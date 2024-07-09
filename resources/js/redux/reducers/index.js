import { combineReducers } from 'redux';
import userReducer from './user';
import tokenReducer from './token';
import { loginApi } from '../services/login';
import { registerApi } from '../services/register';
import { userApi } from '../services/user';
import { dashboardApi } from '../services/dashboard';
import { fileApi } from '../services/files';
import { profileApi } from '../services/profile';
import { landingApi } from '../services/landing';

const apis = [
  loginApi,
  registerApi,
  userApi,
  dashboardApi,
  fileApi,
  profileApi,
  landingApi,

];

const appReducer = combineReducers({
  user: userReducer,
  token: tokenReducer,
  ...apis.reduce((acc, curr) => {
    acc[curr.reducerPath] = curr.reducer;
    return acc;
  }, {}),
});

export const servicesMiddleware = apis.map(curr => curr.middleware);

export default appReducer;