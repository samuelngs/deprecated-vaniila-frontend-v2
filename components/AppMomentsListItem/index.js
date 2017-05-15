
import React from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';

import If from '../If';
import AppDropdownButton from '../AppDropdownButton';
import AppDropdownMenu from '../AppDropdownMenu';
import AppDropdownItem from '../AppDropdownItem';

export default class AppMomentsListItem extends React.PureComponent {

  static contextTypes = {
    store: PropTypes.object,
  }

  static propTypes = {
    whoami      : PropTypes.string,
    profile     : PropTypes.string,
    mode        : PropTypes.string,
    id          : PropTypes.string,
    author      : PropTypes.string,
    name        : PropTypes.string,
    background  : PropTypes.string,
    members     : PropTypes.array,
    impressions : PropTypes.number,
    likes       : PropTypes.number,
    liked       : PropTypes.bool,
    created_at  : PropTypes.string,
  }

  static defaultProps = {
    whoami      : '',
    profile     : '',
    mode        : 'desktop',
    id          : '',
    author      : '',
    name        : '',
    background  : '',
    members     : [ ],
    impressions : 0,
    likes       : 0,
    liked       : false,
    created_at  : '',
  }

  handleAuthorPress = e => {

    e.preventDefault();

    const { author: username } = this.props;
    const { store: { getState } } = this.context;
    const { serverPath } = getState();

    if ( serverPath === `/${username}` ) return;

    return Router.push({
      pathname: '/list-moments',
      query   : { username },
    }, `/${username}`);
  }

  handleItemPress = e => {

    e.preventDefault();

    const { profile, id, author: username, mode } = this.props;
    const { store: { getState } } = this.context;
    const { serverPath, serverPathname, serverQuery } = getState();

    if ( typeof serverQuery.id === 'string' && serverQuery.id.trim().length > 0 ) return;

    switch ( mode ) {

      case 'desktop':
        return Router.push({
          pathname: serverPathname,
          query   : { ...serverQuery, id, username: profile },
        }, `/${username}/${id}`);

      case 'mobile':
        return Router.push({
          pathname: '/view-moment',
          query   : { id, username },
        }, `/${username}/${id}`);
    }

  }

  render() {
    const { id, whoami, author, name, members, background, impressions, likes, liked, created_at, onPress } = this.props;
    const editable = whoami === author || members.indexOf(whoami) > -1;
    return <li className="item">
      <style jsx>{`
        .item {
          margin-top: 0;
          margin-bottom: 20px;
          margin-left: 0;
          margin-right: 0;
          padding-top: 0;
          padding-bottom: 0;
          padding-left: 0;
          padding-right: 0;
          list-style: none;
          display: flex;
          flex-direction: column;
          flex-basis: 100%;
          max-width: 100%;
          width: 300px;
          height: 360px;
        }
        .item-cover {
          width: 300px;
          height: 300px;
          max-width: 100%;
        }
        .item-cover-image {
          width: 300px;
          height: 300px;
          border-radius: 3px;
          overflow: hidden;
          max-width: 100%;
        }
        div.item-cover-image {
          background-color: #ebfff6;
        }
        .item-details {
          display: flex;
          flex-direction: row;
          margin-top: 0;
          margin-bottom: 0;
          margin-left: 0;
          margin-right: 0;
          padding-top: 20px;
          padding-bottom: 20px;
          padding-left: 0;
          padding-right: 0;
        }
        .item-details-info {
          display: flex;
          flex: 1;
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
        .item-details-option {
          margin-top: 0;
          margin-bottom: 0;
          margin-left: 0;
          margin-right: 0;
          padding-top: 0;
          padding-bottom: 0;
          padding-left: 0;
          padding-right: 0;
          width: 30px;
        }
        .item-details a {
          margin-top: 0;
          margin-bottom: 0;
          margin-left: 0;
          margin-right: 0;
          padding-top: 0;
          padding-bottom: 0;
          padding-left: 0;
          padding-right: 0;
          display: block;
          text-decoration: none;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }
        .item-name {
          margin-top: 2px;
          margin-bottom: 2px;
          margin-left: 0;
          margin-right: 0;
          padding-top: 0;
          padding-bottom: 0;
          padding-left: 0;
          padding-right: 0;
        }
        .item-name a {
          font-size: 16px;
          font-weight: 500;
          color: #000;
        }
        .item-description {
          margin-top: 0;
          margin-bottom: 0;
          margin-left: 0;
          margin-right: 0;
          padding-top: 0;
          padding-bottom: 0;
          padding-left: 0;
          padding-right: 0;
        }
        .item-description a {
          font-size: 14px;
          font-weight: 400;
          color: #777;
        }
        @media (min-width: 680px) {
          .item { flex-basis: calc(50% - 20px); }
          .item + .item { margin-left: 20px; }
          .item:nth-child(2n + 1) { margin-left: 0px; }
        }
        @media (min-width: 1000px) {
          .item { flex-basis: calc(33.3% - 20px); }
          .item:nth-child(2n + 1) { margin-left: 20px; }
          .item:nth-child(3n + 1) { margin-left: 0px; }
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
      <a className="item-cover" href={`/${author}/${id}`} onClick={this.handleItemPress}>
        <If condition={!!background}>
          <img className="item-cover-image" src={`${CDN_URL}/${background}/embed`} />
        </If>
        <If condition={!background}>
          <div className="item-cover-image" />
        </If>
      </a>
      <div className="item-details">
        <div className="item-details-info">
          <h2 className="item-name">
            <a href={`/${author}/${id}`} onClick={this.handleItemPress}>{ name || 'Draft' }</a>
          </h2>
          <p className="item-description">
            <a href={`/${author}`} onClick={this.handleAuthorPress}>{ author }</a>
          </p>
        </div>
        <If condition={editable}>
          <div className="item-details-option">
            <AppDropdownButton className="item-dropdown-button" id={id} icon={true}>
              <AppDropdownMenu>
                <AppDropdownItem>Edit</AppDropdownItem>
                <AppDropdownItem>Delete</AppDropdownItem>
              </AppDropdownMenu>
            </AppDropdownButton>
          </div>
        </If>
      </div>
    </li>
  }

}

