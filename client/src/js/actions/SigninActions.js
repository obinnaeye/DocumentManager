/* global Materialize, jwt_decode */
import ajaxCall from 'axios';
import actionTypes from '../constants/actionTypes';


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
        const { activeToken } = response.data;
        localStorage.setItem('xsrf_token', response.data.activeToken);
          // jwt_decode is a browser libery to decode jwt tokens
          // It's inclued in the script tag of this project index.html file
        const decodedUser = jwt_decode(activeToken);
        dispatch(signinUserSuccess(decodedUser));
        Materialize.toast(
          'You have successfully signed in! Welcome!',
          5000
        );
      })
      .catch((error) => {
        dispatch(signinUserFailure());
        Materialize.toast(error.response.data.message, 5000);
      });

// export const setUserDetails = userDetails => ({
//   type: actionTypes.SET_USER_DETAILS, userDetails
// });
