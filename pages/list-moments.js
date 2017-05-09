
import 'isomorphic-fetch';

import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Router from 'next/router';

import WindowObserver from '../components/WindowObserver';
import AppHeader from '../components/AppHeader';
import AppModal from '../components/AppModal';
import AppModalViewMoment from '../components/AppModalViewMoment';

import withRedux from '../storage';

class ListMoments extends React.Component {

  static async getInitialProps ({ err, req, res, pathname, query: { username }, store, isServer }) {
    const { authenticationToken } = store.getState();
    const headers = isServer && {
      internal      : 'TRUE',
      'Access-Token': authenticationToken,
    };
    const moments = await fetch(`${BACKEND_URL}/i/moment/${username}`, {
      method      : 'get',
      credentials : 'include',
      headers,
    }).then(res => {
      return res.json();
    }).then(res => {
      return Array.isArray(res) ? res : [];
    });
    return { username, moments };
  }

  static observe ({ authenticationToken, serverPath, serverPathname, serverParams, serverQuery, windowSize, momentDocuments, playerStates }) {
    return { authenticationToken, serverPath, serverPathname, serverParams, serverQuery, windowSize, momentDocuments, playerStates };
  }

  mode() {

    const { windowSize: { width: ww, height: wh } } = this.props;
    const defaults = { maxWidth: 600, maxHeight: 600 };

    let width = ww - 100;
    let height = wh - 100;

    if ( width > defaults.maxWidth ) width = defaults.maxWidth;
    if ( height > defaults.maxHeight ) height = defaults.maxHeight;

    if ( width >= defaults.maxHeight ) {
      return 'desktop';
    }

    return 'mobile';
  }

  handleViewMomentPress = (e, { author, id }) => {

    e.preventDefault();

    const { serverPath, serverPathname, serverQuery, serverParams } = this.props;
    const mode = this.mode();

    if ( serverQuery.id ) {
      return;
    }

    switch ( mode ) {

      case 'desktop':
        return Router.push({
          pathname: serverPathname,
          query   : { ...serverParams, ...serverQuery, id, username: author },
        }, `/${author}/${id}`);

      case 'mobile':
        return Router.push({
          pathname: '/view-moment',
          query   : { id, username: author },
        }, `/${author}/${id}`);
    }

  }

  handleViewMomentDismiss = e => {
    e.preventDefault();
    return Router.back();
  }

  renderMomentItem = ({ id, author, name }, i) => {
    return <li key={i} className="item">
      <style jsx>{`
        .item + .item {
          margin-top: 20px;
        }
      `}</style>
      <h3>{ name || 'Draft' }</h3>
      <a href={`/${author}/${id}`} onClick={e => this.handleViewMomentPress(e, { author, id })}>Go to moment</a>
    </li>
  }

  render () {

    const { authenticationToken, serverPathname, serverQuery, windowSize, momentDocuments, playerStates, username, moments } = this.props;
    const { username: author, id } = serverQuery;

    return <div>

      <style jsx>{`
        .container {
          padding-top: 80px;
        }
      `}</style>

      <Head>
        <title>Your Moments</title>
      </Head>

      <AppHeader />
      <WindowObserver />

      <div className="container">
        <h1>Your Moments: { username }</h1>
        <ul>{ moments.map(this.renderMomentItem) }</ul>
      </div>

      <AppModal color="rgba(134, 143, 146, 0.7)" active={serverPathname === '/list-moments' && !!id && !!author} dismiss={this.handleViewMomentDismiss} control={false} props={{ id, windowSize, momentDocuments, playerStates }}>
        <AppModalViewMoment />
      </AppModal>

    </div>
  }

}

export default withRedux(ListMoments);


