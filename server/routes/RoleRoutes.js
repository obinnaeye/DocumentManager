import RoleController from '../controllers/RoleController';

/**
 * Class for creating Role routes
 */
class RoleRoutes {

  /**
   * Method that sets all Role routes
   * @param{Object} router - Express router
   * @return{Void} returns void
   */
  static initializeRoutes(router) {
    RoleRoutes.createRole(router);
  }

  /**
   * Method that sets up Route for creating a new role
   * @param{Object} router - Express router
   * @return{Void} returns void
   */
  static createRole(router) {
    router.post('/roles', RoleController.createRole);
  }
}

export default RoleRoutes;
