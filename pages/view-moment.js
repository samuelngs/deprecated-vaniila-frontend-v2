
import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Router from 'next/router';

import If from '../components/If';
import BackToTop from '../components/BackToTop';
import WindowObserver from '../components/WindowObserver';
import AppHeader from '../components/AppHeader';
import AppMomentSync from '../components/AppMomentSync';
import AppMomentViewer from '../components/AppMomentViewer';
import AppMomentViewerSidebar from '../components/AppMomentViewerSidebar';
import AppMomentDetails from '../components/AppMomentDetails';
import AppMomentListComments from '../components/AppMomentListComments';
import AppLaunchLoader from '../components/AppLaunchLoader';
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

  static observe ({ authenticationToken, accountUsername, momentDocuments, momentComments, playerStates, windowSize }) {
    return { authenticationToken, accountUsername, momentDocuments, momentComments, playerStates, windowSize };
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

  componentWillUpdate({ query: { id } }) {
    const { query: { id: prev }, dispatch } = this.props;
    if ( prev !== id ) {
      dispatch(momentReducerApi.retrieveMomentDocument(id));
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
      res.player.width = Math.ceil(res.player.width * .7);
      res.player.ratio = res.player.width / defaults.maxWidth;
      let h = Math.ceil(defaults.maxHeight * res.player.ratio);
      res.player.height = res.player.height > h
        ? h
        : res.player.height;
      res.player.mode = 'desktop';
    } else {
      let r = res.player.height / defaults.maxHeight;
      res.player.ratio = res.player.ratio > r
        ? r *= .7
        : res.player.ratio;
      res.player.height -= 87;
      res.player.mode = 'mobile';
    }

    if ( res.player.width > defaults.maxWidth ) res.player.width = defaults.maxWidth;
    if ( res.player.height > defaults.maxHeight ) res.player.height = defaults.maxHeight;
    if ( res.player.width > width ) res.player.width = width;
    if ( res.player.height > height ) res.player.height = height;

    return res;
  }

  render () {

    const { query: { id }, authenticationToken, accountUsername, momentDocuments, momentComments, playerStates } = this.props;
    const doc = momentDocuments[id];
    const player = playerStates[id];
    const comments = momentComments[id];

    const { err, path, name } = (doc || { });
    const { playerMoment: current, playerNextMoment, playerHasNext, playerPreviousMoment, playerIndex, playerNextIndex, playerPreviousIndex, playerHasPrevious, playerPulse, playerIsLive, playerMoments } = (player || { });

    const sizes = this.getSizes();
    const { player: { width } } = sizes;

    return <div>

      <style jsx>{`
        .container-error {
          padding-top: 47px;
        }
      `}</style>

      <Head>
        <title>{ name || 'There\'s nothing here, yet 🙌' }</title>
      </Head>

      <WindowObserver />
      <BackToTop id={id} />
      <AppHeader />

      <AppLaunchLoader loading={!doc && !err} sizes={sizes} />

      <AppLaunchSuccess success={doc && !err}>

        {/* moment websocket sync component */}
        <AppMomentSync
          id={id}
          path={path}
          pulse={playerPulse}
        />

        {/* moment viewer component */}
        <AppMomentViewer
          id={id}
          doc={doc}
          live={playerIsLive}
          pulse={playerPulse}
          moments={playerMoments}
          current={current}
          currentIndex={playerIndex}
          previous={playerPreviousMoment}
          previousIndex={playerPreviousIndex}
          next={playerNextMoment}
          nextIndex={playerNextIndex}
          hasNext={playerHasNext}
          hasPrevious={playerHasPrevious}
          onNext={this.handleNextMoment}
          onPrevious={this.handlePreviousMoment}
          sizes={sizes}
        >
          {/* desktop chat, only appear when live mode */}
          <If condition={width >= 800 && playerIsLive}>
            <AppMomentViewerSidebar>
              <AppMomentListComments id={id} comments={comments} user={accountUsername} authenticated={!!authenticationToken} />
            </AppMomentViewerSidebar>
          </If>
        </AppMomentViewer>

        {/* moment details */}
        <AppMomentDetails doc={doc} style={{ width, marginLeft: 'auto', marginRight: 'auto' }}>
          <AppMomentListComments id={id} comments={comments} user={accountUsername} authenticated={!!authenticationToken} />
        </AppMomentDetails>

      </AppLaunchSuccess>

      <AppLaunchFail failure={doc && err}>
        <div className="container container-error">
          <h1>Not Found</h1>
        </div>
      </AppLaunchFail>

    </div>
  }

}

export default withRedux(ViewMoment);

