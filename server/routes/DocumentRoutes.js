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
   *     example:
   *          { title: "Big", content: "All are big", access: "role"}
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
   *     type: object
   *     example:
   *          { title: "Big", content: "All are big", access: "role", id: 2,
   * createdAt: 2017-07-20T08:31:51.737Z, updatedAt: 2017-07-20T09:31:51.737Z,
   * ownerId: 3, ownerRoleId: 2}
   *     required:
   *        - title
   *        - content
   *        - id
   *     properties:
   *        title:
   *           type: string
   *        content:
   *           type: string
   *        access:
   *           type: string
   *        id:
   *           type: integer
   *           format: int64
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
     *       - Document
     *     description: Creates a document
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: authorization
     *         description: Jwt access token
     *         in: header
     *         required: true
     *         type: string
     *       - name: body
     *         description: New Document object
     *         in: body
     *         required: true
     *         type: object
     *         schema:
     *           $ref: '#/definitions/NewDocument'
     *     responses:
     *       201:
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
     * /documents/{id}:
     *   get:
     *      description: Returns a document by id
     *      tags:
     *        - Document
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
     *          type: integer
     *      responses:
     *          200:
     *              description: documents
     *              schema:
     *                  $ref: '#/definitions/Document'
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
   * /documents/:
   *   get:
   *      description: Returns a list of all documents
   *      tags:
   *        - Document
   *      produces:
   *        - application/json
   *      parameters:
   *        - name: authorization
   *          description: Jwt access token
   *          in: header
   *          required: true
   *          type: string
   *        - name: limit
   *          description: Documents query limit
   *          in: query
   *          required: false
   *          type: integer
   *        - name: offset
   *          description: Documents query offset
   *          in: query
   *          required: false
   *          type: integer
   *      responses:
   *          200:
   *              description: documents
   *              schema:
   *                type: object
   *                properties:
   *                   page:
   *                      type: number
   *                      example: 2
   *                   page_count:
   *                      type: number
   *                      example: 3
   *                   limit:
   *                      type: number
   *                      example: 10
   *                   offset:
   *                      type: number
   *                      example: 0
   *                   page_size:
   *                      type: number
   *                      example: 10
   *                   total_count:
   *                      type: number
   *                      example: 100
   *                   documents:
   *                      type: array
   *                      items:
   *                          $ref: '#/definitions/Document'
   */
    router.get(
      '/documents/',
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
   * /users/{id}/documents:
   *    get:
   *      description: Returns user documents
   *      tags:
   *        - Document
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
   *          type: integer
   *      responses:
   *          200:
   *              description: documents
   *              schema:
   *                  type: array
   *                  items:
   *                      $ref: '#/definitions/Document'
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
   *        - Document
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
   *          200:
   *              description: documents
   *              schema:
   *                type: object
   *                properties:
   *                   page:
   *                      type: number
   *                      example: 2
   *                   page_count:
   *                      type: number
   *                      example: 4
   *                   limit:
   *                      type: number
   *                      example: 50
   *                   offset:
   *                      type: number
   *                      example: 0
   *                   page_size:
   *                      type: number
   *                      example: 10
   *                   total_count:
   *                      type: number
   *                      example: 100
   *                   documents:
   *                      type: array
   *                      items:
   *                          $ref: '#/definitions/Document'
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
   * /documents/{id}:
   *    put:
   *      description: Update a document
   *      tags:
   *        - Document
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
   *        - name: body
   *          in: body
   *          description: "UpdateDocument object"
   *          required: true
   *          type: object
   *          schema:
   *            $ref: '#/definitions/NewDocument'
   *      responses:
   *        200:
   *          description: document
   *          schema:
   *            $ref: '#/definitions/Document'
   */
    router.put(
      '/documents/:id',
      UserAuthenticator.authenticateUser,
      DocumentMiddleware.validateUpdateRequest,
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
   * /documents/{id}:
   *    delete:
   *      description: Delete a document
   *      tags:
   *        - Document
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
   *          type: integer
   *      responses:
   *        200:
   *          description: statusCode
   */
    router.delete(
      '/documents/:id',
      UserAuthenticator.authenticateUser,
      DocumentController.deleteDocument
    );
  }
}

export default DocumentRoutes;
