import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import expect from 'expect';
import nockAjaxCall from 'nock';
import ajaxCall from 'axios';
import * as signupActions from '../../src/js/actions/SignupActions';
import actionTypes from '../../src/js/constants/actionTypes';
import url from '../helper/constant';

const baseUrl = url.baseUrl;

// set ajaxCall call default base url to localhost
ajaxCall.defaults.baseURL = baseUrl;

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('Signup Action', () => {
  afterEach(() => {
    nockAjaxCall.cleanAll();
  });
  it('creates CREATE_USER_SUCCESS when new user is created',
    () => {
      const user = {
        email: 'obinna@king.com',
        password: 'kingobi1',
        firstName: 'obinna',
        lastName: 'Nnenanya'
      };
      nockAjaxCall(baseUrl)
        .post('/users/', user)
        .reply(200, user);

      const expectedActions = [{ type: actionTypes.CREATE_USER_SUCCESS,
        user }];

      const store = mockStore({});

      store.dispatch(signupActions.createUser(user))
        .then(() => {
          expect(store.getActions()).toEqual(expectedActions);
        });
    });
  it('creates CREATE_USER_FAILURE when an error is encountered creating user',
    () => {
      const user = {
        password: 'kingobi1',
        lastName: 'Nnenanya'
      };
      nockAjaxCall(baseUrl)
        .post('/users/', user)
        .reply(400, user);

      const expectedActions = [{ type: actionTypes.CREATE_USER_FAILURE }];

      const store = mockStore({});

      store.dispatch(signupActions.createUser(user))
        .then(() => {
          expect(store.getActions()).toEqual(expectedActions);
        });
    });
});
