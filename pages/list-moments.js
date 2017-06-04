
import 'isomorphic-fetch';

import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Router from 'next/router';

import If from '../components/If';
import WindowObserver from '../components/WindowObserver';
import AfterEvent from '../components/AfterEvent';
import BackToTop from '../components/BackToTop';
import AppHeader from '../components/AppHeader';
import AppFooter from '../components/AppFooter';
import AppModal from '../components/AppModal';
import AppMomentsList from '../components/AppMomentsList';
import AppMomentsProfile from '../components/AppMomentsProfile';
import AppModalViewMoment from '../components/AppModalViewMoment';
import AppLaunchSuccess from '../components/AppLaunchSuccess';
import AppLaunchFail from '../components/AppLaunchFail';

import { api as momentsApi } from '../reducers/moments';
import { api as usersApi } from '../reducers/users';

import withRedux from '../storage';

class ListMoments extends React.PureComponent {

  static async getInitialProps ({ req, res, pathname, query: { username }, store, isServer }) {
    {
      const { err } = await store.dispatch(usersApi.retrieveUser(username));
      if ( isServer && err ) {
        res.statusCode = 404;
      }
      if ( err ) return { username, err };
    }
    {
      const { err } = await store.dispatch(momentsApi.retrieveMoments(username));
      if ( err ) return { username, err }
    }
    return { username };
  }

  static observe ({ authenticationToken, accountUsername, serverPath, serverPathname, serverParams, serverQuery, windowSize, usersList, momentsList, momentDocuments, momentComments, momentPermissions, playerStates, chat }) {
    return { authenticationToken, accountUsername, serverPath, serverPathname, serverParams, serverQuery, windowSize, usersList, momentsList, momentDocuments, momentComments, momentPermissions, playerStates, chat };
  }

  state = {
    fetching: false,
  }

  onPageLoad = o => {
    const { username, dispatch } = this.props;
    return new Promise(resolve => {
      this.setState(state => !state.fetching && { fetching: true }, _ => {
        Promise.all([
          dispatch(momentsApi.retrieveMoments(username)),
          dispatch(usersApi.retrieveUser(username)),
        ])
        .then(resolve)
        .catch(resolve);
      });
    });
  }

  onPageLoaded = o => {
    this.setState(state => state.fetching && { fetching: false });
  }

  mode() {
    const { windowSize: { width: ww, height: wh } } = this.props;
    const defaults = { maxWidth: 600, maxHeight: 600 };
    let width = ww - 100;
    let height = wh - 100;
    if ( width > defaults.maxWidth ) width = defaults.maxWidth;
    if ( height > defaults.maxHeight ) height = defaults.maxHeight;
    if ( width >= defaults.maxHeight ) {
      return 'desktop';
    }
    return 'mobile';
  }

  handleViewMomentDismiss = e => {
    e.preventDefault();
    return Router.back();
  }

  render () {

    const { fetching } = this.state;
    const { username, authenticationToken, accountUsername, serverPathname, serverQuery, windowSize, usersList, momentsList, momentDocuments, momentComments, momentPermissions, playerStates, chat, err } = this.props;
    const { username: author, id } = serverQuery;

    const moments = momentsList[username];
    const user = usersList[username];

    return <div>

      <style jsx>{`
        .container {
          margin-top: 0;
          margin-bottom: 0;
          margin-left: auto;
          margin-right: auto;
          padding-top: 80px;
          padding-bottom: 130px;
          padding-left: 0;
          padding-right: 0;
          width: 342px;
          max-width: 100%;
          max-width: calc(100% - 40px);
        }
        @media (min-width: 780px) {
          .container {
            width: 700px;
          }
        }
        @media (min-width: 1160px) {
          .container {
            width: 1080px;
          }
        }
      `}</style>

      <BackToTop id={username} />
      <AfterEvent id={username} autostart={false} run={this.onPageLoad} then={this.onPageLoaded} timeout={1000} />

      <AppHeader />
      <WindowObserver />

      <AppLaunchSuccess success={user && moments && !err}>

        <Head>

          <title>Vaniila • { (user || { }).name } (@{ username })</title>

          {/* site info metatags */}
          <meta name="distribution" content="Global" />
          <meta name="description" content="Share all your moments from last night’s party, this week’s tech conference, and next month’s political debate." />
          <meta name="creator" content="vaniila.com" />
          <meta name="publisher" content="vaniila.com" />
          <meta name="rating" content="general" />
          <meta name="robots" content="index, follow" />

          {/* twitter metatags */}
          <meta name="twitter:card" content="summary" />
          <meta name="twitter:site" content="@vaniilacom" />
          <meta name="twitter:creator" content="@vaniilacom" />
          <meta name="twitter:title" content="Vaniila" />
          <meta name="twitter:description" content="Share all your moments from last night’s party, this week’s tech conference, and next month’s political debate." />
          <meta name="twitter:image:alt" content="Share all your moments from last night’s party, this week’s tech conference, and next month’s political debate." />
          <meta name="twitter:image" content={((user || { }).avatar || '').replace('_normal', '_bigger')} />
          <meta name="twitter:player" content="https://vaniila.com" />

          {/* google, facebook metatags */}
          <meta name="og:url" content="https://vaniila.com" />
          <meta name="og:image" content={((user || { }).avatar || '').replace('_normal', '_bigger')} />
          <meta name="og:image:secure_url" content={((user || { }).avatar || '').replace('_normal', '_bigger')} />
          <meta name="og:image:height" content="100" />
          <meta name="og:image:width" content="100" />
          <meta name="og:type" content="website" />
          <meta name="og:title" content="Vaniila" />
          <meta name="og:description" content="Share all your moments from last night’s party, this week’s tech conference, and next month’s political debate." />
          <meta name="og:locale" content="en_US" />
          <meta name="og:site_name" content="vaniila.com" />

        </Head>

        <div className="container">
          <AppMomentsProfile user={user} />
          <AppMomentsList placeholder={fetching} whoami={accountUsername} profile={username} moments={moments} permissions={momentPermissions} mode={this.mode()} />
        </div>

        <AppModal
          color="rgba(134, 143, 146, 0.7)"
          active={serverPathname === '/list-moments' && !!id && !!author}
          dismiss={this.handleViewMomentDismiss}
          control={false}
          props={{
            id,
            windowSize,
            authenticationToken,
            accountUsername,
            momentDocuments,
            momentComments,
            playerStates,
            chat,
          }}
        >
          <AppModalViewMoment />
        </AppModal>

      </AppLaunchSuccess>

      <AppLaunchFail failure={err}>

        <Head>

          <title>Vaniila • There\'s nothing here, yet 🙌</title>

          <meta name="distribution" content="IU" />
          <meta name="rating" content="general" />
          <meta name="robots" content="noindex, follow" />

        </Head>

        <div className="container container-error">
          <h1>Not Found</h1>
        </div>

      </AppLaunchFail>

      <AppFooter />

    </div>
  }

}

export default withRedux(ListMoments);


