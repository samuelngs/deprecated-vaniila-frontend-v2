
import 'isomorphic-fetch';

import React from 'react';
import Head from 'next/head';
import Router from 'next/router';

import AppHeader from '../components/AppHeader';
import AppNewMoment from '../components/AppNewMoment';

import withRedux from '../storage';

class NewMoment extends React.Component {

  render () {
    const { authenticationToken } = this.props;
    return <div>
      <Head>
        <title>Create a Moment</title>
      </Head>
      <AppHeader />
      <style jsx>{`
        .container {
          margin-top: 0;
          margin-bottom: 0;
          margin-left: auto;
          margin-right: auto;
          padding-top: 60px;
          padding-bottom: 0;
          padding-left: 0;
          padding-right: 0;
          display: flex;
          width: 800px;
          max-width: calc(100% - 80px);
        }
        @media (min-width: 768px) {
          padding-top: 160px;
        }
      `}</style>
      <div className="container">
        <AppNewMoment />
      </div>
    </div>
  }

}

export default withRedux(NewMoment);

