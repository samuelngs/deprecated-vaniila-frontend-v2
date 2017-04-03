
import { DiffPatcher } from 'jsondiffpatch/src/diffpatcher';

const patcher = new DiffPatcher({
  objectHash: function (obj, index) {
    return obj.key || '$$index:' + index;
  },
  textDiff: {
    minLength: 1,
  },
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
  histories[id].present = { ...state };
  return histories;
}

/**
 * hook for append editor history
 */
function hookAppendChange(histories, { id, state }) {
  if ( typeof state !== 'object' || state === null ) return histories;

  const { present, past, future } = histories[id];
  const diff = patcher.diff(present, state);

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

function hookRevertChange(histories, { id }) {

  const { present, past, future } = histories[id];

  // nothing to revert
  if ( past.length === 0 ) {
    return histories;
  }

  // retrieve last change
  const diff = past[past.length - 1];

  // unpatch last change
  histories[id].present = patcher.unpatch(present, diff);

  // move changes to the future stack
  future.push(diff);
  past.pop();

  return histories;
}

function hookReplayChange(histories, { id }) {

  const { present, past, future } = histories[id];

  // nothing to replay
  if ( future.length === 0 ) {
    return histories;
  }

  // retrieve last change
  const diff = future[future.length - 1];

  // patch last change
  histories[id].present = patcher.patch(present, diff);

  // move changes to past stack
  past.push(diff);
  future.pop();

  return histories;
}

function hookPatchState(histories, { id, diff, state }) {

  const { present } = histories[id];

  // patch state with diff object
  if ( typeof diff !== 'undefined' ) {
    histories[id].present = patcher.patch(present, diff);
    return histories;
  }

  // full patch with document state
  if ( typeof state === 'object' || state !== null ) {
    histories[id].present = { ...state };
    return histories;
  }

  return histories;
}

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
      return hookInitialHistory(histories, action);

    /**
     * record changes
     */
    case actions.AppendEditorChange:
      return hookAppendChange(histories, action);

    /**
     * undo changes
     */
    case actions.RevertEditorChange:
      return hookRevertChange(histories, action);

    /**
     * redo changes
     */
    case actions.ReplayEditorChange:
      return hookReplayChange(histories, action);

    /**
     * patch editor state
     */
    case actions.PatchEditorState:
      return hookPatchState(histories, action);

    /**
     * clear changes store
     */
    case actions.RemoveEditorChanges:
      return hookRemoveChanges(histories, action);

    default:
      return histories;
  }
}

/**
 * retrieve moment editable document api
 */
function retrieveEditableState(id) {
  return function ( dispatch, getState ) {
    const { authenticationToken } = getState();
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
    .then(histories => histories[id].present);
  }
}

/**
 * replace document state
 */
function replaceState(id, state) {
  return function ( dispatch, getState ) {
    return new Promise(resolve => {
      return resolve(dispatch({ type: actions.PatchEditorState, id, state }));
    })
    .then(histories => histories[id].present);
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
    .then(histories => {
      const { past } = histories[id];
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
    .then(histories => histories[id].present);
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
    .then(histories => histories[id].present);
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
    .then(histories => histories[id].present);
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

