
import React from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';

import If from '../If';
import AppModal from '../AppModal';
import AppDropdownButton from '../AppDropdownButton';
import AppDropdownMenu from '../AppDropdownMenu';
import AppDropdownItem from '../AppDropdownItem';
import AppDropdownSeparator from '../AppDropdownSeparator';
import AppMomentDropdownEdit from '../AppMomentDropdownEdit';
import AppMomentDropdownDelete from '../AppMomentDropdownDelete';
import AppMomentDeleteConfirmation from '../AppMomentDeleteConfirmation';

import { api as momentsApi } from '../../reducers/moments';

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

  state = {
    confirmation: false,
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
          query   : { ...serverQuery, id, username: (profile || username) },
        }, `/${username}/${id}`);

      case 'mobile':
        return Router.push({
          pathname: '/view-moment',
          query   : { id, username },
        }, `/${username}/${id}`);
    }

  }

  handleEditPress = e => {

    e.preventDefault();

    const { id, author: username } = this.props;

    return Router.push({
      pathname: '/edit-moment',
      query   : { id, username },
    }, `/${username}/${id}/edit`);

  }

  handleDeletePress = e => {

    e.preventDefault();

    this.setState(state => !state.confirmation && { confirmation: true });
  }

  handleConfirmationDismiss = e => {
    this.setState(state => state.confirmation && { confirmation: false });
  }

  handleConfirmationRemove = e => {

    const { store: { dispatch } } = this.context;
    const { id, author } = this.props;

    this.setState(state => state.confirmation && { confirmation: false }, e => {
      dispatch(momentsApi.removeMoments(author, id));
    });
  }

  render() {
    const { id, whoami, author, name, members, background, impressions, likes, liked, created_at, onPress } = this.props;
    const { confirmation } = this.state;
    const editable = whoami === author || members.indexOf(whoami) > -1;
    return <li className="item moments-list-item">
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
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f7f7f7;
        }
        div.item-cover-image svg {
          fill: #dedede;
          width: 200px;
          height: 200px;
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
          flex-grow: 1;
          flex-shrink: 1;
          flex-direction: column;
          max-width: 100%;
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
          font-weight: 400;
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
        @media (min-width: 680px) {
          .moments-list-item { flex-basis: calc(50% - 20px); }
          .moments-list-item + .moments-list-item { margin-left: 20px; }
          .moments-list-item:nth-child(2n + 1) { margin-left: 0px; }
        }
        @media (min-width: 1000px) {
          .moments-list-item { flex-basis: calc(33.3% - 20px); }
          .moments-list-item:nth-child(2n + 1) { margin-left: 20px; }
          .moments-list-item:nth-child(3n + 1) { margin-left: 0px; }
        }
      `}</style>
      <a className="item-cover" href={`/${author}/${id}`} onClick={this.handleItemPress}>
        <If condition={!!background}>
          <img className="item-cover-image" src={`${CDN_URL}/${background}/embed`} />
        </If>
        <If condition={!background}>
          <div className="item-cover-image">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
              <path d="M50 28c-14.764 0-26.783 11.88-27 26.594v1.375c-.75-.08-1.22-.33-1.5-.6-.34-.33-.5-.75-.5-1.377a1 1 0 0 0-1.156-1A1 1 0 0 0 19 54c0 .524-.21.936-.688 1.313-.477.376-1.25.687-2.312.687a1 1 0 1 0 0 2c1.423 0 2.66-.384 3.563-1.094.14-.112.22-.278.343-.406.087.106.118.246.22.344.787.758 1.95 1.156 3.374 1.156 1.423 0 2.74-.39 3.75-1.063.303-.2.507-.485.75-.75.243.265.447.55.75.75C29.76 57.61 31.077 58 32.5 58s2.74-.39 3.75-1.063c.303-.2.507-.485.75-.75.243.265.447.55.75.75C38.76 57.61 40.077 58 41.5 58s2.74-.39 3.75-1.063c.265-.176.435-.43.656-.656.175.21.313.46.532.63.9.71 2.14 1.097 3.562 1.097 1.423 0 2.66-.383 3.563-1.093.218-.172.356-.415.53-.625.222.225.392.48.657.656 1.01.67 2.327 1.06 3.75 1.06s2.74-.39 3.75-1.06c.303-.2.507-.486.75-.75.243.264.447.55.75.75 1.01.67 2.327 1.06 3.75 1.06s2.74-.39 3.75-1.063c.303-.2.507-.485.75-.75.243.265.447.55.75.75 1.01.67 2.327 1.06 3.75 1.06s2.587-.397 3.375-1.155c.1-.097.132-.238.22-.344.122.13.2.295.343.407.9.71 2.14 1.095 3.562 1.095a1 1 0 1 0 0-2c-1.062 0-1.835-.31-2.313-.687C81.21 54.938 81 54.525 81 54a1 1 0 0 0-2 0c0 .624-.16 1.047-.5 1.375-.28.27-.75.515-1.5.594v-1.38C76.783 39.88 64.764 28 50 28zm0 2c13.683 0 24.782 10.965 25 24.594v1.218c-.434-.127-.822-.33-1.125-.53-.62-.413-.875-.86-.875-1.282a1 1 0 0 0-2 0c0 .423-.256.87-.875 1.28-.62.414-1.563.72-2.625.72s-2.006-.306-2.625-.72c-.62-.41-.875-.857-.875-1.28a1 1 0 0 0-2 0c0 .423-.256.87-.875 1.28-.62.414-1.563.72-2.625.72s-2.006-.306-2.625-.72c-.62-.41-.875-.857-.875-1.28a1 1 0 0 0-2 0c0 .524-.21.936-.688 1.313-.477.376-1.25.687-2.312.687-1.062 0-1.835-.31-2.313-.688C47.21 54.937 47 54.525 47 54a1 1 0 0 0-2 0c0 .423-.256.87-.875 1.28-.62.414-1.563.72-2.625.72s-2.006-.306-2.625-.72c-.62-.41-.875-.857-.875-1.28a1 1 0 0 0-2 0c0 .423-.256.87-.875 1.28-.62.414-1.563.72-2.625.72s-2.006-.306-2.625-.72c-.62-.41-.875-.857-.875-1.28a1 1 0 0 0-2 0c0 .423-.256.87-.875 1.28-.303.203-.69.405-1.125.532v-1.217C25.218 40.965 36.317 30 50 30zM22.875 59.97A1 1 0 0 0 22 61c0 1.234.74 2.264 1.75 2.938C24.76 64.61 26.077 65 27.5 65s2.74-.39 3.75-1.063c.303-.2.507-.485.75-.75.243.265.447.55.75.75C33.76 64.612 35.077 65 36.5 65s2.74-.39 3.75-1.063c.303-.2.507-.485.75-.75.243.265.447.55.75.75C42.76 64.612 44.077 65 45.5 65s2.74-.39 3.75-1.063c.303-.2.507-.485.75-.75.243.265.447.55.75.75C51.76 64.612 53.077 65 54.5 65s2.74-.39 3.75-1.063c.303-.2.507-.485.75-.75.243.265.447.55.75.75C60.76 64.612 62.077 65 63.5 65s2.74-.39 3.75-1.063c.303-.2.507-.485.75-.75.243.265.447.55.75.75C69.76 64.612 71.077 65 72.5 65s2.74-.39 3.75-1.063C77.26 63.264 78 62.234 78 61a1 1 0 1 0-2 0c0 .423-.256.87-.875 1.28-.62.414-1.563.72-2.625.72s-2.006-.306-2.625-.72c-.62-.41-.875-.857-.875-1.28a1 1 0 0 0-2 0c0 .423-.256.87-.875 1.28-.62.414-1.563.72-2.625.72s-2.006-.306-2.625-.72c-.62-.41-.875-.857-.875-1.28a1 1 0 0 0-2 0c0 .423-.256.87-.875 1.28-.62.414-1.563.72-2.625.72s-2.006-.306-2.625-.72c-.62-.41-.875-.857-.875-1.28a1 1 0 0 0-2 0c0 .423-.256.87-.875 1.28-.62.414-1.563.72-2.625.72s-2.006-.306-2.625-.72c-.62-.41-.875-.857-.875-1.28a1 1 0 0 0-2 0c0 .423-.256.87-.875 1.28-.62.414-1.563.72-2.625.72s-2.006-.306-2.625-.72c-.62-.41-.875-.857-.875-1.28a1 1 0 0 0-2 0c0 .423-.256.87-.875 1.28-.62.414-1.563.72-2.625.72s-2.006-.306-2.625-.72c-.62-.41-.875-.857-.875-1.28a1 1 0 0 0-1.125-1.03zm4 7A1 1 0 0 0 26 68c0 1.334.945 2.323 2.063 2.97C29.18 71.614 30.576 72 32 72s2.66-.384 3.563-1.094c.218-.172.356-.415.53-.625.222.23.392.48.657.66 1.01.677 2.327 1.06 3.75 1.06s2.74-.39 3.75-1.06c.328-.22.556-.52.813-.81.314.31.612.62 1 .844C47.18 71.614 48.577 72 50 72s2.82-.385 3.938-1.03c.387-.225.685-.535 1-.845.256.29.484.594.812.813C56.76 71.61 58.077 72 59.5 72s2.74-.39 3.75-1.063c.265-.176.435-.43.656-.656.175.21.313.46.532.63.9.71 2.14 1.097 3.562 1.097 1.423 0 2.82-.384 3.938-1.03C73.055 70.327 74 69.337 74 68a1 1 0 1 0-2 0c0 .323-.3.81-1.063 1.25-.76.44-1.875.75-2.937.75-1.062 0-1.835-.31-2.313-.688C65.21 68.936 65 68.525 65 68a1 1 0 0 0-2 0c0 .423-.256.87-.875 1.28-.62.414-1.563.72-2.625.72s-2.006-.306-2.625-.72c-.62-.41-.875-.857-.875-1.28a1 1 0 0 0-2 0c0 .323-.3.81-1.063 1.25-.76.44-1.875.75-2.937.75-1.062 0-2.176-.31-2.938-.75C46.302 68.81 46 68.323 46 68a1 1 0 0 0-2 0c0 .423-.256.87-.875 1.28-.62.414-1.563.72-2.625.72s-2.006-.306-2.625-.72c-.62-.41-.875-.857-.875-1.28a1 1 0 0 0-2 0c0 .524-.21.936-.688 1.313-.477.376-1.25.687-2.312.687-1.062 0-2.176-.31-2.938-.75C28.302 68.81 28 68.323 28 68a1 1 0 0 0-1.125-1.03z" />
            </svg>
          </div>
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
                <AppDropdownItem onPress={this.handleEditPress}>
                  <AppMomentDropdownEdit />
                </AppDropdownItem>
                <AppDropdownSeparator />
                <AppDropdownItem warning onPress={this.handleDeletePress}>
                  <AppMomentDropdownDelete />
                </AppDropdownItem>
              </AppDropdownMenu>
            </AppDropdownButton>
          </div>
        </If>
        <AppModal color="#fff" active={confirmation} dismiss={this.handleConfirmationDismiss}>
          <AppMomentDeleteConfirmation name={(name || 'Draft')} author={author} onPress={this.handleConfirmationRemove} onCancel={this.handleConfirmationDismiss} />
        </AppModal>
      </div>
    </li>
  }

}

