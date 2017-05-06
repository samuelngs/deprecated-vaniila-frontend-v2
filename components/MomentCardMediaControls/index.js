
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import Tooltip from '../Tooltip';
import EditorMomentCardMediaDelete from '../EditorMomentCardMediaDelete';
import EditorMomentCardMediaInline from '../EditorMomentCardMediaInline';
import EditorMomentCardMediaFullscreen from '../EditorMomentCardMediaFullscreen';

export default class MomentCardMediaControls extends React.PureComponent {

  static propTypes = {
    active      : PropTypes.bool,
    fullscreen  : PropTypes.bool,
    allowRemove : PropTypes.bool,
    onChange    : PropTypes.func,
  }

  static defaultProps = {
    active      : false,
    fullscreen  : false,
    allowRemove : true,
    onChange    : _ => null,
  }

  handleInline = e => {
    e.preventDefault && e.preventDefault();
    const { onChange } = this.props;
    return onChange('inline-media');
  }

  handleFullscreen = e => {
    e.preventDefault && e.preventDefault();
    const { onChange } = this.props;
    return onChange('fullscreen-media');
  }

  handleDelete = e => {
    e.preventDefault && e.preventDefault();
    const { onChange } = this.props;
    return onChange('delete-image');
  }

  render() {
    const { active, fullscreen, allowRemove, onChange } = this.props;
    return active ? <div className="image-controls">
      <style jsx>{`
        .image-controls {
          position: absolute;
          top: 20px;
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
      { fullscreen && <Tooltip tag="button" className="image-control-btn" title="Inline" position={ fullscreen ? 'bottom' : 'top' } onClick={this.handleInline}>
        <EditorMomentCardMediaInline />
      </Tooltip> }
      { !fullscreen && <Tooltip tag="button" className="image-control-btn" title="Fullscreen" position={ fullscreen ? 'bottom' : 'top' } onClick={this.handleFullscreen}>
        <EditorMomentCardMediaFullscreen />
      </Tooltip> }
      <div className="image-control-separator" />
      { allowRemove && <Tooltip tag="button" className="image-control-btn" title="Delete" position={ fullscreen ? 'bottom' : 'top' } onClick={this.handleDelete}>
        <EditorMomentCardMediaDelete />
      </Tooltip> }
    </div> : null
  }

}
