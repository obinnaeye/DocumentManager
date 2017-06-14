import { combineReducers } from 'redux';
import signUpReducer from './signUpReducer';
import signInReducer from './signInReducer';
import documentReducer from './documentReducers';
import userReducers from './userReducers';

const rootReducer = combineReducers({
  signUpReducer,
  signInReducer,
  documentReducer,
  userReducers
});

export default rootReducer;
