
import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import Router from 'next/router';

import AppHeaderLogo from '../AppHeaderLogo';
import AppHeaderMenu from '../AppHeaderMenu';
import AppModal from '../AppModal';
import AppModalNewMoment from '../AppModalNewMoment';

export default class AppHeader extends React.Component {

  static contextTypes = {
    store: PropTypes.object,
  }

  static cssVariables = {
    headerHeight: 46,
    headerBackgroundColor: '#fff',
    headerIconColor: '#8aa7b1',
  }

  state = {
    active: false,
  }

  handleHeaderMenuPress = e => {
    const { active } = this.state;
    this.setState({ active: !active });
  }

  handleNewMomentPress = e => {

    e.preventDefault();

    const { store: { getState } } = this.context;
    const { serverPath, serverPathname, serverQuery, serverParams } = getState();

    if ( serverPath === '/new' ) {
      return;
    }

    return Router.push({
      pathname: serverPathname,
      query   : { ...serverQuery, ...serverParams, new: 'modal' },
    }, '/new');
  }

  handleNewMomentDismiss = e => {
    e.preventDefault();
    return Router.back();
  }

  render() {

    const { active } = this.state;
    const { store: { getState } } = this.context;
    const { serverPath, serverQuery, authenticationToken, accountUsername } = getState();

    return <header className="header">
      <style jsx>{`
        .header {
          margin-top: 0;
          margin-bottom: 0;
          margin-left: 0;
          margin-right: 0;
          padding-top: 0;
          padding-bottom: 0;
          padding-left: 0;
          padding-right: 0;
          width: 100%;
          height: ${AppHeader.cssVariables.headerHeight}px;
          position: fixed;
          display: flex;
          background-color: ${AppHeader.cssVariables.headerBackgroundColor};
          box-shadow: rgba(0, 0, 0, 0.05) 0px 1px;
          z-index: 7;
        }
        .header-grid {
          background-color: ${AppHeader.cssVariables.headerBackgroundColor};
        }
        .header-nav {
          flex: 1;
          display: flex;
          flex-direction: row;
        }
        .header-grid-column-4 {
          flex: 1;
          display: flex;
          flex-direction: row;
        }
        .header-grid-column-al { justify-content: flex-start; }
        .header-grid-column-ac { justify-content: center; }
        .header-grid-column-ar { justify-content: flex-end; }
        .header-separator {
          width: 0;
          height: 100%;
          border-left: 1px solid #eee;
        }
        .header-nav-button {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 0;
          margin-bottom: 0;
          margin-left: 10px;
          margin-right: 10px;
          padding-top: 0;
          padding-bottom: 0;
          padding-left: 0;
          padding-right: 0;
          background-color: transparent;
          border: none;
          outline: none;
          cursor: pointer;
        }
        .header-nav-ul {
          margin-top: 0;
          margin-bottom: 0;
          margin-left: 20px;
          margin-right: 20px;
          padding-top: 0;
          padding-bottom: 0;
          padding-left: 0;
          padding-right: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .header-nav-ul.header-nav-dropdown {
          display: none;
        }
        .header-nav-li {
          display: flex;
          margin-top: 0;
          margin-bottom: 0;
          margin-left: 0;
          margin-right: 0;
          padding-top: 5px;
          padding-bottom: 5px;
          padding-left: 0;
          padding-right: 0;
          list-style: none;
        }
        .header-nav-a {
          display: flex;
          align-items: center;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          color: #888;
        }
        .header-nav-a.header-nav-a-active {
          color: #000;
        }
        @media (max-width: 768px) {
          .header-nav-ul.header-nav-dropdown-active {
            position: absolute;
            top: calc(100% + 1px);
            left: 0;
            right: 0;
            margin-top: 0;
            margin-bottom: 0;
            margin-left: 0;
            margin-right: 0;
            padding-top: 20px;
            padding-bottom: 20px;
            padding-left: 20px;
            padding-right: 20px;
            display: flex;
            flex-direction: column;
            box-shadow: rgba(0, 0, 0, 0.05) 0px 1px;
            background-color: #fff;
          }
          .header-nav-ul.header-nav-dropdown .header-nav-a {
            font-size: 16px;
          }
        }
        @media (min-width: 768px) {
          .header-nav-button {
            display: none;
          }
          .header-nav-ul {
            flex-direction: row;
          }
          .header-nav-ul.header-nav-dropdown {
            display: flex;
          }
          .header-nav-li {
            padding-top: 0;
            padding-bottom: 0;
          }
          .header-nav-li + .header-nav-li {
            margin-left: 14px;
          }
          .header-nav-a {
            font-size: 14px;
            font-weight: 600;
            color: #888;
          }
        }
      `}</style>
      <nav className="header-nav header-grid">
        { authenticationToken && <div className="header-grid-column-4 header-grid-column-al">
          <button className="header-nav-button" onClick={this.handleHeaderMenuPress}>
            <AppHeaderMenu active={active} />
          </button>
          <ul className={ active ? "header-nav-ul header-nav-dropdown header-nav-dropdown-active" : "header-nav-ul header-nav-dropdown" }>
            <li className="header-nav-li">
              <Link href="/landing" as="/"><a className={ serverPath === '/' ? "header-nav-a header-nav-a-active" : "header-nav-a" }>Explore</a></Link>
            </li>
            <li className="header-nav-li">
              <Link href={{ pathname: '/list-moments', query: { username: accountUsername }}} as={`/${accountUsername}`}><a className={ (serverPath || '').indexOf(`/${accountUsername}`) === 0 ? "header-nav-a header-nav-a-active" : "header-nav-a" }>Your Moments</a></Link>
            </li>
            <li className="header-nav-li">
              <a className={ serverPath === `/new` ? "header-nav-a header-nav-a-active" : "header-nav-a" } href="/new" onClick={this.handleNewMomentPress}>Create a Moment</a>
            </li>
          </ul>
        </div> }
        { !authenticationToken && <div className="header-grid-column-4 header-grid-column-al">
          <button className="header-nav-button" onClick={this.handleHeaderMenuPress}>
            <AppHeaderMenu active={active} />
          </button>
          <ul className={ active ? "header-nav-ul header-nav-dropdown header-nav-dropdown-active" : "header-nav-ul header-nav-dropdown" }>
            <li className="header-nav-li">
              <Link href="/landing" as="/"><a className={ serverPath === '/' ? "header-nav-a header-nav-a-active" : "header-nav-a" }>Explore</a></Link>
            </li>
            <li className="header-nav-li">
              <Link href="/landing" as="/about-us"><a className={ serverPath === '/about-us' ? "header-nav-a header-nav-a-active" : "header-nav-a" }>Learn More</a></Link>
            </li>
          </ul>
        </div> }
        <div className="header-grid-column-1 header-grid-column-ac">
          <AppHeaderLogo headerHeight={AppHeader.cssVariables.headerHeight} />
        </div>
        { authenticationToken && <div className="header-grid-column-4 header-grid-column-ar">
          <ul className="header-nav-ul">
            <li className="header-nav-li">
              <Link href="/signout" as="/signout"><a className="header-nav-a">Sign out</a></Link>
            </li>
          </ul>
        </div> }
        { !authenticationToken && <div className="header-grid-column-4 header-grid-column-ar">
          <ul className="header-nav-ul">
            <li className="header-nav-li">
              <Link href="/signin" as="/signin"><a className="header-nav-a">Sign In</a></Link>
            </li>
          </ul>
        </div> }
      </nav>
      <AppModal color="#fff" active={!!serverQuery.new} dismiss={this.handleNewMomentDismiss}>
        <AppModalNewMoment />
      </AppModal>
    </header>
  }

}


