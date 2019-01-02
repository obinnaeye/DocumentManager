import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import expect from 'expect';
import nockAjaxCall from 'nock';
import ajaxCall from 'axios';
import * as userActions from '../../src/js/actions/UserActions';
import actionTypes from '../../src/js/constants/actionTypes';
import url from '../helper/constant';

const baseUrl = url.baseUrl;

// set ajaxCall call default base url to localhost
ajaxCall.defaults.baseURL = baseUrl;

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('User Actions:', () => {
  describe('Search users',
    () => {
      afterEach(() => {
        nockAjaxCall.cleanAll();
      });

      it('should create SEARCH_USER_SUCCESS when user is found', () => {
        const search = {
          q: 'ob',
          limit: 2,
          offset: 0
        };
        const users = [{
          email: 'obinna@king.com',
          firstName: 'obinna',
          lastName: 'Nnenanya',
          roleId: 2
        }];
        nockAjaxCall(baseUrl)
          .get('/search/users/')
          .query({ q: 'ob', limit: 2, offset: 0 })
          .reply(200, users);

        const expectedActions = [{ type: actionTypes.SEARCH_USERS_SUCCESS,
          users }];

        const store = mockStore({});

        store.dispatch(userActions.searchUsers(search))
          .then(() => {
            expect(store.getActions()).toEqual(expectedActions);
          });
      });

      it('creates SEARCH_USERS_FAILURE when an error is encountered',
      () => {
        const search = {
          q: 'ob',
          limit: 2,
          offset: 0
        };
        const users = [{
          email: 'obinna@king.com',
          firstName: 'obinna',
          lastName: 'Nnenanya',
          roleId: 2
        }];
        nockAjaxCall(baseUrl)
          .get('/search/users/')
          .query({ q: 'ob', limit: 2, offset: 0 })
          .reply(404, users);

        const expectedActions = [{ type: actionTypes.SEARCH_USERS_FAILURE }];

        const store = mockStore({});

        store.dispatch(userActions.searchUsers(search))
          .then(() => {
            expect(store.getActions()).toEqual(expectedActions);
          });
      });
    });

  describe('Get user',
    () => {
      afterEach(() => {
        nockAjaxCall.cleanAll();
      });

      it('should create GET_USER_SUCCESS when user is found', () => {
        const user = {
          email: 'obinna@king.com',
          firstName: 'obinna',
          lastName: 'Nnenanya',
          roleId: 2
        };
        nockAjaxCall(baseUrl)
          .get(`/users/${2}`)
          .reply(200, user);

        const expectedActions = [{ type: actionTypes.GET_USER_SUCCESS,
          user }];

        const store = mockStore({});

        store.dispatch(userActions.getUser(2))
          .then(() => {
            expect(store.getActions()).toEqual(expectedActions);
          });
      });

      it('creates GET_USER_FAILURE when an error is encountered',
      () => {
        nockAjaxCall(baseUrl)
          .get(`/users/${2}`)
          .reply(404);

        const expectedActions = [{ type: actionTypes.GET_USER_FAILURE }];

        const store = mockStore({});

        store.dispatch(userActions.getUser(2))
          .then(() => {
            expect(store.getActions()).toEqual(expectedActions);
          });
      });
    });

  describe('Get users',
    () => {
      afterEach(() => {
        nockAjaxCall.cleanAll();
      });

      it('should create GET_USERS_SUCCESS when user is found', () => {
        const users = [{
          email: 'obinna@king.com',
          firstName: 'obinna',
          lastName: 'Nnenanya',
          roleId: 2
        }];
        nockAjaxCall(baseUrl)
          .get('/users/')
          .query({ offset: 0, limit: 2 })
          .reply(200, users);

        const expectedActions = [{ type: actionTypes.GET_USERS_SUCCESS,
          users }];

        const store = mockStore({});

        store.dispatch(userActions.getUsers(0, 2))
          .then(() => {
            expect(store.getActions()).toEqual(expectedActions);
          });
      });

      it('creates GET_USERS_FAILURE when an error is encountered',
      () => {
        nockAjaxCall(baseUrl)
          .get('/users/')
          .query({ offset: 0, limit: 2 })
          .reply(404);

        const expectedActions = [{ type: actionTypes.GET_USERS_FAILURE }];

        const store = mockStore({});

        store.dispatch(userActions.getUsers(0, 2))
          .then(() => {
            expect(store.getActions()).toEqual(expectedActions);
          });
      });
    });

  describe('Update user',
    () => {
      afterEach(() => {
        nockAjaxCall.cleanAll();
      });

      const updateData = {
        email: 'obinna@king.com',
        firstName: 'obinna',
        lastName: 'Nnenanya',
        roleId: 2
      };

      const updateInfo = {
        updateData
      };

      updateInfo.userId = 2;
      it('should create UPDATE_USER_SUCCESS when user is updated', () => {
        nockAjaxCall(baseUrl)
          .put(`/users/${2}`)
          .reply(200, updateData);

        const expectedActions = [{ type: actionTypes.UPDATE_USER_SUCCESS,
          updatedUser: updateData }];

        const store = mockStore({});

        store.dispatch(userActions.updateUser(updateInfo))
          .then(() => {
            expect(store.getActions()).toEqual(expectedActions);
          });
      });

      it('creates UPDATE_USER_FAILURE when an error is encountered', () => {
        nockAjaxCall(baseUrl)
          .put(`/users/${2}`)
          .reply(404);

        const expectedActions = [{ type: actionTypes.UPDATE_USER_FAILURE }];

        const store = mockStore({});

        store.dispatch(userActions.updateUser(updateInfo))
          .then(() => {
            expect(store.getActions()).toEqual(expectedActions);
          });
      });
    });

  describe('Validate user',
    () => {
      afterEach(() => {
        nockAjaxCall.cleanAll();
      });

      it('should create VALIDATE_USER_SUCCESS when user is valid', () => {
        const user = {
          email: 'obinna@king.com',
          firstName: 'obinna',
          lastName: 'Nnenanya',
          roleId: 2
        };
        nockAjaxCall(baseUrl)
          .get(`/users/${2}`)
          .reply(200, user);

        const expectedActions = [{ type: actionTypes.VALIDATE_USER_SUCCESS,
          validatedUser: user }];

        const store = mockStore({});

        store.dispatch(userActions.validateUser(2))
          .then(() => {
            expect(store.getActions()).toEqual(expectedActions);
          });
      });

      it('creates VALIDATE_USER_FAILURE when an error is encountered',
      () => {
        nockAjaxCall(baseUrl)
          .get(`/users/${2}`)
          .reply(404);

        const expectedActions = [{ type: actionTypes.VALIDATE_USER_FAILURE }];

        const store = mockStore({});

        store.dispatch(userActions.validateUser(2))
          .then(() => {
            expect(store.getActions()).toEqual(expectedActions);
          });
      });
    });

  describe('Logout User', () => {
    afterEach(() => {
      nockAjaxCall.cleanAll();
    });
    it('creates LOGOUT_SUCCESS when is logged out',
      () => {
        nockAjaxCall(baseUrl)
          .post('/users/logout')
          .reply(200);

        const expectedActions = [{ type: actionTypes.LOGOUT_SUCCESS,
          message: '' }];

        const store = mockStore({});

        store.dispatch(userActions.logout())
          .then(() => {
            expect(store.getActions()).toEqual(expectedActions);
          });
      });
    it('creates LOGOUT_FAILURE when an error is encountered',
      () => {
        nockAjaxCall(baseUrl)
          .post('/users/logout')
          .reply(400);

        const expectedActions = [{ type: actionTypes.LOGOUT_FAILURE }];

        const store = mockStore({});

        store.dispatch(userActions.logout())
          .then(() => {
            expect(store.getActions()).toEqual(expectedActions);
          });
      });
  });

  describe('Delete User', () => {
    afterEach(() => {
      nockAjaxCall.cleanAll();
    });
    it('creates DELETE_USER_SUCCESS when user is deleted',
      () => {
        nockAjaxCall(baseUrl)
          .delete(`/users/${2}`)
          .reply(200);

        const expectedActions = [{ type: actionTypes.DELETE_USER_SUCCESS,
          userId: 2 }];

        const store = mockStore({});

        store.dispatch(userActions.deleteUser(2))
          .then(() => {
            expect(store.getActions()).toEqual(expectedActions);
          });
      });
    it('creates DELETE_USER_FAILURE when an error is encountered',
      () => {
        nockAjaxCall(baseUrl)
          .delete(`/users/${2}`)
          .reply(400);

        const expectedActions = [{ type: actionTypes.DELETE_USER_FAILURE }];

        const store = mockStore({});

        store.dispatch(userActions.deleteUser(2))
          .then(() => {
            expect(store.getActions()).toEqual(expectedActions);
          });
      });
  });
});
