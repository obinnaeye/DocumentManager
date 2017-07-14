/* global Materialize, jwt_decode */
import ajaxCall from 'axios';
import actionTypes from '../constants/actionTypes';
import setToken from '../helper/setTokenHelper';

const testing = process.env.NODE_ENV === 'test';

export const signinUserSuccess = user => ({
  type: actionTypes.SIGNIN_USER_SUCCESS, user
});

export const signinUserFailure = () => ({
  type: actionTypes.SIGNIN_USER_FAILURE
});

export const signinUser = user =>
  dispatch =>
    ajaxCall.post('/users/login', user)
      .then((response) => {
        dispatch(signinUserSuccess(response.data));
        /* istanbul ignore next */
        if (!testing) {
          const { activeToken } = response.data;
          localStorage.setItem('accessToken', response.data.activeToken);
          // set jwt authorization token on request header
          setToken(activeToken);
          const decodedUser = jwt_decode(activeToken);
          localStorage.setItem('user_profile', JSON.stringify(decodedUser));
          dispatch(signinUserSuccess(decodedUser));
          Materialize.toast(
            'You have successfully signed in! Welcome!',
            5000, 'green'
          );
        }
      })
      .catch((error) => {
        dispatch(signinUserFailure());
        /* istanbul ignore next */
        if (!testing) {
          Materialize.toast(error.response.data.message, 5000);
        }
      });

