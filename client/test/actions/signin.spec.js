import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import expect from 'expect';
import nockAjaxCall from 'nock';
import ajaxCall from 'axios';
import * as signinActions from '../../src/js/actions/SigninActions';
import actionTypes from '../../src/js/constants/actionTypes';
import url from '../helper/constant';

const baseUrl = url.baseUrl;

// set ajaxCall call default base url to localhost
ajaxCall.defaults.baseURL = baseUrl;

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('Signin Action', () => {
  afterEach(() => {
    nockAjaxCall.cleanAll();
  });
  it('creates SIGNIN_USER_SUCCESS when user is signed in',
    () => {
      const user = {
        email: 'obinna@king.com',
        password: 'kingobi1'
      };
      const response = {
        email: 'obinna@king.com',
        activeToken: 'ajajfafafkafaf',
        firstName: 'obinna',
        lastName: 'Nnenanya',
        roleId: 2
      };
      nockAjaxCall(baseUrl)
        .post('/users/login', user)
        .reply(200, response);

      const expectedActions = [{ type: actionTypes.SIGNIN_USER_SUCCESS,
        user: response }];

      const store = mockStore({});

      store.dispatch(signinActions.signinUser(user))
        .then(() => {
          expect(store.getActions()).toEqual(expectedActions);
        });
    });
  it('creates SIGNIN_USER_FAILURE when an error is encountered signing user',
    () => {
      const user = {
        password: 'king',
        lastName: 'Nnenanya'
      };
      nockAjaxCall(baseUrl)
        .post('/users/', user)
        .reply(400, user);

      const expectedActions = [{ type: actionTypes.SIGNIN_USER_FAILURE }];

      const store = mockStore({});

      store.dispatch(signinActions.signinUser(user))
        .then(() => {
          expect(store.getActions()).toEqual(expectedActions);
        });
    });
});
