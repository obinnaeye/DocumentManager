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
   *        access:
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
     *     tags:
     *       - New Document
     *     description: Creates a document
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: authorization
     *         description: Jwt access token
     *         in: header
     *         required: true
     *         type: string
     *       - name: title
     *         description: document title
     *         in: form
     *         required: true
     *         type: string
     *       - name: content
     *         description: document content
     *         in: form
     *         required: true
     *         type: string
     *       - name: access
     *         description: document access type
     *         in: form
     *         type: number
     *     responses:
     *       200:
     *         description: Document Object created
     *         schema:
     *           $ref: '#/definitions/Document'
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
    /**
     * @swagger
     * /documents/:id:
     *   get:
     *      description: Returns a document by id
     *      tags:
     *        - Get Document
     *      produces:
     *        - application/json
     *      parameters:
     *        - name: authorization
     *          description: Jwt access token
     *          in: header
     *          required: true
     *          type: string
     *        - name: id
     *          description: Document id
     *          in: path
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
     *        - name: authorization
     *          description: Jwt access token
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
    /**
   * @swagger
   * /users/:id/documents:
   *    get:
   *      description: Returns user documents
   *      tags:
   *        - User Documents
   *      produces:
   *        - application/json
   *      parameters:
   *        - name: authorization
   *          in: header
   *          description: Jwt access token
   *          required: true
   *          type: string
   *        - name: id
   *          in: path
   *          description: User id
   *          required: true
   *          type: number
   *      responses:
   *        200:
   *          description: document
   *          schema:
   *            type: object
   */
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
   *      description: Search Documents by title
   *      tags:
   *        - Search for documents by title
   *      produces:
   *        - application/json
   *      parameters:
   *        - name: authorization
   *          in: header
   *          description: Jwt access token
   *          required: true
   *          type: string
   *        - name: q
   *          in: query
   *          description: document title
   *          required: true
   *          type: string
   *        - name: offset
   *          in: query
   *          description: Search offset
   *          type: integer
   *        - name: limit
   *          in: query
   *          description: Search limit
   *          type: integer
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
    /**
   * @swagger
   * /documents/:id:
   *    put:
   *      description: Update a document
   *      tags:
   *        - Update a document
   *      produces:
   *        - application/json
   *      parameters:
   *        - name: authorization
   *          in: header
   *          description: Jwt access token
   *          required: true
   *          type: string
   *        - name: id
   *          in: path
   *          description: document id
   *          required: true
   *          type: number
   *      responses:
   *        200:
   *          description: document
   *          schema:
   *            type: object
   */
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
     /**
   * @swagger
   * /documents/:id:
   *    delete:
   *      description: Delete a document
   *      tags:
   *        - Delete a document
   *      produces:
   *        - application/json
   *      parameters:
   *        - name: authorization
   *          in: header
   *          description: Jwt access token
   *          required: true
   *          type: string
   *        - name: id
   *          in: path
   *          description: document id
   *          required: true
   *          type: number
   *      responses:
   *        200:
   *          description: document
   *          schema:
   *            type: object
   */
    router.delete(
      '/documents/:id',
      UserAuthenticator.authenticateUser,
      DocumentController.deleteDocument
    );
  }
}

export default DocumentRoutes;
