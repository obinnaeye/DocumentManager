import { User } from '../models';
import UserAuthenticator from '../middlewares/UserAuthenticator';
import ResponseHandler from '../helpers/ResponseHandler';
import ErrorHandler from '../helpers/ErrorHandler';

/**
 * Class that handles request to user database
 */
export default class UserController {

  /**
   * Method to get get user fields from a user object
   * @param {Object} user - User object
   * @param {String} activeToken - user's current token (Optional)
   * @return {Object} - new User with user details
   * for public view
   */
  static getUserDetails(user, activeToken) {
    if (activeToken) {
      return {
        userId: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roleId: user.roleId,
        createdAt: user.createdAt,
        activeToken
      };
    }
    return {
      userId: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roleId: user.roleId,
      createdAt: user.createdAt,
    };
  }

  static formatedUsers(users) {
    const formatedUsers = users.map(user =>
        UserController.getUserDetails(user)
      );
    return formatedUsers;
  }

  /**
   * Controller method that creates a new User
   * @param{Object} request - Request Object
   * @param{Object} response - Response Object
   * @return{Void} - returns void
   */
  static createUser(request, response) {
    const { email } = request.body;
    User.findOne({ where: { email } })
      .then((user) => {
        if (user) {
          ResponseHandler.send409(response,
            { message: `${email} has been taken, use another email` }
          );
        } else {
          const newUser = request.body;
          // Restrict creating a new user specified id
          newUser.id = null;
          newUser.roleId = newUser.roleId || 2;
          User.create(newUser)
            .then((createdUser) => {
              const activeToken = UserAuthenticator.generateToken(createdUser);
              createdUser.update({ activeToken })
              .then(() => {
                ResponseHandler.send200(response,
                  {
                    message: 'You have successfully signed up!',
                    activeToken
                  }
                );
              });
            });
        }
      }, (error) => {
        ErrorHandler.handleRequestError(response, error);
      });
  }

  /**
   * Method to login a user
   * @param{Object} request - Request object
   * @param{Object} response - Response object
   * @return{Void} - returns Void
   */
  static login(request, response) {
    const { email, password } = request.body;
    if (email && password) {
      User.findOne({ where: { email } })
        .then((existingUser) => {
          if (existingUser) {
            if (existingUser.verifyPassword(password)) {
              const activeToken = UserAuthenticator.generateToken(existingUser);
              // update user's activeToken
              existingUser.update({ activeToken })
                .then(() => {
                  // send the token here
                  ResponseHandler.send200(response,
                    { message: 'You have successfully logged in',
                      activeToken
                    });
                });
            } else {
              ResponseHandler.send422(response,
                { message: 'Wrong password' }
              );
            }
          } else {
            ResponseHandler.send422(response,
                { message: `You have not registered the email ${email}` }
              );
          }
        });
    }
  }

  /**
   * Method to logout a specific user (POST)
   * @param{Object} request - Request object
   * @param{Object} response - Response object
   * @return{undefined} - returns undefined
   */
  static logoutUser(request, response) {
    const id = request.decoded.userId;
    User.findById(id)
    .then((user) => {
      user.update({ activeToken: null })
      .then(() => {
        ResponseHandler.sendResponse(
          response,
          200,
          { message: 'Logout Successful' }
        );
      });
    });
  }

  /**
   * Method to search for all instances of user
   * @param{Object} request - Request object
   * @param{Object} response - Response object
   * @return{Void} - returns Void
   */
  static searchUser(request, response) {
    if (request.query.q) {
      const like = `%${request.query.q}%`;
      User.findAll({ where:
      {
        $or: [{ email: { $ilike: like } },
          { firstName: { $ilike: like } },
          { lastName: { $ilike: like } }
        ]
      },
        order: '"email" DESC'
      })
       .then((foundUsers) => {
         if (foundUsers.length) {
           return ResponseHandler.send200(
             response,
             UserController.formatedUsers(foundUsers)
            );
         }
         return ResponseHandler.send404(response);
       }).catch(error => ResponseHandler.send500(
           response,
           { message: error }
         ));
    }
  }

  /**
   * Method to update a user's profiles
   * @param{Object} request - Request object
   * @param{Object} response - Response object
   * @return{Void} - returns Void
   */
  static updateUser(request, response) {
    User.findById(request.params.id)
    .then((user) => {
      if (user) {
        // Restrict email from being changed
        const updateFields = request.body;
        updateFields.email = user.email;
        user.update(updateFields)
        .then((updatedUser) => {
          ResponseHandler.send200(
            response,
            UserController.getUserDetails(updatedUser)
          );
        })
        .catch((error) => {
          ErrorHandler.handleRequestError(response, error);
        });
      } else {
        ResponseHandler.send404(response);
      }
    });
  }

  /**
   * Method to delete a specified user
   * @param{Object} request - Request object
   * @param{Object} response - Response object
   * @return{Void} - returns Void
   */
  static deleteUser(request, response) {
    const id = Number(request.params.id);
    User.destroy({ where: { id } })
    .then((deletedUserCount) => {
      if (deletedUserCount === 1) {
        ResponseHandler.send200(
          response,
          { message: 'User Deleted' }
        );
      } else {
        ResponseHandler.send404(
          response,
          { message: 'User not found, no user was deleted'
          });
      }
    });
  }

  /**
   * Method to get a specified user
   * @param{Object} request - Request object
   * @param{Object} response - Response object
   * @return{Void} - returns Void
   */
  static getUser(request, response) {
    const id = Number(request.params.id);
    User.findById(id)
    .then((foundUser) => {
      if (foundUser) {
        ResponseHandler.send200(
          response,
          UserController.getUserDetails(foundUser)
        );
      } else {
        ResponseHandler.send404(
          response,
          { message: 'User not found'
          });
      }
    })
    .catch((error) => {
      ErrorHandler.handleRequestError(
        response,
        error
      );
    });
  }

  /**
   * Method to get all instances of user
   * @param{Object} request - Request object
   * @param{Object} response - Response object
   * @return{Void} - returns Void
   */
  static getUsers(request, response) {
    const limit = request.query.limit || '10';
    const offset = request.query.offset || '0';
    const queryBuilder = {
      limit,
      offset,
      order: '"createdAt" DESC'
    };
    User.findAndCountAll(queryBuilder)
    .then((users) => {
      if (users.count > 0) {
        console.log(users)
        ResponseHandler.send200(response, UserController.formatedUsers(users.rows));
      } else {
        ResponseHandler.send404(response);
      }
    });
  }
}
