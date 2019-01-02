import axios from 'axios';

const setTokenHelper = (token) => {
  if (!token) {
    token = localStorage.accessToken;
  }
  axios.defaults.headers.authorization = token;
};

export default setTokenHelper;
