
import 'isomorphic-fetch';
import { DiffPatcher } from 'jsondiffpatch/src/diffpatcher';

const isServer = typeof window === 'undefined';

const patcher = new DiffPatcher();

const defaults = {

  // comments states storage
  states: { },

  // comments single state
  state: [ ],

};

export const actions = {
  PrependComments: '@@comment/PREPEND_COMMENTS_STATE',
  AppendComments : '@@comment/APPEND_COMMENTS_STATE',
};

function hookInitialPlaceholder(states, { id }, store) {
  if ( !Array.isArray(states[id]) ) {

    const clone = patcher.clone(states);
    clone[id] = [ ];

    return clone;
  }
  return states;
}

function hookAppendComments(states, { id, comments, override = true }, store) {

  if ( !Array.isArray(comments) ) return states;

  const clone = patcher.clone(states);

  if ( override ) {
    clone[id] = comments;
  } else {
    clone[id] = clone[id].concat(comments);
  }

  return clone;
}

/**
 * comments state
 */
function comments (states = defaults.states, action = defaults.action, store) {

  // do not do anything if id is missing
  if ( typeof action.id !== 'string' || ( typeof action.id === 'string' && action.id.trim().length === 0 ) ) return states;

  // initialize state if it does not exist
  states = hookInitialPlaceholder(states, action, store);

  switch ( action.type ) {

    /**
     * player initialization or update
     */
    case actions.AppendComments:
      return hookAppendComments(states, action, store);

    /**
     * getter
     */
    default:
      return states;

  }
}

function retrieveComments(id) {
  return function ( dispatch, getState ) {
    const { authenticationToken } = getState();
    const headers = isServer && { internal: 'TRUE', 'Access-Token': authenticationToken };
    return fetch(`${BACKEND_URL}/i/moment/anyone/${id}/comments`, {
      method      : 'get',
      credentials : 'include',
      headers,
    })
    .then(res => res.json())
    .then(doc => (doc.error ? Promise.reject(doc.error) : doc))
    .then(
      comments => dispatch({ type: actions.AppendComments, id, comments }),
      err      => ({ err }),
    );
  }
}


/**
 * export store api
 */
export const api = {
  retrieveComments,
}

export default {
  comments,
};

