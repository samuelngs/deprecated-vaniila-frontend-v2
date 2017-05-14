
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

  static observe ({ authenticationToken, accountUsername, serverPath, serverPathname, serverParams, serverQuery, windowSize, momentDocuments, momentComments, playerStates }) {
    return { authenticationToken, accountUsername, serverPath, serverPathname, serverParams, serverQuery, windowSize, momentDocuments, momentComments, playerStates };
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

    const { serverPath, serverPathname, serverQuery, username } = this.props;
    const mode = this.mode();

    if ( serverQuery.id ) {
      return;
    }

    switch ( mode ) {

      case 'desktop':
        return Router.push({
          pathname: serverPathname,
          query   : { ...serverQuery, id, username },
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

  renderMomentItem = ({ id, author, name, background }, i) => {
    return <li key={i} className="item" style={{
      backgroundImage: false && background && `url(${CDN_URL}/${background}/cover)`,
      backgroundSize: false && background && 'cover',
      backgroundPosition: false && 'center',
    }}>
      <style jsx>{`
        .item {
          margin-top: 0;
          margin-bottom: 0;
          margin-left: 0;
          margin-right: 0;
          padding-top: 0;
          padding-bottom: 0;
          padding-left: 0;
          padding-right: 0;
          list-style: none;
          display: flex;
          flex: 1;
          flex-basis: 100%;
          max-width: 416px;
          width: 416px;
          height: 312px;
          border-radius: 4px;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
          background-color: #fff;
          overflow: hidden;
        }
        .item .item-link-cover {
          background-color: rgba(0, 0, 0, 0.8);
          background-color: #fff;
        }
        .item a {
          display: flex;
          flex: 1;
          justify-content: center;
          align-items: center;
          text-decoration: none;
        }
        .item a span {
          font-size: 1.4em;
          font-weight: 500;
          color: #000;
        }
        .item a span.item-title-cover {
          color: #000;
        }
        @media (max-width: 900px) {
          .item + .item {
            margin-top: 20px;
          }
        }
        @media (min-width: 900px) {
          .item { flex-basis: 50%; }
          .item + .item { margin-left: 40px; }
          .item:nth-child(2n + 1) { margin-left: 0px; }
        }
        @media (min-width: 1400px) {
          .item { flex-basis: 33.3333%; }
          .item:nth-child(2n + 1) { margin-left: 40px; }
          .item:nth-child(3n + 1) { margin-left: 0px; }
        }
      `}</style>
      <a className={ background ? "item-link item-link-cover" : "item-link" } href={`/${author}/${id}`} onClick={e => this.handleViewMomentPress(e, { author, id })}>
        <span className={ background ? "item-title item-title-cover" : "item-title" }>{ name || 'Draft' }</span>
      </a>
    </li>
  }

  render () {

    const { authenticationToken, accountUsername, serverPathname, serverQuery, windowSize, momentDocuments, momentComments, playerStates, username, moments } = this.props;
    const { username: author, id } = serverQuery;

    return <div>

      <style jsx>{`
        .container {
          margin-top: 0;
          margin-bottom: 0;
          margin-left: auto;
          margin-right: auto;
          padding-top: 80px;
          padding-bottom: 0;
          padding-left: 0;
          padding-right: 0;
          width: 416px;
          max-width: 100%;
          max-width: calc(100% - 40px);
        }
        .moments-list {
          display: flex;
          justify-content: flex-start;
          flex-direction: row;
          flex-wrap: wrap;
        }
        @media (min-width: 900px) {
          .container {
            width: 872px;
          }
        }
        @media (min-width: 1400px) {
          .container {
            width: 1328px;
          }
        }
      `}</style>

      <Head>
        <title>Your Moments</title>
      </Head>

      <AppHeader />
      <WindowObserver />

      <div className="container">
        <ul className="moments-list">{ moments.map(this.renderMomentItem) }</ul>
      </div>

      <AppModal
        color="rgba(134, 143, 146, 0.7)"
        active={serverPathname === '/list-moments' && !!id && !!author}
        dismiss={this.handleViewMomentDismiss}
        control={false}
        props={{
          id,
          windowSize,
          authenticationToken,
          accountUsername,
          momentDocuments,
          momentComments,
          playerStates,
        }}
      >
        <AppModalViewMoment />
      </AppModal>

    </div>
  }

}

export default withRedux(ListMoments);


