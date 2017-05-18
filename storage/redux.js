
import React from 'react';
import Router from 'next/router';
import MemoryStorage from './memory';
import localforage from 'localforage';

import url from 'url';
import { connect, Provider } from 'react-redux';
import { createPersistor, persistStore } from 'redux-persist';

import { prefix as keyPrefix, blacklist } from './config';
import { syncCookies } from './store';
import { actions } from '../reducers/server';

const localforageConf = {
  driver    : [ localforage.INDEXEDDB, localforage.WEBSQL, localforage.LOCALSTORAGE ],
  name      : 'vaniila-com',
  storeName : 'vaniila-com',
}

if (
  process.env.NODE_ENV === 'production' &&
  typeof window !== 'undefined' &&
  window.__REACT_DEVTOOLS_GLOBAL_HOOK__ &&
  Object.keys(window.__REACT_DEVTOOLS_GLOBAL_HOOK__._renderers).length
) {
  window.__REACT_DEVTOOLS_GLOBAL_HOOK__._renderers = {};
}

if (
  process.env.NODE_ENV === 'production' &&
  typeof window !== 'undefined'
) {

  // google analytics
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
  ga('create', 'UA-85759384-1', 'auto');
  ga('send', 'pageview');

  // fullstory
  window['_fs_debug'] = false;
  window['_fs_host'] = 'fullstory.com';
  window['_fs_org'] = '4MA4X';
  window['_fs_namespace'] = 'FS';
  (function(m,n,e,t,l,o,g,y){
    if (e in m && m.console && m.console.log) { m.console.log('FullStory namespace conflict. Please set window["_fs_namespace"].'); return;}
    g=m[e]=function(a,b){g.q?g.q.push([a,b]):g._api(a,b);};g.q=[];
    o=n.createElement(t);o.async=1;o.src='https://'+_fs_host+'/s/fs.js';
    y=n.getElementsByTagName(t)[0];y.parentNode.insertBefore(o,y);
    g.identify=function(i,v){g(l,{uid:i});if(v)g(l,v)};g.setUserVars=function(v){g(l,v)};
    g.identifyAccount=function(i,v){o='account';v=v||{};v.acctId=i;g(o,v)};
    g.clearUserCookie=function(c,d,i){if(!c || document.cookie.match('fs_uid=[`;`]*`[`;`]*`[`;`]*`')){
    d=n.domain;while(1){n.cookie='fs_uid=;domain='+d+
    ';path=/;expires='+new Date(0).toUTCString();i=d.indexOf('.');if(i<0)break;d=d.slice(i+1)}}};
  })(window,document,window['_fs_namespace'],'script','user');
}

/**
 * redux store initialization
 */
let clientStore = null;
function initStore(makeStore, req, res, initialState) {
  // create redux store for node server
  if ( typeof req === 'object' && typeof window === 'undefined' ) {
    if ( !req._store ) {
      req._store = makeStore(initialState);
    }
    return req._store;
  }
  // create redux store for client / browser
  if ( !clientStore ) {
    clientStore = makeStore(initialState);
  }
  return clientStore;
}

/**
 * withRedux injection
 */
export default function(createStore) {

  const args = [].slice.call(arguments).slice(1);

  return function (Component, mapper, middlewares) {

    let mapStateToProps;
    if ( typeof mapper === 'function' ) mapStateToProps = mapper;
    if ( typeof Component.connect === 'function' ) mapStateToProps = Component.connect;
    if ( typeof Component.observe === 'function' ) mapStateToProps = Component.observe;

    const PatchedComponent = connect.apply(null, [ mapStateToProps, ...args ])(Component);

    return class extends React.Component {

      static async getInitialProps (context) {

        // retrieve parameters from context
        const { req, res } = context;

        // extra parameters for context
        context.isServer = !!req;
        context.hasStore = context.isServer ? !!req._store : !!clientStore;
        context.store = context.hasStore
          ? (context.isServer ? req._store : clientStore)
          : initStore(createStore, req, res);

        // create redux persist storage
        const storage = context.isServer ? new MemoryStorage() : localforage;

        // run redux persist initialization if store wasn't initialized
        if ( !context.hasStore ) {

          if ( storage === localforage ) {
            /**
             * localforage configuration
             */
            localforage.config(localforageConf);
          }

          // create redux persist configuration
          const persistConfig = {
            storage,
            blacklist,
            keyPrefix,
          };

          // restore state from redux persist
          const { err, state } = await new Promise(resolve => {
            persistStore(context.store, persistConfig, (err, state) => {
              resolve({ err, state });
            });
          });
          if ( !context.err && err ) context.err = err;
        }

        // only execute when it is running in node.js
        if ( context.isServer ) {
          // retrieve server state
          const { protocol, secure, subdomains, xhr, hostname, ip, path, originalUrl, baseUrl, params, cookies, signedCookies } = req;

          // cookie configuration
          const cookieOpts = {
            domain  : ['127.0.0.1', 'localhost'].indexOf(hostname) ? hostname : hostname.split('.').slice(-2).join('.'),
            path    : '/',
            secure  : false,
            expires : new Date(9999999999999),
          };

          // dispatch and sync custom values with cookies
          for ( const { key, type, name, def } of syncCookies ) {
            const ref = `${keyPrefix}${key}`;
            const val = cookies[ref];
            let parse;
            switch ( typeof def ) {
              case 'string':
                parse = val;
                if ( typeof parse !== 'string' ) {
                  parse = def;
                }
                break;
              case 'number':
                parse = Number(val);
                if ( isNaN(parse) ) {
                  try { parse = JSON.parse(val) } catch(e) { }
                }
                if ( isNaN(parse) || typeof parse !== 'number' ) {
                  parse = def;
                }
                break;
              case 'boolean':
                if ( val === 'true' ) {
                  parse = true;
                }
                if ( val === 'false' ) {
                  parse = false;
                }
                if ( typeof parse !== 'boolean' ) {
                  try { parse = JSON.parse(val) } catch(e) { }
                }
                if ( typeof parse !== 'boolean' ) {
                  parse = def;
                }
                break;
              case 'object':
                try {
                  parse = JSON.parse(val)
                } catch(e) {
                  parse = def;
                }
                break;
            }
            context.store.dispatch({ type, [name]: parse });
            switch ( typeof def ) {
              case 'string':
                res.cookie(ref, parse, cookieOpts);
                break;
              case 'number':
              case 'boolean':
                res.cookie(ref, `${parse}`, cookieOpts);
                break;
              case 'object':
                res.cookie(ref, JSON.stringify(parse), cookieOpts);
                break;
            }
          }

          // run redux middlewares
          if ( Array.isArray(middlewares) ) {
            await Promise.all(middlewares.map(async middleware => {
              if ( typeof middleware === 'function' ) {
                return await middleware(context, keyPrefix);
              }
              return await false;
            }));
          }
        } else {

          if (
            typeof context === 'object'
            && context !== null
            && typeof context.query === 'object'
            && context.query !== null
          ) {
            const { query } = context;
            context.store.dispatch({ type: actions.SetServerQuery, query });
          } else {
            context.store.dispatch({ type: actions.SetServerQuery, query: { } });
          }

          if (
            typeof context === 'object'
            && context !== null
            && typeof context.pathname === 'string'
          ) {
            const { pathname } = context;
            context.store.dispatch({ type: actions.SetServerPathname, pathname });
          }

        }

        // get the `initialProps` from the ComposedComponent
        const initialProps = typeof Component.getInitialProps === 'function'
            ? await Component.getInitialProps(context)
            : { };

        return {
          isServer    : context.isServer,
          store       : context.store,
          initialState: context.store.getState(),
          initialProps
        }

      }

      constructor (props) {
        super(props);
        // retrieve `initialState` and `initialProps` from wrapper component
        const { isServer, initialState = { } } = props;
        const hasStore = props.store
          && props.store.dispatch
          && props.store.getState;
        this.store = hasStore
          ? props.store
          : initStore(createStore, { }, { }, initialState);
        const state = this.store.getState()
        this.persistStore(this.store, state);
      }

      componentDidMount() {
        this.analytics(this.store);
        Router.onRouteChangeStart = path => {
          this.store.dispatch({ type: actions.SetServerPath, path });
          this.analytics(this.store, path);
        }
      }

      componentWillUnmount() {
        Router.onRouteChangeStart = null;
      }

      async analytics(store, path) {
        const { accountUsername, accountFullname } = store.getState();
        if ( typeof window !== 'undefined' && typeof window.ga === 'function' ) {
          if ( !!accountUsername ) {
            ga('set', 'userId', accountUsername);
          }
          if ( !!path ) {
            ga('set', 'page', path);
            ga('send', 'pageview');
          }
        }
        if ( typeof window !== 'undefined' && !!window.FS && !!accountUsername ) {
          FS.identify(accountUsername, {
            displayName: accountFullname,
          });
        }
      }

      async persistStore(store, state) {

        // only execute if it is running in browser
        if ( typeof window === 'undefined' ) return false;

        // localforage configuration
        localforage.config(localforageConf);

        // create redux persist configuration
        const persistConfig = {
          storage: localforage,
          blacklist,
          keyPrefix,
        };

        // create redux persistor instance
        const persistor = createPersistor(store, persistConfig);

        // restore and save state from server
        await persistor.rehydrate(state);

      }

      render () {
        const { store, props: { initialProps } } = this;
        return <Provider store={store}>
          <PatchedComponent {...initialProps} />
        </Provider>
      }

    }

  }
};

