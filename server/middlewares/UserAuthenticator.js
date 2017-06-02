import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from '../models';

dotenv.config();
const JWT_SECRETE = process.env.JWT_SECRETE;

export default class UserAuthenticator {

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

  static getRequestToken(request) {
    const token = request.headers.authorization ||
      request.body.activeToken ||
      request.headers['xsrf-token'];
    return token;
  }

  static verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRETE);
    } catch (error) {
      return null;
    }
  }

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
