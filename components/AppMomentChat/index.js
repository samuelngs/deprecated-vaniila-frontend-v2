
import 'isomorphic-fetch';

import React from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';

import If from '../If';
import IfElse from '../IfElse';
import AfterEvent from '../AfterEvent';
import AppMomentNoConversation from '../AppMomentNoConversation';
import AppMomentChatPlaceholder from '../AppMomentChatPlaceholder';
import AppMomentChatHistories from '../AppMomentChatHistories';

import { api as chatReducerApi } from '../../reducers/chat';

export default class AppMomentChat extends React.PureComponent {

  static contextTypes = {
    store: PropTypes.object,
  }

  static propTypes = {
    id            : PropTypes.string,
    messages      : PropTypes.array,
  };

  static defaultProps = {
    id            : '',
    messages      : [ ],
  };

  state = {
    fetching: true,
  };

  fetch = o => {
    const { store } = this.context;
    const { id } = this.props;
    return new Promise(resolve => {
      this.setState(state => !state.fetching && { fetching: true }, _ => {
        store.dispatch(chatReducerApi.retrieveHistories(id)).then(resolve);
      });
    });
  }

  receive = o => {
    this.setState(state => state.fetching && { fetching: false });
  }

  render() {

    const { id, messages } = this.props;
    const { fetching } = this.state;

    return <div className="base">
      <style jsx>{`
        .base {
          display: flex;
          flex: 1;
          flex-grow: 1;
          flex-shrink: 1;
          flex-direction: column;
          background-color: #fff;
        }
        .base-list {
          flex: 1;
          flex-grow: 1;
          flex-shrink: 1;
        }
      `}</style>

      {/* attach fetch chat event */}
      <AfterEvent id={id} run={this.fetch} then={this.receive} timeout={1000} />

      {/* render placeholder when fetching chat */}
      <If condition={fetching}>
        <AppMomentChatPlaceholder />
      </If>

      {/* render chat after fetching */}
      <If condition={!fetching}>
        <IfElse condition={messages.length > 0} yes={<AppMomentChatHistories id={id} messages={messages} />} no={<AppMomentNoConversation />} />
      </If>
    </div>
  }

}

