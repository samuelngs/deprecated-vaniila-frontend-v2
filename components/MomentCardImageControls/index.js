
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import Tooltip from '../Tooltip';
import EditorMomentCardImageDelete from '../EditorMomentCardImageDelete';
import EditorMomentCardImageInline from '../EditorMomentCardImageInline';
import EditorMomentCardImageFullscreen from '../EditorMomentCardImageFullscreen';

export default class MomentCardImageControls extends React.Component {

  static propTypes = {
    active: PropTypes.bool,
  }

  static defaultProps = {
    active: false,
  }

  render() {
    const { active } = this.props;
    return active ? <div className="image-controls">
      <style jsx>{`
        .image-controls {
          position: absolute;
          top: 10px;
          right: 20px;
          z-index: 5;
          display: flex;
          flex-direction: row;
          padding-left: 7px;
          padding-right: 5px;
          border: 1px solid #eee;
          border-radius: 2px;
          box-shadow: 0 1px 1px 0 rgba(200,200,200,0.2);
          background-color: #fff;
        }
        .image-control-separator {
          border-left: 1px solid #eee;
          margin-left: 5px;
          margin-right: 5px;
        }
      `}</style>
      <style jsx global>{`
        .image-control-btn {
          background-color: transparent;
          margin: 0;
          padding: 0;
          height: 36px;
          width: 36px;
          border: none;
          outline: none;
        }
      `}</style>
      <Tooltip tag="button" className="image-control-btn" title="Inline" position="top">
        <EditorMomentCardImageInline />
      </Tooltip>
      <Tooltip tag="button" className="image-control-btn" title="Fullscreen" position="top">
        <EditorMomentCardImageFullscreen />
      </Tooltip>
      <div className="image-control-separator" />
      <Tooltip tag="button" className="image-control-btn" title="Delete" position="top">
        <EditorMomentCardImageDelete />
      </Tooltip>
    </div> : null
  }

}
