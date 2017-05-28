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
    console.log(request.body);
    response.status(200).json(request.body.user);
  }
}
