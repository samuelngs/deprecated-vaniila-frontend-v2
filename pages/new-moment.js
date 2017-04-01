
import 'isomorphic-fetch';

import React from 'react';
import Head from 'next/head';
import Router from 'next/router';

import AppHeader from '../components/AppHeader';

import withRedux from '../storage';

class NewMoment extends React.Component {

  static async getInitialProps ({ err, req, res, pathname, query, store }) {
    return { };
  }

  static observe (state) {
    return {
      authenticationToken: state.authenticationToken,
    };
  }

  state = {
    momentName: '',
    momentDesc: '',
  }

  onCreateMoment() {
    const { momentName, momentDesc } = this.state;
    const body = new FormData();
    body.append('name', momentName);
    body.append('description', momentDesc);
    body.append('private', 'false');
    fetch(`${BACKEND_URL}/i/plot`, {
      method      : 'post',
      credentials : 'include',
      body,
    }).then(res => {
      return res.json()
    }).then(res => {
      const { full_name } = res;
      const splitter = full_name.split('/');
      if ( splitter.length !== 2 ) return;
      const username = splitter[0];
      const moment = splitter[1];
      return Router.push({
        pathname: '/view-moment',
        query: { username, moment }
      }, `/${username}/${moment}`)
    });
  }

  onMomentNameChange(e) {
    const { target: { value: momentName } } = e;
    return this.setState({ momentName });
  }

  onMomentDescChange(e) {
    const { target: { value: momentDesc } } = e;
    return this.setState({ momentDesc });
  }

  render () {
    const { authenticationToken } = this.props;
    const { momentName, momentDesc } = this.props;
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
        <label>name: </label>
        <input type="text" value={momentName} onChange={::this.onMomentNameChange} />
        <label>desc: </label>
        <input type="text" value={momentDesc} onChange={::this.onMomentDescChange} />
        <button onClick={::this.onCreateMoment}>Create</button>
      </div>
    </div>
  }

}

export default withRedux(NewMoment);

