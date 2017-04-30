
import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Router from 'next/router';

import AppHeader from '../components/AppHeader';

import { api as momentReducerApi } from '../reducers/moment';
import withRedux from '../storage';

class ViewMoment extends React.Component {

  static async getInitialProps ({ query: { username, id }, query, store, isServer }) {
    const { err } = await store.dispatch(momentReducerApi.retrieveMomentDocument(id));
    return { err, query };
  }

  static observe ({ authenticationToken, momentDocuments, windowSize }) {
    return { authenticationToken, momentDocuments, windowSize };
  }

  state = {
    notFound: false,
  }

  componentWillMount() {

    const { query: { username, id }, momentDocuments } = this.props;
    if ( !momentDocuments[id] ) return;

    const { path, author: { username: author } } = momentDocuments[id];

    if ( typeof window !== 'undefined' && `${username}/${id}` !== `${author}/${id}` ) {
      return Router.replace({
        pathname: `/view-moment`,
        query   : { username: author, id },
      }, `/${path}`);
    }
  }

  renderNotFound() {
    return <div className="container">
      <style jsx>{`
        .container {
          padding-top: 80px;
        }
      `}</style>
      <h1>Not Found</h1>
    </div>
  }

  renderMoment({ id, path, author: { username } }) {
    return <div className="container">
      <style jsx>{`
        .container {
          padding-top: 80px;
        }
      `}</style>
      <h1>{ path }</h1>
      <Link href={{ pathname: '/edit-moment', query: { username, id }}} as={`/${username}/${id}/edit`}><a>Edit</a></Link>
    </div>
  }

  render () {

    const { query: { id }, momentDocuments } = this.props;
    const moment = momentDocuments[id];

    return <div>
      <Head>
        <title>Moment</title>
      </Head>
      <AppHeader />
      { moment  && this.renderMoment(moment) }
      { !moment && this.renderNotFound() }
    </div>
  }

}

export default withRedux(ViewMoment);



