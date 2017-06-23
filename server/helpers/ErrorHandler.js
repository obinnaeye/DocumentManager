import ResponseHandler from './ResponseHandler';

/**
 * Class to handle Errors and send appropriate
 * responses
 */
export default class ErrorHandler {

  /**
   * Method to parse error messages returned by Sequelize
   * @param {Array} errors - Array containing error items returned
   * by Sequelize
   * @return {Array} - Array containing parsed error messages
   */
  static parseErrors(errors) {
    return errors.map(error => ({ message: error.message }));
  }

  /**
   * Method to handle errors and send custom error messages
   * @param {Object} response - Response Object
   * @param {Object} error - Error Object from Sequlize
   * @return {Object} - Response Object
   */
  static handleRequestError(response, error) {
    switch (error.name) {
    case 'SequelizeValidationError' : {
      const customErrors = ErrorHandler.parseErrors(error.errors);
      return ResponseHandler.send400(response, customErrors);
    }
    case 'SequelizeForeignKeyConstraintError' : {
      return ResponseHandler.send400(
        response,
        { message: error.message }
      );
    }

    case 'SequelizeUniqueConstraintError' : {
      return ResponseHandler.send400(
        response,
        { message: 'Bad Request' }
      );
    }

    case 'SequelizeDatabaseError' : {
      return ResponseHandler.send400(
        response,
        { message: 'Bad Request' }
      );
    }

    default: {
      return ResponseHandler.send500(response);
    }

    }
  }
}
