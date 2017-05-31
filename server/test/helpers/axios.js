import axios from 'axios';

export default class AxiosCaller {
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
