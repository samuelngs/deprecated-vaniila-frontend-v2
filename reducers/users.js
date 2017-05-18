
import 'isomorphic-fetch';

import { DiffPatcher } from 'jsondiffpatch/src/diffpatcher';

const patcher = new DiffPatcher();
const isServer = typeof window === 'undefined';

const defaults = {
  users: { },
};

export const actions = {
  SetUser: '@@users/SET_USER',
};

/**
 * users storage
 */
function usersList (users = defaults.users, action = defaults.action) {
  switch ( action.type ) {

    case actions.SetUser:

      // do not do anything if id is missing
      if ( typeof action.username !== 'string' || ( typeof action.username === 'string' && action.username.trim().length === 0 ) ) return users;

      // do not do anything if users is missing
      if ( typeof action.user !== 'object' || action.user === null ) return users;

      users[action.username] = action.user.data || action.user;
      return patcher.clone(users);

    default:
      return users;

  }
}

/**
 * retrieve user
 */
function retrieveUser(username) {
  return function ( dispatch, getState ) {
    const { authenticationToken } = getState();
    const headers = isServer ? { internal: 'TRUE', 'Access-Token': authenticationToken } : { };
    return fetch(`${BACKEND_URL}/i/users/${username}?query={username,name,avatar,created_at}`, {
      method      : 'get',
      credentials : 'include',
      headers,
    })
    .then(res => res.json())
    .then(res => (res.error ? promise.reject(res.error) : res))
    .then(
      user  => dispatch({ type: actions.SetUser, username, user }),
      err   => ({ err }),
    );
  }
}

/**
 * export store api
 */
export const api = {
  retrieveUser,
};

export default {
  usersList,
}

