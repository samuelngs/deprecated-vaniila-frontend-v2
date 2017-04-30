
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
import { api as editorReducerApi } from '../reducers/editor';
import { api as historiesReducerApi } from '../reducers/histories';

import withRedux from '../storage';

class EditMoment extends React.Component {

  static async getInitialProps ({ query: { username, id }, store, isServer }) {
    {
      const { err } = await store.dispatch(momentReducerApi.retrieveMomentDocument(id));
      if ( err ) return { id, username, err };
    }
    {
      const { err } = await store.dispatch(historiesReducerApi.retrieveEditableState(id, true));
      if ( err ) return { id, username, err };
    }
    return { username, id };
  }

  static observe ({ authenticationToken, momentDocuments, editorHistories, editorStates, files, windowSize }) {
    return { authenticationToken, momentDocuments, editorHistories, editorStates, files, windowSize };
  }

  state = {

    connected : false,
    peers     : [ ],
    err       : this.props.err,

    cover     : {
      hash    : `${Date.now()}`,
      data    : {
        blocks: [
          {
            key   : 'cover',
            type  : 'header-one',
            data  : '',
            styles: [ ],
          }
        ]
      },
      style   : { },
      align   : 1,
      order   : -1,
    },
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

  onModeChange(grid) {
    const { id, dispatch } = this.props;
    return dispatch(editorReducerApi.setEditorState(id, { grid }));
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
   * handler for moment file progress
   */
  onMomentProgress(moment, state) {
    const payload = {
      action: 'progress',
      moment,
      state,
    };
    this.emit(payload);
  }

  /**
   * handler for moment edit change
   */
  onMomentChange(moment, state) {

    if ( !window.getSelection ) return;

    if ( moment === 'cover' ) {
      return this.setState({ cover: state });
    }

    // retrieve moments document
    const { id, editorHistories, dispatch } = this.props;
    if ( !editorHistories[id] ) return;
    const { present: doc } = editorHistories[id] || { };
    const clone = { };
    deepClone(clone, doc);

    // patch clone
    clone.data || (clone.data = { });
    clone.data.slides || (clone.data.slides = { });

    const remove = typeof state === 'undefined';

    if ( remove ) {
      delete clone.data.slides[moment];
    } else {
      clone.data.slides[moment] = state;
    }

    // prepare websocket payload for 'update' event
    const payload = {
      action  : remove ? 'delete' : 'update',
      time    : new Date(),
      slides: {
        [moment]: state,
      },
    };

    if ( remove ) {
      payload.slidekey = moment;
    } else {
      payload.slides = {
        [moment]: state,
      };
    }

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
   * handler for moment reordering
   */
  onMomentReorder(n) {

    // retrieve moments document
    const { id, editorHistories, dispatch } = this.props;
    if ( !editorHistories[id] ) return;
    const { present: doc } = editorHistories[id] || { };
    const clone = { };
    deepClone(clone, doc);

    // patch clone
    clone.data || (clone.data = { });
    clone.data.slides || (clone.data.slides = { });

    const moments = clone.data.slides;
    const ids = Object.keys(moments);

    const payload = {
      action  : 'update',
      time    : new Date(),
      slides: { },
    };

    let changes = 0;
    for ( let i = 0, c = n; i < ids.length; i++ ) {

      const id = ids[i];
      const moment = moments[id];

      if ( moment.order < c ) continue;

      c++;
      changes++;

      moment.hash = `${Date.now()}`;
      moment.order = c;

      payload.slides[id] = {
        hash  : moment.hash,
        order : moment.order,
      };
    }

    return dispatch(historiesReducerApi.updateState(id, clone))
      .then(changes => this.emit({ action: 'change', changes }))
      .then(_ => {
        return changes > 0
          ? this.emit(payload)
          : null;
      });
  }

  /**
   * handler for create new moment
   */
  onMomentCreate(n, opts = { }) {

    const { parent, blocks } = opts;

    // retrieve moments from histories
    const { id, editorHistories } = this.props;
    if ( !editorHistories[id] ) return;
    const { present: doc } = editorHistories[id] || { };
    const data = (doc.data || { });
    const moments = (data.slides || { });
    const ids = Object.keys(moments);

    // generate moment id
    const name = `${UUID.v4()}`;
    const block = `${UUID.v4()}`;
    const reorder = typeof n === 'number';
    const order = typeof n === 'number'
      ? n
      : (() => {
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
      slides: {
        [name]: {
          hash  : `${Date.now()}`,
          when  : Date.now(),
          data  : {
            blocks: [
              {
                key   : block,
                type  : 'unstyled',
                data  : '',
                styles: [ ],
              }
            ]
          },
          style : { },
          align : 0,
          order,
        },
      },
    };

    if ( Array.isArray(blocks) && blocks.length > 0 ) {
      payload.slides[name].data.blocks = blocks;
    }

    if ( typeof parent === 'string' && parent.length > 0 ) {
      payload.slides[name].parent = parent;
    }

    if ( reorder ) {
      return this.onMomentReorder(n)
        .then(_ => this.emit(payload))
        .then(_ => this.latest()).then(_ => ({ name, block }));
    }

    return this.emit(payload)
      .then(_ => this.latest()).then(_ => ({ name, block }));
  }

  render () {
    const { id, username, editorHistories, editorStates, files, windowSize } = this.props;
    const { err, peers, cover } = this.state;
    const { present: doc, future, past } = editorHistories[id] || { };
    const editorState = editorStates[id] || { };
    const { editorGrid } = editorState;
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
          moment={id}
          onOpen={::this.onWebsocketOpen}
          onClose={::this.onWebsocketClose}
          onSync={::this.onSync}
          onUpdate={::this.onUpdate}
          onSignal={::this.onSignal}
        />
        <EditorHeader
          peers={peers}
          gridview={editorGrid}
          onModeChange={::this.onModeChange}
          onMomentCreate={::this.onMomentCreate}
        />
        <EditorStoryboard
          id={id}
          doc={doc}
          cover={cover}
          files={files}
          gridview={editorGrid}
          windowSize={windowSize}
          editorState={editorState}
          onMomentCreate={::this.onMomentCreate}
          onMomentChange={::this.onMomentChange}
          onMomentProgress={::this.onMomentProgress}
        />
      </EditorLaunchSuccess>
    </div>
  }

}

export default withRedux(EditMoment);

