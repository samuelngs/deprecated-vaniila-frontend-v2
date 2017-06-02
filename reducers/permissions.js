
import 'isomorphic-fetch';
import { DiffPatcher } from 'jsondiffpatch/src/diffpatcher';

const isServer = typeof window === 'undefined';

const patcher = new DiffPatcher();

const defaults = {

  // permissions states storage
  states: { },

  // permissions single state
  state: [ ],

};

export const actions = {
  SetMomentsPermissions: '@@permissions/SET_MOMENTS_PERMISSIONS',
};

/**
 * update permissions list
 */
function hookSetPermissions(states, { id, permissions }, store) {

  if ( !Array.isArray(permissions) ) return states;

  const clone = patcher.clone(states);
  clone[id] = permissions;

  return clone;
}

/**
 * permissions state
 */
function momentPermissions (states = defaults.states, action = defaults.action, store) {

  // do not do anything if id is missing
  if ( typeof action.id !== 'string' || ( typeof action.id === 'string' && action.id.trim().length === 0 ) ) return states;

  switch ( action.type ) {

    /**
     * update permissions list
     */
    case actions.SetMomentsPermissions:
      return hookSetPermissions(states, action, store);

    /**
     * getter
     */
    default:
      return states;

  }
}

/**
 * retrieve permissions
 */
function retrievePermissions(id) {
  return function ( dispatch, getState ) {
    const { authenticationToken } = getState();
    const headers = isServer ? { internal: 'TRUE', 'Access-Token': authenticationToken } : { };
    return fetch(`${BACKEND_URL}/i/moment/anyone/${id}/permissions`, {
      method      : 'get',
      credentials : 'include',
      headers,
    })
    .then(res => res.json())
    .then(doc => (doc.error ? Promise.reject(doc.error) : doc))
    .then(
      permissions => dispatch({ type: actions.SetMomentsPermissions, id, permissions }),
      err         => ({ err }),
    );
  }
}

/**
 * add permission
 */
function addPermission(id, username) {
  return function ( dispatch, getState ) {
    const { authenticationToken } = getState();
    const headers = isServer ? { internal: 'TRUE', 'Access-Token': authenticationToken } : { };
    const body = new FormData();
    body.append('username', username);
    body.append('admin', true);
    body.append('write', true);
    body.append('read', true);
    return fetch(`${BACKEND_URL}/i/moment/anyone/${id}/permissions`, {
      method      : 'post',
      credentials : 'include',
      headers,
      body,
    })
    .then(res => res.json())
    .then(doc => (doc.error ? Promise.reject(doc.error) : doc))
    .then(
      permissions => dispatch(retrievePermissions(id)),
      err         => ({ err }),
    );
  }
}

/**
 * del permission
 */
function delPermission(id, username) {
  return function ( dispatch, getState ) {
    const { authenticationToken } = getState();
    const headers = isServer ? { internal: 'TRUE', 'Access-Token': authenticationToken } : { };
    return fetch(`${BACKEND_URL}/i/moment/anyone/${id}/permissions/${username}`, {
      method      : 'delete',
      credentials : 'include',
      headers,
    })
    .then(res => res.json())
    .then(doc => (doc.error ? Promise.reject(doc.error) : doc))
    .then(
      permissions => dispatch(retrievePermissions(id)),
      err         => ({ err }),
    );
  }
}

/**
 * export store api
 */
export const api = {
  retrievePermissions,
  addPermission,
  delPermission,
}

export default {
  momentPermissions,
};

