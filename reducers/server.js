
const defaults = {
  protocol        : 'http',
  secure          : false,
  subdomains      : [ ],
  xhr             : false,
  hostname        : typeof location !== 'undefined' ? location.hostname : '',
  ip              : '',
  path            : typeof location !== 'undefined' ? location.pathname : '',
  originalUrl     : '',
  baseUrl         : '',
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
  SetServerOriginalUrl  : 'set_server_original_url',
  SetServerBaseUrl      : 'set_server_base_url',
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

function serverXhr(xhr = defaults.xhr, action = defaults.action) {
  switch ( action.type ) {
    case actions.SetServerXhr:
      return action.xhr;
    default:
      return xhr;
  }
}

function serverHostname(hostname = defaults.hostname, action = defaults.action) {
  switch ( action.type ) {
    case actions.SetServerHostname:
      return action.hostname;
    default:
      return hostname;
  }
}

function serverIp(ip = defaults.ip, action = defaults.action) {
  switch ( action.type ) {
    case actions.SetServerIp:
      return action.ip;
    default:
      return ip;
  }
}

function serverPath(path = defaults.path, action = defaults.action) {
  switch ( action.type ) {
    case actions.SetServerPath:
      return action.path;
    default:
      return path;
  }
}

function serverOriginalUrl(originalUrl = defaults.originalUrl, action = defaults.action) {
  switch ( action.type ) {
    case actions.SetServerOriginalUrl:
      return action.originalUrl;
    default:
      return originalUrl;
  }
}

function serverBaseUrl(baseUrl = defaults.baseUrl, action = defaults.action) {
  switch ( action.type ) {
    case actions.SetServerBaseUrl:
      return action.baseUrl;
    default:
      return baseUrl;
  }
}

function serverParams(params = defaults.params, action = defaults.action) {
  switch ( action.type ) {
    case actions.SetServerParams:
      return action.params;
    default:
      return params;
  }
}

function serverCookies(cookies = defaults.cookies, action = defaults.action) {
  switch ( action.type ) {
    case actions.SetServerCookies:
      return action.cookies;
    default:
      return cookies;
  }
}

function serverSignedCookies(signedCookies = defaults.signedCookies, action = defaults.action) {
  switch ( action.type ) {
    case actions.SetServerSignedCookies:
      return action.signedCookies;
    default:
      return signedCookies;
  }
}

export default {
  serverProtocol,
  serverSecure,
  serverSubdomains,
  serverXhr,
  serverHostname,
  serverIp,
  serverPath,
  serverOriginalUrl,
  serverBaseUrl,
  serverParams,
  serverCookies,
  serverSignedCookies,
}

