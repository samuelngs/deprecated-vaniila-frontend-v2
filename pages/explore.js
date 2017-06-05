
import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Router from 'next/router';

import If from '../components/If';
import WindowObserver from '../components/WindowObserver';
import BackToTop from '../components/BackToTop';
import AfterEvent from '../components/AfterEvent';
import AppHeader from '../components/AppHeader';
import AppFooter from '../components/AppFooter';
import AppModal from '../components/AppModal';
import AppMomentsGrid from '../components/AppMomentsGrid';
import AppMomentsList from '../components/AppMomentsList';
import AppModalViewMoment from '../components/AppModalViewMoment';
import AppLoadMore from '../components/AppLoadMore';
import AppSidebarSignupForm from '../components/AppSidebarSignupForm';
import AppSidebarSignupTwitter from '../components/AppSidebarSignupTwitter';

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

  static observe ({ accountUsername, authenticationToken, serverPathname, serverQuery, windowSize, momentDocuments, momentComments, momentPermissions, playerStates, trends, live, chat }) {
    return { accountUsername, authenticationToken, serverPathname, serverQuery, windowSize, momentDocuments, momentComments, momentPermissions, playerStates, trends, live, chat };
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
    const { dispatch, trends: { page, moments } } = this.props;
    const { until } = this.state;
    if ( ( until > 0 && Date.now() - until <= 60000 ) || moments.length % 15 !== 0 ) {
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
      momentPermissions,
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
          margin-bottom: 0;
          margin-left: 0;
          margin-right: 0;
          padding-top: 0;
          padding-bottom: 0;
          padding-left: 0;
          padding-right: 0;
          font-size: 22px;
          font-weight: 400;
          line-height: 1.3;
          color: #000;
        }
        .headline-bold {
          color: #00d68f;
          font-weight: 500;
        }
        .headline span {
          display: block;
        }
        .navigation {
          margin-top: 20px;
          margin-bottom: 80px;
          margin-left: 0;
          margin-right: 0;
          padding-top: 0;
          padding-bottom: 0;
          padding-left: 0;
          padding-right: 0;
        }
        .agreement {
          margin-top: 20px;
          margin-bottom: 0;
          margin-left: 10px;
          margin-right: 10px;
          padding-top: 0;
          padding-bottom: 0;
          padding-left: 0;
          padding-right: 0;
          font-size: 14px;
          font-weight: 400;
          color: #5c7584;
        }
        .agreement a {
          text-decoration: none;
          font-weight: 500;
          color: #000;
        }
        .grid {
          display: flex;
          flex-direction: column;
        }
        .column {
          display: flex;
          flex-direction: column;
          margin-top: 0;
          margin-bottom: 0;
          margin-left: 0;
          margin-right: 0;
          padding-top: 0;
          padding-bottom: 0;
          padding-left: 0;
          padding-right: 0;
        }
        .column-fill {
          flex: 1;
        }
        .column-sidebar {
          flex: 1;
        }
        .button {
          margin-top: 0;
          margin-bottom: 0;
          margin-left: 0;
          margin-right: 0;
          padding-top: 10px;
          padding-bottom: 10px;
          padding-left: 16px;
          padding-right: 16px;
          border: none;
          border-radius: 3px;
          background-color: #fff;
          font-size: 14px;
          font-weight: 400;
          text-decoration: none;
          color: #000;
          outline: none;
        }
        .button-highlight {
          background-color: #000;
          color: #fff;
        }
        .button-highlight:hover {
          background-color: #222;
        }
        .button-highlight:active {
          background-color: #444;
        }
        .button + .button {
          margin-left: 8px;
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
          font-size: 18px;
          font-weight: 500;
          color: #656d72;
        }
        .category-live {
          color: #07d691;
        }
        .category-live svg {
          width: 16px;
          height: 16px;
          margin-top: -1px;
          fill: #07d691;
        }
        @media (min-width: 780px) {
          .container {
            width: 700px;
          }
          .headline {
            margin-top: 90px;
            font-size: 42px;
          }
          .navigation {
            margin-bottom: 90px;
          }
          .button {
            font-size: 16px;
          }
        }
        @media (min-width: 1160px) {
          .container {
            width: 1080px;
          }
          .grid {
            flex-direction: row;
          }
          .column-sidebar {
            flex: initial;
            width: 300px;
            margin-top: 122px;
            margin-left: 20px;
            max-width: 100%;
            max-width: calc(100% - 40px);
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
          <span>Life is full of amazing events.</span>
          <span>Capture them with <b className="headline-bold">Vaniila Moments</b>.</span>
        </h1>

        <div className="navigation">
          <Link href={{ pathname: '/learn-more' }} as="learn"><a className="button button-highlight">Learn more</a></Link>
        </div>

        <If condition={live.length > 0}>
          <h4 className="category category-live">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
              <path d="M16.43 36.684c-.33 0-.663 0-.83-.166-.995-.498-1.66-1.494-1.327-2.656l2.49-9.795H13.94c-.83 0-1.66-.498-1.99-1.162-.333-.664-.333-1.66 0-2.324l9.626-16.1c.166-.164.166-.33.332-.496.663-.664 1.66-.83 2.49-.498.995.498 1.66 1.494 1.327 2.656l-2.49 10.128h2.822c.83 0 1.66.498 1.99 1.162.333.663.333 1.66 0 2.323l-9.627 15.77c-.166.166-.166.332-.332.498-.497.332-1.16.498-1.66.664z"/>
            </svg>
            Live
          </h4>
        </If>
        <If condition={live.length > 0}>
          <AppMomentsGrid placeholder={false} whoami={accountUsername} moments={live} permissions={momentPermissions} mode={this.mode()} />
        </If>

        <If condition={!!authenticationToken}>
          <h4 className="category">Trends</h4>
        </If>
        <If condition={!!authenticationToken}>
          <AppMomentsGrid placeholder={fetching} whoami={accountUsername} moments={moments} permissions={momentPermissions} mode={this.mode()} />
        </If>

        <If condition={!authenticationToken}>
          <div className="grid">
            <div className="column column-fill">
              <h4 className="category">Trends</h4>
              <AppMomentsList placeholder={fetching} whoami={accountUsername} moments={moments} permissions={momentPermissions} mode={this.mode()} />
            </div>
            <div className="column column-sidebar column-fixed">
              <AppSidebarSignupForm />
              <AppSidebarSignupTwitter />
              <p className="agreement">By signing up, you agree to the <Link href="/tos" as="/tos"><a>Terms of Service</a></Link> and <Link href="/privacy" as="/privacy"><a>Privacy Policy</a></Link></p>
            </div>
          </div>
        </If>

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
