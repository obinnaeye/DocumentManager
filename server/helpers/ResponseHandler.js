/**
 * Helper class that handles response to requests
 */
export default class ResponseHandler {

  /**
   * Method to send a response to a requester of a resource
   * @param {Object} response - Response Object
   * @param {Number} statusCode - status code for this response
   * @param {Object} body - Object contained in the response body
   * @return {Object} - Response object sent to requester
   */
  static sendResponse(response, statusCode, body) {
    return response.status(statusCode).json(body);
  }

  /**
   * Method that sends a 200 (OK) response
   * @param {Object} response - Response Object
   * @param {Object} body - Object contained in the response body
   * @return {Object} - Response object sent to requester
   */
  static send200(response, body) {
    const message = body || { message: 'OK' };
    return ResponseHandler.sendResponse(response, 200, message);
  }

  /**
   * Method that sends a 201 (Created) response
   * @param {Object} response - Response Object
   * @param {Object} body - Object contained in the response body
   * @return {Object} - Response object sent to requester
   */
  static send201(response, body) {
    return ResponseHandler.sendResponse(response, 201, body);
  }

  /**
   * Method that sends a 400 (Bad Request) error response
   * @param {Object} response - Response Object
   * @param {Object} body - Object contained in the response body
   * @return {Object} - Response object sent to requester
   */
  static send400(response, body) {
    const message = body || { message: 'Bad Request' };
    return ResponseHandler.sendResponse(response, 400, message);
  }

  /**
   * Method that sends a 401 (Authorization Failure) error response
   * @param {Object} response - Response Object
   * @param {Object} body - Object contained in the response body
   * @return {Object} - Response object sent to requester
   */
  static send401(response, body) {
    const message = body || { message: 'Authorization Failed' };
    return ResponseHandler.sendResponse(response, 401, message);
  }

  /**
   * Method that sends a 403 (Access Denied) error response
   * @param {Object} response - Response Object
   * @param {Object} body - Object contained in the response body
   * @return {Object} - Response object sent to requester
   */
  static send403(response, body) {
    const message = body || { message: 'Access Denied' };
    return ResponseHandler.sendResponse(response, 403, message);
  }

  /**
   * Method that sends a 404 (Resource Not Found) error response
   * @param {Object} response - Response Object
   * @param {Object} body - Object contained in the response body
   * @return {Object} - Response object sent to requester
   */
  static send404(response, body) {
    const message = body || { message: 'Resource(s) Not Found' };
    return ResponseHandler.sendResponse(response, 404, message);
  }

  /**
   * Method that sends a 409 (Conflicts) error response
   * @param {Object} response - Response Object
   * @param {Object} body - Object contained in the response body
   * @return {Object} - Response object sent to requester
   */
  static send409(response, body) {
    const message = body || { message: 'Operation will create data conflicts' };
    return ResponseHandler.sendResponse(response, 409, message);
  }

  /**
   * Method that sends a 422 (Unprocessable Entity) error response
   * @param {Object} response - Response Object
   * @param {Object} body - Object contained in the response body
   * @return {Object} - Response object sent to requester
   */
  static send422(response, body) {
    const message = body || { message: 'Unprocessable Entity' };
    return ResponseHandler.sendResponse(response, 422, message);
  }

  /**
   * Method that sends a 500 (Internal Server Error) error response
   * @param {Object} response - Response Object
   * @param {Object} body - Object contained in the response body
   * @return {Object} - Response object sent to requester
   */
  static send500(response, body) {
    const message = body || { message: 'Internal Server Error' };
    return ResponseHandler.sendResponse(response, 500, message);
  }
}
