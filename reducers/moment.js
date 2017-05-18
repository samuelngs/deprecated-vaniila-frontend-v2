
import 'isomorphic-fetch';

import { DiffPatcher } from 'jsondiffpatch/src/diffpatcher';

const patcher = new DiffPatcher();
const isServer = typeof window === 'undefined';

/**
 * time units
 */
const SECONDS = 1000;
const MINUTES = 60 * SECONDS;
const HOURS   = 60 * MINUTES;
const DAYS    = 24 * HOURS;

/**
 * LIFESPAN configuration
 */
const LIFESPAN = 4 * HOURS;

const defaults = {
  documents: { },
};

export const actions = {
  SetMomentDocument: '@@moments/SET_MOMENT_DOCUMENT',
  RemoveMomentDocument: '@@moments/REMOVE_MOMENT_DOCUMENT',
};

/**
 * hook to clean up expired moment(s) from documents storage
 */
function hookMomentDocumentsCleanup(documents = defaults.documents) {
  const now = Date.now();
  for ( const id in documents ) {
    const { expires } = documents[id];
    if ( typeof expires !== 'number' ) {
      delete documents[id];
      continue;
    }
    if ( now > expires ) {
      delete documents[id];
      continue;
    }
  }
  return documents;
}

/**
 * hook to sort moments
 */
function hookMomentsSort(moments) {
  const momentsNames = Object.keys(moments);
  const momentsOrdered = { };
  momentsNames.sort((a, b) => {
    const momentA = moments[a] || { };
    const momentB = moments[b] || { };
    if ( typeof momentA.order === 'number' && typeof momentB.order === 'number' ) {
      return momentA.order - momentB.order;
    }
    return a - b;
  }).forEach((name, i) => {
    momentsOrdered[name] = moments[name];
  });
  return momentsOrdered;
}

/**
 * moment documents storage
 */
function momentDocuments (documents = defaults.documents, action = defaults.action) {
  switch ( action.type ) {
    case actions.SetMomentDocument:

      // do not do anything if id is missing
      if ( typeof action.id !== 'string' || ( typeof action.id === 'string' && action.id.trim().length === 0 ) ) return hookMomentDocumentsCleanup(documents);

      // do not do anything if moment document is missing
      if ( typeof action.moment !== 'object' || action.moment === null ) return hookMomentDocumentsCleanup(documents);

      const doc = { ...action.moment, expires: Date.now() + LIFESPAN };

      // sort moments
      doc && doc.data && doc.data.slides && (doc.data.slides = hookMomentsSort(doc.data.slides));

      // return merged documents
      return hookMomentDocumentsCleanup({ ...documents, [action.id]: doc });
    case actions.RemoveMomentDocument:

      // do not do anything if id is missing
      if ( typeof action.id !== 'string' || ( typeof action.id === 'string' && action.id.trim().length === 0 ) ) return hookMomentDocumentsCleanup(documents);

      // do not do anything if moment document is missing
      if ( typeof action.moment !== 'object' || action.moment === null ) return hookMomentDocumentsCleanup(documents);

      // remove document matches the action id
      delete documents[action.id];

      // return filtered document
      return hookMomentDocumentsCleanup(documents);
    default:
      return hookMomentDocumentsCleanup(documents);
  }
}

/**
 * retrieve moment document api
 */
function retrieveMomentDocument(id) {
  return function ( dispatch, getState ) {
    const { authenticationToken } = getState();
    const headers = isServer ? { internal: 'TRUE', 'Access-Token': authenticationToken } : { };
    return fetch(`${BACKEND_URL}/i/moment/anyone/${id}`, {
      method      : 'get',
      credentials : 'include',
      headers,
    })
    .then(res => res.json())
    .then(doc => (doc.error ? Promise.reject(doc.error) : doc))
    .then(
      moment => dispatch({ type: actions.SetMomentDocument, id, moment }),
      err    => dispatch({ type: actions.SetMomentDocument, id, moment: { err } }),
    )
    .then(o => {
      dispatch({ type: '@@player/SYNC_PLAYER_STATE', id });
      return o;
    })
  }
}

/**
 * patch moment document api
 */
function patchMomentDocument(id, moments) {
  return function ( dispatch, getState ) {
    return new Promise((resolve, reject) => {
      const doc = getState().momentDocuments[id];
      if ( !doc || typeof moments !== 'object' || moments === null ) return reject();
      const clone = patcher.clone(doc);
      clone.document || (clone.document || { });
      clone.document.data || (clone.document.data || { });
      clone.document.data.slides || (clone.document.data.slides = { });
      for ( const id in moments ) {
        clone.document.data.slides[id] = moments[id];
      }
      return resolve(dispatch({ type: actions.SetMomentDocument, id, moment: clone }));
    })
    .then(o => {
      dispatch({ type: '@@player/SYNC_PLAYER_STATE', id });
      return o;
    })
  }
}

/**
 * like moment
 */
function like(id) {
  return function ( dispatch, getState ) {
    const { authenticationToken } = getState();
    const headers = isServer ? { internal: 'TRUE', 'Access-Token': authenticationToken } : { };
    return fetch(`${BACKEND_URL}/i/moment/anyone/${id}/likes`, {
      method      : 'post',
      credentials : 'include',
      headers,
    })
    .then(res => res.json())
    .then(doc => (doc.error ? Promise.reject(doc.error) : doc))
    .then(
      _   => dispatch(retrieveMomentDocument(id)),
      err => ({ err }),
    );
  }
}

/**
 * unlike moment
 */
function unlike(id) {
  return function ( dispatch, getState ) {
    const { authenticationToken } = getState();
    const headers = isServer ? { internal: 'TRUE', 'Access-Token': authenticationToken } : { };
    return fetch(`${BACKEND_URL}/i/moment/anyone/${id}/likes`, {
      method      : 'delete',
      credentials : 'include',
      headers,
    })
    .then(res => res.json())
    .then(doc => (doc.error ? Promise.reject(doc.error) : doc))
    .then(
      _   => dispatch(retrieveMomentDocument(id)),
      err => ({ err }),
    );
  }
}

/**
 * export store api
 */
export const api = {
  retrieveMomentDocument,
  patchMomentDocument,
  like,
  unlike,
};

export default {
  momentDocuments,
}

