/* global Materialize jwt_decode */
import ajaxCall from 'axios';
import actionTypes from '../constants/actionTypes';

const testing = process.env.NODE_ENV === 'test';

export const createUserSuccess = user => ({
  type: actionTypes.CREATE_USER_SUCCESS, user
});

export const createUserFailure = () => ({
  type: actionTypes.CREATE_USER_FAILURE
});

export const createUser = user =>
   dispatch =>
    ajaxCall.post('/users/', user)
      .then((response) => {
        /* istanbul ignore next */
        if (!testing) {
          const { activeToken } = response.data;
          localStorage.setItem('accessToken', activeToken);
          const decodedUser = jwt_decode(activeToken);
          localStorage.setItem('user_profile', JSON.stringify(decodedUser));
          Materialize.toast(
            'Account created successfully!',
            3000, 'green'
          );
        }
        dispatch(createUserSuccess(response.data));
      }, (error) => {
        dispatch(createUserFailure());
        /* istanbul ignore next */
        if (!testing) {
          Materialize.toast(error.response.data.message, 5000, 'red');
        }
      });
