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
    /**
     * @swagger
     * definition:
     *   NewUser:
     *     type: object
     *     required:
     *       - firstname
     *       - lastname
     *       - email
     *       - password
     *     properties:
     *       firstName:
     *         type: string
     *       lastName:
     *         type: string
     *       password:
     *         type: string
     *         format: password
     *       email:
     *         type: string
     *   User:
     *     type: object
     *     required:
     *       - firstname
     *       - lastname
     *       - email
     *       - password
     *     properties:
     *       firstName:
     *         type: string
     *       lastName:
     *         type: string
     *       roleId:
     *         type: integer
     *       email:
     *         type: string
     *       userId:
     *         type: integer
     *       createdAt:
     *         type: string
     *         format: date
     *       activeToken:
     *          type: string
     *   SafeUser:
     *     type: object
     *     required:
     *       - firstname
     *       - lastname
     *       - email
     *       - password
     *     properties:
     *       firstName:
     *         type: string
     *       lastName:
     *         type: string
     *       roleId:
     *         type: integer
     *       email:
     *         type: string
     *       userId:
     *         type: integer
     *       createdAt:
     *         type: string
     *         format: date
     */
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
    /**
     * @swagger
     * /users/:
     *   post:
     *     description: Creates a new user
     *     tags:
     *      - Create User
     *     produces:
     *      - application/json
     *     parameters:
     *       - name: body
     *         description: User object
     *         in:  body
     *         required: true
     *         type: object
     *         schema:
     *           $ref: '#/definitions/NewUser'
     *     responses:
     *       200:
     *         description: users
     *         schema:
     *          allOf:
     *            - $ref: '#/definitions/NewUser'
     *       400:
     *         description: Error
     */
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
    /**
     * @swagger
     * definition:
     *   Login:
     *     type: object
     *     required:
     *       - email
     *       - password
     *     properties:
     *       password:
     *         type: string
     *         format: password
     *       email:
     *         type: string
     *         format: email
     */

    /**
     * @swagger
     * /users/login:
     *   post:
     *     description: Signs in a user
     *     tags:
     *      - Signs in a user
     *     produces:
     *      - application/json
     *     parameters:
     *       - name: body
     *         description: User object
     *         in:  body
     *         required: true
     *         type: string
     *         schema:
     *           $ref: '#/definitions/Login'
     *     responses:
     *       200:
     *         description: Jwt access token
     *         schema:
     *           $ref: '#/definitions/User'
     */
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
    /**
   * @swagger
   * /search/users?q={user email, firstname or lastname}:
   *    get:
   *      description: Returns the user
   *      tags:
   *        - Searches for a user
   *      produces:
   *        - application/json
   *      parameters:
   *        - name: authorization
   *          in: header
   *          description: Jwt access token
   *          required: true
   *          type: string
   *        - in: query
   *          name: q
   *          description: email, firstName or lastName of a registred user
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
   *          description: user
   *          schema:
   *            $ref: '#/definitions/User'
   */
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
    /**
     * @swagger
     * /users/{id}:
     *   put:
     *     description: Updates details of a single user by id
     *     tags:
     *      - Updates user details
     *     produces:
     *      - application/json
     *     parameters:
     *       - name: authorization
     *         in: header
     *         description: Jwt access token
     *         required: true
     *         type: string
     *       - name: id
     *         in: path
     *         description: User id
     *         required: true
     *         type: integer
     *       - name: body
     *         description: 'User object: Delete fields not to be updated'
     *         in:  body
     *         required: true
     *         type: object
     *         schema:
     *           type: object
     *           properties:
     *              firstName:
     *                type: string
     *              lastName:
     *                type: string
     *              password:
     *                type: string
     *                format: password
     *     responses:
     *       200:
     *         description: users
     *         schema:
     *          $ref: '#/definitions/User'
     */
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
    /**
     * @swagger
     * /users/{id}:
     *   delete:
     *     description: Deletes a user by id
     *     tags:
     *      - Deletes a user by id
     *     produces:
     *      - application/json
     *     parameters:
     *       - name: authorization
     *         in: header
     *         description: Jwt access token
     *         required: true
     *         type: string
     *       - name: id
     *         description: User id
     *         in:  path
     *         required: true
     *         type: string
     *         schema:
     *           $ref: '#/definitions/User'
     *     responses:
     *       200:
     *         description: message
     *         schema:
     *          type: string
     */
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
    /**
     * @swagger
     * /users/{id}:
     *   get:
     *     description: Return a single user by id
     *     tags:
     *      - Return a single user by id
     *     produces:
     *      - application/json
     *     parameters:
     *       - name: authorization
     *         in: header
     *         description: Jwt access token
     *         required: true
     *         type: string
     *       - name: id
     *         description: User id
     *         in:  path
     *         required: true
     *         type: integer
     *     responses:
     *       200:
     *         description: users
     *         schema:
     *          $ref: '#/definitions/SafeUser'
     */
    router.get('/users/:id',
    UserAuthenticator.authenticateUser,
    UserController.getUser);
  }

  /**
   * Method that sets up route for getting all instances of user
   * @param{Object} router - Express router
   * @return{Void} - Returns Void
   * @memberof UserRoutes
   */
  static getUsers(router) {
    /**
     * @swagger
     * /users:
     *   get:
     *     description: Gets a list of all users
     *     tags:
     *      - Get Users List
     *     produces:
     *      - application/json
     *     parameters:
     *        - name: authorization
     *          in: header
     *          description: Jwt access token
     *          required: true
     *          type: string
     *        - name: offset
     *          in: query
     *          description: User query offset
     *          type: integer
     *        - name: limit
     *          in: query
     *          description: User query limit
     *          type: integer
     *     responses:
     *        200:
     *          description: users
     *          schema:
     *            type: array
     *            items:
     *              $ref: '#/definitions/SafeUser'
     */
    router.get('/users/',
    UserAuthenticator.authenticateUser,
    UserController.getUsers);
  }
}

export default UserRoutes;
