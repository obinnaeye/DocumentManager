import UserController from '../controllers/UserController';
import UserAuthenticator from '../middlewares/UserAuthenticator';

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
    UserRoutes.login(router);
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

  static login(router) {
    router.post('/users/login', UserController.login);
  }
}

export default UserRoutes;
