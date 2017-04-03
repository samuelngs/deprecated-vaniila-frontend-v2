
import serverReducer, { middleware as serverMiddleware } from './server';
import authenticationReducer from './authentication';
import accountReducer, { middleware as accountMiddleware } from './account';
import momentReducer from './moment';
import editorReducer from './editor';
import landingReducer from './landing';

export const collections = {
  ...serverReducer,
  ...authenticationReducer,
  ...accountReducer,
  ...momentReducer,
  ...editorReducer,
  ...landingReducer,
};

export const middlewares = [
  ...serverMiddleware,
  ...accountMiddleware,
];

