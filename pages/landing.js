
import React from 'react';
import Head from 'next/head';
import Router from 'next/router';

import AppHeaderLogo from '../components/AppHeaderLogo';

import withRedux from '../storage';

class Landing extends React.Component {

  static async getInitialProps ({ err, req, res, pathname, query, store }) {
    return { };
  }

  static observe (state) {
    return {
      authenticationToken: state.authenticationToken,
      accountUsername: state.accountUsername,
    };
  }

  render () {
    const {
      authenticationToken,
      accountUsername,
    } = this.props;
    return <div>
      <style jsx>{`
        main {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          width: 100vw;
        }
        nav {
          display: flex:
          flex-direction: row;
          align-items: center;
          justify-content: center;
        }
        .logo {
          display: inline-block;
          margin-left: auto;
          margin-right: auto;
        }
        .site-name {
          font-weight: 600;
        }
        .what-is-vaniila {
          margin-left: auto;
          margin-right: auto;
          max-width: calc(100% - 40px);
          width: 300px;
          font-size: 30px;
          font-weight: 400;
          text-align: center;
          line-height: 1.4;
        }
        .button-wrapper {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
        }
        .sign-in {
          margin-top: 40px;
          margin-bottom: 40px;
          padding-top: 16px;
          padding-bottom: 16px;
          padding-left: 24px;
          padding-right: 24px;
          background-color: #0086ff;
          border-radius: 30px;
          border: none;
          font-size: 18px;
          font-weight: 300;
          color: #fff;
          outline: none;
          cursor: pointer;
        }
        .sign-in + .sign-in {
          margin-left: 10px;
        }
        .twitter-logo {
          margin-right: 8px;
          width: 20px;
          height: 20px;
        }
        .join-email {
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
          margin-top: 10px;
          padding-left: 20px;
          padding-right: 20px;
          max-width: calc(100% - 40px);
          width: 260px;
          height: 46px;
          border: 1px solid #eaeaea;
          border-radius: 4px;
          font-size: 16px;
          font-weight: 400;
          text-align: center;
          color: #aaa;
          outline: none;
        }
        .join-us-description {
          margin-top: 20px;
          max-width: calc(100% - 40px);
          width: 300px;
          font-size: 16px;
          font-weight: 300;
          text-align: center;
          line-height: 1.4;
          color: #999;
        }
        .separator {
          max-width: calc(100% - 40px);
          width: 300px;
          border-top: 1px solid #f6f6f6;
        }
      `}</style>
      <Head>
        <title>Vaniila</title>
      </Head>
      <main>
        <header>
          <nav>
            <a className="logo" href="/">
              <AppHeaderLogo headerHeight={180} />
            </a>
          </nav>
        </header>
        <h1 className="what-is-vaniila"><span className="site-name">Vaniila</span> is the simplest way to broadcast your event live.</h1>
        { !authenticationToken && <button className="sign-in" onClick={e => Router.push({
          pathname: '/signin',
        }, `/signin`)}>
          <div className="button-wrapper">
            <svg className="twitter-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
              <path fill="#fff" fillRule="evenodd" d="M34.4060938 85.5994107c32.5490624-.8109492 50.3240624-27.8905087 50.3240624-51.4219913 0-.7844293-.016875-1.5646713-.0520312-2.3393301 3.5578125-2.5486972 6.6473437-5.7338709 9.0885937-9.3587159C90.5 23.9170285 86.99 24.8884926 83.305625 25.3253722c3.7603125-2.237438 6.64875-5.7799318 8.0085937-10.0021712-3.5198437 2.0713399-7.4179687 3.5759925-11.5664062 4.3869417C76.4234375 16.1969603 71.69 14 66.4517187 14c-10.0603125 0-18.2165624 8.0955335-18.2165624 18.0809553 0 1.4167184.1617187 2.7957507.4724999 4.1189516-15.1396875-.753722-28.5609374-7.9517679-37.5454687-18.8891129-1.56796875 2.6701303-2.4665625 5.7757445-2.4665625 9.0893301 0 6.2712469 3.2160938 11.8055211 8.1042188 15.0479218-2.986875-.0935174-5.7951563-.9072581-8.25187505-2.2611662-.00140625.0753722-.00140625.1521402-.00140625.2275124 0 8.7599255 6.2789063 16.0668424 14.6123438 17.7278225-1.5285938.4131514-3.1373438.6350807-4.7995313.6350807-1.1728125 0-2.3146875-.1144541-3.4270312-.3252171 2.3189062 7.1826923 9.0449999 12.4098945 17.0170312 12.5564516-6.2353125 4.8489454-14.0892187 7.7396092-22.62234375 7.7396092-1.46390625 0-2.908125-.0851427-4.32703125-.2512407v.0097704c7.7779688 4.9452544 16.965 7.8931452 26.8382813 8.092742h2.5678125"/>
            </svg>
            Sign up with Twitter
          </div>
        </button> }
        { authenticationToken && <div>
          <button className="sign-in" onClick={e => Router.push({
            pathname: '/new-moment',
          }, `/new`)}>
            <div className="button-wrapper">
              New Moment
            </div>
          </button>
          <button className="sign-in" onClick={e => Router.push({
            pathname: `/list-moments`,
            query: { username: accountUsername },
          }, `/${accountUsername}`)}>
            <div className="button-wrapper">
              List
            </div>
          </button>
          <button className="sign-in" onClick={e => Router.push({
            pathname: '/signout',
          }, `/signout`)}>
            <div className="button-wrapper">
              Sign out
            </div>
          </button>
        </div> }
        <input className="join-email" type="text" placeholder="email@domain.com" />
        <p className="join-us-description">Subscribe to our newsletter & hear more about our behind the scene stories.</p>
      </main>
    </div>
  }

}

export default withRedux(Landing);
