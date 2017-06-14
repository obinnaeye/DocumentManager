/* global Materialize */
import ajaxCall from 'axios';
import actionTypes from '../constants/actionTypes';
import setToken from '../helper/setTokenHelper';

export const searchUserSuccess = users =>
  ({ type: actionTypes.SEARCH_USERS_SUCCESS, users });

export const searchUserFailure = () =>
  ({ type: actionTypes.SEARCH_USERS_FAILURE });

export const searchUsers = (searchData) => {
  const { q, offset, limit } = searchData;
  setToken();
  return dispatch =>
    ajaxCall.get(`/search/users/?q=${q}&offset=${offset}&limit=${limit}`)
      .then((response) => {
        dispatch(searchUserSuccess(response.data));
      })
      .catch((error) => {
        dispatch(searchUserFailure(error));
      });
};
