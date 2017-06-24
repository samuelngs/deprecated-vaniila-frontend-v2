
import React from 'react';
import Head from 'next/head';

import AppModalSignin from '../components/AppModalSignin';

import withRedux from '../storage';

class SignIn extends React.Component {

  static getInitialProps ({ err, req, res, pathname, query, store }) {
    return { query };
  }

  static observe (state) {
    return { authenticationToken: state.authenticationToken };
  }

  render () {
    return <div className="container">
      <style jsx>{`
        .container {
          display: flex;
          width: 100vw;
          height: 100vh;
          justify-content: center;
          align-items: center;
        }
      `}</style>
      <Head>
        <title>Sign In</title>
      </Head>
      <AppModalSignin />
    </div>
  }

}

export default withRedux(SignIn);

