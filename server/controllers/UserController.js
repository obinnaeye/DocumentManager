import jwt from 'jsonwebtoken';
import { User } from '../models';

/**
 * @export
 * @class UserController
 */
export default class UserController {

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
          User.create(newUser);
          response.status(200).json(newUser);
        }
      }, (err) => {
        response.status(500).json({ message: `An internal Server
        error occured, please try again or contact the site admin` });
      });
  }
}
