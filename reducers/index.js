
import serverReducer, { middleware as serverMiddleware } from './server';
import authenticationReducer from './authentication';
import accountReducer, { middleware as accountMiddleware } from './account';
import usersReducer from './users';
import momentReducer from './moment';
import momentsReducer from './moments';
import historiesReducer from './histories';
import editorReducer from './editor';
import fileReducer from './file';
import playerReducer from './player';
import commentsReducer from './comments';
import windowReducer from './window';
import trendsReducer from './trends';

export const collections = {
  ...serverReducer,
  ...authenticationReducer,
  ...accountReducer,
  ...usersReducer,
  ...momentReducer,
  ...momentsReducer,
  ...historiesReducer,
  ...editorReducer,
  ...fileReducer,
  ...playerReducer,
  ...commentsReducer,
  ...windowReducer,
  ...trendsReducer,
};

export const middlewares = [
  ...serverMiddleware,
  ...accountMiddleware,
];

