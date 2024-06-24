import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './authReducer';
import languageReducer from './languageReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  language: languageReducer
});

export default rootReducer;
