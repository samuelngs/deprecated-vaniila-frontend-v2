
import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

import AppModal from '../AppModal';
import EditorModalStartLive from '../EditorModalStartLive';
import EditorModalEndLive from '../EditorModalEndLive';
import EditorHeaderLogo from '../EditorHeaderLogo';
import EditorHeaderBack from '../EditorHeaderBack';
import EditorHeaderMode from '../EditorHeaderMode';
import EditorHeaderDetails from '../EditorHeaderDetails';
import EditorHeaderLiveStream from '../EditorHeaderLiveStream';
import EditorPeersList from '../EditorPeersList';

export default class EditorHeader extends React.Component {

  static contextTypes = {
    store: PropTypes.object,
  }

  static propTypes = {
    peers               : PropTypes.array,
    gridview            : PropTypes.bool,
    livestream          : PropTypes.bool,
    livestreamStartedAt : PropTypes.string,
    livestreamEndedAt   : PropTypes.string,
    onBack              : PropTypes.func,
    onModeChange        : PropTypes.func,
    onMomentCreate      : PropTypes.func,
    onMomentLiveStart   : PropTypes.func,
    onMomentLiveEnd     : PropTypes.func,
  }

  static defaultProps = {
    peers               : [ ],
    gridview            : false,
    livestream          : false,
    livestreamStartedAt : '0001-01-01T00:00:00Z',
    livestreamEndedAt   : '0001-01-01T00:00:00Z',
    onBack              : _ => null,
    onModeChange        : _ => null,
    onMomentCreate      : _ => null,
    onMomentLiveStart   : _ => null,
    onMomentLiveEnd     : _ => null,
  }

  state = {
    startConfirmation: false,
    endConfirmation  : false,
  }

  static cssVariables = {
    headerHeight: 46,
    headerBackgroundColor: '#fff',
    headerTransparentBackgroundColor: 'rgba(255, 255, 255, 0.88)',
    headerIconColor: '#8aa7b1',
  }

  handleOnBack = e => {
    const { onBack } = this.props;
    return onBack();
  }

  handleModeChange = gridview => {
    const { gridview: current, onModeChange } = this.props;
    if ( current === gridview ) return;
    return onModeChange(gridview);
  }

  handleStartConfirmationPress = startConfirmation => {
    this.setState({ startConfirmation });
  }

  handleStartConfirmationDismiss = e => {
    e.preventDefault();
    this.setState({ startConfirmation: false });
  }

  handleStartConfirm = e => {
    const { onMomentLiveStart } = this.props;
    this.handleStartConfirmationDismiss(e);
    onMomentLiveStart();
  }

  handleEndConfirmationPress = endConfirmation => {
    this.setState({ endConfirmation });
  }

  handleEndConfirmationDismiss = e => {
    e.preventDefault();
    this.setState({ endConfirmation: false });
  }

  handleEndConfirm = e => {
    const { onMomentLiveEnd } = this.props;
    this.handleEndConfirmationDismiss(e);
    onMomentLiveEnd();
  }

  render() {

    const {
      peers,
      gridview,
      livestream,
      livestreamStartedAt,
      livestreamEndedAt,
      onMomentCreate
    } = this.props;

    const {
      startConfirmation,
      endConfirmation
    } = this.state;

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
            onPress={this.handleOnBack}
          />
          <div className="header-separator" />
          { livestream && <EditorHeaderLiveStream
            headerHeight={EditorHeader.cssVariables.headerHeight}
            livestreamStartedAt={livestreamStartedAt}
            livestreamEndedAt={livestreamEndedAt}
            livestreamStartConfirmation={startConfirmation}
            livestreamEndConfirmation={endConfirmation}
            onStartConfirmationPress={this.handleStartConfirmationPress}
            onEndConfirmationPress={this.handleEndConfirmationPress}
          /> }
        </div>
        <div className="header-grid-column-1 header-grid-column-ac">
          <EditorHeaderLogo headerHeight={EditorHeader.cssVariables.headerHeight} />
        </div>
        <div className="header-grid-column-4 header-grid-column-ar">
          <EditorPeersList
            headerHeight={EditorHeader.cssVariables.headerHeight}
            peers={peers}
          />
          <div className="header-separator" />
          <EditorHeaderMode
            headerHeight={EditorHeader.cssVariables.headerHeight}
            onPress={this.handleModeChange}
            gridview={gridview}
          />
        </div>
      </nav>
      <AppModal color="#fff" active={startConfirmation} dismiss={this.handleStartConfirmationDismiss}>
        <EditorModalStartLive onPress={this.handleStartConfirm} />
      </AppModal>
      <AppModal color="#fff" active={endConfirmation} dismiss={this.handleEndConfirmationDismiss}>
        <EditorModalEndLive onPress={this.handleEndConfirm} />
      </AppModal>
    </header>
  }

}

