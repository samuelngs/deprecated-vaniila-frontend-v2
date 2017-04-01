
const defaults = {
  _vt   : '',
  action: { },
};

export const actions = {
  SetAuthenticationToken: 'set_authentication_token',
};

function authenticationToken (_vt = defaults._vt, action = defaults.action) {
  switch ( action.type ) {
    case actions.SetAuthenticationToken:
      return action._vt;
    default:
      return _vt;
  }
}
authenticationToken.cookie = { type: actions.SetAuthenticationToken, name: '_vt', def: defaults._vt };

export default {
  authenticationToken,
}
