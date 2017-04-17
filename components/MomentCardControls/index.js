
import React from 'react';
import PropTypes from 'prop-types';

import { Motion, spring } from 'react-motion';

import Tooltip from '../Tooltip';
import EditorMomentCardControlMedia from '../EditorMomentCardControlMedia';
import EditorMomentCardControlAlign from '../EditorMomentCardControlAlign';

export default class MomentCardControls extends React.Component {

  static propTypes = {
    no        : PropTypes.number,
    total     : PropTypes.number,
    editmode  : PropTypes.bool,
    active    : PropTypes.bool,
    onAction  : PropTypes.func,
  }

  static defaultProps = {
    no          : 1,
    total       : 0,
    editmode    : false,
    active      : false,
    onAction    : _ => null,
  }

  constructor(props) {
    super(props);
    this.onFileChange = this.onFileChange.bind(this);
    this.onFileClick = this.onFileClick.bind(this);
  }

  onFileChange(e) {
    e.preventDefault && e.preventDefault();
    const { target: { value, files } } = e;
    const { onAction } = this.props;
    if ( typeof files !== 'object' || typeof files.length !== 'number' ) {
      return;
    }
    const promises = [].map.call(files, file => new Promise(resolve => {
      const reader = new FileReader();
      reader.addEventListener('load', ({ currentTarget: { result: base64 } }) => resolve({ file, base64 }), false);
      return reader.readAsDataURL(file);
    }));
    return Promise.all(promises).then(blobs => {
      return onAction('media-upload', blobs);
    });
  }

  onFileClick(e) {
    e.target.value = null;
  }

  render() {
    const { no, total, editmode, active, onAction } = this.props;
    return editmode && <Motion style={{ opacity: spring(active ? 1 : 0), y: spring(active ? -32 : -37) }}>
      {({ opacity, y }) =><div className="base" style={{ opacity, transform: `translate3d(0px, ${y}px, 0px) scale(1)` }} data-controls>
        <style jsx>{`
          .base {
            display: flex;
            flex-direction: row;
            position: absolute;
            height: 18px;
            padding-left: 10px;
            padding-right: 10px;
            left: 0;
            right: 0;
            color: #8a8a8a;
            font-size: .9em;
            font-weight: 300;
          }
          .column {
            display: flex;
            flex-direction: row;
            align-items: center;
          }
          .column + .column {
            margin-left: 14px;
            padding-left: 14px;
            border-left: 1px solid #e8e8e8;
          }
        `}</style>
        <style jsx global>{`
          .card-controls-button {
            margin: 0;
            padding: 0;
            width: 18px;
            height: 18px;
            background-color: transparent;
            border: none;
            outline: none;
          }
          .card-controls-button + .card-controls-button {
            margin-left: 10px;
          }
          .card-input-hidden {
            position: absolute;
            top: -3000px;
          }
        `}</style>
        <div className="column" data-controls>{ no } of { total }</div>
        <div className="column" data-controls>
          <Tooltip tag="button" className="card-controls-button" title="Align" data-controls onClick={_ => onAction('align-moment')}>
            <EditorMomentCardControlAlign />
          </Tooltip>
          <Tooltip tag="label" className="card-controls-button" title="Upload image" data-controls>
            <EditorMomentCardControlMedia />
            <input className="card-input-hidden" type="file" onChange={this.onFileChange} onClick={this.onFileClick} data-controls />
          </Tooltip>
        </div>
      </div> }
    </Motion>
  }

}
