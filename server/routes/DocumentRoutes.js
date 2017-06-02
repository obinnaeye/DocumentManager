import DocumentController from '../controllers/DocumentController';
import UserAuthenticator from '../middlewares/UserAuthenticator';
import DocumentMiddleware from '../middlewares/DocumentMiddleware';
/**
 * Class for creating Document routes
 */
class DocumentRoutes {
  static setDocumentRoutes(router) {
    DocumentRoutes.createDocument(router);
    DocumentRoutes.getDocument(router);
    DocumentRoutes.getDocuments(router);
    DocumentRoutes.updateDocument(router);
    DocumentRoutes.deleteDocument(router);
  }

  static createDocument(router) {
    router.post(
      '/documents',
      UserAuthenticator.authenticateUser,
      DocumentMiddleware.validateCreateRequest,
      DocumentController.createDocument
    );
  }

  static getDocument(router) {
    router.get(
      '/documents/:id',
      UserAuthenticator.authenticateUser,
      DocumentMiddleware.validateGetRequest,
      DocumentController.getDocument
    );
  }

  static getDocuments(router) {
    router.get(
      '/documents',
      UserAuthenticator.authenticateUser,
      DocumentMiddleware.validateGetRequest,
      DocumentController.getDocuments
    );
  }

  static searchDocument(router) {
    router.get('/search/documents', UserAuthenticator.authenticateUser,
    DocumentMiddleware.validateGetRequest,
    DocumentController.searchDocuments);
  }

  static updateDocument(router) {
    router.put(
      '/documents/:id',
      UserAuthenticator.authenticateUser,
      DocumentController.updateDocument
    );
  }

  static deleteDocument(router) {
    router.delete(
      '/documents/:id',
      UserAuthenticator.authenticateUser,
      DocumentController.deleteDocument
    );
  }
}

export default DocumentRoutes;
