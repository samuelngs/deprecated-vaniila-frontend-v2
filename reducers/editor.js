
import { DiffPatcher } from 'jsondiffpatch/src/diffpatcher';

const patcher = new DiffPatcher({
  objectHash: function (obj, index) {
    return obj.key || '$$index:' + index;
  },
  // textDiff: {
  //   minLength: 1,
  // },
});

const defaults = {
  history: {
    past    : [ ],
    future  : [ ],
    present : { },
  },
  histories: { },
};

const MAX_CHANGES = 20;

export const actions = {
  InitialEditorHistory  : '@@editor/INITIAL_EDITOR_HISTORY',
  AppendEditorChange    : '@@editor/APPEND_EDITOR_CHANGE',  // record
  RevertEditorChange    : '@@editor/REVERT_EDITOR_CHANGE',  // undo
  ReplayEditorChange    : '@@editor/REPLAY_EDITOR_CHANGE',  // redo
  PatchEditorState      : '@@editor/PATCH_EDITOR_STATE',    // patch editor state
  RemoveEditorChanges   : '@@editor/REMOVE_EDITOR_CHANGES', // remove all editor change records
};

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
 * hook for initial history placeholder
 */
function hookInitialPlaceholder(histories, { id }) {
  if (
    (typeof histories[id] !== 'object' || histories[id] === null)
    || (typeof histories[id].present !== 'object' ||  histories[id].present === null)
    || !Array.isArray(histories[id].past)
    || !Array.isArray(histories[id].future)
  ) histories[id] = { ...defaults.history };
  return histories;
}

/**
 * hook for setup history store
 */
function hookInitialHistory(histories, { id, state }) {
  if ( typeof state !== 'object' || state === null ) return histories;
  const doc = { ...state };
  doc && doc.data && doc.data.slides && (doc.data.slides = hookMomentsSort(doc.data.slides));
  histories[id].present = doc;
  return histories;
}

/**
 * hook for append editor history
 */
function hookAppendChange(histories, { id, state }) {
  if ( typeof state !== 'object' || state === null ) return histories;

  const { present, past, future } = histories[id];
  const diff = patcher.diff(present, state);
  if ( !diff ) return histories;

  histories[id].present = state;

  // record changes
  past.push(diff);

  // clear all future changes
  future.splice(0, future.length);

  // remove old changes if there is too many
  if ( past.length > MAX_CHANGES ) {
    past.splice(past.length - MAX_CHANGES, past.length);
  }

  return histories;
}

/**
 * hook for undo editor history
 */
function hookRevertChange(histories, { id }) {

  const { present, past, future } = histories[id];

  // nothing to revert
  if ( past.length === 0 ) {
    return histories;
  }

  // retrieve last change
  const diff = past[past.length - 1];

  // unpatch last change
  const doc = patcher.unpatch(present, diff);
  doc && doc.data && doc.data.slides && (doc.data.slides = hookMomentsSort(doc.data.slides));
  histories[id].present = doc;

  // move changes to the future stack
  future.push(diff);
  past.pop();

  return histories;
}

/**
 * hook for redo editor history
 */
function hookReplayChange(histories, { id }) {

  const { present, past, future } = histories[id];

  // nothing to replay
  if ( future.length === 0 ) {
    return histories;
  }

  // retrieve last change
  const diff = future[future.length - 1];

  // patch last change
  const doc = patcher.patch(present, diff);
  doc && doc.data && doc.data.slides && (doc.data.slides = hookMomentsSort(doc.data.slides));
  histories[id].present = doc;


  // move changes to past stack
  past.push(diff);
  future.pop();

  return histories;
}

/**
 * hook for patching history state with hash check
 * only patch with the newer version
 */
function hookPatchWithHashState(histories, { id, state }) {

  const { present } = histories[id];
  const doc = patcher.clone(present);

  doc.data = (doc.data || { });
  doc.data.slides = (doc.data.slides || { });

  const prevData = doc.data;
  const prevSlides = prevData.slides;
  const prevSlidesNames = Object.keys(prevSlides);

  const nextData = (state.data || { });
  const nextSlides = (nextData.slides || { });
  const nextSlidesNames = Object.keys(nextSlides);

  const removed = prevSlidesNames.filter( v => nextSlidesNames.indexOf(v) === -1 );

  for ( const name in nextSlides ) {

    const prevMoment = prevSlides[name];
    const nextMoment = nextSlides[name];

    // insert to storage if this is a new slide
    if ( !prevMoment && nextMoment ) {
      prevSlides[name] = nextMoment;
      continue;
    }

    // compare two hash, only update if the receive state is newer
    const { hash: prevHashString } = prevMoment;
    const { hash: nextHashString } = nextMoment;

    const prevHash = Number(prevHashString);
    const nextHash = Number(nextHashString);

    // skip patching if hash is invalid
    if ( isNaN(prevHash) || isNaN(nextHash) ) continue;
    // skip patching since the current state is newer
    if (  nextHash < prevHash ) continue;

    prevSlides[name] = nextMoment;

  }

  removed.forEach(name => {
    delete prevSlides[name];
  });

  doc && doc.data && doc.data.slides && (doc.data.slides = hookMomentsSort(doc.data.slides));
  histories[id].present = doc;

  return histories;
}

/**
 * hook for patching history state
 */
function hookPatchState(histories, { id, diff, state, checksHash }) {

  const { present } = histories[id];

  // patch state with diff object
  if ( typeof diff !== 'undefined' ) {
    {
      const doc = patcher.patch(present, diff);
      doc && doc.data && doc.data.slides && (doc.data.slides = hookMomentsSort(doc.data.slides));
      histories[id].present = doc;
    }
    return histories;
  }

  // full patch with document state
  if ( typeof state === 'object' || state !== null ) {
    if ( checksHash ) {
      return hookPatchWithHashState(histories, { id, state });
    }
    {
      const doc = patcher.clone(state);
      doc && doc.data && doc.data.slides && (doc.data.slides = hookMomentsSort(doc.data.slides));
      histories[id].present = doc;
    }
    return histories;
  }

  return histories;
}

/**
 * hook to remove all changes records
 */
function hookRemoveChanges(histories, { id }) {

  const { past, future } = histories[id];

  // clear all future changes
  past.splice(0, past.length);
  future.splice(0, future.length);

  return histories;
}

/**
 * editor histories storage
 */
function editorHistories (histories = defaults.histories, action = defaults.action) {

  // do not do anything if id is missing
  if ( typeof action.id !== 'string' || ( typeof action.id === 'string' && action.id.trim().length === 0 ) ) return histories;

  // initialize history if it does not exist
  histories = hookInitialPlaceholder(histories, action);

  switch ( action.type ) {

    /**
     * editor history initialization
     */
    case actions.InitialEditorHistory:
      return patcher.clone(hookInitialHistory(histories, action));

    /**
     * record changes
     */
    case actions.AppendEditorChange:
      return patcher.clone(hookAppendChange(histories, action));

    /**
     * undo changes
     */
    case actions.RevertEditorChange:
      return patcher.clone(hookRevertChange(histories, action));

    /**
     * redo changes
     */
    case actions.ReplayEditorChange:
      return patcher.clone(hookReplayChange(histories, action));

    /**
     * patch editor state
     */
    case actions.PatchEditorState:
      return patcher.clone(hookPatchState(histories, action));

    /**
     * clear changes store
     */
    case actions.RemoveEditorChanges:
      return patcher.clone(hookRemoveChanges(histories, action));

    default:
      return histories;
  }
}

/**
 * retrieve moment editable document api
 */
function retrieveEditableState(id, cache = false) {
  return function ( dispatch, getState ) {
    const { authenticationToken, momentDocuments } = getState();
    if ( cache ) {
      const state = momentDocuments[id];
      if ( typeof state === 'object' && state !== null ) {
        return new Promise(resolve => {
          return resolve(dispatch({ type: actions.InitialEditorHistory, id, state: (state.document || { }) }));
        });
      }
    }
    const headers = isServer && { internal: 'TRUE', 'Access-Token': authenticationToken };
    return fetch(`${BACKEND_URL}/i/plot/${id}`, {
      method      : 'get',
      credentials : 'include',
      headers,
    })
    .then(res => res.json())
    .then(doc => (doc.error ? Promise.reject(doc.error) : (doc.document || { })))
    .then(
      state => dispatch({ type: actions.InitialEditorHistory, id, state }),
      err  => ({ err }),
    )
  }
}

/**
 * patch document state with diff object
 */
function patchState(id, diff) {
  return function ( dispatch, getState ) {
    return new Promise(resolve => {
      return resolve(dispatch({ type: actions.PatchEditorState, id, diff }));
    })
    .then(_ => getState().editorHistories[id].present);
  }
}

/**
 * replace document state
 */
function replaceState(id, state, checksHash = false) {
  return function ( dispatch, getState ) {
    return new Promise(resolve => {
      return resolve(dispatch({ type: actions.PatchEditorState, id, state, checksHash }));
    })
    .then(_ => getState().editorHistories[id].present);
  }
}

/**
 * update document state
 */
function updateState(id, state) {
  return function ( dispatch, getState ) {
    return new Promise(resolve => {
      return resolve(dispatch({ type: actions.AppendEditorChange, id, state }));
    })
    .then(_ => {
      const { editorHistories } = getState();
      const { past } = editorHistories[id];
      return past[past.length - 1];
    });
  }
}

/**
 * undo state changes
 */
function undo(id) {
  return function ( dispatch, getState ) {
    return new Promise(resolve => {
      return resolve(dispatch({ type: actions.RevertEditorChange, id }));
    })
    .then(_ => {
      const { editorHistories } = getState();
      const { future } = editorHistories[id];
      const changes = future[future.length - 1];
      return patcher.reverse(changes);
    });
  }
}

/**
 * redo state changes
 */
function redo(id) {
  return function ( dispatch, getState ) {
    return new Promise(resolve => {
      return resolve(dispatch({ type: actions.ReplayEditorChange, id }));
    })
    .then(_ => {
      const { editorHistories } = getState();
      const { past } = editorHistories[id];
      return past[past.length - 1];
    });
  }
}

/**
 * clear past and future changes
 */
function clearChanges(id) {
  return function ( dispatch, getState ) {
    return new Promise(resolve => {
      return resolve(dispatch({ type: actions.RemoveEditorChanges, id }));
    })
    .then(_ => getState().editorHistories[id]);
  }
}

/**
 * export store api
 */
export const api = {
  retrieveEditableState,
  patchState,
  replaceState,
  updateState,
  undo,
  redo,
  clearChanges,
};

export default {
  editorHistories,
};

