
import React from 'react';
import PropTypes from 'prop-types';
import Sphere from './sphere';

export default class AppSync extends React.Component {

  static contextTypes = {
    store: PropTypes.object,
  }

  static propTypes = {
    onWebsocketOpen           : PropTypes.func,
    onWebsocketClose          : PropTypes.func,
    onWebsocketMessage        : PropTypes.func,
    onWebsocketSubscribe      : PropTypes.func,
    onWebsocketUnsubscribe    : PropTypes.func,
    onWebsocketChannelMessage : PropTypes.func,
    channels                  : PropTypes.arrayOf(PropTypes.string),
  }

  static defaultProps = {
    onWebsocketOpen           : _ => null,
    onWebsocketClose          : _ => null,
    onWebsocketMessage        : m => null,
    onWebsocketSubscribe      : (type, name, packet) => null,
    onWebsocketUnsubscribe    : (type, name) => null,
    onWebsocketChannelMessage : (type, name, message) => null,
    channels                  : [ ],
  }

  componentDidMount() {
    this.appSyncBind();
    this.appSyncCreate();
    this.appSyncAddListener();
  }

  componentWillUnmount() {
    this.appSyncRemoveListener();
  }

  componentDidUpdate(prevProps, prevState) {
    const { store } = this.context;
    const { authenticationToken } = store.getState();
    const unsubscribeChannels = [ ];
    const subscribeChannels = [ ];
    const { channels: nextChannels, onWebsocketSubscribe } = this.props;
    const { channels: prevChannels } = prevProps;
    const channels = this.channels();
    for ( const channel of prevChannels ) {
      if ( nextChannels.indexOf(channel) === -1 && channels.indexOf(channel) === -1 ) {
        unsubscribeChannels.push(channel);
      }
    }
    for ( const channel of nextChannels ) {
      if ( prevChannels.indexOf(channel) === -1 && channels.indexOf(channel) === -1 ) {
        subscribeChannels.push(channel);
      }
    }
    for ( const channel of [...new Set(unsubscribeChannels)] ) {
      const [ type, name ] = channel.split(':');
      this.websocket.unsubscribe(type, name, _ => this.appSyncUnsubscribe(type, name));
    }
    for ( const channel of [...new Set(subscribeChannels)] ) {
      const [ type, name ] = channel.split(':');
      this.websocket.subscribe(type, name, authenticationToken, packet => this.appSyncSubscribe(type, name, packet));
    }
  }

  appSyncBind() {
    this.appSyncOpen = this.appSyncOpen.bind(this);
    this.appSyncClose = this.appSyncClose.bind(this);
    this.appSyncMessage = this.appSyncMessage.bind(this);
    this.appSyncSubscribe = this.appSyncSubscribe.bind(this);
    this.appSyncUnsubscribe = this.appSyncUnsubscribe.bind(this);
    this.appSyncChannelMessage = this.appSyncChannelMessage.bind(this);
  }

  appSyncCreate() {
    if ( typeof location === 'undefined' ) return;
    const { store } = this.context;
    const { authenticationToken } = store.getState();
    const protocol = location.protocol === 'https:'
      ? 'wss'
      : 'ws';
    this.websocket = new Sphere(`${protocol}://${BACKEND_HOST}/sync`, { accesskey: authenticationToken });
  }

  appSyncAddListener() {
    this.websocket.on('open', this.appSyncOpen);
    this.websocket.on('close', this.appSyncClose);
    this.websocket.on('message', this.appSyncMessage);
  }

  appSyncRemoveListener() {
    this.websocket.channels().forEach(channel => channel.removeEvent('message'));
    this.websocket.removeEvent('open');
    this.websocket.removeEvent('close');
    this.websocket.removeEvent('message');
  }

  appSyncOpen() {
    const { onWebsocketOpen } = this.props;
    return onWebsocketOpen();
  }

  appSyncClose() {
    const { onWebsocketClose } = this.props;
    return onWebsocketClose();
  }

  appSyncMessage(message) {
    const { onWebsocketMessage } = this.props;
    return onWebsocketMessage(message);
  }

  appSyncSubscribe(type, name, packet) {
    const { onWebsocketSubscribe } = this.props;
    const channel = this.websocket.channel(type, name);
    channel.removeEvent('message');
    channel.on('message', message => this.appSyncChannelMessage(type, name, message));
    return onWebsocketSubscribe(type, name, packet);
  }

  appSyncUnsubscribe(type, name) {
    const { onWebsocketUnsubscribe } = this.props;
    const channel = this.websocket.channel(type, name)
    channel.removeEvent('message');
    return onWebsocketUnsubscribe(type, name);
  }

  appSyncChannelMessage(type, name, message) {
    const { onWebsocketChannelMessage } = this.props;
    return onWebsocketChannelMessage(type, name, message);
  }

  channel(type, name) {
    return this.websocket.channel(type, name);
  }

  channels() {
    return this.websocket.channels().map( ({ attributes: { namespace, room } }) => `${namespace}:${room}`);
  }

  render() {
    return null;
  }

}

