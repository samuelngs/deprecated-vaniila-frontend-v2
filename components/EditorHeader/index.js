
import React from 'react';
import Link from 'next/link';

import EditorHeaderBack from '../EditorHeaderBack';
import EditorPeersList from '../EditorPeersList';

export default class EditorHeader extends React.Component {

  static contextTypes = {
    store: React.PropTypes.object,
  }

  static propTypes = {
    peers: React.PropTypes.array,
  }

  static defaultProps = {
    peers: [ ],
  }

  static cssVariables = {
    headerHeight: 60,
    headerBackgroundColor: '#fff',
    headerIconColor: '#7799a4',
  }

  render() {
    const { peers } = this.props;
    const { store: { getState } } = this.context;
    const { authenticationToken } = getState();
    return <header className="header">
      <style jsx>{`
        .header {
          margin-top: 0;
          margin-bottom: 0;
          margin-left: 0;
          margin-right: 0;
          padding-top: 0;
          padding-bottom: 0;
          padding-left: 0;
          padding-right: 0;
          width: 100%;
          height: ${EditorHeader.cssVariables.headerHeight}px;
          position: fixed;
          display: flex;
          background-color: ${EditorHeader.cssVariables.headerBackgroundColor};
          box-shadow: rgba(181, 189, 198, 0.27451) 0px 1px;
        }
        .header-nav {
          flex: 1;
          display: flex;
          flex-direction: row;
        }
      `}</style>
      <nav className="header-nav">
        <EditorHeaderBack
          headerHeight={EditorHeader.cssVariables.headerHeight}
          headerIconColor={EditorHeader.cssVariables.headerIconColor}
        />
        <EditorPeersList
          headerHeight={EditorHeader.cssVariables.headerHeight}
          peers={peers}
        />
      </nav>
    </header>
  }

}

