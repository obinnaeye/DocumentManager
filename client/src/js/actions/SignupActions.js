/* global Materialize */
import ajaxCall from 'axios';
import actionTypes from '../constants/actionTypes';

class SignupActions {
  static willCreateUser() {
    return { type: actionTypes.WILL_CREATE_USER };
  }

  static createUser(user) {
    return (dispatch) => {
      dispatch(SignupActions.willCreateUser());
      ajaxCall.post('/users/', user)
        .then((response) => {
          dispatch(SignupActions.createUserSuccess(response.data));
          Materialize.toast(
            'Account created! Please login to continue',
            5000
          );
        }, (error) => {
          dispatch(SignupActions.createUserFailure());
          Materialize.toast(error.response.data.message, 5000);
          throw ('error', error.response.data.message);
        });
    };
  }

  static createUserSuccess(user) {
    return { type: actionTypes.CREATE_USER_SUCCESS, user };
  }

  static createUserFailure() {
    return { type: actionTypes.CREATE_USER_FAILURE };
  }
}
