
import 'isomorphic-fetch';

import React from 'react';
import Head from 'next/head';

import { actions } from '../reducers/authentication';
import withRedux from '../storage';

class SignOut extends React.Component {

  static async getInitialProps ({ err, req, res, pathname, query, store }) {
    const { dispatch } = store;
    const status = await fetch(`${BACKEND_URL}/i/auth`, {
      method      : 'delete',
      credentials : 'include',
    }).then(res => {
      return res.json();
    });
    dispatch({ type: actions.SetAuthenticationToken, _vt: '' });
    return { status, query };
  }

  static observe (state) {
    return { authenticationToken: state.authenticationToken };
  }

  componentDidMount() {
    const { query: { redirect = '/' } } = this.props;
    location.href = (redirect || '/');
  }

  render () {
    return <div>
      <Head>
        <title>Sign Out</title>
      </Head>
    </div>
  }

}

export default withRedux(SignOut);

