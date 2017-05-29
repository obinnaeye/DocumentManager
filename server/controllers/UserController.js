import { User } from '../models';
import UserAuthenticator from '../middlewares/UserAuthenticator';

/**
 * @export
 * @class UserController
 */
export default class UserController {

  static getUserDetails(user, token) {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roleId: user.roleId,
      createdAt: user.createdAt,
      token
    };
  }

  /**
   *
   *
   * @static
   * @param {any} request
   * @param {any} response
   * @return {void}
   * @memberOf UserController
   */
  static createUser(request, response) {
    const { email, firstName, lastName, password } = request.body;
    if (!email || !firstName || !lastName || !password) {
      response.status(300).json({ message: 'Incomplete registration data' });
    }

    if (password.length < 8 || password.length > 50) {
      response.status(300).json('Password should be between 8 and 50 letters');
    }

    User.findOne({ where: { email } })
      .then((user) => {
        if (user) {
          response.status(201).send(`${email} has been taken, try another.`);
        } else {
          const newUser = request.body;
          newUser.roleId = newUser.roleId || 2;
          User.create(newUser)
            .then((user) => {
              const activeToken = UserAuthenticator.generateToken(user);
              user.update({ activeToken })
              .then(() => {
                response.status(200).json({
                  message: 'You have successfully signed up!',
                  activeToken
                });
              });
            });
        }
      }, (err) => {
        response.status(500).json({ message: `An internal Server
        error occured, please try again or contact the site admin` });
      });
  }
}
