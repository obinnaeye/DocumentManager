import actionTypes from '../constants/actionTypes';

const initialState = { signingIn: false, user: {} };

/**
 * authentication reducer
 * @param {object} state
 * @param {object} action
 * @returns {object} - state
 */

const signUpReducer = (state = initialState, action) => {
  switch (action.type) {

  case actionTypes.SIGNIN_USER_SUCCESS:
    return { ...state, signingIn: false, user: action.user, };

  case actionTypes.SIGNIN_USER_FAILURE:
    return { ...state, signingIn: false };

  // case actionTypes.SET_USER_DETAILS:
  //   return { ...state, signingIn: false, userDetails: action.userDetails };

  default:
    return state;
  }
};

export default signUpReducer;
