
import React from 'react';
import PropTypes from 'prop-types';

import AppLaunchSuccess from '../AppLaunchSuccess';
import AppLaunchFail from '../AppLaunchFail';
import AppMomentSync from '../AppMomentSync';
import AppMomentViewer from '../AppMomentViewer';

import { api as momentReducerApi } from '../../reducers/moment';
import { api as playerReducerApi } from '../../reducers/player';

export default class AppModalViewMoment extends React.Component {

  static contextTypes = {
    store: PropTypes.object,
  }

  static propTypes = {
    id              : PropTypes.string,
    path            : PropTypes.string,
    windowSize      : PropTypes.object,
    momentDocuments : PropTypes.object,
    playerStates    : PropTypes.object,
  }

  static defaultProps = {
    id              : '',
    path            : '',
    windowSize      : { },
    momentDocuments : { },
    playerStates    : { },
  }

  componentDidMount() {
    const { id } = this.props;
    const { store } = this.context;
    store.dispatch(momentReducerApi.retrieveMomentDocument(id));
  }

  handleNextMoment = e => {
    const { store: { dispatch } } = this.context;
    const { id } = this.props;
    dispatch(playerReducerApi.next(id));
  }

  handlePreviousMoment = e => {
    const { store: { dispatch } } = this.context;
    const { id } = this.props;
    dispatch(playerReducerApi.previous(id));
  }

  getSizes() {

    const { windowSize: { width: ww, height: wh } } = this.props;

    const defaults = {
      maxWidth: 800,
      maxHeight: 600,
    };

    let width = ww - 100;
    let height = wh - 100;

    if ( width > defaults.maxWidth ) width = defaults.maxWidth;
    if ( height > defaults.maxHeight ) height = defaults.maxHeight;

    const res = {
      screen: { width, height },
      player: { width, height, ratio: 1, mode: 'desktop' },
    };

    if ( res.player.width >= defaults.maxHeight ) {
      res.player.width = Math.ceil(res.player.width);
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

  render() {

    const { id, momentDocuments, playerStates } = this.props;
    const sizes = this.getSizes();
    const { screen: { width, height } } = sizes;

    const doc = momentDocuments[id];
    const player = playerStates[id];

    const { path, name } = (doc || { });
    const { playerMoment: current, playerNextMoment, playerHasNext, playerPreviousMoment, playerHasPrevious, playerPulse, playerIsLive } = (player || { });

    return <div className="modal-container" style={{ width, height }}>
      <style jsx>{`
        .modal-container {
          display: flex;
          align-items: center;
          justify-content: center;
          max-width: 100%;
          max-height: 100%;
          background-color: #fff;
          border-radius: 3px;
          overflow: hidden;
        }
      `}</style>
      <AppLaunchSuccess success={doc}>
        <AppMomentSync
          id={id}
          path={path}
          pulse={playerPulse}
        />
        <AppMomentViewer
          id={id}
          doc={doc}
          modal={true}
          live={playerIsLive}
          pulse={playerPulse}
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
    </div>
  }

}
