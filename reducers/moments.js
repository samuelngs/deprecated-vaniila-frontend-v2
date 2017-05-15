
import 'isomorphic-fetch';

import { DiffPatcher } from 'jsondiffpatch/src/diffpatcher';

const patcher = new DiffPatcher();
const isServer = typeof window === 'undefined';

const defaults = {
  moments: { },
};

export const actions = {
  SetMoments    : '@@moments/SET_MOMENTS',
  AppendMoments : '@@moments/APPEND_MOMENTS',
};

/**
 * moment documents storage
 */
function momentsList (moments = defaults.moments, action = defaults.action) {
  switch ( action.type ) {

    case actions.SetMoments:

      // do not do anything if id is missing
      if ( typeof action.username !== 'string' || ( typeof action.username === 'string' && action.username.trim().length === 0 ) ) return moments;

      // do not do anything if moments is missing
      if ( !Array.isArray(action.moments) ) return moments;

      const diff = patcher.diff(
        moments[action.username],
        action.moments,
      );

      if ( !diff ) return moments;

      moments[action.username] = action.moments;
      return patcher.clone(moments);

    case actions.AppendMoments:

      // do not do anything if id is missing
      if ( typeof action.username !== 'string' || ( typeof action.username === 'string' && action.username.trim().length === 0 ) ) return moments;

      // do not do anything if moments is missing
      if ( !Array.isArray(action.moments) ) return moments;

      if ( Array.isArray( moments[action.username] ) ) {
        moments[action.username] = [ ...moments[action.username], ...action.moments ];
      } else {
        moments[action.username] = action.moments;
      }
      return patcher.clone(moments);

    default:
      return moments;

  }
}

/**
 * retrieve moments
 */
function retrieveMoments(username) {
  return function ( dispatch, getState ) {
    const { authenticationToken } = getState();
    const headers = isServer && { internal: 'TRUE', 'Access-Token': authenticationToken };
    return fetch(`${BACKEND_URL}/i/moment/${username}`, {
      method      : 'get',
      credentials : 'include',
      headers,
    })
    .then(res => res.json())
    .then(res => (res.error ? promise.reject(res.error) : res))
    .then(
      moments => dispatch({ type: actions.SetMoments, username, moments }),
      err     => ({ err }),
    );
  }
}

/**
 * export store api
 */
export const api = {
  retrieveMoments,
};

export default {
  momentsList,
}

