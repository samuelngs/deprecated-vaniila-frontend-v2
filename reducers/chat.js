
import 'isomorphic-fetch';

import { DiffPatcher } from 'jsondiffpatch/src/diffpatcher';

const patcher = new DiffPatcher();
const isServer = typeof window === 'undefined';

const defaults = {

  // comments states storage
  states: { },

  // comments single state
  state: [ ],

};

export const actions = {
  SetChatHistory  : '@@chat/SET_CHAT_HISTORY',
  AppendChatRecord: '@@chat/APPEND_CHAT_RECORD',
};

function hookSetChatHistory(states, { id, history }, store) {

  if ( !Array.isArray(history) ) return states;

  const clone = patcher.clone(states);
  clone[id] = history;

  return clone;
}

function hookAppendChatRecord(states, { id, record }, store) {

  if ( typeof record !== 'object' || record === null ) return states;

  const clone = patcher.clone(states);

  if ( Array.isArray(clone[id]) ) {
    clone[id].push(record);
  } else {
    clone[id] = [ record ];
  }

  return clone;
}

/**
 * chat state
 */
function chat (states = defaults.states, action = defaults.action, store) {

  // do not do anything if id is missing
  if ( typeof action.id !== 'string' || ( typeof action.id === 'string' && action.id.trim().length === 0 ) ) return states;

  switch ( action.type ) {

    /**
     * set chat history
     */
    case actions.SetChatHistory:
      return hookSetChatHistory(states, action, store);

    /**
     * append chat record
     */
    case actions.AppendChatRecord:
      return hookAppendChatRecord(states, action, store);

    /**
     * getter
     */
    default:
      return states;

  }
}

function retrieveHistories(id) {
  return function ( dispatch, getState ) {
    const { authenticationToken } = getState();
    const headers = isServer && { internal: 'TRUE', 'Access-Token': authenticationToken };
    return fetch(`${BACKEND_URL}/i/moment/anyone/${id}/chat`, {
      method      : 'get',
      credentials : 'include',
      headers,
    })
    .then(res => res.json())
    .then(doc => (doc.error ? Promise.reject(doc.error) : doc))
    .then(
      history => dispatch({ type: actions.SetChatHistory, id, history }),
      err     => ({ err }),
    );
  }
}

function receiveMessage(id, record) {
  return function ( dispatch, getState ) {
    return new Promise(resolve => {
      resolve(dispatch({ type: actions.AppendChatRecord, id, record }));
    })
  }
}

function sendMessage(id, message) {
  return function ( dispatch, getState ) {

    const { authenticationToken } = getState();
    const headers = isServer && { internal: 'TRUE', 'Access-Token': authenticationToken };

    const body = new FormData();
    body.append('message', message);

    return fetch(`${BACKEND_URL}/i/moment/anyone/${id}/chat`, {
      method      : 'post',
      credentials : 'include',
      headers,
      body,
    });
  }
}

/**
 * export store api
 */
export const api = {
  retrieveHistories,
  receiveMessage,
  sendMessage,
}

export default {
  chat,
};


