import { Role } from '../models';

/**
 * Class that controls role requests
 */
export default class RoleController {

  /**
   * Method to create a a new Role
   * @param{Object} request - Request Object
   * @param{Object} response - Response Object
   * @return{Void} - Returns void
   * @memberof RoleController
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
