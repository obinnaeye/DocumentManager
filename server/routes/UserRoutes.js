import UserController from '../controllers/UserController';

/**
 *
 *
 * @class UserRoutes
 */
class UserRoutes {

  /**
   *
   * @static
   * @param {function} router
   * @return {void}
   * @memberOf UserRoutes
   */
  static initializeRoutes(router) {
    UserRoutes.createUser(router);
  }

  /**
   *
   * @static
   * @param {any} router
   * @return {void}
   * @memberOf UserRoutes
   */
  static createUser(router) {
    router.post('/users/', UserController.createUser);
  }
}

export default UserRoutes;
