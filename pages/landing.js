
import React from 'react';
import Head from 'next/head';

import { actions, fields } from '../reducers/landing';
import AppHeader from '../components/AppHeader';
import LandingIntroduction from '../components/LandingIntroduction';
import LandingWordsOut from '../components/LandingWordsOut';
import LandingHeartsAndMind from '../components/LandingHeartsAndMind';
import LandingCreativity from '../components/LandingCreativity';
import LandingGetInvolved from '../components/LandingGetInvolved';
import LandingGetStarted from '../components/LandingGetStarted';

import withRedux from '../storage';

class Landing extends React.Component {

  static async getInitialProps ({ err, req, res, pathname, query, store }) {
    return { };
  }

  static observe (state) {
    return {
      authenticationToken     : state.authenticationToken,
      landingFoldWordsOut     : state.landingFoldWordsOut,
      landingFoldHeartsAndMind: state.landingFoldHeartsAndMind,
      landingFoldCreativity   : state.landingFoldCreativity,
      landingFoldGetInvolved  : state.landingFoldGetInvolved,
    };
  }

  signin() {
    console.log('sign in');
  }

  toggle(name, action) {
    return e => {
      const { dispatch } = this.props;
      for ( const type in actions ) {
        if ( type === action ) {
          const fold = this.props[name];
          dispatch({ type: actions[type], [name]: !fold });
        } else {
          dispatch({ type: actions[type], [fields[type]]: false });
        }
      }
    }
  }

  render () {
    const {
      authenticationToken,
      landingFoldWordsOut,
      landingFoldHeartsAndMind,
      landingFoldCreativity,
      landingFoldGetInvolved,
    } = this.props;
    return <div>
      <Head>
        <title>Landing page</title>
      </Head>
      <AppHeader />
      <LandingIntroduction onSignInClick={::this.signin} />
      { false && <LandingWordsOut unfold={landingFoldWordsOut} toggle={::this.toggle('landingFoldWordsOut', 'SetLandingFoldWordsOut')} /> }
      { false && <LandingHeartsAndMind unfold={landingFoldHeartsAndMind} toggle={::this.toggle('landingFoldHeartsAndMind', 'SetLandingFoldHeartsAndMind')} /> }
      { false && <LandingCreativity unfold={landingFoldCreativity} toggle={::this.toggle('landingFoldCreativity', 'SetLandingFoldCreativity')} /> }
      { false && <LandingGetInvolved unfold={landingFoldGetInvolved} toggle={::this.toggle('landingFoldGetInvolved', 'SetLandingFoldGetInvolved')} /> }
      { false && <LandingGetStarted /> }
    </div>
  }

}

export default withRedux(Landing);
