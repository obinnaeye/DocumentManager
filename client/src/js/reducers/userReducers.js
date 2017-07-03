import findIndex from 'lodash/findIndex';
import actionTypes from '../constants/actionTypes';

const initialState = {
  users: [],
  fetchingUsers: false,
  fetchingUser: false,
  count: 0
};

const userReducers = (state = initialState, action) => {
  switch (action.type) {
  case actionTypes.GET_USERS_SUCCESS:
    return ({ ...state, users: action.users, fetchingUsers: true });

  case actionTypes.GET_USERS_FAILURE:
    return ({ ...state, fetchingUsers: false });

  case actionTypes.GET_USER_SUCCESS:
    return ({ ...state, user: action.user, fetchingUser: true });

  case actionTypes.GET_USER_FAILURE:
    return ({ ...state, fetchingUser: false });

  case actionTypes.SEARCH_USERS_SUCCESS:
    return ({ ...state, users: action.users, fetchingUsers: true });

  case actionTypes.SEARCH_USERS_FAILURE:
    return ({ ...state, fetchingUsers: false });

  case actionTypes.UPDATE_USER_SUCCESS:
    return ({ ...state, user: action.updatedUser, updatingUser: true });

  case actionTypes.UPDATE_USER_FAILURE:
    return ({ ...state, updatingUser: false });

  case actionTypes.VALIDATE_USER_SUCCESS:
    return ({ ...state, authenticated: true });

  case actionTypes.VALIDATE_USER_FAILURE:
    return ({ ...state, authenticated: false });

  case actionTypes.LOGOUT_SUCCESS:
    return {};

  case actionTypes.DELETE_USER_SUCCESS: {
    // Use unary plus to convert id string to number
    const index = findIndex(state.users, { userId: +(action.userId) });
    const stateUsers = state.users;
    stateUsers.splice(index, 1);
    console.log(index, action.userId, "index here", stateUsers);
    return { ...state,
      users: stateUsers,
      deletingUsers: true,
      count: state.count + 1 || 1 };
  }

  default:
    return state;
  }
};

export default userReducers;
