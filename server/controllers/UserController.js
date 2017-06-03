import { User } from '../models';
import UserAuthenticator from '../middlewares/UserAuthenticator';
import ResponseHandler from '../helpers/ResponseHandler';
import ErrorHandler from '../helpers/ErrorHandler';

/**
 * @export
 * @class UserController
 */
export default class UserController {

  static getUserDetails(user, activeToken) {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roleId: user.roleId,
      createdAt: user.createdAt,
      activeToken
    };
  }

  static createUser(request, response) {
    const { email, firstName, lastName, password } = request.body;
    if (!email || !firstName || !lastName || !password) {
      ResponseHandler.send400(response,
      { message: 'Incomplete registration data' });
    }
    if (password.length < 8 || password.length > 50) {
      ResponseHandler.send400(response,
      { message: 'Password should be between 8 and 50 letters' });
    }
    User.findOne({ where: { email } })
      .then((user) => {
        if (user) {
          response.status(201).json({
            message: `${email} has been taken, use another email`
          });
        } else {
          const newUser = request.body;
          //eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImZpcnN0TmFtZSI6InVzZXIxIiwibGFzdE5hbWUiOiJhbm90aGVyIiwiZW1haWwiOiJvYmlvYmlAeWFob28uY29tIiwicm9sZUlkIjoyLCJpYXQiOjE0OTY0MjUyNzksImV4cCI6MTQ5NzAzMDA3OX0.wsZmuWVRi20zxecF9R21fVWRmND_C-XmpdZsLAKf_PY
          // Restrict creating a new user specified id
          newUser.id = null;
          newUser.roleId = newUser.roleId || 2;
          User.create(newUser)
            .then((createdUser) => {
              const activeToken = UserAuthenticator.generateToken(createdUser);
              createdUser.update({ activeToken })
              .then(() => {
                response.status(200).json({
                  message: 'You have successfully signed up!',
                  activeToken
                });
              });
            });
        }
      }, (error) => {
        ErrorHandler.handleRequestError(response, error);
      });
  }

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
         if (foundUsers) {
           const formatedUsers  = foundUsers.map(foundUser =>
             UserController.getUserDetails(foundUser)
           );
           return ResponseHandler.send200(
             response,
             formatedUsers
            );
         }
       }).catch(error => ResponseHandler.send500(
           response,
           { message: error }
         ));
    }
  }

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
            updatedUser
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

  static deleteUser(request, response) {
    const id = Number(request.params.id);
    User.destroy({
      where: { id }
    }).then((deletedUserCount) => {
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

  static fetchUsers(request, response) {
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
        ResponseHandler.send200(response, users);
      } else {
        ResponseHandler.send404(response);
      }
    });
  }
}