
import { DiffPatcher } from 'jsondiffpatch/src/diffpatcher';

const patcher = new DiffPatcher();

const defaults = {

  // player states storage
  states: { },

  // player single state
  state: {
    playerMoment: 'cover',
    playerMoments: [ ],
    playerHasPrevious: false,
    playerPreviousMoment: null,
    playerHasNext: false,
    playerNextMoment: null,
    playerIsLive: false,
    playerPulse: false,
  },

  options: {
    moment: undefined,
    pulse: undefined,
    live: undefined,
  },

};

export const actions = {
  SetPlayerState: '@@player/SET_PLAYER_STATE',
  SyncPlayerState: '@@player/SYNC_PLAYER_STATE',
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

function hookInitialPlaceholder(states, { id }, store) {
  if ( typeof states[id] !== 'object' || states[id] === null ) {

    const clone = patcher.clone(states);
    clone[id] = { ...defaults.state };

    const { momentDocuments } = store;
    const doc = momentDocuments[id];

    if ( !doc ) return clone;

    const state = clone[id];

    const { started_at, ended_at, livestream, document } = doc;

    const moments = hookMomentsSort(((document || { }).data || { }).slides || { });
    const ids = Object.keys(moments);

    state.playerMoments = ids;

    if ( ids.length > 0 ) {
      state.playerNextMoment = ids[0];
      state.playerHasNext = true;
    }

    // if it's not live stream, moment starts from the beginning
    if ( !livestream ) return clone;

    // if it's live stream, starts from the latest moment
    const startedAt = new Date(started_at);
    const endedAt = new Date(ended_at);

    if (
      startedAt.getTime() < 0 ||  // if live stream hasn't started, starts from the beginning
      endedAt.getTime() > 0 ||    // if live stream has already ended, starts from the beginning
      ids.length === 0            // if there are no other moments, starts from cover screen
    ) return clone;

    const idx = idx.length - 1;

    state.playerMoment = ids[idx];

    state.playerNextMoment = null;
    state.playerHasNext = false;
    state.playerPreviousMoment = idx === 0
      ? 'cover'
      : idx - 1;
    state.playerHasPrevious = true;

    return clone;
  }
  return states;
}

function hookSetPlayerState(states, { id, options: opts }, store) {

  const { momentDocuments } = store;
  const doc = momentDocuments[id];

  if ( !doc ) return states;

  // clone current states
  const clone = patcher.clone(states);

  // retrieve specific player state
  const state = clone[id];

  const moments = hookMomentsSort(((doc.document || { }).data || { }).slides || { });
  const ids = Object.keys(moments);

  state.playerMoments = ids;

  if ( typeof opts.pulse === 'boolean' ) {
    state.playerPulse = opts.pulse;
  }

  if ( typeof opts.live === 'boolean' ) {
    state.playerIsLive = opts.live;
  }

  const idx = ids.indexOf(opts.moment);

  if (
    ( typeof opts.moment === 'string' ) &&
    ( idx > -1 || opts.moment === 'cover' )
  ) {

    state.playerMoment = opts.moment;

    if ( opts.moment === 'cover' ) {

      state.playerHasPrevious = false;
      state.playerPreviousMoment = null;

      if ( ids.length > 0 ) {
        state.playerHasNext = true;
        state.playerNextMoment = ids[0];
      } else {
        state.playerHasNext = false;
        state.playerNextMoment = null;
      }
    } else {

      if ( idx > -1 ) {
        state.playerHasPrevious = true;
        state.playerPreviousMoment = idx === 0
          ? 'cover'
          : ids[idx - 1];
      } else {
        state.playerHasPrevious = false;
        state.playerPreviousMoment = null;
      }

      if ( idx < ids.length - 1 ) {
        state.playerHasNext = true;
        state.playerNextMoment = ids[idx + 1];
      } else {
        state.playerHasNext = false;
        state.playerNextMoment = null;
      }
    }
  }

  return clone;
}

/**
 * sync with document state
 */
function hookSyncWithDocument(states, { id }, store) {

  const { momentDocuments } = store;
  const doc = momentDocuments[id];

  if ( !doc ) return states;

  // clone current states
  const clone = patcher.clone(states);

  // retrieve specific player state
  const state = clone[id];

  let modified = false;

  const { started_at, ended_at, livestream, document } = doc;

  const moments = hookMomentsSort(((doc.document || { }).data || { }).slides || { });
  const startedAt = new Date(started_at);
  const endedAt = new Date(ended_at);

  const playerIsLive = livestream && startedAt.getTime() > 0 && endedAt.getTime() < 0;
  if ( playerIsLive !== state.playerIsLive ) {
    state.playerIsLive = playerIsLive;
    modified = true;
  }

  const playerMoments = Object.keys(moments);
  if ( playerMoments.length !== state.playerMoments.length ) {
    state.playerMoments = playerMoments;
    modified = true;
  } else {
    let momentsEqual = true;
    for ( let i = 0; momentsEqual && i < playerMoments.length; i++ ) {
      if ( playerMoments[i] !== state.playerMoments[i] ) {
        momentsEqual = false;
      }
    }
    if ( !momentsEqual ) {
      state.playerMoments = playerMoments;
      modified = true;
    }
  }

  if ( modified ) {

    if ( state.playerMoment === 'cover' ) {

      state.playerHasPrevious = false;
      state.playerPreviousMoment = null;

      if ( playerMoments.length > 0 ) {
        state.playerHasNext = true;
        state.playerNextMoment = playerMoments[0];
      } else {
        state.playerHasNext = false;
        state.playerNextMoment = null;
      }
    } else {

      const idx = state.playerMoments.indexOf(state.playerMoment);

      if ( idx === -1 ) {

        const nidx = state.playerMoments.indexOf(state.playerNextMoment);
        const pidx = state.playerMoments.indexOf(state.playerPreviousMoment);
        const tidx = nidx > -1
          ? nidx
          : (
            pidx > -1
            ? pidx
            : -1
          )

        if ( tidx > 0 ) {

          state.playerMoment = state.playerMoments[tidx];

          state.playerNextMoment = null;
          state.playerHasNext = false;
          state.playerPreviousMoment = tidx === 0
            ? 'cover'
            : tidx - 1;
          state.playerHasPrevious = true;

        } else {

          state.playerMoment = 'cover';
          state.playerHasPrevious = false;
          state.playerPreviousMoment = null;

          if ( ids.length > 0 ) {
            state.playerHasNext = true;
            state.playerNextMoment = ids[0];
          } else {
            state.playerHasNext = false;
            state.playerNextMoment = null;
          }
        }
      }
    }

    return clone;
  }

  return states;
}

/**
 * player state
 */
function playerStates (states = defaults.states, action = defaults.action, store) {

  // do not do anything if id is missing
  if ( typeof action.id !== 'string' || ( typeof action.id === 'string' && action.id.trim().length === 0 ) ) return states;

  // initialize state if it does not exist
  states = hookInitialPlaceholder(states, action, store);

  switch ( action.type ) {

    /**
     * player initialization or update
     */
    case actions.SetPlayerState:
      return hookSetPlayerState(states, action, store);

    /**
     * sync player state with document changes
     */
    case actions.SyncPlayerState:
      return hookSyncWithDocument(states, action, store);

    /**
     * getter
     */
    default:
      return states;

  }
}

/**
 * set player state
 */
function setPlayerState(id, opts) {
  const options = { ...defaults.state, ...opts };
  return function ( dispatch, getState ) {
    return new Promise(resolve => {
      return resolve(dispatch({ type: actions.SetPlayerState, id, options }));
    })
    .then(_ => getState().playerStates[id]);
  }
}

/**
 * next moment
 */
function next(id) {
  return function ( dispatch, getState ) {
    const { playerHasNext, playerNextMoment: moment } = getState().playerStates[id];
    const options = { moment };
    return new Promise(resolve => {
      if ( !playerHasNext ) return resolve();
      return resolve(dispatch({ type: actions.SetPlayerState, id, options }));
    });
  }
}

/**
 * previous moment
 */
function previous(id) {
  return function ( dispatch, getState ) {
    const { playerHasPrevious, playerPreviousMoment: moment } = getState().playerStates[id];
    const options = { moment };
    return new Promise(resolve => {
      if ( !playerHasPrevious ) return resolve();
      return resolve(dispatch({ type: actions.SetPlayerState, id, options }));
    });
  }
}

/**
 * export store api
 */
export const api = {
  next,
  previous,
  setPlayerState,
}

export default {
  playerStates,
};

