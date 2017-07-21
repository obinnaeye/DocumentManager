import { Role } from '../models';
import ErrorHandler from '../helpers/ErrorHandler';
import ResponseHandler from '../helpers/ResponseHandler';

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
        ResponseHandler.send201(response, createdRole);
      }, (error) => {
        ErrorHandler.handleRequestError(response, error);
      });
  }

  /**
   * Method to update a Role
   * @param{Object} request - Request Object
   * @param{Object} response - Response Object
   * @return{Void} - Returns void
   * @memberof RoleController
   */
  static updateRole(request, response) {
    Role.update(request.body, {
      where: {
        id: request.params.id
      }
    })
    .then((update) => {
      if (update[0] === 1) {
        ResponseHandler.send200(
          response,
          { message: 'Update Successful' }
        );
      } else {
        ResponseHandler.send404(response);
      }
    });
  }

  /**
   * Method to get a Role
   * @param{Object} request - Request Object
   * @param{Object} response - Response Object
   * @return{Void} - Returns void
   * @memberof RoleController
   */
  static getRole(request, response) {
    Role.findById(request.params.id, {
      attributes: ['id', 'title', 'createdAt']
    })
    .then((role) => {
      if (role) {
        ResponseHandler.send200(
          response,
          role
        );
      } else {
        ResponseHandler.send404(response);
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
   * Method to fetch all Roles
   * @param{Object} request - Request Object
   * @param{Object} response - Response Object
   * @return{Void} - Returns void
   */
  static getRoles(request, response) {
    const limit = request.query.limit || '10';
    const offset = request.query.offset || '0';
    const queryBuilder = {
      limit,
      offset,
      order: '"createdAt" DESC'
    };
    Role.findAndCountAll(queryBuilder)
    .then((roles) => {
      if (roles.rows.length > 0) {
        ResponseHandler.send200(response, roles);
      } else {
        ResponseHandler.send404(response);
      }
    });
  }

  /**
   * Method to delete a Role
   * @param{Object} request - Request Object
   * @param{Object} response - Response Object
   * @return{Void} - Returns void
   */
  static deleteRole(request, response) {
    const id = request.params.id;
    Role.destroy({
      where: { id }
    })
    .then((status) => {
      if (status) {
        ResponseHandler.sendResponse(
          response,
          200,
          { message: 'Delete Successful' }
        );
      } else {
        ResponseHandler.send404(response);
      }
    });
  }

}
