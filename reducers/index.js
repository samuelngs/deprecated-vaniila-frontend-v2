
import serverReducer, { middleware as serverMiddleware } from './server';
import authenticationReducer from './authentication';
import accountReducer, { middleware as accountMiddleware } from './account';
import landingReducer from './landing';

export const collections = {
  ...serverReducer,
  ...authenticationReducer,
  ...accountReducer,
  ...landingReducer,
};

export const middlewares = [
  ...serverMiddleware,
  ...accountMiddleware,
];

