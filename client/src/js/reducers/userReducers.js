import findIndex from 'lodash/findIndex';
import actionTypes from '../constants/actionTypes';
import initialState from './initialState';

const userReducers = (state = initialState, action) => {
  switch (action.type) {
  case actionTypes.CREATE_USER_SUCCESS:
    return ({
      ...state,
      createdUser: true,
      user: action.user,
      count: state.count + 1 || 1
    });

  case actionTypes.CREATE_USER_FAILURE:
    return { ...state, createdUser: false, count: state.count + 1 || 1 };

  case actionTypes.SIGNIN_USER_SUCCESS:
    return {
      ...state, signingIn: true, user: action.user, count: state.count + 1 || 1
    };

  case actionTypes.SIGNIN_USER_FAILURE:
    return { ...state, signingIn: false, count: state.count + 1 || 1 };

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
    return ({ ...state, authenticated: true, count: state.count + 1 || 1 });

  case actionTypes.VALIDATE_USER_FAILURE:
    return ({ ...state, authenticated: false, count: state.count + 1 || 1 });

  case actionTypes.LOGOUT_SUCCESS:
    return (initialState);

  case actionTypes.DELETE_USER_SUCCESS: {
    // Use unary plus to convert id string to number
    const index = findIndex(state.users, { userId: +(action.userId) });
    const stateUsers = state.users.slice(0);
    stateUsers.splice(index, 1);
    return ({ ...state,
      users: stateUsers,
      deletingUsers: true,
      count: state.count + 1 || 1 });
  }

  default:
    return state;
  }
};

export default userReducers;
