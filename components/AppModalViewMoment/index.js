
import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';

import If from '../If';
import AfterEvent from '../AfterEvent';
import AppLaunchLoader from '../AppLaunchLoader';
import AppLaunchSuccess from '../AppLaunchSuccess';
import AppLaunchFail from '../AppLaunchFail';
import AppMomentSync from '../AppMomentSync';
import AppMomentViewer from '../AppMomentViewer';
import AppMomentDetails from '../AppMomentDetails';
import AppMomentStats from '../AppMomentStats';
import AppMomentListComments from '../AppMomentListComments';
import AppMomentLoginComment from '../AppMomentLoginComment';
import AppMomentLeaveComment from '../AppMomentLeaveComment';
import AppMomentChat from '../AppMomentChat';
import AppMomentChatCompose from '../AppMomentChatCompose';

import { api as momentReducerApi } from '../../reducers/moment';
import { api as playerReducerApi } from '../../reducers/player';

export default class AppModalViewMoment extends React.Component {

  static contextTypes = {
    store: PropTypes.object,
  }

  static propTypes = {
    id                  : PropTypes.string,
    path                : PropTypes.string,
    windowSize          : PropTypes.object,
    authenticationToken : PropTypes.string,
    accountUsername     : PropTypes.string,
    momentComments      : PropTypes.object,
    momentDocuments     : PropTypes.object,
    playerStates        : PropTypes.object,
    chat                : PropTypes.object,
  }

  static defaultProps = {
    id                  : '',
    path                : '',
    windowSize          : { },
    authenticationToken : '',
    accountUsername     : '',
    momentComments      : { },
    momentDocuments     : { },
    playerStates        : { },
    chat                : { },
  }

  state = {
    fetching: true,
  }

  handleFetchMoment = e => {
    const { id } = this.props;
    const { store } = this.context;
    return new Promise(resolve => {
      this.setState(state => !state.fetching && { fetching: true }, _ => {
        store.dispatch(momentReducerApi.retrieveMomentDocument(id)).then(resolve);
      });
    });
  }

  handleFetchMomentComplete = o => {
    this.setState(state => state.fetching && { fetching: false });
  }

  handleNextMoment = (e, automation) => {
    const { store: { dispatch } } = this.context;
    const { id } = this.props;
    dispatch(playerReducerApi.next(id, automation));
  }

  handlePreviousMoment = e => {
    const { store: { dispatch } } = this.context;
    const { id } = this.props;
    dispatch(playerReducerApi.previous(id));
  }

  handlerToMoment = (e, moment) => {
    const { store: { dispatch } } = this.context;
    const { id } = this.props;
    dispatch(playerReducerApi.to(id, moment));
  }

  getSizes() {

    const { windowSize: { width: ww, height: wh } } = this.props;

    const defaults = {
      maxWidth: 600,
      maxHeight: 600,
      sidebarWidth: 330,
    };

    let width = ww - 100;
    let height = wh - 100;

    if ( width > defaults.maxWidth ) width = defaults.maxWidth;
    if ( height > defaults.maxHeight ) height = defaults.maxHeight;

    const res = {
      screen    : { width, height },
      player    : { width, height, ratio: 1, mode: 'desktop' },
      container : { width: width + defaults.sidebarWidth, height },
    };

    if ( res.player.width >= defaults.maxHeight ) {
      res.player.width = Math.ceil(res.player.width);
      res.player.ratio = res.player.width / defaults.maxWidth;
      let h = Math.ceil(defaults.maxHeight * res.player.ratio);
      res.player.height = res.player.height > h
        ? h
        : res.player.height;
      res.player.mode = 'desktop';
      res.player.ratio *= 0.7;
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

  render() {

    const { fetching } = this.state;
    const { id, authenticationToken, accountUsername, momentDocuments, momentComments, playerStates, chat } = this.props;
    const sizes = this.getSizes();
    const { container: { width }, screen: { height } } = sizes;

    const doc = momentDocuments[id];
    const player = playerStates[id];
    const comments = momentComments[id];
    const messages = chat[id];

    const { err, path, name, impressions, likes, liked, permissions } = (doc || { });
    const { write, admin } = (permissions || { });

    const { playerMoment: current, playerNextMoment, playerHasNext, playerPreviousMoment, playerIndex, playerNextIndex, playerPreviousIndex, playerHasPrevious, playerPulse, playerIsLive, playerMoments, playerLiveInterrupted } = (player || { });

    return <div className="modal-container" style={{ width, height }}>
      <style jsx>{`
        .modal-container {
          display: flex;
          align-items: center;
          max-width: 100%;
          max-height: 100%;
          background-color: #fff;
          border-radius: 3px;
          overflow: hidden;
          z-index: 2;
          position: relative;
          transform: translateZ(0);
        }
      `}</style>

      {/* attach fetch comments event */}
      <AfterEvent id={id} run={this.handleFetchMoment} then={this.handleFetchMomentComplete} />

      <AppLaunchSuccess modal={true} success={!fetching && doc && !err}>
        <Head>
          <title>Vaniila • { name || 'There\'s nothing here, yet 🙌' }</title>
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
          modal={true}
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
          onTo={this.handlerToMoment}
          sizes={sizes}
        />

        <AppMomentDetails modal={true} doc={doc} style={{ flex: 1, height, maxHeight: height }}>

          {/* stats component */}
          <AppMomentStats id={id} impressions={impressions} likes={likes} liked={liked} authenticated={!!authenticationToken} />

          {/* list users comments component */}
          <If condition={!playerIsLive}>
            <AppMomentListComments id={id} modal={true} comments={comments} user={accountUsername} authenticated={!!authenticationToken} />
          </If>

          {/* leave comment component */}
          <If condition={!playerIsLive && !!authenticationToken}>
            <AppMomentLeaveComment id={id} />
          </If>

          {/* sign in comment component */}
          <If condition={!playerIsLive && !authenticationToken}>
            <AppMomentLoginComment id={id} />
          </If>

          {/* list users chat component */}
          <If condition={playerIsLive}>
            <AppMomentChat id={id} modal={true} messages={messages} />
          </If>

          {/* chat component */}
          <If condition={playerIsLive}>
            <AppMomentChatCompose id={id} />
          </If>

        </AppMomentDetails>
      </AppLaunchSuccess>

      <AppLaunchFail failure={!fetching && doc && err}>
        { err }
      </AppLaunchFail>

    </div>
  }

}
