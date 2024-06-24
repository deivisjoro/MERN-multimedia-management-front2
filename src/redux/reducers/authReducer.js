import { AUTH_SUCCESS, AUTH_FAILURE, LOGOUT, SET_AUTH_TOKEN } from '../types';

const initialState = {
  isAuthenticated: false,
  user: null,
  token: localStorage.getItem('token') || null,
  error: null
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case AUTH_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token
      };
    case SET_AUTH_TOKEN:
      return {
        ...state,
        token: action.payload,
        isAuthenticated: true
      };
    case AUTH_FAILURE:
      return {
        ...state,
        isAuthenticated: false,
        error: action.payload
      };
    case LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        error: null
      };
    default:
      return state;
  }
};

export default authReducer;
