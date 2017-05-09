
import 'isomorphic-fetch';

import React from 'react';
import Router from 'next/router';

import AppMomentCommentItem from '../AppMomentCommentItem';
import AppMomentCommentPlaceholder from '../AppMomentCommentPlaceholder';

export default class AppMomentListComments extends React.PureComponent {

  render() {
    return <div className="comments-list">
      <style jsx>{`
        .comments-list {
          flex: 1;
          background-color: #fff;
        }
      `}</style>
      <AppMomentCommentPlaceholder />
    </div>
  }

}

