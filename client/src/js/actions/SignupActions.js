/* global Materialize */
import ajaxCall from 'axios';
import actionTypes from '../constants/actionTypes';

export const willCreateUser = () => ({
  type: actionTypes.WILL_CREATE_USER
});

export const createUserSuccess = user => ({
  type: actionTypes.CREATE_USER_SUCCESS, user
});

export const createUserFailure = () => ({
  type: actionTypes.CREATE_USER_FAILURE
});

export const createUser = (user) => {
  return (dispatch) => {
    // dispatch(SignupActions.willCreateUser());
    ajaxCall.post('/users/', user)
      .then((response) => {
        localStorage.setItem('xsrf_token', response.data.activeToken);
        dispatch(createUserSuccess(response.data));
        Materialize.toast(
          'Account created! Please login to continue',
          5000
        );
      }, (error) => {
        dispatch(createUserFailure());
        Materialize.toast(error.response.data.message, 5000);
      });
  };
};
