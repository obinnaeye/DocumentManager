import DocumentController from '../controllers/DocumentController';
import UserAuthenticator from '../middlewares/UserAuthenticator';
import DocumentMiddleware from '../middlewares/DocumentMiddleware';

/**
 * Class for creating Document routes
 */
class DocumentRoutes {

  /**
   * Method that sets all document routes
   * @param{Object} router - Express router
   * @return{Void} - returns Void
   * @memberof DocumentRoutes
   */
  static initializeRoutes(router) {
    DocumentRoutes.createDocument(router);
    DocumentRoutes.getDocument(router);
    DocumentRoutes.getDocuments(router);
    DocumentRoutes.searchDocuments(router);
    DocumentRoutes.updateDocument(router);
    DocumentRoutes.deleteDocument(router);
  }

  /**
   * Method that sets route for create new document request
   * @param{Object} router - Express router
   * @return{Void}  - Returns void
   * @memberof DocumentRoutes
   */
  static createDocument(router) {
    router.post(
      '/documents',
      UserAuthenticator.authenticateUser,
      DocumentMiddleware.validateCreateRequest,
      DocumentController.createDocument
    );
  }

  /**
   * Method that sets route for getting a specific document
   * @param{Object} router - Express router
   * @return{Void}  - Returns void
   * @memberof DocumentRoutes
   */
  static getDocument(router) {
    router.get(
      '/documents/:id',
      UserAuthenticator.authenticateUser,
      DocumentMiddleware.validateGetRequest,
      DocumentController.getDocument
    );
  }

  /**
   * Method that sets route for getting all instances of document
   * @param{Object} router - Express router
   * @return{Void}  - Returns void
   * @memberof DocumentRoutes
   */
  static getDocuments(router) {
    router.get(
      '/documents',
      UserAuthenticator.authenticateUser,
      DocumentMiddleware.validateGetRequest,
      DocumentController.getDocuments
    );
  }

  /**
   * Method that sets route for searching all instances of document
   * @param{Object} router - Express router
   * @return{Void}  - Returns void
   * @memberof DocumentRoutes
   */
  static searchDocuments(router) {
    router.get(
      '/search/documents',
      UserAuthenticator.authenticateUser,
      DocumentMiddleware.validateGetRequest,
      DocumentController.searchDocuments);
  }

  /**
   * Method that sets route for updating a document
   * @param{Object} router - Express router
   * @return{Void}  - Returns void
   * @memberof DocumentRoutes
   */
  static updateDocument(router) {
    router.put(
      '/documents/:id',
      UserAuthenticator.authenticateUser,
      DocumentController.updateDocument
    );
  }

  /**
   * Method that sets route for deleting a specific document
   * @param{Object} router - Express router
   * @return{Void}  - Returns void
   * @memberof DocumentRoutes
   */
  static deleteDocument(router) {
    router.delete(
      '/documents/:id',
      UserAuthenticator.authenticateUser,
      DocumentController.deleteDocument
    );
  }
}

export default DocumentRoutes;
