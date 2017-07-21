import RoleController from '../controllers/RoleController';
import UserAuthenticator from '../middlewares/UserAuthenticator';
import RoleMiddleware from '../middlewares/RoleMiddleware';

/**
 * Class for creating Role routes
 */
class RoleRoutes {

  /**
   * Method that initializes all Role routes
   * @param{Object} router - Express router
   * @return{Void} returns void
   */
  static initializeRoutes(router) {
    /**
   * @swagger
   * definition:
   *   NewRole:
   *     type: object
   *     example: { title: "devops"}
   *     required:
   *       - title
   *     properties:
   *       title:
   *         type: string
   *   Role:
   *     type: object
   *     example: { title: "devops", id: 2, createdAt: 2017-07-20T08:31:51.737Z,
   * updatedAt: 2017-07-20T09:31:51.737Z}
   *     required:
   *       - title
   *       - id
   *     properties:
   *       title:
   *         type: string
   *       id:
   *         type: integer
   */
    RoleRoutes.getRole(router);
    RoleRoutes.getRoles(router);
    RoleRoutes.createRole(router);
    RoleRoutes.deleteRole(router);
    RoleRoutes.updateRole(router);
  }

  /**
   * Method that sets up Route for creating a new role
   * @param{Object} router - Express router
   * @return{Void} returns void
   */
  static createRole(router) {
        /**
     * @swagger
     * /roles:
     *   post:
     *     description: Creates a new role
     *     tags:
     *      - Role
     *     produces:
     *      - application/json
     *     parameters:
     *       - name: authorization
     *         in:  header
     *         description: Jwt access token
     *         required: true
     *         type: string
     *       - name: body
     *         in: body
     *         type: object
     *         required: true
     *         schema:
     *           $ref: '#/definitions/NewRole'
     *     responses:
     *       201:
     *         description: role
     *         schema:
     *          $ref: '#/definitions/Role'
     */
    router.post(
      '/roles',
      UserAuthenticator.authenticateUser,
      RoleMiddleware.validateCreateRequest,
      RoleController.createRole
    );
  }

  /**
   * Method to setup Route for deleting a specified role
   * @param{Object} router - Express router
   * @return{Void} returns void
   */
  static getRole(router) {
    /**
     * @swagger
     * /roles/{id}:
     *   get:
     *     description: Returns a role
     *     tags:
     *      - Role
     *     produces:
     *      - application/json
     *     parameters:
     *       - name: authorization
     *         in:  header
     *         description: Jwt access token
     *         required: true
     *         type: string
     *       - name: id
     *         in:  path
     *         description: Role id
     *         required: true
     *         type: integer
     *     responses:
     *       200:
     *         description: roles
     *         schema:
     *          $ref: '#/definitions/Role'
     */
    router.get(
      '/roles/:id',
      UserAuthenticator.authenticateUser,
      RoleMiddleware.validateGetRequest,
      RoleController.getRole
    );
  }

  /**
   * Method to setup Route for deleting a specified role
   * @param{Object} router - Express router
   * @return{Void} returns void
   */
  static getRoles(router) {
    router.get(
      '/roles',
      UserAuthenticator.authenticateUser,
      RoleMiddleware.validateGetRequest,
      RoleController.getRoles
    );
  }

  /**
   * Method to setup Route for deleting a specified role
   * @param{Object} router - Express router
   * @return{Void} returns void
   */
  static updateRole(router) {
                /**
     * @swagger
     * /roles/{id}:
     *   put:
     *     description: Updates a role
     *     tags:
     *      - Role
     *     produces:
     *      - application/json
     *     parameters:
     *       - name: authorization
     *         in: header
     *         description: Jwt access token
     *         required: true
     *         type: string
     *       - name: id
     *         in:  path
     *         description: Role id
     *         required: true
     *         type: integer
     *       - name: body
     *         description: Role object
     *         in:  body
     *         required: true
     *         type: object
     *         schema:
     *           $ref: '#/definitions/NewRole'
     *     responses:
     *       200:
     *         description: roles
     *         schema:
     *           $ref: '#/definitions/Role'
     */
    router.put(
      '/roles/:id',
      UserAuthenticator.authenticateUser,
      RoleMiddleware.validateUpdateRequest,
      RoleController.updateRole
    );
  }

  /**
   * Method to setup Route for deleting a specified role by id
   * @param{Object} router - Express router
   * @return{Void} returns void
   */
  static deleteRole(router) {
                    /**
     * @swagger
     * /roles/{id}:
     *   delete:
     *     description: Deletes a role
     *     tags:
     *      - Role
     *     produces:
     *      - application/json
     *     parameters:
     *       - name: authorization
     *         in:  header
     *         description: Jwt access token
     *         required: true
     *         type: string
     *       - name: id
     *         in:  path
     *         description: Role id
     *         required: true
     *         type: integer
     *     responses:
     *       200:
     *         description: statusCode
     */
    router.delete(
      '/roles/:id',
      UserAuthenticator.authenticateUser,
      RoleMiddleware.validateDeleteRequest,
      RoleController.deleteRole);
  }
}

export default RoleRoutes;
