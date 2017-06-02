import ResponseHandler from './ResponseHandler';

export default class ErrorHandler {

  static parseErrors(errors) {
    return errors.map(error => ({ message: error.message }));
  }

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

    default: {
      return ResponseHandler.send500(response);
    }

    }
  }
}
