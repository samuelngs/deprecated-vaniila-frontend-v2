
import 'isomorphic-fetch';

import React from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';

import If from '../If';

export default class AppLoginForm extends React.PureComponent {

  static contextTypes = {
    store: PropTypes.object,
  }

  state = {
    name: '',
    password: '',
    err: '',
  }

  onNameChanged = ({ target: { value } }) => this.setState({ name: value });
  onPasswordChanged = ({ target: { value } }) => this.setState({ password: value });

  onSubmit = e => {
    e.preventDefault();

    const { store: { getState } } = this.context;
    const { serverPath, serverQuery } = getState();
    const { current = '/' } = serverQuery;

    const { name, password } = this.state;
    const body = new FormData();
    body.append('username', name);
    body.append('password', password);

    fetch(`${BACKEND_URL}/i/auth/verify`, {
      method      : 'post',
      credentials : 'include',
      body,
    })
    .then(res => res.json())
    .then(res => (res.error ? Promise.reject(res.error) : res))
    .then(user => (location.href = current))
    .catch(m => {
      let err = m;
      console.log(err);
      switch ( err ) {
        case 'username is empty':
          err = 'What\'s your login email or username?';
          break;
        case 'password is empty':
          err = 'What\'s your login password?';
          break;
        default:
          err = 'The username and password that you\'ve entered did not match our records.';
          break;
      }
      this.setState({ err });
    });
  }

  render() {
    const { name, password, err } = this.state;
    return <form className="base" onSubmit={this.onSubmit}>
      <style jsx>{`
        .base {
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
          width: 300px;
          max-width: 100%;
        }
        .title {
          margin-top: 20px;
          margin-bottom: 10px;
          margin-left: 20px;
          margin-right: 20px;
          padding-top: 0;
          padding-bottom: 0;
          padding-left: 0;
          padding-right: 0;
          font-size: 24px;
          font-weight: 500;
          text-align: center;
          color: #000;
        }
        .input {
          margin-top: 0;
          margin-bottom: 0;
          margin-left: 14px;
          margin-right: 14px;
          padding-top: 12px;
          padding-bottom: 12px;
          padding-left: 8px;
          padding-right: 8px;
          font-size: 14px;
          font-weight: 400;
          color: #000;
          background-color: #fff;
          border: none;
          outline: none;
          -webkit-border-radius: 0;
          -webkit-appearance: none;
          border-left: 1px solid #e8e8e8;
          border-right: 1px solid #e8e8e8;
        }
        .input + .input {
          border-top: 1px solid #f2f2f2;
        }
        .input-rt {
          margin-top: 20px;
          border-top: 1px solid #e8e8e8;
          border-top-left-radius: 3px;
          border-top-right-radius: 3px;
        }
        .input-rb {
          border-bottom: 1px solid #e8e8e8;
          border-bottom-left-radius: 3px;
          border-bottom-right-radius: 3px;
        }
        .warning {
          margin-top: 14px;
          margin-bottom: 0;
          margin-left: 14px;
          margin-right: 14px;
          padding-top: 8px;
          padding-bottom: 8px;
          padding-left: 8px;
          padding-right: 8px;
          font-size: 14px;
          font-weight: 400;
          color: #fff;
          background-color: #82a3b7;
          border-radius: 3px;
        }
        .button {
          margin-top: 14px;
          margin-bottom: 14px;
          margin-left: 14px;
          margin-right: 14px;
          padding-top: 12px;
          padding-bottom: 12px;
          padding-left: 8px;
          padding-right: 8px;
          background-color: #00d68f;
          border: none;
          border-radius: 3px;
          font-size: 14px;
          font-weight: 500;
          color: #fff;
        }
      `}</style>
      <h1 className="title">Welcome back</h1>
      <If condition={!!err}>
        <div className="warning">{ err }</div>
      </If>
      <input autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false" className="input input-rt" type="text" placeholder="Email or username" value={name} onChange={this.onNameChanged} />
      <input autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false" className="input input-rb" type="password" placeholder="Password" value={password} onChange={this.onPasswordChanged} />
      <button type="submit" className="button">Login</button>
    </form>
  }

}

