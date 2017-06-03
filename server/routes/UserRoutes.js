import UserController from '../controllers/UserController';
import UserAuthenticator from '../middlewares/UserAuthenticator';
import UserMiddleware from '../middlewares/UserMiddleware';

/**
 * Class that creates a UserRoutes Object
 * and set express routes associated with a user object
 */
class UserRoutes {

  /**
   * Method that sets all User routes
   * @param{Object} router - Express router
   * @returns{Void} - Returns Void
   * @memberof UserRoutes
   */
  static initializeRoutes(router) {
    UserRoutes.createUser(router);
    UserRoutes.login(router);
    UserRoutes.logoutUser(router);
    UserRoutes.searchUser(router);
    UserRoutes.updateUser(router);
    UserRoutes.deleteUser(router);
    UserRoutes.getUser(router);
    UserRoutes.getUsers(router);
  }

  /**
   * Method that sets up route for create a new user requests
   * @param{Object} router - Express router
   * @return{Void} - Returns Void
   * @memberof UserRoutes
   */
  static createUser(router) {
    router.post('/users/',
    UserMiddleware.validateCreateRequest,
    UserController.createUser);
  }

  /**
   * Method that sets up route for user login requests
   * @param{Object} router - Express router
   * @return{Void} - Returns Void
   * @memberof UserRoutes
   */
  static login(router) {
    router.post('/users/login',
    UserController.login);
  }

  /**
   * Method that sets up route for user logout requests
   * @param{Object} router - Express router
   * @return{Void} - Returns Void
   * @memberof UserRoutes
   */
  static logoutUser(router) {
    router.post(
      '/users/logout',
      UserAuthenticator.authenticateUser,
      UserController.logoutUser
    );
  }

  /**
   * Method that sets up route for searching documents
   * @param{Object} router - Express router
   * @return{Void} - Returns Void
   * @memberof UserRoutes
   */
  static searchUser(router) {
    router.get('/search/users/',
    UserAuthenticator.authenticateUser,
    UserController.searchUser);
  }

  /**
   * Method that sets up route for updating user profiles
   * @param{Object} router - Express router
   * @return{Void} - Returns Void
   * @memberof UserRoutes
   */
  static updateUser(router) {
    router.put('/users/:id',
    UserAuthenticator.authenticateUser,
    UserMiddleware.validateUpdateRequest,
    UserController.updateUser);
  }

  /**
   * Method that sets up route for delete user requests
   * @param{Object} router - Express router
   * @return{Void} - Returns Void
   * @memberof UserRoutes
   */
  static deleteUser(router) {
    router.delete('/users/:id',
    UserAuthenticator.authenticateUser,
    UserMiddleware.validateDeleteRequest,
    UserController.deleteUser);
  }

  /**
   * Method that sets up route for getting a specific user
   * @param{Object} router - Express router
   * @return{Void} - Returns Void
   * @memberof UserRoutes
   */
  static getUser(router) {
    router.get('/users/:id',
    UserAuthenticator.authenticateUser,
    UserMiddleware.validateGetRequest,
    UserController.getUser);
  }

  /**
   * Method that sets up route for getting all instances of user
   * @param{Object} router - Express router
   * @return{Void} - Returns Void
   * @memberof UserRoutes
   */
  static getUsers(router) {
    router.get('/users/',
    UserAuthenticator.authenticateUser,
    UserController.getUsers);
  }
}

export default UserRoutes;
