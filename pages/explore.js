
import React from 'react';
import Head from 'next/head';
import Router from 'next/router';

import WindowObserver from '../components/WindowObserver';
import BackToTop from '../components/BackToTop';
import AfterEvent from '../components/AfterEvent';
import AppHeader from '../components/AppHeader';
import AppModal from '../components/AppModal';
import AppMomentsList from '../components/AppMomentsList';
import AppModalViewMoment from '../components/AppModalViewMoment';

import { api as trendsApi } from '../reducers/trends';
import withRedux from '../storage';

class Explore extends React.Component {

  static async getInitialProps ({ req, res, pathname, query, store }) {
    const { err } = await store.dispatch(trendsApi.retrieveTrends(1));
    return { err };
  }

  static observe ({ accountUsername, authenticationToken, serverPathname, serverQuery, windowSize, momentDocuments, momentComments, playerStates, trends }) {
    return { accountUsername, authenticationToken, serverPathname, serverQuery, windowSize, momentDocuments, momentComments, playerStates, trends };
  }

  state = {
    fetching: false,
  }

  onPageLoad = o => {
    const { dispatch } = this.props;
    return new Promise(resolve => {
      this.setState(state => !state.fetching && { fetching: true }, _ => {
        dispatch(trendsApi.retrieveTrends(1))
          .then(resolve)
          .catch(resolve);
      });
    });
  }

  onPageLoaded = o => {
    this.setState(state => state.fetching && { fetching: false });
  }

  onModalDismiss = e => {
    e.preventDefault();
    return Router.back();
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

  render () {

    const {
      fetching,
    } = this.state;

    const {
      authenticationToken,
      accountUsername,
      serverPathname,
      serverQuery,
      windowSize,
      momentDocuments,
      momentComments,
      playerStates,
      trends,
    } = this.props;

    const { } = this.props;

    const {
      id,
      username,
    } = serverQuery;

    const {
      moments,
    } = trends;

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
        <title>Vaniila</title>
      </Head>

      <WindowObserver />
      <AppHeader />

      <BackToTop id="landing" />
      <AfterEvent autostart={false} run={this.onPageLoad} then={this.onPageLoaded}  />

      <div className="container">
        <AppMomentsList placeholder={fetching} whoami={accountUsername} moments={moments} mode={this.mode()} />
      </div>

      <AppModal
        color="rgba(134, 143, 146, 0.7)"
        active={serverPathname === '/explore' && !!id && !!username}
        dismiss={this.onModalDismiss}
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

    </div>
  }

}

export default withRedux(Explore);
