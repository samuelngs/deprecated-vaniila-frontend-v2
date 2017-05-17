
import React from 'react';
import PropTypes from 'prop-types';

export default class AppMomentViewerSidebar extends React.PureComponent {

  static propTypes = {
    children: PropTypes.node,
    height  : PropTypes.number,
  }

  static defaultProps = {
    children: null,
    height  : 300,
  }


  render() {
    const { children, height } = this.props;
    return <div className="base" style={{ height }}>
      <style jsx>{`
        .base {
          display: flex;
          flex: 1;
          flex-direction: column;
          margin-top: 0;
          margin-bottom: 0;
          margin-left: 0;
          margin-right: 0;
          padding-top: 0;
          padding-bottom: 0;
          padding-left: 0;
          padding-right: 0;
          max-width: 350px;
          border-left: 1px solid rgba(0, 0, 0, .03);
        }
      `}</style>
      { children }
    </div>
  }

}



