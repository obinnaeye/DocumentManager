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
    UserRoutes.searchUser(router);
    UserRoutes.updateUser(router);
    UserRoutes.deleteUser(router);
    UserRoutes.getUser(router);
    UserRoutes.fetchUsers(router);
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

  static searchUser(router) {
    router.get('/search/users/', UserController.searchUser);
  }

  static updateUser(router) {
    router.put('/users/:id', UserController.updateUser);
  }

  static deleteUser(router) {
    router.delete('/users/:id', UserController.deleteUser);
  }

  static getUser(router) {
    router.get('/users/:id', UserController.getUser);
  }

  static fetchUsers(router) {
    router.get('/users/', UserController.fetchUsers);
  }
}

export default UserRoutes;
