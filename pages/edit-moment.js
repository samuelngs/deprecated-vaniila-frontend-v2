
import 'isomorphic-fetch';

import React from 'react';
import Head from 'next/head';

import EditorSync from '../components/EditorSync';
import EditorHeader from '../components/EditorHeader';
import EditorLaunchFail from '../components/EditorLaunchFail';
import EditorLaunchSuccess from '../components/EditorLaunchSuccess';

import { api as accountReducerApi } from '../reducers/account';
import { api as momentReducerApi } from '../reducers/moment';
import withRedux from '../storage';

class EditMoment extends React.Component {

  static async getInitialProps ({ query: { username, moment }, store, isServer }) {
    const id = `${username}/${moment}`;
    const { err, ...doc } = await store.dispatch(momentReducerApi.retrieveMomentDocument(id));
    return { id, username, moment, err };
  }

  static observe ({ authenticationToken, momentDocuments }) {
    return { authenticationToken, momentDocuments };
  }

  state = {
    connected : false,
    peers     : [ ],
    err       : this.props.err,
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
    const peers = [ ...res ]
      .sort((a, b) => a.initial > b.initial)
      .slice(0, 5);
    return this.setState({ peers });
  }

  async onRetry() {
    const { id, dispatch } = this.props;
    {
      const err = await dispatch(accountReducerApi.retrieveMyAccount());
      if ( err ) return this.setState({ err });
    }
    {
      const { err } = await dispatch(momentReducerApi.retrieveMomentDocument(id));
      if ( err ) return this.setState({ err });
    }
    return this.setState({ err: null });
  }

  componentDidMount() {
    console.log('documents', this.props.momentDocuments);
  }

  render () {
    const { username, moment } = this.props;
    const { err, doc, peers } = this.state;
    return <div>
      <style jsx>{`div { height: 100vh; width: 100vw; background-color: #F5F8F9; }`}</style>
      <Head>
        <title>Moment</title>
      </Head>
      <EditorLaunchFail err={err} retry={::this.onRetry} />
      <EditorLaunchSuccess err={err}>
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
        <EditorHeader doc={doc} peers={peers} />
      </EditorLaunchSuccess>
    </div>
  }

}

export default withRedux(EditMoment);

