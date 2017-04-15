
import 'isomorphic-fetch';

import React from 'react';
import Head from 'next/head';

import UUID from 'uuid';

import WindowObserver from '../components/WindowObserver';
import EditorSync from '../components/EditorSync';
import EditorHeader from '../components/EditorHeader';
import EditorLaunchFail from '../components/EditorLaunchFail';
import EditorLaunchSuccess from '../components/EditorLaunchSuccess';
import EditorStoryboard from '../components/EditorStoryboard';

import deepClone from '../utils/clone';

import { api as accountReducerApi } from '../reducers/account';
import { api as momentReducerApi } from '../reducers/moment';
import { api as historiesReducerApi } from '../reducers/histories';

import withRedux from '../storage';

class EditMoment extends React.Component {

  static async getInitialProps ({ query: { username, moment }, store, isServer }) {
    const id = `${username}/${moment}`;
    {
      const { err } = await store.dispatch(momentReducerApi.retrieveMomentDocument(id));
      if ( err ) return { id, username, moment, err };
    }
    {
      const { err } = await store.dispatch(historiesReducerApi.retrieveEditableState(id, true));
      if ( err ) return { id, username, moment, err };
    }
    return { id, username, moment };
  }

  static observe ({ authenticationToken, momentDocuments, editorHistories, editorStates, windowSize }) {
    return { authenticationToken, momentDocuments, editorHistories, editorStates, windowSize };
  }

  state = {
    connected : false,
    peers     : [ ],
    err       : this.props.err,
  }

  /**
   * shortcut functions
   *
   *  - for emit message to websocket server
   *  - for fetching updates from websocket server
   */
  emit(message) { return this.sync && this.sync.emit(message); }
  latest() { return this.sync && this.sync.latest(); }

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
  onSync(data) {
    // console.log('sync', data);
  }

  /**
   * trigger when websocket receive updates from other users
   */
  onUpdate() {
    console.log('update');
  }

  /**
   * trigger when receive peer signal (other users) from websocket
   */
  onSignal({ peers: res }) {
    const peers = [ ...res ]
      .sort((a, b) => a.initial > b.initial)
      .slice(0, 5);
    return this.setState({ peers });
  }

  /**
   * retry handler for re-fetch account and moment data
   */
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
    {
      const { err } = await store.dispatch(historiesReducerApi.retrieveEditableState(id, true));
      if ( err ) return this.setState({ err });
    }
    return this.setState({ err: null });
  }

  /**
   * handler for moment redo
   */
  onMomentRedo() {
    console.log('redo');
  }

  /**
   * handler for moment undo
   */
  onMomentUndo() {
    console.log('undo');
  }

  /**
   * handler for moment edit change
   */
  onMomentChange(moment, state) {

    if ( !window.getSelection ) return;

    // retrieve moments document
    const { id, username, moment: plotname, editorHistories, dispatch } = this.props;
    if ( !editorHistories[id] ) return;
    const { present: doc } = editorHistories[id] || { };
    const clone = { };
    deepClone(clone, doc);

    // patch clone
    clone.data || (clone.data = { });
    clone.data.slides || (clone.data.slides = { });
    clone.data.slides[moment] = state;

    // prepare websocket payload for 'update' event
    const payload = {
      action  : 'update',
      username,
      plotname,
      time    : new Date(),
      slides: {
        [moment]: state,
      },
    };

    if ( process.env.NODE_ENV !== 'production' ) {
      return dispatch(historiesReducerApi.updateState(id, clone))
        .then(changes => { this.emit({ action: 'change', changes }) })
        .then(_ => { this.emit(payload) });
    }

    return dispatch(historiesReducerApi.updateState(id, clone))
      .then(changes => this.emit({ action: 'change', changes }))
      .then(_ => this.emit(payload));
  }

  /**
   * handler for create new moment
   */
  onMomentCreate() {
    // retrieve moments from histories
    const { id, username, moment: plotname, editorHistories } = this.props;
    if ( !editorHistories[id] ) return;
    const { present: doc } = editorHistories[id] || { };
    const data = (doc.data || { });
    const moments = (data.slides || { });
    const ids = Object.keys(moments);

    // generate moment id
    const name = `${UUID.v4()}`;
    const order = (() => {
      let max = 0;
      ids.forEach(id => {
        const moment = (moments[id] || { });
        const order = typeof moment.order === 'number'
          ? moment.order
          : 0;
        if ( order > max ) max = order;
      });
      return max + 1;
    })();

    // prepare payload
    const payload = {
      action  : 'add',
      time    : new Date(),
      plotname,
      username,
      slides: {
        [name]: {
          hash  : `${Date.now()}`,
          data  : {
            blocks: [
              {
                key   : `${UUID.v4()}`,
                type  : 'unstyled',
                data  : '',
                styles: [ ],
              }
            ]
          },
          style : { },
          order,
        },
      },
    };

    // create moment
    this.emit(payload).then(_ => this.latest());
  }

  render () {
    const { id, username, moment, editorHistories, editorStates, windowSize } = this.props;
    const { err, peers } = this.state;
    const { present: doc, future, past } = editorHistories[id] || { };
    const editorState = editorStates[id] || { };
    return <div>
      <style jsx>{`div { height: 100vh; width: 100vw; background-color: #F8F8F8; }`}</style>
      <Head>
        <title>Moment</title>
      </Head>
      <WindowObserver />
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
        <EditorHeader
          peers={peers}
          onMomentCreate={::this.onMomentCreate}
        />
        <EditorStoryboard
          id={id}
          doc={doc}
          editorState={editorState}
          windowSize={windowSize}
          onMomentCreate={::this.onMomentCreate}
          onMomentChange={::this.onMomentChange}
        />
      </EditorLaunchSuccess>
    </div>
  }

}

export default withRedux(EditMoment);

