
import 'isomorphic-fetch';

import React from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';

import If from '../If';
import IfElse from '../IfElse';
import AfterEvent from '../AfterEvent';
import AppMomentLeaveComment from '../AppMomentLeaveComment';
import AppMomentComments from '../AppMomentComments';
import AppMomentNoComments from '../AppMomentNoComments';
import AppMomentCommentPlaceholder from '../AppMomentCommentPlaceholder';

import { api as commentsReducerApi } from '../../reducers/comments';

export default class AppMomentListComments extends React.PureComponent {

  static contextTypes = {
    store: PropTypes.object,
  }

  static propTypes = {
    id      : PropTypes.string,
    comments: PropTypes.array,
  };

  static defaultProps = {
    id      : '',
    comments: [],
  };

  state = {
    fetching: true,
  };

  fetch = o => {
    const { store } = this.context;
    const { id } = this.props;
    return new Promise(resolve => {
      this.setState(state => !state.fetching && { fetching: true }, _ => {
        store.dispatch(commentsReducerApi.retrieveComments(id)).then(resolve);
      });
    });
  }

  receive = o => {
    this.setState(state => state.fetching && { fetching: false });
  }

  render() {

    const { id, comments } = this.props;
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

      {/* attach fetch comments event */}
      <AfterEvent id={id} run={this.fetch} then={this.receive} timeout={1000} />

      {/* render placeholder when fetching comments */}
      <If condition={fetching}>
        <AppMomentCommentPlaceholder />
      </If>

      {/* render comments after fetching */}
      <If condition={!fetching}>
        <IfElse condition={comments.length > 0} yes={<AppMomentComments comments={comments} />} no={<AppMomentNoComments />} />
      </If>

      {/* leave comment component */}
      <AppMomentLeaveComment id={id} />
    </div>
  }

}

