
import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Router from 'next/router';

import If from '../components/If';
import BackToTop from '../components/BackToTop';
import WindowObserver from '../components/WindowObserver';
import AppHeader from '../components/AppHeader';
import AppFooter from '../components/AppFooter';
import AppMomentSync from '../components/AppMomentSync';
import AppMomentViewer from '../components/AppMomentViewer';
import AppMomentViewerSidebar from '../components/AppMomentViewerSidebar';
import AppMomentDetails from '../components/AppMomentDetails';
import AppMomentLeaveComment from '../components/AppMomentLeaveComment';
import AppMomentListComments from '../components/AppMomentListComments';
import AppMomentChat from '../components/AppMomentChat';
import AppMomentChatCompose from '../components/AppMomentChatCompose';
import AppLaunchLoader from '../components/AppLaunchLoader';
import AppLaunchSuccess from '../components/AppLaunchSuccess';
import AppLaunchFail from '../components/AppLaunchFail';

import format from 'date-fns/format';

import { api as momentReducerApi } from '../reducers/moment';
import { api as playerReducerApi } from '../reducers/player';
import withRedux from '../storage';

class ViewMoment extends React.Component {

  static async getInitialProps ({ query: { username, id }, query, store, isServer, res }) {
    const { moment: { err } } = await store.dispatch(momentReducerApi.retrieveMomentDocument(id));
    if ( isServer && err ) {
      res.statusCode = 404;
    }
    return { err, query };
  }

  static observe ({ authenticationToken, accountUsername, serverHostname, momentDocuments, momentComments, playerStates, windowSize, chat }) {
    return { authenticationToken, accountUsername, serverHostname, momentDocuments, momentComments, playerStates, windowSize, chat };
  }

  state = {
    notFound: false,
  }

  componentWillMount() {

    const { query: { username, id }, momentDocuments } = this.props;
    if ( !momentDocuments[id] || ( momentDocuments[id] && momentDocuments[id].err ) ) return;

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

  handleNextMoment = (e, automation) => {
    const { dispatch, query: { id } } = this.props;
    dispatch(playerReducerApi.next(id, automation));
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

    const { query: { id }, authenticationToken, accountUsername, serverHostname, momentDocuments, momentComments, playerStates, chat } = this.props;
    const doc = momentDocuments[id];
    const player = playerStates[id];
    const comments = momentComments[id];
    const messages = chat[id];

    const { err, path, name, background, author, created_at } = (doc || { });
    const { username, name: fullname } = (author || { });
    const { playerMoment: current, playerNextMoment, playerHasNext, playerPreviousMoment, playerIndex, playerNextIndex, playerPreviousIndex, playerHasPrevious, playerPulse, playerIsLive, playerLiveInterrupted, playerMoments } = (player || { });

    const sizes = this.getSizes();
    const { player: { width, height } } = sizes;

    return <div>

      <style jsx>{`
        .container-error {
          padding-top: 47px;
        }
      `}</style>

      <WindowObserver />
      <BackToTop id={id} />
      <AppHeader />

      <AppLaunchLoader loading={!doc && !err} sizes={sizes} />

      <AppLaunchSuccess success={doc && !err}>

        <Head>

          <title>{ name || 'There\'s nothing here, yet 🙌' }</title>

          <meta name="distribution" content="Global" />
          <meta name="rating" content="general" />
          <meta name="robots" content="index, follow" />

          <If condition={!!doc}><meta name="creator" content={username} /></If>
          <If condition={!!doc}><meta name="publisher" content={username} /></If>

          {/* twitter metatags */}
          <If condition={!!doc}><meta name="twitter:card" content="summary_large_image" /></If>
          <If condition={!!doc}><meta name="twitter:site" content="@vaniilacom" /></If>
          <If condition={!!doc}><meta name="twitter:creator" content="@vaniilacom" /></If>
          <If condition={!!doc}><meta name="twitter:title" content={name || 'There\'s nothing here, yet 🙌'} /></If>
          <If condition={!!doc}><meta name="twitter:description" content={`Published on ${format(new Date(created_at), "MMMM D, YYYY")} by ${fullname || `@${username}`}`} /></If>
          <If condition={!!doc && !!background}><meta name="twitter:image:alt" content={`Published on ${format(new Date(created_at), "MMMM D, YYYY")} by ${fullname || `@${username}`}`} /></If>
          <If condition={!!doc && !!background}><meta name="twitter:image" content={`https://cdn-images.vaniila.com/${background}/embed`} /></If>
          <If condition={!!doc}><meta name="twitter:player" content={`https://${serverHostname}/${path}`} /></If>

          {/* google, facebook metatags */}
          <If condition={!!doc}><meta name="og:url" content={`https://${serverHostname}/${path}`} /></If>
          <If condition={!!doc && !!background}><meta name="og:image" content={`https://cdn-images.vaniila.com/${background}/embed`} /></If>
          <If condition={!!doc && !!background}><meta name="og:image:secure_url" content={`https://cdn-images.vaniila.com/${background}/embed`} /></If>
          <If condition={!!doc}><meta name="og:type" content="article" /></If>
          <If condition={!!doc}><meta name="og:title" content={name || 'There\'s nothing here, yet 🙌'} /></If>
          <If condition={!!doc}><meta name="og:headline" content={name || 'There\'s nothing here, yet 🙌'} /></If>
          <If condition={!!doc}><meta name="og:description" content={`Published on ${format(new Date(created_at), "MMMM D, YYYY")} by ${fullname || `@${username}`}`} /></If>
          <If condition={!!doc}><meta name="og:locale" content="en_US" /></If>
          <If condition={!!doc}><meta name="og:site_name" content="vaniila.com" /></If>

          {/* og article metatags */}
          <If condition={!!doc}><meta name="article:author" content={username} /></If>
          <If condition={!!doc}><meta name="article:published_time" content={created_at} /></If>

        </Head>

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
          hasInterrupted={playerLiveInterrupted}
          hasNext={playerHasNext}
          hasPrevious={playerHasPrevious}
          onNext={this.handleNextMoment}
          onPrevious={this.handlePreviousMoment}
          sizes={sizes}
        >
          {/* desktop chat, only appear when live mode */}
          <If condition={width >= 800 && playerIsLive}>
            <AppMomentViewerSidebar height={height}>
              <AppMomentChat id={id} messages={messages} />
              <AppMomentChatCompose id={id} />
            </AppMomentViewerSidebar>
          </If>
        </AppMomentViewer>

        {/* moment details */}
        <AppMomentDetails doc={doc} style={{ width, marginLeft: 'auto', marginRight: 'auto' }}>
          <AppMomentListComments id={id} comments={comments} user={accountUsername} authenticated={!!authenticationToken} />
        </AppMomentDetails>

      </AppLaunchSuccess>

      <AppLaunchFail failure={doc && err}>

        <Head>

          <title>There\'s nothing here, yet 🙌</title>

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

export default withRedux(ViewMoment);

