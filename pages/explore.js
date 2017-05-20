
import React from 'react';
import Head from 'next/head';
import Router from 'next/router';

import If from '../components/If';
import WindowObserver from '../components/WindowObserver';
import BackToTop from '../components/BackToTop';
import AfterEvent from '../components/AfterEvent';
import AppHeader from '../components/AppHeader';
import AppFooter from '../components/AppFooter';
import AppModal from '../components/AppModal';
import AppMomentsList from '../components/AppMomentsList';
import AppModalViewMoment from '../components/AppModalViewMoment';
import AppLoadMore from '../components/AppLoadMore';

import { api as trendsApi } from '../reducers/trends';
import { api as liveApi } from '../reducers/live';
import withRedux from '../storage';

class Explore extends React.Component {

  static async getInitialProps ({ req, res, pathname, query, store }) {
    {
      const { err } = await store.dispatch(trendsApi.retrieveTrends(1));
      if ( err ) return { err };
    }
    {
      const { err } = await store.dispatch(liveApi.retrieveLive());
      if ( err ) return { err };
    }
    return { };
  }

  static observe ({ accountUsername, authenticationToken, serverPathname, serverQuery, windowSize, momentDocuments, momentComments, playerStates, trends, live, chat }) {
    return { accountUsername, authenticationToken, serverPathname, serverQuery, windowSize, momentDocuments, momentComments, playerStates, trends, live, chat };
  }

  state = {
    fetching: false,
    until   : 0,
  }

  onPageLoad = o => {
    const { dispatch } = this.props;
    return new Promise(resolve => {
      this.setState(state => !state.fetching && { fetching: true }, _ => {
        Promise.all([
          dispatch(trendsApi.retrieveTrends(1)),
          dispatch(liveApi.retrieveLive()),
        ])
        .then(resolve)
        .catch(resolve);
      });
    });
  }

  onPageLoaded = o => {
    this.setState(state => state.fetching && { fetching: false });
  }

  onLoadMore = o => {
    const { dispatch, trends: { page } } = this.props;
    const { until } = this.state;
    if ( until > 0 && Date.now() - until <= 60000 ) {
      return;
    }
    return new Promise(resolve => {
      this.setState(state => !state.fetching && { fetching: true }, _ => {
        dispatch(trendsApi.retrieveTrends())
          .then(resolve)
          .catch(resolve);
      });
    }).then(o => {
      if ( page === o.page && o.trends.length < 15 ) {
        this.setState(state => state.fetching && { fetching: false, until: Date.now() });
      } else {
        this.setState(state => state.fetching && { fetching: false, until: 0 });
      }
    });
  }

  onModalDismiss = e => {
    e.preventDefault();
    return Router.back();
  }

  mode() {
    const { windowSize: { width: ww, height: wh } } = this.props;
    const defaults = { maxWidth: 600, maxHeight: 600 };
    let width = ww - 100;
    let height = wh - 100;
    if ( width > defaults.maxWidth ) width = defaults.maxWidth;
    if ( height > defaults.maxHeight ) height = defaults.maxHeight;
    if ( width >= defaults.maxHeight ) {
      return 'desktop';
    }
    return 'mobile';
  }

  render () {

    const {
      fetching,
    } = this.state;

    const {
      authenticationToken,
      accountUsername,
      serverPathname,
      serverQuery,
      windowSize,
      momentDocuments,
      momentComments,
      playerStates,
      trends,
      live,
      chat,
    } = this.props;

    const { } = this.props;

    const {
      id,
      username,
    } = serverQuery;

    const {
      moments,
    } = trends;

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
        .headline {
          margin-top: 40px;
          margin-bottom: 80px;
          margin-left: 0;
          margin-right: 0;
          padding-top: 0;
          padding-bottom: 0;
          padding-left: 0;
          padding-right: 0;
          font-size: 22px;
          font-weight: 300;
          line-height: 1.3;
          text-align: center;
          color: #000;
        }
        .headline-bold {
          font-weight: 700;
        }
        .headline-color {
          color: #288fea;
          background: -webkit-linear-gradient(-54deg, #C3DC6F, #82C4AC, #288FEA, #288FEA);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .headline span {
          display: block;
        }
        .category {
          display: flex;
          flex-direction: row;
          align-items: center;
          margin-top: 20px;
          margin-bottom: 20px;
          margin-left: 2px;
          margin-right: 2px;
          padding-top: 0;
          padding-bottom: 0;
          padding-left: 0;
          padding-right: 0;
          font-size: 16px;
          font-weight: 600;
          color: #000;
        }
        .category-live {
          color: #07d691;
        }
        .category-live svg {
          width: 14px;
          height: 14px;
          margin-top: -2px;
          fill: #07d691;
        }
        @media (min-width: 680px) {
          .container {
            width: 620px;
          }
          .headline {
            margin-top: 90px;
            margin-bottom: 90px;
            font-size: 40px;
          }
        }
        @media (min-width: 1000px) {
          .container {
            width: 940px;
          }
        }
      `}</style>

      <Head>

        <title>Vaniila • Capture, highlight, and share your moments for any event</title>

        {/* site info metatags */}
        <meta name="distribution" content="Global" />
        <meta name="description" content="Share all your moments from last night’s party, this week’s tech conference, and next month’s political debate." />
        <meta name="creator" content="vaniila.com" />
        <meta name="publisher" content="vaniila.com" />
        <meta name="rating" content="general" />
        <meta name="robots" content="index, follow" />

        {/* twitter metatags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@vaniilacom" />
        <meta name="twitter:creator" content="@vaniilacom" />
        <meta name="twitter:title" content="Vaniila" />
        <meta name="twitter:description" content="Share all your moments from last night’s party, this week’s tech conference, and next month’s political debate." />
        <meta name="twitter:image:alt" content="Share all your moments from last night’s party, this week’s tech conference, and next month’s political debate." />
        <meta name="twitter:image" content="https://cdn-images.vaniila.com/xqLNOwneZ4a3bDY9QDmkGQdpyRK8B7/embed" />
        <meta name="twitter:player" content="https://vaniila.com" />

        {/* google, facebook metatags */}
        <meta name="og:url" content="https://vaniila.com" />
        <meta name="og:image" content="https://cdn-images.vaniila.com/xqLNOwneZ4a3bDY9QDmkGQdpyRK8B7/embed" />
        <meta name="og:image:secure_url" content="https://cdn-images.vaniila.com/xqLNOwneZ4a3bDY9QDmkGQdpyRK8B7/embed" />
        <meta name="og:image:height" content="600" />
        <meta name="og:image:width" content="600" />
        <meta name="og:type" content="website" />
        <meta name="og:title" content="Vaniila" />
        <meta name="og:description" content="Share all your moments from last night’s party, this week’s tech conference, and next month’s political debate." />
        <meta name="og:locale" content="en_US" />
        <meta name="og:site_name" content="vaniila.com" />

      </Head>

      <WindowObserver />
      <AppHeader />

      <BackToTop id="landing" />
      <AfterEvent autostart={false} run={this.onPageLoad} then={this.onPageLoaded}  />

      <div className="container">
        <h1 className="headline">
          <span>Share the best</span>
          <span><b className="headline-bold headline-color">moments</b> of any event.</span>
        </h1>
        <If condition={live.length > 0}>
          <h4 className="category category-live">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
              <path d="M16.43 36.684c-.33 0-.663 0-.83-.166-.995-.498-1.66-1.494-1.327-2.656l2.49-9.795H13.94c-.83 0-1.66-.498-1.99-1.162-.333-.664-.333-1.66 0-2.324l9.626-16.1c.166-.164.166-.33.332-.496.663-.664 1.66-.83 2.49-.498.995.498 1.66 1.494 1.327 2.656l-2.49 10.128h2.822c.83 0 1.66.498 1.99 1.162.333.663.333 1.66 0 2.323l-9.627 15.77c-.166.166-.166.332-.332.498-.497.332-1.16.498-1.66.664z"/>
            </svg>
            Live
          </h4>
        </If>
        <If condition={live.length > 0}>
          <AppMomentsList placeholder={false} whoami={accountUsername} moments={live} mode={this.mode()} />
        </If>
        <h4 className="category">Trends</h4>
        <AppMomentsList placeholder={fetching} whoami={accountUsername} moments={moments} mode={this.mode()} />
        <AppLoadMore run={this.onLoadMore} />
      </div>

      <AppModal
        color="rgba(134, 143, 146, 0.7)"
        active={serverPathname === '/explore' && !!id && !!username}
        dismiss={this.onModalDismiss}
        control={false}
        props={{
          id,
          windowSize,
          authenticationToken,
          accountUsername,
          momentDocuments,
          momentComments,
          playerStates,
          chat,
        }}
      >
        <AppModalViewMoment />
      </AppModal>

      <AppFooter />

    </div>
  }

}

export default withRedux(Explore);
