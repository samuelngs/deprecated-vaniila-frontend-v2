
import React from 'react';
import PropTypes from 'prop-types';
import UUID from 'uuid';

import AppSync from '../AppSync';
import deepClone from '../../utils/clone';
import { api as Api } from '../../reducers/histories';

export default class EditorSync extends React.Component {

  static contextTypes = {
    store: PropTypes.object,
  }

  static propTypes = {
    username      : PropTypes.string,
    moment        : PropTypes.string,
    onOpen        : PropTypes.func,
    onClose       : PropTypes.func,
    onSubscribe   : PropTypes.func,
    onUnsubscribe : PropTypes.func,
    onSync        : PropTypes.func,
    onSignal      : PropTypes.func,
  }

  static defaultProps = {
    username      : '',
    moment        : '',
    onOpen        : _ => null,
    onClose       : _ => null,
    onSubscribe   : ({ type, name }) => null,
    onUnsubscribe : ({ type, name }) => null,
    onSync        : ({ type, name, data }) => null,
    onSignal      : ({ type, name, user, peers }) => null,
  }

  static TYPE = 'editor-sync'
  static OPEN = 'open'
  static CLOSED = 'closed'

  state = {
    id        : UUID.v4(),
    state     : EditorSync.CLOSED,
    messages  : [ ],
    peers     : [ ],
    background: false,
    flushLock : false,
  }

  componentDidMount() {
    this.bind();
    this.auto();
    this.addEventListener();
    this.interval = setInterval(this.auto, 5000);
  }

  componentWillUnmount() {
    this.removeEventListener();
    clearInterval(this.interval);
  }

  componentDidUpdate(prevProps, prevState) {
    const { state: nextWsState, messages } = this.state;
    const { state: prevWsState } = prevState;
    if ( nextWsState != prevWsState && nextWsState === EditorSync.OPEN && messages.length > 0 ) {
      this.flush(messages);
    }
  }

  pageVisibilityApi() {
    if ( this.visibilitySupport ) {
      return this.visibilitySupport;
    }
    if ( typeof document !== 'undefined' ) {
      if ( typeof document.hidden !== 'undefined' ) {
        return this.visibilitySupport = { hidden: 'hidden', event: 'visibilitychange' };
      } else if ( typeof document.msHidden !== 'undefined' ) {
        return this.visibilitySupport = { hidden: 'msHidden', event: 'msvisibilitychange' };
      } else if ( typeof document.webkitHidden !== 'undefined' ) {
        return this.visibilitySupport = { hidden: 'webkitHidden', event: 'webkitvisibilitychange' };
      }
    }
    return this.visibilitySupport = { unsupported: true };
  }

  /**
   * add event listener to component
   */
  addEventListener() {
    const { unsupported, event } = this.pageVisibilityApi();
    if ( unsupported ) {
      if ( typeof window === 'undefined' ) return;
      window.addEventListener('focus', this.onWindowFocus);
      window.addEventListener('blur', this.onWindowBlur);
    } else {
      if ( typeof document === 'undefined' ) return;
      document.addEventListener(event, this.onVisibilityChange);
    }
  }

  /**
   * remove event listener from component
   */
  removeEventListener() {
    const { unsupported, event } = this.pageVisibilityApi();
    if ( unsupported ) {
      if ( typeof window === 'undefined' ) return;
      window.removeEventListener('focus', this.onWindowFocus);
      window.removeEventListener('blur', this.onWindowBlur);
    } else {
      if ( typeof document === 'undefined' ) return;
      document.removeEventListener(event, this.onVisibilityChange);
    }
  }

  /**
   * bind function scope to class
   */
  bind() {
    this.emit = this.emit.bind(this);
    this.auto = this.auto.bind(this);
    this.onWindowFocus = this.onWindowFocus.bind(this);
    this.onWindowBlur = this.onWindowBlur.bind(this);
    this.onVisibilityChange = this.onVisibilityChange.bind(this);
  }

  /**
   * interval functions for websocket, for example: sending online signal to server, receive document updates
   */
  auto() {
    // flush pending messages if there is any
    const { messages } = this.state;
    this.latest();
    this.signal();
    this.flush(messages);
  }

  /**
   * emit synchronous request to server
   */
  latest() {
    const { username, moment: plotname } = this.props;
    this.emit({ action: 'sync', username, plotname }, false);
  }

  /**
   * emit signal to server so that other users know that you are currently online
   */
  signal() {
    const { store } = this.context;
    const { accountUsername, accountFullname, accountAvatar } = store.getState();
    const { id, background } = this.state;
    const { username, moment: plotname } = this.props;
    const { platform = 'Device' } = typeof navigator === 'object' ? navigator : { };
    const accountFullnameParts = accountFullname.split(' ');
    this.emit({
      action: 'signal',
      username,
      plotname,
      platform,
      id,
      background,
      avatar    : accountAvatar,
      identity  : accountUsername,
      fullname  : accountFullname,
      shortname : accountFullnameParts.length >= 2
        ? ( `${accountFullnameParts[0].substring(0, 1)}${accountFullnameParts[1].substring(0, 1)}` ).toUpperCase()
        : ( accountUsername.substring(0, 2) ).toUpperCase(),
    }, false);
  }

  /**
   * function to emit message to server
   */
  emit(payload, retry = true) {
    const { id } = this.state;
    const message = payload && payload.action === 'update' ? { } : { _sid: id };
    deepClone(message, payload);
    return new Promise((resolve, reject) => {
      const { messages, state } = this.state;
      if ( !this.websocket || state === EditorSync.CLOSED ) {
        return this.setState({ messages: (retry ? [ ...messages, message ] : messages) }, _ => {
          if ( retry ) {
            return reject(`websocket is not ready, message will be delievered when it is ready`);
          }
          return resolve();
        });
      }
      const channels = this.websocket.channels();
      if ( channels.length === 0 ) {
        return this.setState({ messages: (retry ? [ ...messages, message ] : messages) }, _ => {
          if ( retry ) {
            return reject(`channel is not ready, message will be delievered when it is ready`);
          }
          return resolve();
        });
      }
      if ( typeof message !== 'object' || message === null ) {
        return resolve();
      }
      const { username, moment } = this.props;
      const { action } = message;
      if ( typeof action !== 'string' || ( typeof action === 'string' && action.trim().length === 0 ) ) {
        return resolve();
      }
      return this.websocket.channel(EditorSync.TYPE, `${username}/${moment}`).send(action, JSON.stringify(message), _ => resolve(message));
    });
  }

  /**
   * flush pending messages if there is any
   */
  flush(messages) {
    const { flushLock } = this.state;
    const { username, moment } = this.props;
    if ( flushLock || !this.websocket ) {
      return false;
    }
    this.setState({ flushLock: true }, _ => {
      const promises = messages.map(message => new Promise(resolve => {
        const channels = this.websocket.channels();
        if ( channels.length === 0 ) {
          return resolve(message);
        }
        if ( typeof message !== 'object' || message === null ) {
          return resolve();
        }
        const { action } = message;
        if ( typeof action !== 'string' || ( typeof action === 'string' && action.trim().length === 0 ) ) {
          return resolve();
        }
        const { username, moment } = this.props;
        this.websocket.channel(EditorSync.TYPE, `${username}/${moment}`).send(action, JSON.stringify(message));
        return resolve();
      }));
      Promise.all(promises).then(pending => {
        const messages = pending.filter(m => m);
        return this.setState({ messages, flushLock: false });
      });
    });
  }

  /**
   * trigger when window is focused (browser tab is active)
   */
  onWindowFocus() {
    return this.setState({ background: false });
  }

  /**
   * trigger when window is unfocused (browser tab is inactive)
   */
  onWindowBlur() {
    return this.setState({ background: true });
  }

  /**
   * trigger when page visibility state changed
   */
  onVisibilityChange() {
    const { hidden } = this.pageVisibilityApi();
    setImmediate(_ => this.setState({ background: document[hidden] }));
  }

  /**
   * trigger when websocket connection is established
   */
  onWebsocketOpen() {
    const { onOpen } = this.props;
    this.setState({ state: EditorSync.OPEN }, onOpen);
  }

  /**
   * trigger when websocket connection is disconnected
   */
  onWebsocketClose() {
    const { onClose } = this.props;
    this.setState({ state: EditorSync.CLOSED }, onClose);
  }

  /**
   * trigger after channel subscription event, if error exists, the subscription fails
   */
  onWebsocketSubscribe(type, name, packet) {
    const { onSubscribe } = this.props;
    const channels = this.websocket.channels();
    const { attributes: { error } } = packet;
    return onSubscribe({ type, name, error, channels });
  }

  /**
   * trigger after channel unsubscription event
   */
  onWebsocketUnsubscribe(type, name) {
    const { onUnsubscribe } = this.props;
    const channels = this.websocket.channels();
    const { attributes: { error } } = packet;
    return onUnsubscribe({ type, name, error, channels });
  }

  /**
   * trigger when websocket client receives message from websocket server
   */
  onWebsocketMessage(message) { }

  /**
   * trigger when channel receives message
   */
  onWebsocketChannelMessage(type, name, message) {
    if ( !message.attributes.message ) return;
    if ( !message.attributes.message.data || !message.attributes.message.event ) return;
    const { id } = this.state;
    const data = JSON.parse(message.attributes.message.data);
    switch ( message.attributes.message.event ) {
      case 'sync':
        if ( !data.id ) return;
        // debounce repeated message
        clearImmediate(this.editorSyncImmediate);
        return this.editorSyncImmediate = setImmediate(_ => this.onEditorSync(type, name, data));
      case 'change':
        if ( data._sid === id ) return;
        if ( !data.changes ) return;
        return this.onEditorChange(type, name, data);
      case 'update':
        if ( !data.elements || !data.slidekey ) return;
        return this.onEditorUpdate(type, name, data);
      case 'signal':
        if ( !data.id ) return;
        return this.onEditorSignal(type, name, data);
    }
  }

  /**
   * trigger when the receive message is a synchronous response
   */
  onEditorSync(type, name, data) {
    const { store } = this.context;
    const { onSync } = this.props;
    store.dispatch(Api.replaceState(name, data, true)).then(
      data => onSync({ type, name, data }),
    );
  }

  /**
   * trigger when websocket receive peer to peer changes
   */
  onEditorChange(type, name, data) {
    const { store } = this.context;
    const { changes } = data;
    store.dispatch(Api.patchState(name, changes));
  }

  /**
   * trigger when the receive message is a update response
   */
  onEditorUpdate(type, name, data) {
    console.log('on update', type, name, data);
  }

  /**
   * trigger when the receive message is a signal response
   */
  onEditorSignal(type, name, data) {

    const { onSignal } = this.props;
    const { peers: prevPeers } = this.state;

    const peers = [ ];
    const now = Date.now();

    const { action, username, plotname, ...details } = data;
    const user = { ...details, when: now, initial: now };

    let added = false;
    for ( const peer of prevPeers ) {
      if ( peer.id === user.id ) {
        peers.push({ ...user, initial: peer.initial });
        added = true;
      } else {
        const { when } = peer;
        if ( typeof when !== 'number' ) {
          continue;
        }
        const expired = ( now - when ) / 1000.0;
        if ( expired > 10.0 ) {
          continue;
        }
        peers.push(peer);
      }
    }
    if ( !added ) {
      peers.push(user);
    }

    return this.setState({ peers }, _ => onSignal({ type, name, user, peers }));
  }

  render() {
    const { username, moment } = this.props;
    const { state } = this.state;
    const channels = (state === EditorSync.OPEN && username && moment)
      ? [ `${EditorSync.TYPE}:${username}/${moment}` ]
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
