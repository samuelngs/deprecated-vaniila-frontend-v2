
import React from 'react';
import Head from 'next/head';
import Router from 'next/router';

import AppHeader from '../components/AppHeader';

import withRedux from '../storage';

class Landing extends React.Component {

  static async getInitialProps ({ err, req, res, pathname, query, store }) {
    return { };
  }

  static observe (state) {
    return {
      authenticationToken: state.authenticationToken,
      accountUsername: state.accountUsername,
    };
  }

  render () {
    const {
      authenticationToken,
      accountUsername,
    } = this.props;
    return <div>
      <Head>
        <title>Vaniila</title>
      </Head>
      <AppHeader />
    </div>
  }

}

export default withRedux(Landing);
