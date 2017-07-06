import actionTypes from '../constants/actionTypes';
import initialState from './initialState';

const signUpReducer = (state = initialState, action) => {
  switch (action.type) {
  case actionTypes.CREATE_USER_SUCCESS:
    return { ...state, createdUser: true, user: action.user };

  case actionTypes.CREATE_USER_FAILURE:
    return { ...state, createdUser: false };

  default:
    return state;
  }
};

export default signUpReducer;
