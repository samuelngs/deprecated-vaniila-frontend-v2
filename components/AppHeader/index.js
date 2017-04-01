
import React from 'react';
import Link from 'next/link';

export default class AppHeader extends React.Component {

  static contextTypes = {
    store: React.PropTypes.object,
  }

  static cssVariables = {
    headerHeight: 60,
    headerBackgroundColor: '#fff',
  }

  render() {
    const { store: { getState } } = this.context;
    const { authenticationToken, accountUsername } = getState();
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
          background-color: ${AppHeader.cssVariables.headerBackgroundColor};
          box-shadow: 0 2px 2px -2px rgba(0, 0, 0, .18);
        }
        .header-nav {
          margin-top: 0;
          margin-bottom: 0;
          margin-left: auto;
          margin-right: auto;
          padding-top: 0;
          padding-bottom: 0;
          padding-left: 0;
          padding-right: 0;
          height: ${AppHeader.cssVariables.headerHeight}px;
          width: 1170px;
          max-width: calc(100% - 40px);
          display: flex;
          flex-direction: row;
        }
        a + a {
          margin-left: 10px;
        }
      `}</style>
      <nav className="header-nav">
        <Link href="/landing" as="/"><a>Home</a></Link>
        { authenticationToken && <Link href="/new-moment" as="/new"><a>Create new Moment</a></Link> }
        { authenticationToken && <Link href={{ pathname: '/list-moments', query: { username: accountUsername }}} as={`/${accountUsername}`}><a>@{ accountUsername }</a></Link> }
        { authenticationToken && <Link href="/signout" as="/signout"><a>Sign Out</a></Link> }
        { !authenticationToken && <Link href="/signin" as="/signin"><a>Sign In</a></Link> }
      </nav>
    </header>
  }

}


