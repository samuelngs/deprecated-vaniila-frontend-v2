
import 'isomorphic-fetch';

const isServer = typeof window === 'undefined';

const defaults = {
  live: [ ],
};

export const actions = {
  SetLive: '@@live/SET_LIVE',
};

function unique(arr, ref = 'id') {
  const map = { };
  const res = [ ];
  for ( const i of arr ) {
    if ( map[i[ref]] !== true ) {
      map[i[ref]] = true;
      res.push(i);
    }
  }
  return res;
}

/**
 * live storage
 */
function live (live = defaults.live, action = defaults.action) {
  switch ( action.type ) {

    case actions.SetLive:

      // do not do anything if live is missing
      if ( !Array.isArray(action.live) || action.live.length === 0 ) return live;

      return unique(action.live);

    default:
      return live;

  }
}

/**
 * retrieve live
 */
function retrieveLive() {
  return function ( dispatch, getState ) {
    const { authenticationToken } = getState();
    const headers = isServer && { internal: 'TRUE', 'Access-Token': authenticationToken };
    return fetch(`${BACKEND_URL}/i/moments/live`, {
      method      : 'get',
      credentials : 'include',
      headers,
    })
    .then(res => res.json())
    .then(res => (res.error ? promise.reject(res.error) : res))
    .then(
      live => dispatch({ type: actions.SetLive, live }),
      err  => ({ err }),
    );
  }
}

/**
 * export store api
 */
export const api = {
  retrieveLive,
};

export default {
  live,
}


