import ResponseHandler from '../helpers/ResponseHandler';

/**
 * Middleware class to handle verify/check User related
 * requests
 */
export default class UserMiddleware {
  /**
   * Middleware to check and handle validation of user creation request
   * @param {Object} request - Request Object
   * @param {Object} response - Response Object
   * @param {Function} next - Function call to move to next
   * @return {Void} - Returns void
   */
  static validateCreateRequest(request, response, next) {
    const { email, firstName, lastName, password } = request.body;
    if (!email || !firstName || !lastName || !password) {
      ResponseHandler.send400(response,
        { message: 'Incomplete registration data',
          data: request.body });
    } else if (password.length < 8 || password.length > 50) {
      ResponseHandler.send400(response,
      { message: 'Password should be between 8 and 50 letters' });
    } else if (request.body.id) {
      request.body.id = null;
      next();
    } else {
      next();
    }
  }

    /**
   * Method that checks and validates user get requests
   * @param {Object} request - Request Object
   * @param {Object} response - Response Object
   * @param {Function} next - Function call to continue with next function
   * @return {undefined}
   */
  static validateGetRequest(request, response, next) {
    if (request.query && Number(request.query.limit) < 1) {
      ResponseHandler.send400(
        response,
        { message: 'Invalid limit; limit should not be less than 1' }
      );
    } else if (request.query && Number(request.query.offset) < 0) {
      ResponseHandler.send400(
        response,
        { message: 'Invalid offset; offset should not be less than 1' }
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
    const requesterRoleId = request.decoded.roleId;
    if (requesterRoleId !== 1) {
      ResponseHandler.send403(
        response,
        { message: 'Admin Privilege Required' }
      );
    } else {
      next();
    }
  }

  /**
   * Middleware to check and handle violation of user update
   * rules by the request
   * @param {Object} request - Request Object
   * @param {Object} response - Response Object
   * @param {Function} next - Function call to move to next
   * @return {undefined}
   */
  static validateUpdateRequest(request, response, next) {
    const updateId = Number(request.params.id);
    if (request.body.roleId === 1) {
      ResponseHandler.send403(
        response,
        { message: 'Cannot Update To Admin User' }
      );
    } else if (request.body.id) {
      ResponseHandler.send400(
        response,
        { message: 'Update User ID Not Allowed' }
      );
    } else if (request.body.email) {
      ResponseHandler.send400(
        response,
        { message: 'Email Updating Not Allowed' }
      );
    } else if (request.body.password &&
      (request.body.password.length < 8 || request.body.password.length > 50)) {
      ResponseHandler.send400(response, {
        message: 'Password length should range between 8 - 50 characters'
      });
    } else if (
      request.decoded.userId === updateId
      ||
      request.decoded.roleId === 1
    ) {
      next();
    } else {
      ResponseHandler.send403(response);
    }
  }
}
