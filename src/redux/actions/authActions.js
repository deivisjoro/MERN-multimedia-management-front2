import axios from '../../axiosConfig';
import { AUTH_SUCCESS, AUTH_FAILURE, LOGOUT, SET_AUTH_TOKEN } from '../types';

export const login = (email, password) => async dispatch => {
  try {
    const res = await axios.post('/auth/login', { email, password });
    const token = res.data.data.token;
    localStorage.setItem('token', token);
    dispatch(setAuthToken(token));
    dispatch({
      type: AUTH_SUCCESS,
      payload: { user: res.data.data.user, token }
    });
    return { type: AUTH_SUCCESS, payload: res.data.data }; // Asegurarse de devolver los datos correctos
  } catch (err) {
    dispatch({
      type: AUTH_FAILURE,
      payload: err.response.data
    });
    return { type: AUTH_FAILURE, payload: err.response.data }; // Devolver el error para manejarlo en el componente
  }
};

export const setAuthToken = token => dispatch => {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  dispatch({
    type: SET_AUTH_TOKEN,
    payload: token
  });
};

export const logout = () => dispatch => {
  localStorage.removeItem('token');
  delete axios.defaults.headers.common['Authorization'];
  dispatch({ type: LOGOUT });
};
