
import 'isomorphic-fetch';

const isServer = typeof window === 'undefined';

const defaults = {
  username: '',
  fullname: '',
  avatar  : '',
  action  : { },
};

export const actions = {
  SetAccountUsername  : 'set_account_username',
  SetAccountFullname  : 'set_account_fullname',
  SetAccountAvatar    : 'set_account_avatar',
};

/**
 * account username field
 */
function accountUsername (username = defaults.username, action = defaults.action) {
  switch ( action.type ) {
    case actions.SetAccountUsername:
      return action.username;
    default:
      return username;
  }
}

/**
 * account fullname field
 */
function accountFullname (fullname = defaults.fullname, action = defaults.action) {
  switch ( action.type ) {
    case actions.SetAccountFullname:
      return action.fullname;
    default:
      return fullname;
  }
}

/**
 * account avatar field
 */
function accountAvatar (avatar = defaults.avatar, action = defaults.avatar) {
  switch ( action.type ) {
    case actions.SetAccountAvatar:
      return action.avatar;
    default:
      return avatar;
  }
}

/**
 * retrieve account object api
 */
function retrieveMyAccount() {
  return function ( dispatch, getState ) {
    const { authenticationToken } = getState();
    const headers = isServer && { internal: 'TRUE', 'Access-Token': authenticationToken };
    return fetch(`${BACKEND_URL}/i/user?query={username,name,avatar}`, {
      method      : 'get',
      credentials : 'include',
      headers,
    })
    .then(res => res.json())
    .then(res => (res.error ? Promise.reject(res.error) : res))
    .then(
      res => {
        const { data: {
          name: fullname = defaults.fullname,
          username = defaults.username,
          avatar = defaults.avatar,
        } = { } } = res;
        dispatch({ type: actions.SetAccountUsername, username  });
        dispatch({ type: actions.SetAccountFullname, fullname });
        dispatch({ type: actions.SetAccountAvatar, avatar });
        return false;
      },
      err  => err,
    )
  }
}

/**
 * account sync middleware
 */
async function accountSync ({ store }) {
  const { authenticationToken } = store.getState();
  if ( typeof authenticationToken !== 'string' || ( typeof authenticationToken === 'string' && authenticationToken.trim().length === 0 ) ) {
    store.dispatch({ type: actions.SetAccountUsername, username: defaults.username });
    store.dispatch({ type: actions.SetAccountFullname, fullname: defaults.fullname });
    store.dispatch({ type: actions.SetAccountAvatar, avatar: defaults.avatar });
    return false;
  }
  const user = await fetch(`${BACKEND_URL}/i/user?query={username,name,avatar}`, {
    method      : 'get',
    credentials : 'include',
    headers     : { internal: 'TRUE', 'Access-Token': authenticationToken },
  })
  .then(
    res => res.json(),
    err => null,
  );
  if ( !user ) return false;
  if ( user.error ) return store.dispatch({ type: 'set_authentication_token', _vt: '' });
  const { data: {
    name: fullname = defaults.fullname,
    username = defaults.username,
    avatar = defaults.avatar,
  } = { } } = user;
  store.dispatch({ type: actions.SetAccountUsername, username  });
  store.dispatch({ type: actions.SetAccountFullname, fullname });
  store.dispatch({ type: actions.SetAccountAvatar, avatar });
}

export const api = {
  retrieveMyAccount,
};

export const middleware = [
  accountSync,
];

export default {
  accountUsername,
  accountFullname,
  accountAvatar,
}

