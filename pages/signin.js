
import React from 'react';
import Head from 'next/head';

import withRedux from '../storage';

class SignIn extends React.Component {

  static getInitialProps ({ err, req, res, pathname, query, store }) {
    return { query };
  }

  static observe (state) {
    return { authenticationToken: state.authenticationToken };
  }

  componentDidMount() {
    const { query: { redirect = '/' } } = this.props;
    location.href = `${BACKEND_URL}/i/auth?redirect=${redirect}`;
  }

  render () {
    const { authenticationToken, query } = this.props;
    return <div>
      <Head>
        <title>Sign In</title>
      </Head>
    </div>
  }

}

export default withRedux(SignIn);

