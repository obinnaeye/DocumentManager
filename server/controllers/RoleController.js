import { Role } from '../models';
import ErrorHandler from '../helpers/ErrorHandler';

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
      }, (error) => {
        ErrorHandler.handleRequestError(response, error);
      });
  }
}
