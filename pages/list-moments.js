
import 'isomorphic-fetch';

import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Router from 'next/router';

import If from '../components/If';
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

  handleViewAuthorPress = (e, username) => {

    e.preventDefault();

    const { serverPath } = this.props;
    if ( serverPath === `/${username}` ) {
      return;
    }

    return Router.push({
      pathname: '/list-moments',
      query   : { username },
    }, `/${username}`);
  }

  handleViewMomentDismiss = e => {
    e.preventDefault();
    return Router.back();
  }

  renderMomentItem = ({ id, author, name, background, impressions, likes, liked, created_at: createdAt }, i) => {
    return <li key={i} className="item">
      <style jsx>{`
        .item {
          margin-top: 0;
          margin-bottom: 20px;
          margin-left: 0;
          margin-right: 0;
          padding-top: 0;
          padding-bottom: 0;
          padding-left: 0;
          padding-right: 0;
          list-style: none;
          display: flex;
          flex-direction: column;
          flex: 1;
          flex-basis: 100%;
          max-width: 300px;
          width: 300px;
          height: 360px;
        }
        .item-cover {
          width: 300px;
          height: 300px;
        }
        .item-cover-image {
          width: 300px;
          height: 300px;
          border-radius: 3px;
          overflow: hidden;
        }
        div.item-cover-image {
          background-color: #ebfff6;
        }
        .item-details {
          margin-top: 0;
          margin-bottom: 0;
          margin-left: 0;
          margin-right: 0;
          padding-top: 20px;
          padding-bottom: 20px;
          padding-left: 0;
          padding-right: 0;
        }
        .item-details a {
          margin-top: 0;
          margin-bottom: 0;
          margin-left: 0;
          margin-right: 0;
          padding-top: 0;
          padding-bottom: 0;
          padding-left: 0;
          padding-right: 0;
          display: block;
          text-decoration: none;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }
        .item-name {
          margin-top: 2px;
          margin-bottom: 2px;
          margin-left: 0;
          margin-right: 0;
          padding-top: 0;
          padding-bottom: 0;
          padding-left: 0;
          padding-right: 0;
        }
        .item-name a {
          font-size: 16px;
          font-weight: 400;
          color: #000;
        }
        .item-description {
          margin-top: 0;
          margin-bottom: 0;
          margin-left: 0;
          margin-right: 0;
          padding-top: 0;
          padding-bottom: 0;
          padding-left: 0;
          padding-right: 0;
        }
        .item-description a {
          font-size: 14px;
          font-weight: 400;
          color: #777;
        }
        @media (min-width: 680px) {
          .item + .item { margin-left: 20px; }
          .item:nth-child(2n + 1) { margin-left: 0px; }
        }
        @media (min-width: 1000px) {
          .item:nth-child(2n + 1) { margin-left: 20px; }
          .item:nth-child(3n + 1) { margin-left: 0px; }
        }
      `}</style>
      <a className="item-cover" href={`/${author}/${id}`} onClick={e => this.handleViewMomentPress(e, { author, id })}>
        <If condition={!!background}>
          <img className="item-cover-image" src={`${CDN_URL}/${background}/embed`} />
        </If>
        <If condition={!background}>
          <div className="item-cover-image" />
        </If>
      </a>
      <div className="item-details">
        <h2 className="item-name">
          <a href={`/${author}/${id}`} onClick={e => this.handleViewMomentPress(e, { author, id })}>{ name || 'Draft' }</a>
        </h2>
        <p className="item-description">
          <a href={`/${author}`} onClick={e => this.handleViewAuthorPress(e, author)}>{ author }</a>
        </p>
      </div>
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
          padding-top: 340px;
          padding-bottom: 0;
          padding-left: 0;
          padding-right: 0;
          width: 300px;
          max-width: 100%;
          max-width: calc(100% - 40px);
        }
        .moments-list {
          display: flex;
          justify-content: flex-start;
          flex-direction: row;
          flex-wrap: wrap;
        }
        @media (min-width: 680px) {
          .container {
            width: 620px;
          }
        }
        @media (min-width: 1000px) {
          .container {
            width: 940px;
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


