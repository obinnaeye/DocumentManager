import Document from '../models/document';
import ResponseHandler from '../helpers/ResponseHandler';
import ErrorHandler from '../helpers/ErrorHandler';

class DocumentController {

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
  
  static createDocument(request, response) {
    // const { title, content } = request.body;
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
        DocumentController.getDocumentFields(createdDocument)
      );
    })
    .catch((error) => {
      ErrorHandler.handleRequestError(response, error);
    });
  }

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

  static searchUser(request, response) {
    if (request.query.q) {
      const like = `%${request.query.q}%`;
      const queryBuilder = {
        where: {
          title: {
            $like: like
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
          userId === foundDocument.OwnerId
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
          userId === foundDocument.OwnerId
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
