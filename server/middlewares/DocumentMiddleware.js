import ResponseHandler from '../helpers/ResponseHandler';
import { Document } from '../models';

/**
 * Class to verify/check Document related requests
 */
export default class DocumentMiddleware {

  /**
   * Method that checks and validates document creation requests
   * @param {Object} request - Request Object
   * @param {Object} response - Response Object
   * @param {Function} next - Function call to continue with next function
   * @return {Void} - Returns void
   */
  static validateCreateRequest(request, response, next) {
    console.log(request.body);
    const { title, content } = request.body;
    const { userId } = request.decoded;
    if (request.body.id) {
      request.body.id = null;
    }
    if (!title) {
      ResponseHandler.send400(
        response,
        { message: 'Please supply document title' }
      );
    }
    if (!content) {
      ResponseHandler.send400(
        response,
        { message: 'Document should have content' }
      );
    }
      // check for document duplicates here
    Document.findAll({
      where: {
        $and: [
          { ownerId: userId },
          { title },
          { content }
        ]
      }
    }).then((documents) => {
      if (documents.length > 0) {
        ResponseHandler.send409(
          response,
          { message: `A document with the title '${title}'
          already exist. Choose a different title.` }
        );
      } else {
        next();
      }
    });
  }

  /**
   * Method that checks and validates document get requests
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
}
