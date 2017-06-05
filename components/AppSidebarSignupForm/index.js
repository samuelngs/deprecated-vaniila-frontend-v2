
import 'isomorphic-fetch';

import React from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';

import If from '../If';

export default class AppSidebarSignupForm extends React.PureComponent {

  state = {
    name: '',
    email: '',
    username: '',
    password: '',
    err: '',
  }

  onNameChanged = ({ target: { value } }) => this.setState({ name: value });
  onEmailChanged = ({ target: { value } }) => this.setState({ email: value });
  onUsernameChanged = ({ target: { value } }) => this.setState({ username: value });
  onPasswordChanged = ({ target: { value } }) => this.setState({ password: value });

  onSubmit = e => {
    e.preventDefault();

    const { name, email, username, password } = this.state;
    const body = new FormData();
    body.append('name', name);
    body.append('email', email);
    body.append('username', username);
    body.append('password', password);

    fetch(`${BACKEND_URL}/i/auth/join`, {
      method      : 'post',
      credentials : 'include',
      body,
    })
    .then(res => res.json())
    .then(res => (res.error ? Promise.reject(res.error) : res))
    .then(user => location.reload())
    .catch(m => {
      let err = m;
      switch ( err ) {
        case 'name is empty':
          err = 'What\'s your name?';
          break;
        case 'name length has to be minimum of 3 and maximum of 34 characters':
          err = 'Your name must be at least 3 characters.';
          break;
        case 'username is empty':
          err = 'What\'s your username?';
          break;
        case 'username length has to be minimum of 3 and maximum of 14 characters':
          err = 'Your username must be at least 3 characters.';
          break;
        case 'email address is empty':
          err = 'What\'s your email address?';
          break;
        case 'password is empty':
          err = 'What\'s your password?';
          break;
        case 'password length has to be minimum of 5 and maximum of 60 characters':
          err = 'Your password must be at least 5 characters.';
          break;
      }
      this.setState({ err });
    });
  }

  render() {
    const { name, email, password, username, err } = this.state;
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
          background-color: #000;
          background-image: url('/static/signup/background.jpg');
          background-position: center;
          background-size: cover;
          border-radius: 3px;
          min-height: 300px;
        }
        .title {
          margin-top: 20px;
          margin-bottom: 0;
          margin-left: 20px;
          margin-right: 20px;
          padding-top: 0;
          padding-bottom: 0;
          padding-left: 0;
          padding-right: 0;
          font-size: 18px;
          font-weight: 500;
          color: #fff;
        }
        .description {
          margin-top: 5px;
          margin-bottom: 0;
          margin-left: 20px;
          margin-right: 20px;
          padding-top: 0;
          padding-bottom: 0;
          padding-left: 0;
          padding-right: 0;
          font-size: 14px;
          font-weight: 400;
          color: #fff;
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
        }
        .input + .input {
          border-top: 1px solid #f8f8f8;
        }
        .input-rt {
          margin-top: 20px;
          border-top-left-radius: 3px;
          border-top-right-radius: 3px;
        }
        .input-rb {
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
          background-color: rgba(119, 86, 89, 0.52);
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
          background-color: #fff;
          border: none;
          border-radius: 3px;
          font-size: 14px;
          font-weight: 500;
          color: #06eaaf;
        }
      `}</style>
      <h4 className="title">New to Vaniila?</h4>
      <p className="description">Sign up for a free account and start creating your own moments and stories</p>
      <If condition={!!err}>
        <div className="warning">{ err }</div>
      </If>
      <input autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false" className="input input-rt" type="text" placeholder="Name" value={name} onChange={this.onNameChanged} />
      <input autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false" className="input" type="email" placeholder="Email" value={email} onChange={this.onEmailChanged} />
      <input autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false" className="input" type="password" placeholder="Password (min 5 characters)" value={password} onChange={this.onPasswordChanged} />
      <input autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false" className="input input-rb" type="text" placeholder="Username" value={username} onChange={this.onUsernameChanged} />
      <button type="submit" className="button">Create your free account!</button>
    </form>
  }

}
