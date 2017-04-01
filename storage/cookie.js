
export default class CookieStorage {

  constructor({ req, res }) {
    if ( req ) this.req = req;
    if ( res ) this.res = res;
    if ( !this.req) throw 'http request could not be found';
    if ( !this.res) throw 'http response could not be found';
  }

  get(key) {
    const { req: { cookies } } = this;
    const value = typeof cookies[key] === 'string' ? cookies[key] : '';
    return value;
  }

  set(key, value) {
    const {
      req: { secure, hostname },
    } = this;
    const data = typeof value === 'string' ? value : JSON.stringify(value);
    try {
      if ( ['127.0.0.1', 'localhost'].indexOf(hostname) > -1 ) {
        this.res.cookie(key, data, { path: '/', secure: false, expires: new Date(9999999999999) });
      } else {
        this.res.cookie(key, data, { domain: hostname.split('.').slice(-2).join('.'), path: '/', secure: false, expires: new Date(9999999999999) });
      }
    } catch ( e ) { }
  }

  remove(key) {
    try {
      this.res.clearCookie(key);
    } catch ( e ) { }
  }

}
