import { combineReducers } from 'redux';
import signUpReducer from './signUpReducer';
import signInReducer from './signInReducer';

const rootReducer = combineReducers({
  signUpReducer,
  signInReducer
});

export default rootReducer;
