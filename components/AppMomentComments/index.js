
import React from 'react';
import PropTypes from 'prop-types';

import AppMomentComment from '../AppMomentComment';

export default class AppMomentComments extends React.PureComponent {

  static propTypes = {
    id      : PropTypes.string,
    comments: PropTypes.array,
    user    : PropTypes.string,
  }

  static defaultProps = {
    id      : '',
    comments: [ ],
    user    : '',
  }

  render() {
    const { id, comments, user } = this.props;
    return <ul className="base">
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
      { comments.map(({ id: cid, name, avatar, username, comment, created_at }, i) => <AppMomentComment key={i} id={id} cid={cid} name={name} avatar={avatar} username={username} comment={comment} when={created_at} controls={user === username} />) }
    </ul>
  }

}

