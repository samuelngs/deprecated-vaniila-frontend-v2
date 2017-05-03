
const defaults = {
  protocol        : 'http',
  secure          : false,
  subdomains      : [ ],
  xhr             : false,
  hostname        : typeof location !== 'undefined' ? location.hostname : '',
  ip              : '',
  path            : typeof location !== 'undefined' ? location.pathname : '',
  pathname        : '',
  originalUrl     : '',
  baseUrl         : '',
  query           : { },
  params          : { },
  cookies         : { },
  signedCookies   : { },
  action          : { },
};

export const actions = {
  SetServerProtocol     : 'set_server_protocol',
  SetServerSecure       : 'set_server_secure',
  SetServerSubdomains   : 'set_server_subdomains',
  SetServerXhr          : 'set_server_xhr',
  SetServerHostname     : 'set_server_hostname',
  SetServerIp           : 'set_server_ip',
  SetServerPath         : 'set_server_path',
  SetServerPathname     : 'set_server_pathname',
  SetServerOriginalUrl  : 'set_server_original_url',
  SetServerBaseUrl      : 'set_server_base_url',
  SetServerQuery        : 'set_server_query',
  SetServerParams       : 'set_server_params',
  SetServerCookies      : 'set_server_cookies',
  SetServerSignedCookies: 'set_server_signed_cookies',
};

function serverProtocol (protocol = defaults.protocol, action = defaults.action) {
  switch ( action.type ) {
    case actions.SetServerProtocol:
      return action.protocol;
    default:
      return protocol;
  }
};

function serverSecure (secure = defaults.secure, action = defaults.action) {
  switch ( action.type ) {
    case actions.SetServerSecure:
      return action.secure;
    default:
      return secure;
  }
}

function serverSubdomains (subdomains = defaults.subdomains, action = defaults.action) {
  switch ( action.type ) {
    case actions.SetServerSubdomains:
      return action.subdomains;
    default:
      return subdomains;
  }
}

function serverXhr (xhr = defaults.xhr, action = defaults.action) {
  switch ( action.type ) {
    case actions.SetServerXhr:
      return action.xhr;
    default:
      return xhr;
  }
}

function serverHostname (hostname = defaults.hostname, action = defaults.action) {
  switch ( action.type ) {
    case actions.SetServerHostname:
      return action.hostname;
    default:
      return hostname;
  }
}

function serverIp (ip = defaults.ip, action = defaults.action) {
  switch ( action.type ) {
    case actions.SetServerIp:
      return action.ip;
    default:
      return ip;
  }
}

function serverPath (path = defaults.path, action = defaults.action) {
  switch ( action.type ) {
    case actions.SetServerPath:
      return action.path;
    default:
      return path;
  }
}

function serverPathname (pathname = defaults.pathname, action = defaults.action) {
  switch ( action.type ) {
    case actions.SetServerPathname:
      return action.pathname;
    default:
      return pathname;
  }
}

function serverOriginalUrl (originalUrl = defaults.originalUrl, action = defaults.action) {
  switch ( action.type ) {
    case actions.SetServerOriginalUrl:
      return action.originalUrl;
    default:
      return originalUrl;
  }
}

function serverBaseUrl (baseUrl = defaults.baseUrl, action = defaults.action) {
  switch ( action.type ) {
    case actions.SetServerBaseUrl:
      return action.baseUrl;
    default:
      return baseUrl;
  }
}

function serverQuery (query = defaults.query, action = defaults.action) {
  switch ( action.type ) {
    case actions.SetServerQuery:
      return action.query;
    default:
      return query;
  }
}

function serverParams (params = defaults.params, action = defaults.action) {
  switch ( action.type ) {
    case actions.SetServerParams:
      return action.params;
    default:
      return params;
  }
}

function serverCookies (cookies = defaults.cookies, action = defaults.action) {
  switch ( action.type ) {
    case actions.SetServerCookies:
      return action.cookies;
    default:
      return cookies;
  }
}

function serverSignedCookies (signedCookies = defaults.signedCookies, action = defaults.action) {
  switch ( action.type ) {
    case actions.SetServerSignedCookies:
      return action.signedCookies;
    default:
      return signedCookies;
  }
}

async function serverProtocolMiddleware ({ req: { protocol }, store }) {
  store.dispatch({ type: actions.SetServerProtocol, protocol });
}

async function serverSecureMiddleware ({ req: { secure }, store }) {
  store.dispatch({ type: actions.SetServerSecure, secure });
}

async function serverSubdomainsMiddleware ({ req: { subdomains }, store }) {
  store.dispatch({ type: actions.SetServerSubdomains, subdomains });
}

async function serverXhrMiddleware ({ req: { xhr }, store }) {
  store.dispatch({ type: actions.SetServerXhr, xhr });
}

async function serverHostnameMiddleware ({ req: { hostname }, store }) {
  store.dispatch({ type: actions.SetServerHostname, hostname });
}

async function serverIpMiddleware ({ req: { ip }, store }) {
  store.dispatch({ type: actions.SetServerIp, ip });
}

async function serverPathMiddleware ({ req: { path }, store }) {
  store.dispatch({ type: actions.SetServerPath, path });
}

async function serverPathnameMiddleware ({ pathname, store }) {
  store.dispatch({ type: actions.SetServerPathname, pathname });
}

async function serverOriginalUrlMiddleware ({ req: { originalUrl }, store }) {
  store.dispatch({ type: actions.SetServerOriginalUrl, originalUrl });
}

async function serverBaseUrlMiddleware ({ req: { baseUrl }, store }) {
  store.dispatch({ type: actions.SetServerBaseUrl, baseUrl });
}

async function serverQueryMiddleware ({ req: { query }, store }) {
  store.dispatch({ type: actions.SetServerQuery, query });
}

async function serverParamsMiddleware ({ req: { params }, store }) {
  store.dispatch({ type: actions.SetServerParams, params });
}

async function serverCookiesMiddleware ({ req: { cookies }, store }, keyPrefix) {
  // dispatch and sync request cookie to redux storage
  const filteredCookies = { };
  for ( const key in cookies ) {
    if ( key.indexOf(keyPrefix) === -1 ) filteredCookies[key] = cookies[key];
  }
  store.dispatch({ type: actions.SetServerCookies, cookies: filteredCookies });
}

async function serverSignedCookiesMiddleware ({ req: { signedCookies }, store }, keyPrefix) {
  // dispatch and sync request signed-cookies to redux storage
  const filteredSignedCookies = { };
  for ( const key in signedCookies ) {
    if ( key.indexOf(keyPrefix) === -1 ) filteredSignedCookies[key] = signedCookies[key];
  }
  store.dispatch({ type: actions.SetServerSignedCookies, signedCookies: filteredSignedCookies });
}

export const middleware = [
  serverProtocolMiddleware,
  serverSecureMiddleware,
  serverSubdomainsMiddleware,
  serverXhrMiddleware,
  serverHostnameMiddleware,
  serverIpMiddleware,
  serverPathMiddleware,
  serverPathnameMiddleware,
  serverOriginalUrlMiddleware,
  serverBaseUrlMiddleware,
  serverQueryMiddleware,
  serverParamsMiddleware,
  serverCookiesMiddleware,
  serverSignedCookiesMiddleware,
];

export default {
  serverProtocol,
  serverSecure,
  serverSubdomains,
  serverXhr,
  serverHostname,
  serverIp,
  serverPath,
  serverPathname,
  serverOriginalUrl,
  serverBaseUrl,
  serverQuery,
  serverParams,
  serverCookies,
  serverSignedCookies,
}

