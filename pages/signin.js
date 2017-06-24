
import React from 'react';
import Head from 'next/head';

import WindowObserver from '../components/WindowObserver';
import BackToTop from '../components/BackToTop';
import AppHeader from '../components/AppHeader';
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
    return <div>
      <style jsx>{`
        .container {
          margin-top: 0;
          margin-bottom: 0;
          margin-left: auto;
          margin-right: auto;
          padding-top: 80px;
          padding-bottom: 130px;
          padding-left: 0;
          padding-right: 0;
          width: 300px;
          max-width: 100%;
          max-width: calc(100% - 40px);
        }
        @media (min-width: 780px) {
          .container {
            width: 700px;
          }
        }
        @media (min-width: 1160px) {
          .container {
            width: 1080px;
          }
        }
      `}</style>

      <Head>
        <title>Sign In</title>
      </Head>

      <BackToTop id="sign-in" />
      <WindowObserver />

      <AppHeader />

      <div className="container">
        <AppModalSignin />
      </div>
    </div>
  }

}

export default withRedux(SignIn);

