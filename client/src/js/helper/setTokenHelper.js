import axios from 'axios';

const setTokenHelper = (token) => {
  if (!token) {
    token = localStorage.xsrf_token;
  }
  axios.defaults.headers.authorization = token;
};

export default setTokenHelper;
