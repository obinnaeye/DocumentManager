import actionTypes from '../constants/actionTypes';

const initialState = { users: [], fetchingUsers: false };

const userReducers = (state = initialState, action) => {
  switch (action.type) {
  case actionTypes.SEARCH_USERS_SUCCESS:
    return ({ ...state, users: action.users, fetchingUsers: true });

  case actionTypes.SEARCH_USERS_FAILURE:
    return ({ ...state, fetchingUsers: false });

  case actionTypes.UPDATE_USER_SUCCESS:
    return ({ ...state, user: action.updatedUser, updatingUser: true });

  case actionTypes.UPDATE_USER_FAILURE:
    return ({ ...state, updatingUser: false });

  default:
    return state;
  }
};

export default userReducers;
