import { Document } from '../models';
import ResponseHandler from '../helpers/ResponseHandler';
import ErrorHandler from '../helpers/ErrorHandler';

/**
 * @class DocumentController
 */
class DocumentController {

  /**
   * Method to get document fields from Document object
   * @param {Object} passedDocument - Document object
   * @return {Object} - new Document object with document
   * details for public view
   * @memberof DocumentController
   */
  static getDocumentDetails(passedDocument) {
    const { id, title, content, access, createdAt } = passedDocument;
    return {
      id,
      title,
      content,
      access,
      createdAt
    };
  }

  /**
   * Controller method that creates a new Document
   * @param{Object} request - Request Object
   * @param{Object} response - Response Object
   * @return{Void} - returns void
   * @memberof DocumentController
   */
  static createDocument(request, response) {
    const newDocument = {
      title: request.body.title,
      content: request.body.content,
      ownerId: request.decoded.userId,
      ownerRoleId: request.decoded.roleId,
      access: request.body.access || 'public'
    };
    Document.create(newDocument)
    .then((createdDocument) => {
      ResponseHandler.send200(
        response,
        DocumentController.getDocumentDetails(createdDocument)
      );
    })
    .catch((error) => {
      ErrorHandler.handleRequestError(response, error);
    });
  }

  /**
   * Controller method that gets a specific Document
   * @param{Object} request - Request Object
   * @param{Object} response - Response Object
   * @return{Void} - returns void
   * @memberof DocumentController
   */
  static getDocument(request, response) {
    const { id } = request.params;
    const { userId } = request.decoded;
    const userRoleId = request.decoded.roleId;
    Document.findOne({
      where: { id }
    })
    .then((foundDocument) => {
      if (foundDocument) {
        // chceck document access type
        // give access to owner, admin;
        // or public user if access is public
        if (
          foundDocument.access === 'public'
          || userId === foundDocument.OwnerId
          || userRoleId === 1
          ) {
          ResponseHandler.send200(
            response,
            DocumentController.getDocumentDetails(foundDocument)
          );
        } else {
          ResponseHandler.send403(
            response,
            { message: 'You do not have the right access to this document' }
          );
        }
      } else {
        ResponseHandler.send404(
          response
        );
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
   * Controller method that gets all documents
   * @param{Object} request - Request Object
   * @param{Object} response - Response Object
   * @return{Void} - returns void
   * @memberof DocumentController
   */
  static getDocuments(request, response) {
    const { userId, roleId } = request.decoded;
    const limit = request.query.limit || '10';
    const offset = request.query.offset || '0';
    const queryBuilder = {
      limit,
      offset,
      order: '"createdAt" DESC'
    };
    if (roleId === 1) {
      Document.findAndCountAll(queryBuilder)
      .then((foundDocuments) => {
        if (foundDocuments) {
          ResponseHandler.send200(
            response,
            foundDocuments
          );
        } else {
          ResponseHandler.send404(response);
        }
      })
      .catch((error) => {
        ErrorHandler.handleRequestError(response, error);
      });
    } else {
      Document.findAndCountAll({ where: {
        $or: [
          { ownerId: userId },
          { access: 'public' }
        ]
      },
        queryBuilder
      })
      .then((foundDocuments) => {
        if (foundDocuments) {
          ResponseHandler.send200(
            response,
            foundDocuments
          );
        } else {
          ResponseHandler.send404(response);
        }
      })
      .catch((error) => {
        ErrorHandler.handleRequestError(response, error);
      });
    }
  }

  /**
   * Controller method that searches for all instances of document
   * @static
   * @param {Object} request - request object
   * @param {Object} response - response object
   * @return{Void} - returns void
   * @memberof DocumentController
   */
  static searchDocuments(request, response) {
    if (request.query.q) {
      const like = `%${request.query.q}%`;
      const queryBuilder = {
        where: {
          title: {
            $ilike: like
          }
        },
        attributes: ['id', 'access', 'title', 'createdAt'],
        order: '"createdAt" DESC'
      };
      Document.findAll(queryBuilder)
       .then((foundDocuments) => {
         if (foundDocuments) {
           return ResponseHandler.send200(
             response,
             foundDocuments
            );
         }
       })
       .catch(error => ResponseHandler.send404(
           response,
           { message: error }
         ));
    }
  }

  /**
   * Controller method that updates a Document
   * @param{Object} request - Request Object
   * @param{Object} response - Response Object
   * @return{Void} - returns void
   * @memberof DocumentController
   */
  static updateDocument(request, response) {
    const { id } = request.params;
    const { userId } = request.decoded;
    const userRoleId = request.decoded.roleId;
    Document.findById(Number(id))
    .then((foundDocument) => {
      if (foundDocument) {
        // chceck document access type
        // give access to owner, admin;
        if (
          userId === foundDocument.ownerId
          || userRoleId === 1
          ) {
          foundDocument.update(request.body)
          .then((updatedDocument) => {
            ResponseHandler.send200(
              response,
              updatedDocument
            );
          });
        } else {
          ResponseHandler.send403(
            response,
            { message: `You do not have the right access
              to update this document` }
          );
        }
      } else {
        ResponseHandler.send404(
          response
        );
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
   * Controller method that deletes a specific Document
   * @param{Object} request - Request Object
   * @param{Object} response - Response Object
   * @return{Void} - returns void
   * @memberof DocumentController
   */
  static deleteDocument(request, response) {
    const { id } = request.params;
    const { userId } = request.decoded;
    const userRoleId = request.decoded.roleId;
    Document.findById(Number(id))
    .then((foundDocument) => {
      if (foundDocument) {
        // chceck document access type
        // give access to owner, admin;
        if (
          userId === foundDocument.ownerId
          || userRoleId === 1
          ) {
          foundDocument.destroy(request.body)
          .then(() => {
            ResponseHandler.send200(
              response,
              { message: 'Document deleted successfully' }
            );
          });
        } else {
          ResponseHandler.send403(
            response,
            { message: `You do not have the right access
              to delete this document` }
          );
        }
      } else {
        ResponseHandler.send404(
          response
        );
      }
    });
  }
}

export default DocumentController;
