
const CLOSED = 'closed';
const CONNECTING = 'connecting';
const OPEN = 'open';
const AUTHENTICATED = 'authenticated';
const PENDING = 'pending';
const UNAUTHENTICATED = 'unauthenticated';

const defaults = {
  state       : CLOSED,
  activeSubs  : [],
  pendingSubs : [],
  messages    : [],
};

export const events = {
  WebsocketOpen       : '@@websocket/CONNECTION_OPEN',
  WebsocketClose      : '@@websocket/CONNECTION_CLOSE',
  WebsocketMessage    : '@@websocket/CONNECTION_MESSAGE',
  WebsocketSubscribe  : '@@websocket/CHANNEL_SUBSCRIBE',
  WebSocketUnsubscribe: '@@websocket/CHANNEL_UNSUBSCRIBE',
}

export const actions = {
  SetWebsocketOpen    : 'set_websocket_open',
  SetWebsocketClose   : 'set_websocket_close',
  SubscribeChannel    : 'subscribe_channel',
  UnsubscribeChannel  : 'unsubscribe_channel',
};
