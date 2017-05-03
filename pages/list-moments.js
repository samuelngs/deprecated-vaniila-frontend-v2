
import 'isomorphic-fetch';

import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

import AppHeader from '../components/AppHeader';

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

  static observe (state) {
    return {
      authenticationToken: state.authenticationToken,
    };
  }

  renderMomentItem({ id, author, name }, i) {
    return <li key={i} className="item">
      <style jsx>{`
        .item + .item {
          margin-top: 20px;
        }
      `}</style>
      <h3>{ name || 'Draft' }</h3>
      <Link href={{ pathname: '/view-moment', query: { username: author, id }}} as={`/${author}/${id}`}><a>Go to moment</a></Link>
    </li>
  }

  render () {
    const { authenticationToken, username, moments } = this.props;
    return <div>
      <Head>
        <title>Your Moments</title>
      </Head>
      <AppHeader />
      <style jsx>{`
        .container {
          padding-top: 80px;
        }
      `}</style>
      <div className="container">
        <h1>Your Moments: { username }</h1>
        <ul>{ moments.map(this.renderMomentItem) }</ul>
      </div>
    </div>
  }

}

export default withRedux(ListMoments);


