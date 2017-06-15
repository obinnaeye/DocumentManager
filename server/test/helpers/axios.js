import axios from 'axios';

/**
 * @export
 * @class AxiosCaller
 * @desc Makes axios CRUD calls
 */
export default class AxiosCaller {

  /**
   * @static
   * @desc method that makes axios post request and resolves the response
   * @param {string} url
   * @param {object} body
   * @returns {object} - Promise
   *
   * @memberOf AxiosCaller
   */
  static post(url, body) {
    return (new Promise((resolve, reject) => {
      axios.post(url, body).then((response, error) => {
        if (error) {
          reject(error);
        }
        resolve(response);
      });
    }));
  }
}
