
import React from 'react';
import PropTypes from 'prop-types';

import If from '../If';
import AfterEvent from '../AfterEvent';
import AppAutoComplete from '../AppAutoComplete';
import AppAutoCompleteUserRow from '../AppAutoCompleteUserRow';
import AppProgressCircular from '../AppProgressCircular';
import AppPermissionsList from '../AppPermissionsList';

import { api as permissionsApi } from '../../reducers/permissions';
import { api as usersApi } from '../../reducers/users.js';

export default class AppMomentSettings extends React.PureComponent {

  static contextTypes = {
    store: PropTypes.object,
  }

  static propTypes = {
    id          : PropTypes.string,
    name        : PropTypes.string,
    author      : PropTypes.string,
    permissions : PropTypes.array,
    onPress     : PropTypes.func,
    onCancel    : PropTypes.func,
  }

  static defaultProps = {
    id          : '',
    name        : '',
    author      : '',
    permissions : [ ],
    onPress     : e => null,
    onCancel    : e => null,
  }

  state = {
    fetching: true,
  }

  onPageLoad = e => {
    const { store: { dispatch } } = this.context;
    const { id } = this.props;
    return new Promise(resolve => {
      this.setState(state => !state.fetching && { fetching: true }, _ => {
        dispatch(permissionsApi.retrievePermissions(id))
          .then(resolve)
          .catch(resolve);
      });
    });
  }

  onPageLoaded = e => {
    this.setState(state => state.fetching && { fetching: false });
  }

  onUserRemove = username => {
    const { store: { dispatch } } = this.context;
    const { id } = this.props;
    return dispatch(permissionsApi.delPermission(id, username));
  }

  onUserSelect = username => {
    const { store: { dispatch } } = this.context;
    const { id } = this.props;
    return dispatch(permissionsApi.addPermission(id, username));
  }

  onUserSearch = keyword => {
    const { store: { dispatch } } = this.context;
    const { permissions } = this.props;
    const hmap = { };
    for ( const { username } of permissions ) {
      hmap[username] = true;
    }
    return dispatch(usersApi.searchUsers(keyword))
      .then(res => res.filter(({ username }) => !hmap[username]));
  }

  renderRow = (props, i) => <AppAutoCompleteUserRow key={i} { ...props } />

  render() {
    const { id, name, author, permissions, onPress, onCancel } = this.props;
    const { fetching } = this.state;
    return <div className="base">
      <style jsx>{`
        .base {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin: 0 auto;
          padding: 0;
          width: 800px;
          max-width: calc(100% - 80px);
        }
        .container {
          height: 560px;
          max-height: calc(100vh - 80px);
        }
        .title {
          font-size: 20px;
          font-weight: 300;
          width: 100%;
          text-align: center;
        }
        .description {
          margin-top: 20px;
          margin-bottom: 20px;
          font-size: 16px;
          font-weight: 300;
          color: #82a3b7;
          width: 100%;
          max-width: 400px;
          line-height: 1.3;
          text-align: center;
        }
        .description-icon {
          width: 16px;
          height: 16px;
          margin-right: 6px;
          fill: #fff;
        }
        .button-options {
          margin-top: 20px;
          margin-bottom: 0;
          margin-left: 0;
          margin-right: 0;
          display: flex;
          flex-direction: column;
        }
        .button {
          margin-top: 10px;
          margin-bottom: 0;
          margin-left: 0;
          margin-right: 0;
          padding-top: 12px;
          padding-bottom: 12px;
          padding-right: 12px;
          padding-left: 12px;
          border-radius: 3px;
          border: none;
          outline: none;
          cursor: pointer;
          background-color: #000;
          font-size: 14px;
          font-weight: 600;
          color: #fff;
        }
        .button-cancel {
          background-color: #f8f8f8;
          color: #8e8e8e;
        }
        .button-container {
          flex-direction: row;
          display: flex;
          align-items: center;
        }
        .button-icon {
          width: 20px;
          height: 20px;
          margin-right: 6px;
          fill: #fff;
        }
        .button-text {
          margin-top: 2px;
        }
        .separator {
          margin-top: 26px;
          margin-bottom: 20px;
        }
        @media (min-width: 768px) {
          .title {
            font-size: 40px;
          }
          .description {
            font-size: 20px;
          }
          .description-icon {
            width: 20px;
            height: 20px;
          }
          .button {
            padding-right: 20px;
            padding-left: 20px;
            font-size: 16px;
          }
          .button-options {
            display: initial;
          }
          .button + .button {
            margin-left: 6px;
          }
        }
      `}</style>

      {/* run after page is loaded */}
      <AfterEvent id={id} autostart={true} run={this.onPageLoad} then={this.onPageLoaded} timeout={1000} />

      {/* show progress bar before permissions is loaded */}
      <If condition={fetching}>
        <AppProgressCircular active={true} />
      </If>

      {/* show view after data is fetched */}
      <If condition={!fetching}>
        <div className="container">
          <h4 className="title">Share Settings</h4>
          <p className="description">If you want specific people to manage, or edit your moments together, invite them here. <img className="description-icon" src="/static/emoji/2x/1f649.png" /></p>
          <AppAutoComplete placeholder="Invite by username" search={this.onUserSearch} select={this.onUserSelect} render={this.renderRow} />
          <div className="separator" />
          <AppPermissionsList permissions={permissions} onRemove={this.onUserRemove} />
        </div>
      </If>

    </div>
  }

}

