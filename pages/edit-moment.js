
import 'isomorphic-fetch';

import React from 'react';
import Head from 'next/head';

import EditorSync from '../components/EditorSync';
import EditorHeader from '../components/EditorHeader';

import withRedux from '../storage';

class EditMoment extends React.Component {

  static async getInitialMoment ({ store, isServer }) {
    const { authenticationToken } = store.getState();
    const headers = isServer && { internal: 'TRUE', 'Access-Token': authenticationToken };
    try {
      const { err, doc } = await fetch(`${BACKEND_URL}/i/plot/${username}/${moment}`, {
        method      : 'get',
        credentials : 'include',
        headers,
      })
      .then(res => res.json())
      .then(doc => (doc.error ? { err: doc.error } : { doc }))
      .catch(err => ({ err }));
      return { doc, err };
    } catch (err) {
      return { err };
    }
  }

  static async getInitialProps ({ query: { username, moment }, store, isServer }) {
    const { doc, err } = await this.getInitialMoment({ store, isServer });
    return { username, moment, doc, err };
  }

  static observe (state) {
    return { authenticationToken: state.authenticationToken };
  }

  state = {
    connected : false,
    peers     : [ ],
    doc       : { ...this.props.doc },
  }

  componentDidMount() {
    const { doc } = this.state;
    // console.log(doc);
  }

  /**
   * shortcut function for emit message to websocket server
   */
  emit(message) { return this.sync && this.sync.emit(message); }

  /**
   * trigger when websocket is connected
   */
  onWebsocketOpen() { this.setState({ connected: true }); }

  /**
   * trigger when websocket is disconnected from server
   */
  onWebsocketClose() { this.setState({ connected: false }); }

  /**
   * trigger when websocket receive synchronous data
   */
  onSync() {
    console.log('sync');
  }

  /**
   * trigger when websocket receive updates from other users
   */
  onUpdate() {
    console.log('update');
  }

  onSignal({ peers: res }) {
    const peers = [ ...res ].sort((a, b) => a.initial > b.initial).slice(0, 5);
    return this.setState({ peers });
  }

  render () {
    const { username, moment } = this.props;
    const { peers } = this.state;
    return <div className="base">
      <Head>
        <title>Moment</title>
      </Head>
      <EditorSync
        ref={n => this.sync = n}
        username={username}
        moment={moment}
        onOpen={::this.onWebsocketOpen}
        onClose={::this.onWebsocketClose}
        onSync={::this.onSync}
        onUpdate={::this.onUpdate}
        onSignal={::this.onSignal}
      />
      <EditorHeader peers={peers} />
      <style jsx>{`
        .base {
          height: 100vh;
          width: 100vw;
          background-color: #F5F8F9;
        }
      `}</style>
    </div>
  }

}

export default withRedux(EditMoment);

