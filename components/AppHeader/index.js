
import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import Router from 'next/router';

import If from '../If';
import AppHeaderLogo from '../AppHeaderLogo';
import AppHeaderMenu from '../AppHeaderMenu';
import AppModal from '../AppModal';
import AppModalNewMoment from '../AppModalNewMoment';
import AppDropdownButton from '../AppDropdownButton';
import AppDropdownMenu from '../AppDropdownMenu';
import AppDropdownItem from '../AppDropdownItem';
import AppDropdownSeparator from '../AppDropdownSeparator';

export default class AppHeader extends React.Component {

  static contextTypes = {
    store: PropTypes.object,
  }

  static cssVariables = {
    headerBackgroundColor: '#fff',
    headerIconColor: '#8aa7b1',
  }

  state = {
    active: false,
  }

  componentDidMount() {
    this.$$_mounted_$$ = true;
  }

  componentWillUnmount() {
    this.$$_mounted_$$ = false;
  }

  handleHeaderMenuPress = e => {
    const { active } = this.state;
    this.$$_mounted_$$ && this.setState({ active: !active });
  }

  handleNewMomentPress = e => {

    e.preventDefault();

    const { store: { getState } } = this.context;
    const { serverPath, serverPathname, serverQuery } = getState();

    if ( serverPath === '/new' ) {
      return;
    }

    return Router.push({
      pathname: serverPathname,
      query   : { ...serverQuery, new: 'modal' },
    }, '/new');
  }

  handleNewMomentDismiss = e => {
    e.preventDefault();
    return Router.back();
  }

  handleUserLogin = e => {

    e.preventDefault();

    const { store: { getState } } = this.context;
    const { serverPath } = getState();

    return Router.push({
      pathname: '/signin',
      query   : { redirect: serverPath },
    }, '/signin');
  }

  handleUserLogout = e => {

    e.preventDefault();

    const { store: { getState } } = this.context;
    const { serverPath } = getState();

    return Router.push({
      pathname: '/signout',
      query   : { redirect: serverPath },
    }, '/signout');
  }

  render() {

    const { active } = this.state;
    const { store: { getState } } = this.context;
    const { serverPath, serverQuery, authenticationToken, accountUsername, accountAvatar } = getState();

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
          height: 46px;
          position: fixed;
          display: flex;
          background-color: ${AppHeader.cssVariables.headerBackgroundColor};
          z-index: 21;
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
        .header-nav-ul:hover .header-nav-a {
          color: #ccc;
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
          font-weight: 500;
          text-decoration: none;
          color: #484848;
          transition: color .5s ease;
        }
        .header-nav-avatar {
          width: 24px;
          height: 24px;
          border: 1px solid rgba(0, 0, 0, 0.05);
          border-radius: 12px;
        }
        .header-nav-a:hover,
        .header-nav-a.header-nav-a-active,
        .header-nav-ul:hover .header-nav-a:hover {
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
          .header {
            height: 56px;
          }
          .header-nav-button {
            display: none;
          }
          .header-nav-ul {
            flex-direction: row;
          }
          .header-nav-ul.header-nav-dropdown {
            display: flex;
            margin-left: 0;
            margin-right: 0;
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
            font-weight: 500;
            color: #787878;
          }
          .header-grid-column-al { order: 2; }
          .header-grid-column-ac { order: 1; padding-left: 10px; padding-right: 10px; }
          .header-grid-column-ar { order: 3; }
        }
      `}</style>
      <style jsx global>{`
        .avatar-dropdown-wrapper {
          width: 24px;
          max-width: 24px;
        }
        .avatar-dropdown-button {
          margin-top: 0;
          margin-bottom: 0;
          margin-left: 0;
          margin-right: 0;
          padding-top: 0;
          padding-bottom: 0;
          padding-left: 0;
          padding-right: 0;
          border: none;
          background-color: transparent;
          outline: none;
          cursor: pointer;
          width: 24px;
          height: 46px;
        }
        @media (min-width: 768px) {
          .avatar-dropdown-button {
            height: 56px;
          }
        }
      `}</style>
      <nav className="header-nav header-grid">

        {/* left menu items when logged in */}
        <If condition={!!authenticationToken}>
          <div className="header-grid-column-4 header-grid-column-al">
            <button className="header-nav-button" onClick={this.handleHeaderMenuPress}>
              <AppHeaderMenu active={active} />
            </button>
            <ul className={ active ? "header-nav-ul header-nav-dropdown header-nav-dropdown-active" : "header-nav-ul header-nav-dropdown" }>
              <li className="header-nav-li">
                <Link href={{ pathname: '/list-moments', query: { username: accountUsername }}} as={`/${accountUsername}`}><a className={ (serverPath || '').indexOf(`/${accountUsername}`) === 0 ? "header-nav-a header-nav-a-active" : "header-nav-a" }>Your Moments</a></Link>
              </li>
              <li className="header-nav-li">
                <a className={ serverPath === `/new` ? "header-nav-a header-nav-a-active" : "header-nav-a" } href="/new" onClick={this.handleNewMomentPress}>Create a Moment</a>
              </li>
            </ul>
          </div>
        </If>

        {/* left menu items when guest */}
        <If condition={!authenticationToken}>
          <div className="header-grid-column-4 header-grid-column-al">
          </div>
        </If>

        {/* logo container */}
        <div className="header-grid-column-1 header-grid-column-ac">
          <Link href="/explore" as="/">
            <a>
              <AppHeaderLogo active={serverPath === '/'} />
            </a>
          </Link>
        </div>

        {/* user left menu */}
        <If condition={!!authenticationToken}>
          <div className="header-grid-column-4 header-grid-column-ar">
            <ul className="header-nav-ul">
              <li className="header-nav-li avatar-dropdown-wrapper">
                <AppDropdownButton className="avatar-dropdown-button" render={<img className="header-nav-avatar" src={accountAvatar} />}>
                  <AppDropdownMenu>
                    <AppDropdownItem onPress={this.handleUserLogout}>
                      <a className="header-nav-a">Sign out</a>
                    </AppDropdownItem>
                  </AppDropdownMenu>
                </AppDropdownButton>
              </li>
            </ul>
          </div>
        </If>

        {/* guest left menu */}
        <If condition={!authenticationToken}>
          <div className="header-grid-column-4 header-grid-column-ar">
            <ul className="header-nav-ul">
              <li className="header-nav-li">
                <a className="header-nav-a" href="/signin" onClick={this.handleUserLogin}>Sign In</a>
              </li>
            </ul>
          </div>
        </If>

      </nav>

      {/* new moment modal screen */}
      <AppModal color="#fff" active={!!serverQuery.new} dismiss={this.handleNewMomentDismiss}>
        <AppModalNewMoment />
      </AppModal>

    </header>
  }

}


