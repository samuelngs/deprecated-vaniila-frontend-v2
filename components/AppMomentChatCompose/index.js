
import React from 'react';
import PropTypes from 'prop-types';

import { api as chatReducerApi } from '../../reducers/chat';

export default class AppMomentChatCompose extends React.PureComponent {

  static contextTypes = {
    store: PropTypes.object,
  }

  static propTypes = {
    id: PropTypes.string,
  };

  static defaultProps = {
    id: '',
  };

  state = {
    text: '',
  }

  componentDidMount() {
    this.$$_mounted_$$ = true;
  }

  componentWillUnmount() {
    this.$$_mounted_$$ = false;
  }

  handleChatChange = ({ target: { value: text } }) => {
    if ( !this.$$_mounted_$$ ) return;
    this.setState({ text });
  }

  handleChatSubmit = e => {
    const { store: { dispatch } } = this.context;
    const { id } = this.props;
    const { text } = this.state;
    const len = text.trim().length;
    if ( len === 0 ) {
      return this.n && this.n.focus();
    }
    dispatch(chatReducerApi.sendMessage(id, text))
      .then(e => this.setState({ text: '' }))
      .then(e => {
        this.n && this.n.focus();
      });
  }

  handleChatKeypress = e => {
    if ( e.key === 'Enter' ) {
      this.handleChatSubmit(e);
    }
  }

  render() {
    const { text } = this.state;
    const len = text.trim().length;
    return <div className="base">
      <style jsx>{`
        .base {
          display: flex;
          flex-direction: row;
          margin-top: 0;
          margin-bottom: 0;
          margin-left: 0;
          margin-right: 0;
          padding-top: 0;
          padding-bottom: 0;
          padding-left: 0;
          padding-right: 0;
          min-height: 48px;
          border-top: 1px solid rgba(0, 0, 0, 0.05);
          background-color: #fff;
        }
        .input {
          flex: 1;
          margin-top: 0;
          margin-bottom: 0;
          margin-left: 0;
          margin-right: 0;
          padding-top: 4px;
          padding-bottom: 4px;
          padding-left: 10px;
          padding-right: 10px;
          border: none;
          outline: none;
          font-size: 14px;
          font-weight: 400;
          color: #53575d;
        }
        .input::placeholder {
          color: #bbb;
        }
        .button {
          margin-top: 10px;
          margin-bottom: 10px;
          margin-left: 0;
          margin-right: 10px;
          padding-top: 0;
          padding-bottom: 0;
          padding-left: 7px;
          padding-right: 7px;
          font-size: 14px;
          font-weight: 500;
          color: #fff;
          border: none;
          border-radius: 2px;
          background-color: #a6aeb2;
          cursor: text;
          outline: none;
          opacity: .5;
          transition: opacity .2s ease;
        }
        .button-active {
          position: initial;
          opacity: 1;
          cursor: pointer;
        }
      `}</style>
      <input
        ref={n => this.n = n}
        type="text"
        value={text}
        placeholder="Say something..."
        className="input"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        onChange={this.handleChatChange}
        onKeyPress={this.handleChatKeypress}
      />
      <button className={len > 0 ? "button button-active" : "button"} onClick={this.handleChatSubmit}>Send</button>
    </div>
  }

}
