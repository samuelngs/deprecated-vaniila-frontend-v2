
import { DiffPatcher } from 'jsondiffpatch/src/diffpatcher';

const patcher = new DiffPatcher();

const defaults = {

  // editor states storage
  states: { },

  // editor single state
  state: {

    // editor moment
    editorMoment: null,

    // editor next moment
    editorNextMoment: null,

    // editor grid view
    editorGrid: false,

    // selection start point (usually the anchor point)
    editorStartKey: null,
    editorStartGroup: null,
    editorStartOffset: 0,

    // selection anchor point
    editorAnchorKey: null,
    editorAnchorGroup: null,
    editorAnchorOffset: 0,

    // selection end point (usually the focus point)
    editorEndKey: null,
    editorEndGroup: null,
    editorEndOffset: 0,

    // selection focus point
    editorFocusKey: null,
    editorFocusGroup: null,
    editorFocusOffset: 0,

    // selection position
    editorSelectionTop: 0,
    editorSelectionLeft: 0,
    editorSelectionBottom: 0,
    editorSelectionRight: 0,
    editorSelectionHeight: 0,
    editorSelectionWidth: 0,

    // selection recovery
    editorSelectionRecovery: false,

    // If the anchor position is lower in the document than the focus position, the selection is backward
    editorIsBackward: false,
    editorIsCollapsed: true,

    // whether the editor currently has focus
    editorHasFocus: false,

    // if the current state is composition mode (IME)
    editorIsCompositionMode: false,
    editorIsCompositionResolved: false,
    editorIsComposing: false,
    editorInputData: '',
  },

  options: {

    id: undefined,
    nextId: undefined,

    grid: undefined,

    anchorKey: undefined,
    anchorGroup: undefined,
    anchorOffset: -1,

    focusKey: undefined,
    focusGroup: undefined,
    focusOffset: -1,

    selectionTop: undefined,
    selectionLeft: undefined,
    selectionBottom: undefined,
    selectionRight: undefined,
    selectionHeight: undefined,
    selectionWidth: undefined,

    selectionRecovery: undefined,
    selectionCollapsed: undefined,

    focus: undefined,

    compositionMode: undefined,
    compositionResolved: undefined,
    composing: undefined,
    inputData: undefined,
  },

};

export const actions = {
  SetEditorState: '@@editor/SET_EDITOR_STATE',
};

function hookInitialPlaceholder(states, { id }) {
  if ( typeof states[id] !== 'object' || states[id] === null ) {
    const clone = patcher.clone(states);
    clone[id] = { ...defaults.state };
    return clone;
  }
  return states;
}

function hookSetEditorState(states, { id, options: opts }, store) {

  // clone current states
  const clone = patcher.clone(states);

  // retrieve specific editor state
  const state = clone[id];
  const { editorHistories } = store;
  const { present } = editorHistories[id];

  if ( !present ) return clone;

  // update state
  conditionReset(state, present, opts);
  conditionUpdateNext(state, present, opts);
  conditionUpdateGridview(state, present, opts);
  conditionUpdateAnchorPoint(state, present, opts);
  conditionUpdateFocusPoint(state, present, opts);
  conditionUpdateFocus(state, present, opts);
  conditionUpdateOrdering(state, present, opts);
  conditionUpdateSelectionPosition(state, present, opts);
  conditionUpdateSelectionRecovery(state, present, opts);
  conditionUpdateSelectionCollapsed(state, present, opts);
  conditionUpdateCompositionMode(state, present, opts);
  conditionUpdateCompositionResolved(state, present, opts);
  conditionUpdateComposing(state, present, opts);
  conditionUpdateInputData(state, present, opts);

  return clone;
}

function conditionReset(state, doc, opts) {
  const { id } = opts;
  if ( typeof id !== 'string' ) return;
  if ( state.editorMoment !== id ) {
    for ( const i in defaults.state ) {
      state[i] = defaults.state[i];
    }
    state.editorMoment = id;
  }
}

function conditionUpdateNext(state, doc, opts) {
  const { nextId } = opts;
  if ( typeof nextId !== 'string' ) return;
  state.editorNextMoment = nextId;
}

function conditionUpdateGridview(state, doc, opts) {
  const { grid } = opts;
  if ( typeof grid !== 'boolean' ) return;
  state.editorGrid = grid;
}

function conditionUpdateAnchorPoint(state, doc, opts) {
  const { anchorKey, anchorGroup, anchorOffset } = opts;
  if ( typeof anchorKey === 'undefined' || typeof anchorGroup === 'undefined' || anchorOffset === -1 ) return;
  state.editorAnchorKey = anchorKey;
  state.editorAnchorGroup = anchorGroup;
  state.editorAnchorOffset = anchorOffset;
}

function conditionUpdateFocusPoint(state, doc, opts) {
  const { focusKey, focusGroup, focusOffset } = opts;
  if ( typeof focusKey === 'undefined' || typeof focusGroup === 'undefined' || focusOffset === -1 ) return;
  state.editorFocusKey = focusKey;
  state.editorFocusGroup = focusGroup;
  state.editorFocusOffset = focusOffset;
}

function conditionUpdateOrdering(state, doc, opts) {
  const {
    editorMoment,
    editorAnchorKey,
    editorAnchorGroup,
    editorAnchorOffset,
    editorFocusKey,
    editorFocusGroup,
    editorFocusOffset,
  } = state;
  const oEditorAnchorGroup = Number(editorAnchorGroup);
  const oEditorFocusGroup = Number(editorFocusGroup);
  if ( isNaN(oEditorAnchorGroup) || isNaN(oEditorFocusGroup) ) return;

  const data = (doc.data || { });
  const moments = (data.slides || { });
  const moment = editorMoment === 'cover'
    ? {
      data  : {
        blocks: [
          {
            key   : 'cover',
            type  : 'unstyled',
            data  : '',
            styles: [ ],
          }
        ]
      }
    }
    : moments[editorMoment];

  if ( typeof moment !== 'object' || moment === null ) return;

  const blocks = (moment && moment.data && moment.data.blocks) || [ ];

  let anchorBlockIdx = -1;
  let focusBlockIdx = -1;
  for ( let i = 0; i < blocks.length; i++ ) {
    const { key } = blocks[i];
    if ( key === editorAnchorKey ) anchorBlockIdx = i;
    if ( key === editorFocusKey ) focusBlockIdx = i;
    if ( anchorBlockIdx > -1 && focusBlockIdx > -1 ) break;
  }

  if ( anchorBlockIdx === -1 || focusBlockIdx === -1 ) return;

  const equalBlock = (anchorBlockIdx === focusBlockIdx);
  const equalGroup = equalBlock && editorAnchorGroup === editorFocusGroup;
  const equalOffset = editorAnchorOffset === editorFocusOffset;

  state.editorIsCollapsed = equalBlock && equalGroup && equalOffset;

  if ( !equalBlock ) {
    if ( anchorBlockIdx < focusBlockIdx ) {
      state.editorStartKey = editorAnchorKey;
      state.editorStartGroup = editorAnchorGroup;
      state.editorStartOffset = editorAnchorOffset;
      state.editorEndKey = editorFocusKey;
      state.editorEndGroup = editorFocusGroup;
      state.editorEndOffset = editorFocusOffset;
      state.editorIsBackward = false;
    } else {
      state.editorStartKey = editorFocusKey;
      state.editorStartGroup = editorFocusGroup;
      state.editorStartOffset = editorFocusOffset;
      state.editorEndKey = editorAnchorKey;
      state.editorEndGroup = editorAnchorGroup;
      state.editorEndOffset = editorAnchorOffset;
      state.editorIsBackward = true;
    }
    return;
  }

  if ( !equalGroup ) {
    if ( oEditorAnchorGroup < oEditorFocusGroup ) {
      state.editorStartKey = editorAnchorKey;
      state.editorStartGroup = editorAnchorGroup;
      state.editorStartOffset = editorAnchorOffset;
      state.editorEndKey = editorFocusKey;
      state.editorEndGroup = editorFocusGroup;
      state.editorEndOffset = editorFocusOffset;
      state.editorIsBackward = false;
    } else {
      state.editorStartKey = editorFocusKey;
      state.editorStartGroup = editorFocusGroup;
      state.editorStartOffset = editorFocusOffset;
      state.editorEndKey = editorAnchorKey;
      state.editorEndGroup = editorAnchorGroup;
      state.editorEndOffset = editorAnchorOffset;
      state.editorIsBackward = true;
    }
    return;
  }

  if ( !equalOffset ) {
    if ( editorAnchorOffset < editorFocusOffset ) {
      state.editorStartKey = editorAnchorKey;
      state.editorStartGroup = editorAnchorGroup;
      state.editorStartOffset = editorAnchorOffset;
      state.editorEndKey = editorFocusKey;
      state.editorEndGroup = editorFocusGroup;
      state.editorEndOffset = editorFocusOffset;
      state.editorIsBackward = false;
    } else {
      state.editorStartKey = editorFocusKey;
      state.editorStartGroup = editorFocusGroup;
      state.editorStartOffset = editorFocusOffset;
      state.editorEndKey = editorAnchorKey;
      state.editorEndGroup = editorAnchorGroup;
      state.editorEndOffset = editorAnchorOffset;
      state.editorIsBackward = true;
    }
    return;
  }

  state.editorStartKey = editorAnchorKey;
  state.editorStartGroup = editorAnchorGroup;
  state.editorStartOffset = editorAnchorOffset;
  state.editorEndKey = editorFocusKey;
  state.editorEndGroup = editorFocusGroup;
  state.editorEndOffset = editorFocusOffset;
  state.editorIsBackward = false;
}

function conditionUpdateSelectionPosition(state, doc, opts) {
  const {
    selectionTop,
    selectionLeft,
    selectionBottom,
    selectionRight,
    selectionHeight,
    selectionWidth,
  } = opts;
  if (
    typeof selectionTop === 'number'
    && typeof selectionLeft === 'number'
    && typeof selectionBottom === 'number'
    && typeof selectionRight === 'number'
    && typeof selectionHeight === 'number'
    && typeof selectionWidth === 'number'
  ) {
    state.editorSelectionTop = selectionTop;
    state.editorSelectionLeft = selectionLeft;
    state.editorSelectionBottom = selectionBottom;
    state.editorSelectionRight = selectionRight;
    state.editorSelectionHeight = selectionHeight;
    state.editorSelectionWidth = selectionWidth;
  }
}

function conditionUpdateSelectionRecovery(state, doc, opts) {
  const { selectionRecovery } = opts;
  if ( typeof selectionRecovery !== 'boolean' ) return;
  state.editorSelectionRecovery = selectionRecovery;
}

function conditionUpdateSelectionCollapsed(state, doc, opts) {
  const { selectionCollapsed } = opts;
  if ( typeof selectionCollapsed !== 'boolean' ) return;
  state.editorIsCollapsed = selectionCollapsed;
}

function conditionUpdateFocus(state, doc, opts) {
  const { focus } = opts;
  if ( typeof focus !== 'boolean' ) return;
  state.editorHasFocus = focus;
}

function conditionUpdateCompositionMode(state, doc, opts) {
  const { compositionMode } = opts;
  if ( typeof compositionMode !== 'boolean' ) return;
  state.editorIsCompositionMode = compositionMode;
}

function conditionUpdateCompositionResolved(state, doc, opts) {
  const { compositionResolved } = opts;
  if ( typeof compositionResolved != 'boolean' ) return;
  state.editorIsCompositionResolved = compositionResolved;
}

function conditionUpdateComposing(state, doc, opts) {
  const { composing } = opts;
  if ( typeof composing !== 'boolean' ) return;
  state.editorIsComposing = composing;
}

function conditionUpdateInputData(state, doc, opts) {
  const { inputData } = opts;
  if ( typeof inputData !== 'string' ) return;
  state.editorInputData = inputData;
}

/**
 * editor state
 */
function editorStates (states = defaults.states, action = defaults.action, store) {

  // do not do anything if id is missing
  if ( typeof action.id !== 'string' || ( typeof action.id === 'string' && action.id.trim().length === 0 ) ) return states;

  // initialize state if it does not exist
  states = hookInitialPlaceholder(states, action);

  switch ( action.type ) {

    /**
     * editor history initialization
     */
    case actions.SetEditorState:
      return hookSetEditorState(states, action, store);

    /**
     * getter
     */
    default:
      return states;

  }
}

/**
 * set editor state
 */
function setEditorState(id, opts) {
  const options = { ...defaults.state, ...opts };
  return function ( dispatch, getState ) {
    return new Promise(resolve => {
      return resolve(dispatch({ type: actions.SetEditorState, id, options }));
    })
    .then(_ => getState().editorStates[id]);
  }
}

/**
 * export store api
 */
export const api = {
  setEditorState,
}

export default {
  editorStates,
};
