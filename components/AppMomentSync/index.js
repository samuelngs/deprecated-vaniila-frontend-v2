
import React from 'react';
import PropTypes from 'prop-types';
import UUID from 'uuid';

import AppSync from '../AppSync';
import deepClone from '../../utils/clone';
import { api as PlayerApi } from '../../reducers/player';

export default class AppMomentSync extends React.PureComponent {

  static contextTypes = {
    store: PropTypes.object,
  }

  static propTypes = {
    id          : PropTypes.string,
    path        : PropTypes.string,
    pulse       : PropTypes.bool,
    onPulseStart: PropTypes.func,
    onPulseStop : PropTypes.func,
  }

  static defaultProps = {
    id          : '',
    path        : '',
    pulse       : false,
    onPulseStart: e => null,
    onPulseStop : e => null,
  }

  static TYPE = 'moment-sync'
  static OPEN = 'open'
  static CLOSED = 'closed'

  state = {
    id    : UUID.v4(),
    state : AppMomentSync.CLOSED,
  }

  onWebsocketOpen() {
    this.setState({ state: AppMomentSync.OPEN });
  }

  onWebsocketClose() {
    this.setState({ state: AppMomentSync.CLOSED });
  }

  onWebsocketMessage() {
  }

  onWebsocketSubscribe() {
  }

  onWebsocketUnsubscribe() {
  }

  onWebsocketChannelMessage(type, name, message) {
    if ( !message.attributes.message ) return;
    if ( !message.attributes.message.data || !message.attributes.message.event ) return;
    const data = JSON.parse(message.attributes.message.data);
    switch ( message.attributes.message.event ) {
      case 'updating':
        return this.onAppPulseChange(type, name, data);
      case 'started':
        return this.onAppLiveStart(type, name, data);
      case 'ended':
        return this.onAppLiveEnd(type, name, data);
    }
  }

  onAppLiveStart(type, name, data) {
    const { store } = this.context;
    const { id } = this.props;
    store.dispatch(PlayerApi.setPlayerState(id, { live: true }));
  }

  onAppLiveEnd(type, name, data) {
    const { store } = this.context;
    const { id } = this.props;
    store.dispatch(PlayerApi.setPlayerState(id, { live: false }));
  }

  onAppPulseChange(type, name, data) {
    const { store } = this.context;
    const { id, pulse } = this.props;
    if ( !pulse ) {
      store.dispatch(PlayerApi.setPlayerState(id, { pulse: true }));
    }
    this.$$_pulse_timeout_$$ && window.clearTimeout(this.$$_pulse_timeout_$$);
    this.$$_pulse_timeout_$$ = window.setTimeout(e => {
      this.$$_pulse_timeout_$$ = null;
      store.dispatch(PlayerApi.setPlayerState(id, { pulse: false }));
    }, 3000);
  }

  render() {
    const { path } = this.props;
    const { state } = this.state;
    const channels = (state === AppMomentSync.OPEN && path)
      ? [ `${AppMomentSync.TYPE}:${path}` ]
      : [ ];
    return <AppSync
      ref={n => this.websocket = n}
      onWebsocketOpen={::this.onWebsocketOpen}
      onWebsocketClose={::this.onWebsocketClose}
      onWebsocketMessage={::this.onWebsocketMessage}
      onWebsocketSubscribe={::this.onWebsocketSubscribe}
      onWebsocketUnsubscribe={::this.onWebsocketUnsubscribe}
      onWebsocketChannelMessage={::this.onWebsocketChannelMessage}
      channels={channels}
    />
  }

}

