import expect from 'expect';
import userReducer from '../../src/js/reducers/userReducers';
import * as userActions from '../../src/js/actions/UserActions';
import * as signupActions from '../../src/js/actions/SignupActions';
import * as signinActions from '../../src/js/actions/SigninActions';
import initialState from '../../src/js/reducers/initialState';

describe('Document Reducer', () => {
  const users = [
    {
      firstName: 'obi',
      lastName: 'king',
      userId: 1,
      roleId: 1,
      email: 'king@obi.com'
    },
    {
      firstName: 'obi2',
      lastName: 'king2',
      userId: 2,
      roleId: 2,
      email: 'king2@obi2.com'
    }
  ];
  it('should add created user to the store if signup is successful',
  () => {
    const newUser = { firstName: 'A', lastName: 'B', email: 'a@b.ocm' };
    const action = signupActions.createUserSuccess(newUser);
    const newState = userReducer(initialState, action);
    expect(newState.user).toEqual(newUser);
    expect(newState.createdUser).toEqual(true);
  });

  it('should not add any user to the store if signup fails', () => {
    const action = signupActions.createUserFailure();
    const newState = userReducer(initialState, action);
    expect(newState.user).toEqual({});
    expect(newState.createdUser).toEqual(false);
  });

  it('should add user to the store if signin is successful',
  () => {
    const action = signinActions.signinUserSuccess(users[0]);
    const newState = userReducer(initialState, action);
    expect(newState.user).toEqual(users[0]);
    expect(newState.signingIn).toEqual(true);
  });

  it('should not add any user to the store if signup fails', () => {
    const action = signinActions.signinUserFailure();
    const newState = userReducer(initialState, action);
    expect(newState.user).toEqual({});
    expect(newState.signingIn).toEqual(false);
  });

  it(`should add users to the state store when 
  getUsers is successful`,
  () => {
    const action = userActions.getUsersSuccess(users);
    const newState = userReducer(initialState, action);
    expect(newState.users.length).toEqual(2);
    expect(newState.users).toEqual(users);
  });

  it('should not add any user to the store if getUsers fails', () => {
    const action = userActions.getUsersFailure();
    const newState = userReducer(initialState, action);
    expect(newState.users.length).toEqual(0);
    expect(newState.fetchingUsers).toEqual(false);
  });

  it(`should add single user to the store if getting 
  user is successful`, () => {
    const action = userActions.getUserSuccess(users[0]);
    const newState = userReducer(initialState, action);
    expect(newState.user).toEqual(users[0]);
    expect(newState.fetchingUser).toEqual(true);
  });

  it('should not add any user to the store if getUser fails', () => {
    const action = userActions.getUserFailure();
    const newState = userReducer(initialState, action);
    expect(newState.user).toEqual({});
    expect(newState.fetchingUser).toEqual(false);
  });

  let authenticatedState;
  it(`should update store authenticate state to true if 
  user valid`, () => {
    const action = userActions.validateUserSuccess(users[0]);
    authenticatedState = userReducer(initialState, action);
    expect(authenticatedState.authenticated).toEqual(true);
  });

  it('should return store authenticate state to false if user is not valid',
  () => {
    const action = userActions.validateUserFailure();
    const newState = userReducer(authenticatedState, action);
    expect(newState.authenticated).toEqual(false);
  });

  let updatedState;
  it(`should update store updatingUser state to true if 
  user update is successful`, () => {
    const action = userActions.updateUserSuccess(users[0]);
    updatedState = userReducer(initialState, action);
    expect(updatedState.updatingUser).toEqual(true);
  });

  it('should return store updatingUser state to false if update fails',
  () => {
    const action = userActions.updateUserFailure();
    const newState = userReducer(updatedState, action);
    expect(newState.authenticated).toEqual(false);
  });

  let searchState;
  it(`should add found users to the store is search
  is successful`, () => {
    const action = userActions.searchUserSuccess(users);
    searchState = userReducer(initialState, action);
    expect(searchState.users).toEqual(users);
  });

  it('should restore store fetchingUsers to false  if no user is found',
  () => {
    const action = userActions.searchUserFailure();
    const newState = userReducer(searchState, action);
    expect(newState.fetchingUsers).toEqual(false);
  });

  it(`should restore the store to the initial state
   if logout is successful`, () => {
    const action = signinActions.signinUserSuccess(users[0]);
    const currentState = userReducer(initialState, action);
    const logoutAction = userActions.logoutSuccess();
    const newState = userReducer(currentState, logoutAction);
    expect(newState).toEqual(initialState);
  });

  it(`should remove deleted user from store without mutating the store
   if deleting user is successful`, () => {
    const action = userActions.getUsersSuccess(users);
    const currentState = userReducer(initialState, action);
    const deleteAction = userActions.deleteSuccess(1);
    const newState = userReducer(currentState, deleteAction);
    expect(newState.users.length).toEqual(1);
    expect(newState.users[0]).toEqual(currentState.users[1]);
  });

  it('should return the initial state if no action is matched', () => {
    const action = { type: 'DOES_NOT_MATCH_ANY_ACTION' };
    const newState = userReducer(initialState, action);
    expect(newState).toEqual(initialState);
  });
});
