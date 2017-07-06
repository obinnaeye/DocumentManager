import actionTypes from '../constants/actionTypes';
import initialState from './initialState';

const signInReducer = (state = initialState, action) => {
  switch (action.type) {

  case actionTypes.SIGNIN_USER_SUCCESS:
    return { ...state, signingIn: true, user: action.user, };

  case actionTypes.SIGNIN_USER_FAILURE:
    return { ...state, signingIn: false };

  default:
    return state;
  }
};

export default signInReducer;
