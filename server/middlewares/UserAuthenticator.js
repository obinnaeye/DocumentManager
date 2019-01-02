import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from '../models';

dotenv.config();
const JWT_SECRETE = process.env.JWT_SECRETE;

/**
 * Class to handle user authentication
 */
export default class UserAuthenticator {

  /**
   * Method to generate a token for a user
   * @param{Object} user - User Object
   * @return{String} - Token string
   * @memberof UserAuthenticator
   */
  static generateToken(user) {
    return jwt.sign({
      userId: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      roleId: user.roleId
    },
    JWT_SECRETE,
    { expiresIn: '7 days' });
  }

  /**
   * Method to get token from a request object
   * @param {Object} request - Request Object
   * @return {Object} - returns the token if it is present in the
   * request, otherwise returns undefined
   * @memberof UserAuthenticator
   */
  static getRequestToken(request) {
    const token = request.headers.authorization ||
      request.body.activeToken ||
      request.headers['xsrf-token'];
    return token;
  }

  /**
   * Method to verify a token and return the decoded user object
   * @param {Object} token - Token to be verified
   * @return{Object|null} - returns decoded user object if the token is
   * valid, otherwise returns null
   * @memberof UserAuthenticator
   */
  static verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRETE);
    } catch (error) {
      return null;
    }
  }

  /**
   * Method to authenticate a user token before user can access
   * protected routes
   * @param {Object} request - Request Object
   * @param {Object} response - Response Object
   * @param {Function} next - Function call to move to the next middleware
   * or endpoint controller
   * @return {Void} - Returns void
   * @memberof UserAuthenticator
   */
  static authenticateUser(request, response, next) {
    const token = UserAuthenticator.getRequestToken(request);
    if (token) {
      const verifiedToken = UserAuthenticator.verifyToken(token);
      if (verifiedToken) {
        User.findById(verifiedToken.userId)
          .then((user) => {
            if (user && user.activeToken === token) {
              request.decoded = verifiedToken;
              next();
            } else {
              response.status(400).send('Invalid User Authentication Token!');
            }
          });
      } else {
        response.status(400).send('Invalid User Authentication Token!');
      }
    } else {
      response.status(400).send('Please provide Authentication Token');
    }
  }
}
