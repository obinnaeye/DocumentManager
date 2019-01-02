import ResponseHandler from '../helpers/ResponseHandler';

/**
 * Middleware class to handle verify/check User related
 * requests
 */
export default class UserMiddleware {
  /**
   * Middleware to check and handle violation of Role creation
   * rules by the request
   * @param {Object} request - Request Object
   * @param {Object} response - Response Object
   * @param {Function} next - Function call to move to next
   * @return {undefined}
   */
  static validateCreateRequest(request, response, next) {
    if (request.decoded.roleId !== 1) {
      ResponseHandler.send403(
        response,
        { message: 'Admin Access Required!' }
      );
    } else if (request.body.id) {
      ResponseHandler.send400(
        response,
        { message: 'Role Id is not allowed!' }
      );
    } else {
      next();
    }
  }

  /**
   * Middleware to check and handle violation of get Roles
   * rules by the request
   * @param {Object} request - Request Object
   * @param {Object} response - Response Object
   * @param {Function} next - Function call to move to next
   * @return {undefined}
   */
  static validateGetRequest(request, response, next) {
    if (request.decoded.roleId !== 1) {
      ResponseHandler.send403(
        response,
        { message: 'Admin Privilege Required' }
      );
    } else if (request.query && Number(request.query.limit) < 1) {
      ResponseHandler.send400(
        response,
        { message: 'Invalid Limit' }
      );
    } else if (request.query && Number(request.query.offset) < 0) {
      ResponseHandler.send400(
        response,
        { message: 'Invalid Offset' }
      );
    } else {
      next();
    }
  }

  /**
   * Middleware to check and handle validation of user deletion request
   * @param {Object} request - Request Object
   * @param {Object} response - Response Object
   * @param {Function} next - Function call to move to next
   * @return {Void} - Returns void
   */
  static validateDeleteRequest(request, response, next) {
    console.log('body', request.params);
    const requesterRoleId = request.decoded.roleId;
    if (requesterRoleId !== 1) {
      ResponseHandler.send403(
        response,
        { message: 'Admin Access Required!' }
      );
    } else if (Number(request.params.id) === 1 ||
      Number(request.params.id) === 2) {
      ResponseHandler.send403(
        response,
        { message: 'Protected Roles Cannot be deleted!' }
      );
    } else {
      next();
    }
  }

  /**
   * Middleware to check and handle violation of Roles update
   * rules by the request
   * @param {Object} request - Request Object
   * @param {Object} response - Response Object
   * @param {Function} next - Function call to move to next
   * @return {undefined}
   */
  static validateUpdateRequest(request, response, next) {
    const updateId = Number(request.params.id);
    if (request.decoded.roleId !== 1) {
      ResponseHandler.send403(
        response,
        { message: 'Admin Access Required!' }
      );
    } else if (request.body.id) {
      ResponseHandler.send400(
        response,
        { message: 'Role ID Can not be Updated!' }
      );
    } else if (updateId === 1 || updateId === 2) {
      ResponseHandler.send403(
        response,
        { message: 'Protected Roles can not be Updated!' }
      );
    } else {
      next();
    }
  }
}
