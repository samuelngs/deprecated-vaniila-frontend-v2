
import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

import EditorHeaderLogo from '../EditorHeaderLogo';
import EditorHeaderBack from '../EditorHeaderBack';
import EditorHeaderMode from '../EditorHeaderMode';
import EditorHeaderDetails from '../EditorHeaderDetails';
import EditorPeersList from '../EditorPeersList';

export default class EditorHeader extends React.Component {

  static contextTypes = {
    store: PropTypes.object,
  }

  static propTypes = {
    doc           : PropTypes.object,
    peers         : PropTypes.array,
    gridview      : PropTypes.bool,
    onModeChange  : PropTypes.func,
    onMomentCreate: PropTypes.func,
  }

  static defaultProps = {
    doc           : null,
    peers         : [ ],
    gridview      : false,
    onModeChange  : _ => null,
    onMomentCreate: _ => null,
  }

  static cssVariables = {
    headerHeight: 46,
    headerBackgroundColor: '#fff',
    headerTransparentBackgroundColor: 'rgba(255, 255, 255, 0.88)',
    headerIconColor: '#8aa7b1',
  }

  onModeChange = gridview => {
    const { gridview: current, onModeChange } = this.props;
    if ( current === gridview ) return;
    return onModeChange(gridview);
  }

  render() {
    const { peers, gridview, onMomentCreate } = this.props;
    const { store: { getState } } = this.context;
    const { authenticationToken } = getState();
    const className = gridview
      ? 'header header-grid'
      : 'header';
    return <header className={className}>
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
          box-shadow: rgba(0, 0, 0, 0.05) 0px 1px;
          z-index: 7;
        }
        .header-grid {
          background-color: ${EditorHeader.cssVariables.headerBackgroundColor};
        }
        .header-nav {
          flex: 1;
          display: flex;
          flex-direction: row;
        }
        .header-grid-column-4 {
          flex: 1;
          display: flex;
          flex-direction: row;
        }
        .header-grid-column-al { justify-content: flex-start; }
        .header-grid-column-ac { justify-content: center; }
        .header-grid-column-ar { justify-content: flex-end; }
        .header-separator {
          width: 0;
          height: 100%;
          border-left: 1px solid #eee;
        }
      `}</style>
      <nav className="header-nav header-grid">
        <div className="header-grid-column-4 header-grid-column-al">
          <EditorHeaderBack
            headerHeight={EditorHeader.cssVariables.headerHeight}
            headerIconColor={EditorHeader.cssVariables.headerIconColor}
          />
          <div className="header-separator" />
          <EditorHeaderMode
            headerHeight={EditorHeader.cssVariables.headerHeight}
            onPress={this.onModeChange}
            gridview={gridview}
          />
          <div className="header-separator" />
          <EditorHeaderDetails
            headerHeight={EditorHeader.cssVariables.headerHeight}
          />
        </div>
        <div className="header-grid-column-4 header-grid-column-ac">
          <EditorHeaderLogo headerHeight={EditorHeader.cssVariables.headerHeight} />
          { false && <button onClick={onMomentCreate}>Create Moment</button> }
        </div>
        <div className="header-grid-column-4 header-grid-column-ar">
          <EditorPeersList
            headerHeight={EditorHeader.cssVariables.headerHeight}
            peers={peers}
          />
        </div>
      </nav>
    </header>
  }

}

