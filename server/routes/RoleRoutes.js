import RoleController from '../controllers/RoleController';
import UserAuthenticator from '../middlewares/UserAuthenticator';
import RoleMiddleware from '../middlewares/RoleMiddleware';

/**
 * Class for creating Role routes
 */
class RoleRoutes {

  /**
   * Method that sets all Role routes
   * @param{Object} router - Express router
   * @return{Void} returns void
   */
  static setRoleRoutes(router) {
    /**
   * @swagger
   * definition:
   *   NewRole:
   *     type: object
   *     required:
   *       - title
   *     properties:
   *       title:
   *         type: string
   *   Role:
   *     allOf:
   *       - $ref: '#/definitions/NewRole'
   *       - required:
   *         - id
   *       - properties:
   *         id:
   *           type: integer
   *           format: int64
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
     *     description: Creates a role
     *     tags:
     *      - Create Role
     *     produces:
     *      - application/json
     *     parameters:
     *       - name: Authorization
     *         in:  header
     *         description: an authorization token
     *         required: true
     *         type: string
     *         schema:
     *           $ref: '#/definitions/Role'
     *     responses:
     *       201:
     *         description: roles
     *         schema:
     *          type: object
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
  static deleteRole(router) {
                    /**
     * @swagger
     * /roles/{id}:
     *   delete:
     *     description: Deletes a role
     *     tags:
     *      - Deletes a role
     *     produces:
     *      - application/json
     *     parameters:
     *       - name: Authorization
     *         in:  header
     *         description: an authorization token
     *         required: true
     *         type: string
     *         schema:
     *           $ref: '#/definitions/Role'
     *     responses:
     *       201:
     *         description: roles
     *         schema:
     *          type: object
     */
    router.delete(
      '/roles/:id',
      UserAuthenticator.authenticateUser,
      RoleMiddleware.validateDeleteRequest,
      RoleController.deleteRole);
  }
}

export default RoleRoutes;
