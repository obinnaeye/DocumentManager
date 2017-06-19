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
    /**
   * @swagger
   * definition:
   *   NewDocument:
   *     type: object
   *     required:
   *        - title
   *        - content
   *     properties:
   *        title:
   *           type: string
   *        content:
   *           type: string
   *   Document:
   *      allOf:
   *        - $ref: '#definitions/NewDocument'
   *        - required:
   *        - id:
   *              type: integer
   *              format: int64
   */
    DocumentRoutes.createDocument(router);
    DocumentRoutes.getDocument(router);
    DocumentRoutes.getDocuments(router);
    DocumentRoutes.getUserDocuments(router);
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
    /**
     * @swagger
     * /documents:
     *   post:
     *     description: Creates a new document
     *     tags:
     *      - Create Document
     *     produces:
     *      - application/json
     *     parameters:
     *       - name: body
     *         description: Document object
     *         in:  body
     *         required: true
     *         type: string
     *         schema:
     *           $ref: '#/definitions/NewDocument'
     *     responses:
     *       201:
     *         description: documents
     *         schema:
     *          type: object
     */
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
    /**
     * @swagger
     * /documents:
     *   get:
     *      description: Returns a list of all documents
     *      tags:
     *        - Get Documents List
     *      produces:
     *        - application/json
     *      parameters:
     *        - name: Authorization
     *          description: A valid token
     *          in: header
     *          required: true
     *          type: string
     *      responses:
     *          200:
     *              description: documents
     *              schema:
     *                  type: array
     *                  items:
     *                      $ref: '#/definitions/Document'
     */
    router.get(
      '/documents',
      UserAuthenticator.authenticateUser,
      DocumentMiddleware.validateGetRequest,
      DocumentController.getDocuments
    );
  }

  /**
   * Method that sets route for getting all documents belonging to user
   * @param{Object} router - Express router
   * @return{Void}  - Returns void
   * @memberof DocumentRoutes
   */
  static getUserDocuments(router) {
    router.get(
      '/users/:id/documents',
      UserAuthenticator.authenticateUser,
      DocumentController.getUserDocuments
    );
  }

  /**
   * Method that sets route for searching all instances of document
   * @param{Object} router - Express router
   * @return{Void}  - Returns void
   * @memberof DocumentRoutes
   */
  static searchDocuments(router) {
    /**
   * @swagger
   * /search/documents?q={DocumentTitle}:
   *    get:
   *      description: Returns the documents
   *      tags:
   *        - Finds a document by title
   *      produces:
   *        - application/json
   *      parameters:
   *        - name: Authorization
   *          in: header
   *          description: an authorization header
   *          required: true
   *          type: string
   *        - in: query
   *          name: q
   *          description: title of a document
   *          required: true
   *          type: string
   *      responses:
   *        200:
   *          description: document
   *          schema:
   *            type: object
   */
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
