
import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Router from 'next/router';

import WindowObserver from '../components/WindowObserver';
import AppHeader from '../components/AppHeader';
import AppMomentSync from '../components/AppMomentSync';
import AppMomentViewer from '../components/AppMomentViewer';
import AppLaunchSuccess from '../components/AppLaunchSuccess';
import AppLaunchFail from '../components/AppLaunchFail';

import { api as momentReducerApi } from '../reducers/moment';
import { api as playerReducerApi } from '../reducers/player';
import withRedux from '../storage';

class ViewMoment extends React.Component {

  static async getInitialProps ({ query: { username, id }, query, store, isServer }) {
    const { err } = await store.dispatch(momentReducerApi.retrieveMomentDocument(id));
    return { err, query };
  }

  static observe ({ authenticationToken, momentDocuments, playerStates, windowSize }) {
    return { authenticationToken, momentDocuments, playerStates, windowSize };
  }

  state = {
    notFound: false,
  }

  componentWillMount() {

    const { query: { username, id }, momentDocuments } = this.props;
    if ( !momentDocuments[id] ) return;

    const { path, author: { username: author } } = momentDocuments[id];

    if ( typeof window !== 'undefined' && `${username}/${id}` !== `${author}/${id}` ) {
      return Router.replace({
        pathname: `/view-moment`,
        query   : { username: author, id },
      }, `/${path}`);
    }
  }

  handleNextMoment = e => {
    const { dispatch, query: { id } } = this.props;
    dispatch(playerReducerApi.next(id));
  }

  handlePreviousMoment = e => {
    const { dispatch, query: { id } } = this.props;
    dispatch(playerReducerApi.previous(id));
  }

  getSizes() {

    const { windowSize: { width, height } } = this.props;

    const defaults = {
      maxWidth: 1440,
      maxHeight: 810,
    };

    const res = {
      screen: { width, height },
      player: { width, height, ratio: 1, mode: 'desktop' },
    };

    if ( res.player.width >= defaults.maxHeight ) {
      res.player.width = Math.ceil(res.player.width * .8);
      res.player.ratio = res.player.width / defaults.maxWidth;
      let h = Math.ceil(defaults.maxHeight * res.player.ratio);
      res.player.height = res.player.height > h
        ? h
        : res.player.height;
      res.player.mode = 'desktop';
    } else {
      let r = res.player.height / defaults.maxHeight;
      res.player.ratio = res.player.ratio > r - 30
        ? r - 30
        : res.player.ratio;
      res.player.height -= 47;
      res.player.mode = 'mobile';
    }

    if ( res.player.width > defaults.maxWidth ) res.player.width = defaults.maxWidth;
    if ( res.player.height > defaults.maxHeight ) res.player.height = defaults.maxHeight;
    if ( res.player.width > width ) res.player.width = width;
    if ( res.player.height > height ) res.player.height = height;

    return res;
  }

  render () {

    const { query: { id }, momentDocuments, playerStates } = this.props;
    const doc = momentDocuments[id];
    const player = playerStates[id];

    const { path, name } = (doc || { });
    const { playerMoment: current, playerNextMoment, playerHasNext, playerPreviousMoment, playerHasPrevious, playerPulse, playerIsLive, playerMoments } = (player || { });

    const sizes = this.getSizes();

    return <div>

      <style jsx>{`
        .container-error {
          padding-top: 47px;
        }
      `}</style>

      <Head>
        <title>{ name }</title>
      </Head>

      <WindowObserver />
      <AppHeader />

      <AppLaunchSuccess success={doc}>
        <AppMomentSync
          id={id}
          path={path}
          pulse={playerPulse}
        />
        <AppMomentViewer
          id={id}
          doc={doc}
          live={playerIsLive}
          pulse={playerPulse}
          moments={playerMoments}
          current={current}
          previous={playerPreviousMoment}
          next={playerNextMoment}
          hasNext={playerHasNext}
          hasPrevious={playerHasPrevious}
          onNext={this.handleNextMoment}
          onPrevious={this.handlePreviousMoment}
          sizes={sizes}
        />
      </AppLaunchSuccess>

      <AppLaunchFail failure={!doc}>
        <div className="container container-error">
          <h1>Not Found</h1>
        </div>
      </AppLaunchFail>

    </div>
  }

}

export default withRedux(ViewMoment);



