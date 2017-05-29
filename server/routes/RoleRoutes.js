import RoleController from '../controllers/RoleController';

/**
 *
 *
 * @class UserRoutes
 */
class RoleRoutes {

  /**
   *
   * @static
   * @param {function} router
   * @return {void}
   * @memberOf UserRoutes
   */
  static initializeRoutes(router) {
    RoleRoutes.createRole(router);
  }

  /**
   *
   * @static
   * @param {any} router
   * @return {void}
   * @memberOf UserRoutes
   */
  static createRole(router) {
    router.post('/roles', RoleController.createRole);
  }
}

export default RoleRoutes;
