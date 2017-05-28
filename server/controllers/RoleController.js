import jwt from 'jsonwebtoken';
import { Role } from '../models';

/**
 * @export
 * @class UserController
 */
export default class RoleController {

  /**
   *
   *
   * @static
   * @param {any} request
   * @param {any} response
   * @return {void}
   * @memberOf RoleController
   */
  static createRole(request, response) {
    const newRole = request.body;
    Role.create(newRole)
      .then((createdRole) => {
        response.status(200).json(createdRole);
      }, (err) => {
        response.status(500).json({ message: err });
      });
  }
}
