
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

import { api as momentsApi } from '../reducers/moments';
import { api as usersApi } from '../reducers/users';

import withRedux from '../storage';

class ListMoments extends React.PureComponent {

  static async getInitialProps ({ req, res, pathname, query: { username }, store, isServer }) {
    {
      const { err } = await store.dispatch(momentsApi.retrieveMoments(username));
      if ( err ) return { username, err }
    }
    {
      const { err } = await store.dispatch(usersApi.retrieveUser(username));
      if ( err ) return { username, err }
    }
    return { username };
  }

  static observe ({ authenticationToken, accountUsername, serverPath, serverPathname, serverParams, serverQuery, windowSize, usersList, momentsList, momentDocuments, momentComments, playerStates }) {
    return { authenticationToken, accountUsername, serverPath, serverPathname, serverParams, serverQuery, windowSize, usersList, momentsList, momentDocuments, momentComments, playerStates };
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
    const { username, authenticationToken, accountUsername, serverPathname, serverQuery, windowSize, usersList, momentsList, momentDocuments, momentComments, playerStates } = this.props;
    const { username: author, id } = serverQuery;

    const moments = momentsList[username] || [ ];
    const user = usersList[username] || { };

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
          width: 300px;
          max-width: 100%;
          max-width: calc(100% - 40px);
        }
        @media (min-width: 680px) {
          .container {
            width: 620px;
          }
        }
        @media (min-width: 1000px) {
          .container {
            width: 940px;
          }
        }
      `}</style>

      <Head>
        <title>Your Moments</title>
      </Head>

      <BackToTop id={username} />
      <AfterEvent id={username} autostart={false} run={this.onPageLoad} then={this.onPageLoaded} timeout={1000} />

      <AppHeader />
      <WindowObserver />

      <div className="container">
        <AppMomentsProfile user={user} />
        <AppMomentsList placeholder={fetching} whoami={accountUsername} profile={username} moments={moments} mode={this.mode()} />
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
        }}
      >
        <AppModalViewMoment />
      </AppModal>

      <AppFooter />

    </div>
  }

}

export default withRedux(ListMoments);


