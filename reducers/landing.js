
const defaults = {
  landingFoldWordsOut      : false,
  landingFoldHeartsAndMind : false,
  landingFoldCreativity    : false,
  landingFoldGetInvolved   : false,
  action: { },
};

export const actions = {
  SetLandingFoldWordsOut      : 'set_landing_fold_words_out',
  SetLandingFoldHeartsAndMind : 'set_landing_fold_hearts_and_mind',
  SetLandingFoldCreativity    : 'set_landing_fold_creativity',
  SetLandingFoldGetInvolved   : 'set_landing_fold_get_involved',
};

export const fields = {
  SetLandingFoldWordsOut      : 'landingFoldWordsOut',
  SetLandingFoldHeartsAndMind : 'landingFoldHeartsAndMind',
  SetLandingFoldCreativity    : 'landingFoldCreativity',
  SetLandingFoldGetInvolved   : 'landingFoldGetInvolved',
};

/**
 * "words out" section toggle
 */
function landingFoldWordsOut (landingFoldWordsOut = defaults.landingFoldWordsOut, action = defaults.action) {
  switch ( action.type ) {
    case actions.SetLandingFoldWordsOut:
      return action.landingFoldWordsOut;
    default:
      return landingFoldWordsOut;
  }
}
landingFoldWordsOut.cookie = { type: actions.SetLandingFoldWordsOut, name: 'landingFoldWordsOut', def: defaults.landingFoldWordsOut };

/**
 * "hearts and mind" section toggle
 */
function landingFoldHeartsAndMind (landingFoldHeartsAndMind = defaults.landingFoldHeartsAndMind, action = defaults.action) {
  switch ( action.type ) {
    case actions.SetLandingFoldHeartsAndMind:
      return action.landingFoldHeartsAndMind;
    default:
      return landingFoldHeartsAndMind;
  }
}
landingFoldHeartsAndMind.cookie = { type: actions.SetLandingFoldHeartsAndMind, name: 'landingFoldHeartsAndMind', def: defaults.landingFoldHeartsAndMind };

/**
 * "creativity" section toggle
 */
function landingFoldCreativity (landingFoldCreativity = defaults.landingFoldCreativity, action = defaults.action) {
  switch ( action.type ) {
    case actions.SetLandingFoldCreativity:
      return action.landingFoldCreativity;
    default:
      return landingFoldCreativity;
  }
}
landingFoldCreativity.cookie = { type: actions.SetLandingFoldCreativity, name: 'landingFoldCreativity', def: defaults.landingFoldCreativity };

/**
 * "get involved" section toggle
 */
function landingFoldGetInvolved (landingFoldGetInvolved = defaults.landingFoldGetInvolved, action = defaults.action) {
  switch ( action.type ) {
    case actions.SetLandingFoldGetInvolved:
      return action.landingFoldGetInvolved;
    default:
      return landingFoldGetInvolved;
  }
}
landingFoldGetInvolved.cookie = { type: actions.SetLandingFoldGetInvolved, name: 'landingFoldGetInvolved', def: defaults.landingFoldGetInvolved };

export default {
  // landingFoldWordsOut,
  // landingFoldHeartsAndMind,
  // landingFoldCreativity,
  // landingFoldGetInvolved,
}
