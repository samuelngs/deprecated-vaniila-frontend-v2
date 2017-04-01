
import React from 'react';
import Head from 'next/head';

import AppHeader from '../components/AppHeader';

import withRedux from '../storage';

class NewMoment extends React.Component {

  static getInitialProps ({ err, req, res, pathname, query, store }) {
    console.log('NewMoment getInitialProps', store.getState());
    return { };
  }

  static observe (state) {
    return {
      authenticationToken: state.authenticationToken,
    };
  }

  render () {
    const {
      authenticationToken,
    } = this.props;
    return <div>
      <Head>
        <title>NewMoment page</title>
      </Head>
      <AppHeader />
      <style jsx>{`
        .container {
          padding-top: 80px;
        }
      `}</style>
      <div className="container">
        <h1>new moment</h1>
        <input type="text" />
      </div>
    </div>
  }

}

export default withRedux(NewMoment);

