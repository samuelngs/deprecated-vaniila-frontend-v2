
import serverReducer, { middleware as serverMiddleware } from './server';
import authenticationReducer from './authentication';
import accountReducer, { middleware as accountMiddleware } from './account';
import momentReducer from './moment';
import editorReducer from './editor';
import windowReducer from './window';
import landingReducer from './landing';

export const collections = {
  ...serverReducer,
  ...authenticationReducer,
  ...accountReducer,
  ...momentReducer,
  ...editorReducer,
  ...windowReducer,
  ...landingReducer,
};

export const middlewares = [
  ...serverMiddleware,
  ...accountMiddleware,
];

