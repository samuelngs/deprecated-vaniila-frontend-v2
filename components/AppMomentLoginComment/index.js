
import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

export default class AppMomentLoginComment extends React.PureComponent {

  static propTypes = {
    id: PropTypes.string,
  };

  static defaultProps = {
    id: '',
  };

  render() {
    return <div className="base">
      <style jsx>{`
        .base {
          display: flex;
          flex-direction: row;
          align-items: center;
          margin-top: 0;
          margin-bottom: 0;
          margin-left: 0;
          margin-right: 0;
          padding-top: 0;
          padding-bottom: 0;
          padding-left: 20px;
          padding-right: 20px;
          min-height: 48px;
          border-top: 1px solid rgba(0, 0, 0, 0.05);
        }
        .message {
          font-size: 14px;
          font-weight: 500;
          color: #a0aaae;
        }
        .message a {
          text-decoration: none;
          color: #319aff;
        }
      `}</style>
      <div className="message">
        <Link href="/signin" as="/signin"><a>Log in</a></Link> to like or comment
      </div>
    </div>
  }

}

