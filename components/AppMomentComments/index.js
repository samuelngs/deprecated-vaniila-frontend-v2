
import React from 'react';
import PropTypes from 'prop-types';

import AppMomentComment from '../AppMomentComment';

export default class AppMomentComments extends React.PureComponent {

  static propTypes = {
    comments: PropTypes.array,
  }

  static defaultProps = {
    comments: [ ],
  }

  render() {
    const { comments } = this.props;
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
      { comments.map(({ name, avatar, username, comment }, i) => <AppMomentComment key={i} name={name} avatar={avatar} username={username} comment={comment} />) }
    </ul>
  }

}

