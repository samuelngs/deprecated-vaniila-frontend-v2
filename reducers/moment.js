
import 'isomorphic-fetch';

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
  SetMomentDocument: 'set_moment_document',
  RemoveMomentDocument: 'remove_moment_document',
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
 * moment documents storage
 */
function momentDocuments (documents = defaults.documents, action = defaults.action) {
  switch ( action.type ) {
    case actions.SetMomentDocument:

      // do not do anything if id is missing
      if ( typeof action.id !== 'string' || ( typeof action.id === 'string' && action.id.trim().length === 0 ) ) return hookMomentDocumentsCleanup(documents);

      // do not do anything if moment document is missing
      if ( typeof action.moment !== 'object' || action.moment === null ) return hookMomentDocumentsCleanup(documents);

      // return merged documents
      return hookMomentDocumentsCleanup({ ...documents, [action.id]: { ...action.moment, expires: Date.now() + LIFESPAN } });
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
    const headers = isServer && { internal: 'TRUE', 'Access-Token': authenticationToken };
    return fetch(`${BACKEND_URL}/i/plot/${id}`, {
      method      : 'get',
      credentials : 'include',
      headers,
    })
    .then(res => res.json())
    .then(doc => (doc.error ? Promise.reject(doc.error) : doc))
    .then(
      moment => dispatch({ type: actions.SetMomentDocument, id, moment }),
      err  => ({ err }),
    )
  }
}

/**
 * export store api
 */
export const api = {
  retrieveMomentDocument,
};

export default {
  momentDocuments,
}
