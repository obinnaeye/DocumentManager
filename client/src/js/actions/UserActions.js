/* global Materialize */
import ajaxCall from 'axios';
import actionTypes from '../constants/actionTypes';
import setToken from '../helper/setTokenHelper';

const testing = process.env.NODE_ENV === 'test';

export const searchUserSuccess = users =>
  ({ type: actionTypes.SEARCH_USERS_SUCCESS, users });

export const searchUserFailure = () =>
  ({ type: actionTypes.SEARCH_USERS_FAILURE });

export const searchUsers = (searchData) => {
  const { q, offset, limit } = searchData;
  /* istanbul ignore next */
  if (!testing) {
    setToken();
  }
  return dispatch =>
    ajaxCall.get(`/search/users/?q=${q}&offset=${offset}&limit=${limit}`)
      .then((response) => {
        if (response.data.rows.length > 0) {
          dispatch(searchUserSuccess(response.data.rows));
        } else {
          dispatch(searchUserFailure());
        }
      })
      .catch((error) => {
        dispatch(searchUserFailure(error));
      });
};

export const getUserSuccess = user =>
  ({ type: actionTypes.GET_USER_SUCCESS, user });

export const getUserFailure = () =>
  ({ type: actionTypes.GET_USER_FAILURE });

export const getUser = (userId) => {
  /* istanbul ignore next */
  if (!testing) {
    setToken();
  }
  return dispatch =>
    ajaxCall.get(`/users/${userId}`)
      .then((response) => {
        dispatch(getUserSuccess(response.data));
      })
      .catch((error) => {
        dispatch(getUserFailure(error));
      });
};

export const getUsersSuccess = users =>
  ({ type: actionTypes.GET_USERS_SUCCESS, users });

export const getUsersFailure = () =>
  ({ type: actionTypes.GET_USERS_FAILURE });

export const getUsers = (offset, limit) => {
  /* istanbul ignore next */
  if (!testing) {
    setToken();
  }
  return dispatch =>
    ajaxCall.get(`/users/?limit=${limit}&offset=${offset}`)
      .then((response) => {
        dispatch(getUsersSuccess(response.data.rows));
      })
      .catch((error) => {
        dispatch(getUsersFailure(error));
      });
};

export const updateUserSuccess = updatedUser =>
  ({ type: actionTypes.UPDATE_USER_SUCCESS, updatedUser });

export const updateUserFailure = () =>
  ({ type: actionTypes.UPDATE_USER_FAILURE });

export const updateUser = (updateInfo) => {
  const { userId } = updateInfo;
  const { updateData } = updateInfo;
  /* istanbul ignore next */
  if (!testing) {
    setToken();
  }
  return dispatch =>
    ajaxCall.put(`/users/${userId}`, updateData)
      .then((response) => {
        dispatch(updateUserSuccess(response.data));
        /* istanbul ignore next */
        if (!testing) {
          Materialize.toast('Profile updated successfully!', 3000, 'green');
        }
      })
      .catch((error) => {
        dispatch(updateUserFailure(error));
        /* istanbul ignore next */
        if (!testing) {
          Materialize.toast(error.response.data.message, 3000, 'red');
        }
      });
};

export const validateUserSuccess = validatedUser =>
  ({ type: actionTypes.VALIDATE_USER_SUCCESS, validatedUser });

export const validateUserFailure = () =>
  ({ type: actionTypes.VALIDATE_USER_FAILURE });

export const validateUser = (userId) => {
  /* istanbul ignore next */
  if (!testing) {
    setToken();
  }
  return dispatch =>
    ajaxCall.get(`/users/${userId}`)
      .then((response) => {
        dispatch(validateUserSuccess(response.data));
      })
      .catch((error) => {
        dispatch(validateUserFailure(error));
      });
};

export const logoutSuccess = message =>
  ({ type: actionTypes.LOGOUT_SUCCESS, message });

export const logoutFailure = () =>
  ({ type: actionTypes.LOGOUT_FAILURE });

export const logout = () => {
  /* istanbul ignore next */
  if (!testing) {
    setToken();
  }
  return dispatch =>
    ajaxCall.post('/users/logout')
      .then((response) => {
        /* istanbul ignore next */
        if (!testing) {
          localStorage.removeItem('accessToken');
        }
        dispatch(logoutSuccess(response.data));
      })
      .catch((error) => {
        dispatch(logoutFailure(error));
      });
};

export const deleteSuccess = userId =>
  ({ type: actionTypes.DELETE_USER_SUCCESS, userId });

export const deleteFailure = () =>
  ({ type: actionTypes.DELETE_USER_FAILURE });

export const deleteUser = (userId) => {
  /* istanbul ignore next */
  if (!testing) {
    setToken();
  }
  return dispatch =>
    ajaxCall.delete(`/users/${userId}`)
      .then((response) => {
        dispatch(deleteSuccess(userId));
        /* istanbul ignore next */
        if (!testing) {
          Materialize.toast(response.data.message, 3000, 'green');
        }
      })
      .catch((error) => {
        dispatch(deleteFailure(error));
        /* istanbul ignore next */
        if (!testing) {
          Materialize.toast(error.message, 3000, 'red');
        }
      });
};
