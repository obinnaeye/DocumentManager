import actionTypes from '../constants/actionTypes';

const initialState = { createUser: false, user: {} };

/**
 * authentication reducer
 * @param {object} state
 * @param {object} action
 * @returns {object} - state
 */

const signUpReducer = (state = initialState, action) => {
  switch (action.type) {
  case actionTypes.WILL_CREATE_USER:
    return { ...state, createuser: true };

  case actionTypes.CREATE_USER_SUCCESS:
    return { ...state, createUser: false, user: action.user };

  case actionTypes.CREATE_USER_FAILURE:
    return { ...state, createUser: false };

  default:
    return state;
  }
};

export default signUpReducer;
