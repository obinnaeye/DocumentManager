
export default class ResponseHandler {

  static sendResponse(response, statusCode, message) {
    return response.status(statusCode).json(message);
  }

  static send200(response, body) {
    const message = body || { message: 'OK' };
    return ResponseHandler.sendResponse(response, 200, message);
  }

  static send400(response, body) {
    const message = body || { message: 'Bad Request' };
    return ResponseHandler.sendResponse(response, 400, message);
  }

  static send401(response, body) {
    const message = body || { message: 'Authorization Failed' };
    return ResponseHandler.sendResponse(response, 401, message);
  }

  static send404(response, body) {
    const message = body || { message: 'Resource(s) Not Found' };
    return ResponseHandler.sendResponse(response, 404, message);
  }

   static send409(response, body) {
    const message = body || { message: 'Operation will create data conflicts' };
    return ResponseHandler.sendResponse(response, 409, message);
  }

   static send422(response, body) {
    const message = body || { message: 'Unprocessable Entity' };
    return ResponseHandler.sendResponse(response, 422, message);
  }

  static send500(response, body) {
    const message = body || { message: 'Internal Server Error' };
    return ResponseHandler.sendResponse(response, 500, message);
  }
}
