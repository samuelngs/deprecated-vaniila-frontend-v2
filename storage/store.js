
import { applyMiddleware, compose, combineReducers, createStore } from 'redux';
import { autoRehydrate } from 'redux-persist';
import thunkMiddleware from 'redux-thunk';
import Cookies from 'js-cookie';

import withRedux from './redux';
import { prefix } from './config';

import serverReducer from '../reducers/server';
import authenticationReducer from '../reducers/authentication';
import landingReducer from '../reducers/landing';

const collections = {
  ...serverReducer,
  ...authenticationReducer,
  ...landingReducer,
};

export const reducers = (() => {
  if ( typeof window === 'undefined' || typeof location === 'undefined' ) {
    return collections;
  }
  const { hostname } = location;
  const cookieOpts = {
    domain  : ['127.0.0.1', 'localhost'].indexOf(hostname) ? hostname : hostname.split('.').slice(-2).join('.'),
    path    : '/',
    secure  : false,
    expires : new Date(9999999999999),
  };
  const reducers = { };
  for ( const key in collections ) {
    if (
      collections[key]
      && typeof collections[key].cookie === 'object'
      && collections[key].cookie !== null
      && typeof collections[key].cookie.type === 'string'   // <-- action type
      && typeof collections[key].cookie.name === 'string'   // <-- data reference
      && typeof collections[key].cookie.def !== 'undefined' // <-- default
    ) {
      reducers[key] = function ( value, action ) {
        const next = collections[key](value, action);
        const prev = collections[key](value, { });
        if ( next !== prev ) {
          Cookies.set(`${prefix}${key}`, next, cookieOpts);
        }
        return next;
      }
    } else {
      reducers[key] = collections[key];
    }
  }
  return reducers;
})();

export const syncCookies = (() => {
  const names = [ ];
  for ( const key in collections ) {
    if (
      collections[key]
      && typeof collections[key].cookie === 'object'
      && collections[key].cookie !== null
      && typeof collections[key].cookie.type === 'string'   // <-- action type
      && typeof collections[key].cookie.name === 'string'   // <-- data reference
      && typeof collections[key].cookie.def !== 'undefined' // <-- default
    ) {
      const { type, name, def } = collections[key].cookie;
      names.push({ key, type, name, def });
    }
  }
  return names;
})();

export const initStore = initialState => {
  return createStore(combineReducers(reducers), initialState, compose(
    applyMiddleware(thunkMiddleware),
    autoRehydrate(),
    typeof window !== 'undefined' && window.devToolsExtension ? window.devToolsExtension() : f => f,
  ));
}

export default function (Component, mapStateToProps) {
  return withRedux(initStore)(Component, mapStateToProps);
}
