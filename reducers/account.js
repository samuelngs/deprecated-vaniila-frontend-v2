
import 'isomorphic-fetch';

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

function accountUsername (username = defaults.username, action = defaults.action) {
  switch ( action.type ) {
    case actions.SetAccountUsername:
      return action.username;
    default:
      return username;
  }
}

function accountFullname (fullname = defaults.fullname, action = defaults.action) {
  switch ( action.type ) {
    case actions.SetAccountFullname:
      return action.fullname;
    default:
      return fullname;
  }
}

function accountAvatar (avatar = defaults.avatar, action = defaults.avatar) {
  switch ( action.type ) {
    case actions.SetAccountAvatar:
      return action.avatar;
    default:
      return avatar;
  }
}

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
    headers     : {
      internal      : 'TRUE',
      'Access-Token': authenticationToken,
    },
  }).then(res => {
    return res.json();
  }).catch(_ => null);
  if ( !user ) return false;
  if ( user.error ) {
    return store.dispatch({ type: 'set_authentication_token', _vt: '' });
  }
  const { data: {
    name: fullname = defaults.fullname,
    username = defaults.username,
    avatar = defaults.avatar,
  } = { } } = user;
  store.dispatch({ type: actions.SetAccountUsername, username  });
  store.dispatch({ type: actions.SetAccountFullname, fullname });
  store.dispatch({ type: actions.SetAccountAvatar, avatar });
  return true;
}

export const middleware = [
  accountSync,
];

export default {
  accountUsername,
  accountFullname,
  accountAvatar,
}

