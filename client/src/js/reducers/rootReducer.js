import { combineReducers } from 'redux';
import signUpReducer from './signUpReducer';
import signInReducer from './signInReducer';
import documentReducer from './documentReducers';

const rootReducer = combineReducers({
  signUpReducer,
  signInReducer,
  documentReducer
});

export default rootReducer;
