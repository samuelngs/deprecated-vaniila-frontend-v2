
import React from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';

import If from '../If';
import AppDropdownButton from '../AppDropdownButton';
import AppDropdownMenu from '../AppDropdownMenu';
import AppDropdownItem from '../AppDropdownItem';
import AppDropdownSeparator from '../AppDropdownSeparator';
import AppMomentDropdownEdit from '../AppMomentDropdownEdit';
import AppMomentDropdownDelete from '../AppMomentDropdownDelete';
import AppMomentDropdownTheaterMode from '../AppMomentDropdownTheaterMode';
import AppMomentDeleteConfirmation from '../AppMomentDeleteConfirmation';

export default class AppMomentDetails extends React.PureComponent {

  static contextTypes = {
    store: PropTypes.object,
  }

  static propTypes = {
    doc     : PropTypes.object,
    modal   : PropTypes.bool,
    children: PropTypes.node,
    style   : PropTypes.object,
  }

  static defaultProps = {
    doc     : { },
    modal   : false,
    children: null,
    style   : undefined,
  }

  handleUsernamePress = e => {
    e.preventDefault && e.preventDefault();

    const { doc } = this.props;
    const { store: { getState } } = this.context;

    const { author: { username } } = doc;
    const { serverPathname, serverQuery, serverQuery: { username: current } } = getState();

    if ( serverPathname === '/list-moments' && username === current ) {
      return Router.back();
    }

    return Router.push({
      pathname: '/list-moments',
      query   : { username },
    }, `/${username}`);
  }

  handleTheaterModePress = e => {

    e.preventDefault();

    const { doc: { id, author: { username } } } = this.props;
    return Router.push({
      pathname: '/view-moment',
      query   : { id, username },
    }, `/${username}/${id}`);
  }

  handleEditPress = e => {

    e.preventDefault();

    const { doc: { id, author: { username } } } = this.props;
    return Router.push({
      pathname: '/edit-moment',
      query   : { id, username },
    }, `/${username}/${id}/edit`);
  }

  render() {
    const { doc, modal, children, style } = this.props;
    const { id, name: title, author: { avatar, name, username }, permissions: { admin, write } } = doc;
    return <div className={ modal ? "base base-modal" : "base" } style={style}>
      <style jsx>{`
        .base {
          display: flex;
          flex-direction: column;
          margin-top: 0;
          margin-bottom: 0;
          margin-left: auto;
          margin-right: auto;
        }
        .base-modal {
          border-left: 1px solid rgba(0, 0, 0, 0.05);
        }
        .details-container {
          display: flex;
          flex-direction: row;
          margin-top: 0;
          margin-bottom: 0;
          margin-left: 0;
          margin-right: 0;
          padding-top: 10px;
          padding-bottom: 10px;
          padding-left: 14px;
          padding-right: 14px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.03);
        }
        .details-avatar {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 50px;
          width: 50px;
        }
        .details-avatar a {
          width: 38px;
          height: 38px;
        }
        .details-avatar-image {
          width: 36px;
          height: 36px;
          border: 1px solid rgba(0, 0, 0, 0.05);
          border-radius: 19px;
        }
        .details-content {
          margin-top: 0;
          margin-bottom: 0;
          margin-left: 0;
          margin-right: 0;
          padding-top: 0;
          padding-bottom: 0;
          padding-left: 10px;
          padding-right: 10px;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .details-options {
          margin-top: 10px;
          margin-bottom: 10px;
          margin-left: 0;
          margin-right: 0;
          padding-top: 0;
          padding-bottom: 0;
          padding-left: 0;
          padding-right: 0;
          width: 30px;
          max-height: 30px;
        }
        .details-title {
          margin-top: 0;
          margin-bottom: 0;
          margin-left: 0;
          margin-right: 0;
          padding-top: 0;
          padding-bottom: 0;
          padding-left: 0;
          padding-right: 0;
          font-size: 14px;
          font-weight: 600;
          color: #000;
        }
        .details-username {
          margin-top: 2px;
          margin-bottom: 0;
          margin-left: 0;
          margin-right: 0;
          padding-top: 0;
          padding-bottom: 0;
          padding-left: 0;
          padding-right: 0;
        }
        .details-username a {
          font-size: 14px;
          font-weight: 400;
          color: #999;
          text-decoration: none;
        }
        .details-username a:hover,
        .details-username a:active {
          color: #777;
        }
      `}</style>
      <style jsx global>{`
        .item-dropdown-button {
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
        }
      `}</style>
      <header className="details-container">
        <div className="details-avatar">
          <a href={`/${username}`} onClick={this.handleUsernamePress}><img className="details-avatar-image" src={avatar} /></a>
        </div>
        <div className="details-content">
          <h1 className="details-title">{ title || 'Draft' }</h1>
          <h4 className="details-username">
            <a href={`/${username}`} onClick={this.handleUsernamePress}>{ name }</a>
          </h4>
        </div>
        <div className="details-options">
          <AppDropdownButton className="item-dropdown-button" id={id} icon={true}>
            <AppDropdownMenu>
              <AppDropdownItem onPress={this.handleTheaterModePress}>
                <AppMomentDropdownTheaterMode />
              </AppDropdownItem>
              <If condition={write}>
                <AppDropdownItem onPress={this.handleEditPress}>
                  <AppMomentDropdownEdit />
                </AppDropdownItem>
              </If>
            </AppDropdownMenu>
          </AppDropdownButton>
        </div>
      </header>
      { children }
    </div>;
  }

}
