import { Document } from '../models';
import ResponseHandler from '../helpers/ResponseHandler';
import ErrorHandler from '../helpers/ErrorHandler';
import PaginationHelper from '../helpers/PaginationHelper';

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
    const { id, title, content, access, createdAt, ownerId } = passedDocument;
    return {
      id,
      title,
      content,
      access,
      createdAt,
      ownerId
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
    const ownerId = request.decoded.userId;
    const { title, content } = request.body;
    const accessTypes = ['private', 'public', 'role'];
    const newDocument = {
      title,
      content,
      ownerId,
      ownerRoleId: request.decoded.roleId,
      access: accessTypes.indexOf(request.body.access) >= 0 ?
      request.body.access : 'public'
    };
    Document.findOne({ where: { $and: { ownerId, title } } })
      .then((foundDocument) => {
        if (foundDocument) {
          ResponseHandler.send409(
            response,
            { message: `${title} already exist, choose a different title!` }
          );
        } else {
          Document.create(newDocument)
            .then((createdDocument) => {
              ResponseHandler.send201(
                response,
                DocumentController.getDocumentDetails(createdDocument)
              );
            })
            .catch((error) => {
              ErrorHandler.handleRequestError(response, error);
            });
        }
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
    let { id } = request.params;
    const { userId } = request.decoded;
    id = Number(id);
    const userRoleId = request.decoded.roleId;
    if (isNaN(id)) {
      ResponseHandler.send400(response, {
        message: 'Document id should be number!'
      });
    } else {
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
            || userId === foundDocument.ownerId
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
      });
    }
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
        if (foundDocuments.count > 0) {
          ResponseHandler.send200(
            response,
            PaginationHelper.paginateResult(foundDocuments, offset, limit)
          );
        } else {
          ResponseHandler.send404(response);
        }
      });
    } else {
      Document.findAndCountAll({ where: {
        $or: [
          { ownerId: userId },
          { access: 'public' }
        ]
      },
        limit,
        offset,
        order: '"createdAt" DESC'
      })
      .then((foundDocuments) => {
        if (foundDocuments.rows.length > 0) {
          ResponseHandler.send200(
            response,
            PaginationHelper.paginateResult(foundDocuments, offset, limit)
          );
        } else {
          ResponseHandler.send404(response);
        }
      });
    }
  }

  /**
   * Controller method that gets all documents belonging a user
   * @param{Object} request - Request Object
   * @param{Object} response - Response Object
   * @return{Void} - returns void
   * @memberof DocumentController
   */
  static getUserDocuments(request, response) {
    const id = Number(request.params.id);
    const ownerId = request.decoded.userId;
    if (id !== ownerId && request.decoded.roleId !== 1) {
      ResponseHandler.send400(
        response,
        { message: 'User ID does not match id in uri params' }
      );
    } else {
      const queryBuilder = {
        where: { ownerId },
        order: '"createdAt" DESC'
      };
      Document.findAll(queryBuilder)
        .then((foundDocuments) => {
          if (foundDocuments.length > 0) {
            ResponseHandler.send200(
              response,
              foundDocuments
            );
          } else {
            ResponseHandler.send404(
              response,
              { message: 'You do not have any document' }
            );
          }
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
    const { userId, roleId } = request.decoded;
    const limit = request.query.limit || '10';
    const offset = request.query.offset || '0';
    const like = `%${request.query.q}%`;

    if (!request.query.q) {
      ResponseHandler.send400(response);
    } else if (roleId === 1) {
      const queryBuilder = {
        where: {
          title: {
            $ilike: like
          }
        },
        limit,
        offset,
        order: '"createdAt" DESC'
      };
      Document.findAndCountAll(queryBuilder)
      .then((foundDocuments) => {
        ResponseHandler.send200(
          response,
          PaginationHelper.paginateResult(foundDocuments, offset, limit)
        );
      });
    } else {
      const queryBuilder = {
        where: {
          title: {
            $ilike: like
          },
          $or: [
            { ownerId: userId },
            { access: 'public' }
          ],
        },
        limit,
        offset,
        order: '"createdAt" DESC'
      };
      Document.findAndCountAll(queryBuilder)
        .then((foundDocuments) => {
          ResponseHandler.send200(
            response,
            PaginationHelper.paginateResult(foundDocuments, offset, limit)
          );
        });
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
    let { id } = request.params;
    const { userId } = request.decoded;
    id = Number(id);
    const userRoleId = request.decoded.roleId;
    if (isNaN(id)) {
      ResponseHandler.send400(response, {
        message: 'Document id should be number!'
      });
    } else {
      Document.findById(id)
        .then((foundDocument) => {
          if (foundDocument) {
            // chceck document access type
            // give access to owner, admin;
            if (
              userId === foundDocument.ownerId
              || userRoleId === 1
              ) {
              const accessTypes = ['private', 'public', 'role'];
              foundDocument.update({
                title: request.body.title || foundDocument.title,
                content: request.body.content || foundDocument.content,
                ownerId: userId,
                ownerRoleId: foundDocument.ownerRoleId,
                access: accessTypes.indexOf(request.body.access) >= 0 ?
                request.body.access : foundDocument.access
              })
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
        });
    }
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
