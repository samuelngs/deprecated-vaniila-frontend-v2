
import 'isomorphic-fetch';

const isServer = typeof window === 'undefined';

const defaults = {
  trends: {
    page   : 1,
    moments: [ ],
  },
};

export const actions = {
  SetTrends   : '@@trends/SET_TRENDS',
  AppendTrends: '@@trends/APPEND_TRENDS',
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
 * trends storage
 */
function trends (trends = defaults.trends, action = defaults.action) {
  switch ( action.type ) {

    case actions.SetTrends:

      // do not do anything if trends is missing
      if ( !Array.isArray(action.trends) || action.trends.length === 0 ) return trends;
      if ( typeof action.page !== 'number' ) return trends;

      return {
        moments: unique(action.trends),
        page: action.trends.length >= 15
          ? action.page + 1
          : action.page,
      };

    case actions.AppendTrends:

      // do not do anything if trends is missing
      if ( !Array.isArray(action.trends) || action.trends.length === 0 ) return trends;
      if ( typeof action.page !== 'number' ) return trends;

      return {
        moments: unique([ ...trends, ...action.trends ]),
        page: action.trends.length >= 15
          ? action.page + 1
          : action.page,
      };

    default:
      return trends;

  }
}

/**
 * retrieve trends
 */
function retrieveTrends(override) {
  return function ( dispatch, getState ) {
    const { authenticationToken, trends: { page: target } } = getState();
    const headers = isServer && { internal: 'TRUE', 'Access-Token': authenticationToken };
    const page = typeof override === 'number'
      ? override
      : target;
    return fetch(`${BACKEND_URL}/i/moments/trends/${page}`, {
      method      : 'get',
      credentials : 'include',
      headers,
    })
    .then(res => res.json())
    .then(res => (res.error ? promise.reject(res.error) : res))
    .then(
      trends  => dispatch({
        trends,
        page,
        type: page <= 1
          ? actions.SetTrends
          : actions.AppendTrends,
      }),
      err     => ({ err }),
    );
  }
}

/**
 * export store api
 */
export const api = {
  retrieveTrends,
};

export default {
  trends,
}


