import { combineReducers } from 'redux';
import documentReducer from './documentReducer';
import userReducers from './userReducers';

const rootReducer = combineReducers({
  documentReducer,
  userReducers
});

export default rootReducer;
