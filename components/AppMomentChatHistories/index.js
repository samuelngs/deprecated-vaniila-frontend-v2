
import React from 'react';
import PropTypes from 'prop-types';

import AppMomentChatHistory from '../AppMomentChatHistory';

export default class AppMomentHistories extends React.PureComponent {

  static propTypes = {
    id      : PropTypes.string,
    messages: PropTypes.array,
  }

  static defaultProps = {
    id      : '',
    messages: [ ],
  }

  componentDidMount() {
    setTimeout(_ => {
      if ( this.n ) this.n.scrollTop = this.n.scrollHeight;
    }, 0);
  }

  componentDidUpdate({ messages: prev }) {
    const { messages: next } = this.props;
    if ( next !== prev && this.n ) {
      setTimeout(_ => {
        if ( this.n ) this.n.scrollTop = this.n.scrollHeight;
      }, 0);
    }
  }

  render() {
    const { id, messages } = this.props;
    return <ul ref={n => this.n = n} className="base">
      <style jsx>{`
        .base {
          flex: 1;
          flex-grow: 1;
          flex-shrink: 1;
          margin-top: 0;
          margin-bottom: 0;
          margin-left: 0;
          margin-right: 0;
          padding-top: 18px;
          padding-bottom: 18px;
          padding-left: 0;
          padding-right: 0;
          overflow: auto;
        }
      `}</style>
      { messages.map(({ name, username, message, when }, i) => <AppMomentChatHistory key={i} name={name} username={username} message={message} when={when} />) }
    </ul>
  }

}


