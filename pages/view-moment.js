
import React from 'react';
import Head from 'next/head';

import AppHeader from '../components/AppHeader';

import withRedux from '../storage';

class ViewMoment extends React.Component {

  static getInitialProps ({ query: { username, moment } }) {
    return { username, moment };
  }

  static observe (state) {
    return {
      authenticationToken: state.authenticationToken,
    };
  }

  render () {
    const { authenticationToken, username, moment } = this.props;
    return <div>
      <Head>
        <title>Moment</title>
      </Head>
      <AppHeader />
      <style jsx>{`
        .container {
          padding-top: 80px;
        }
      `}</style>
      <div className="container">
        <h1>{ username }/{ moment }</h1>
      </div>
    </div>
  }

}

export default withRedux(ViewMoment);



