
import React from 'react';
import PropTypes from 'prop-types';

export default class AppModalSignin extends React.PureComponent {

  render() {
    return <div className="base">
      <style jsx>{`
        .base {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin: 0 auto;
          padding: 0;
          width: 800px;
          max-width: calc(100% - 80px);
        }
        .title {
          font-size: 20px;
          font-weight: 300;
          width: 100%;
          text-align: center;
        }
        @media (min-width: 768px) {
          .title {
            font-size: 40px;
          }
        }
      `}</style>
      <h4 className="title">Sign in to Vaniila</h4>
    </div>
  }

}

