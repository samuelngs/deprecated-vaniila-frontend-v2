
import React from 'react';
import PropTypes from 'prop-types';

import Compress from 'compress.js';
import { TransitionMotion, spring, presets } from 'react-motion';

import If from '../If';
import Tooltip from '../Tooltip';
import EditorMomentCardControlDelete from '../EditorMomentCardControlDelete';
import EditorMomentCardControlAlign from '../EditorMomentCardControlAlign';
import EditorMomentCardControlMedia from '../EditorMomentCardControlMedia';
import EditorMomentCardControlPublish from '../EditorMomentCardControlPublish';

const compress = new Compress();

const active   = [ { key: 'card-controls' } ];
const inactive = [ ];

export default class MomentCardControls extends React.PureComponent {

  static propTypes = {
    id          : PropTypes.string,
    no          : PropTypes.number,
    when        : PropTypes.number,
    total       : PropTypes.number,
    livestream  : PropTypes.bool,
    published   : PropTypes.bool,
    editmode    : PropTypes.bool,
    active      : PropTypes.bool,
    fullscreen  : PropTypes.bool,
    onAction    : PropTypes.func,
  }

  static defaultProps = {
    id          : '',
    no          : 1,
    when        : -1,
    total       : 0,
    livestream  : false,
    published   : false,
    editmode    : false,
    active      : false,
    fullscreen  : false,
    onAction    : _ => null,
  }

  onFileChange = e => {
    e.preventDefault && e.preventDefault();
    const { target: { value, files } } = e;
    const { onAction } = this.props;
    if ( typeof files !== 'object' || typeof files.length !== 'number' ) {
      return;
    }

    const promises = [].map.call(files, file => new Promise(resolve => {

      compress.compress([ file ], {
        size      : 2,
        quality   : 1,
        maxWidth  : 3840,
        maxHeight : 3840,
        resize    : true,
      }).then(([ { data, prefix, ext, alt, endWidthInPx, endHeightInPx, initialSizeInMb, endSizeInMb }, ...wtv ]) => {

        // if compress image successfully
        if ( initialSizeInMb >= endSizeInMb ) {
          const blob = {
            file      : Compress.convertBase64ToFile(data, ext),
            base64    : `${prefix}${data}`,
            dimensions: { width: endWidthInPx, height: endHeightInPx },
            compressed: true,
          };
          if ( typeof blob.file.name === 'undefined' ) blob.file.name = alt;
          if ( typeof blob.file.type === 'undefined' ) blob.file.type = ext;
          if ( typeof blob.file.size === 'undefined' ) blob.file.size = endSizeInMb;
          if ( typeof blob.file.lastModified === 'undefined' ) blob.lastModified = Date.now();
          return resolve(blob);
        }

        // use regular file reader
        const reader = new FileReader();
        reader.addEventListener('load', ({ currentTarget: { result: base64 } }) => {
          const img = new Image;
          img.onload = e => resolve({
            file,
            base64,
            dimensions: { height: img.height, width: img.width },
            compressed: false,
          });
          img.src = base64;
        }, false);
        return reader.readAsDataURL(file);

      });
    }));
    return Promise.all(promises).then(blobs => {
      return onAction('media-upload', blobs);
    });
  }

  onFileClick = e => {
    e.target.value = null;
  }

  willEnter() {
    return { opacity: 0, y: -37 }
  }

  willLeave() {
    return { opacity: spring(0), y: spring(-37) }
  }

  getDefaultStyles() {
    const arr = this.props.active
      ? active
      : inactive;
    return arr.map(o => ({ ...o, style: { opacity: 0, y: -37 } }));
  }

  getStyles() {
    const arr = this.props.active
      ? active
      : inactive;
    return arr.map(o => ({ ...o, style: { opacity: spring(1), y: spring(-32) } }));
  }

  getTime() {
    const { when } = this.props;
    const date = new Date(when);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hours}:${minutes} ${ampm}`;
  }

  renderCardControls = ({ key, style, data }) => {
    const { id, no, when, total, livestream, published, editmode, active, fullscreen, onAction } = this.props;
    return <div key={key} className="base" style={{ opacity: style.opacity, transform: `translate3d(0px, ${style.y}px, 0px) scale(1)` }} data-controls>
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
          z-index: 1;
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
          cursor: pointer;
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
      <If condition={no !== -1}>
        <div className="column" data-controls>{ no } of { total }</div>
      </If>
      <If condition={when !== -1}>
        <div className="column" data-controls>
          { this.getTime() }
        </div>
      </If>
      <If condition={!fullscreen}>
        <div className="column" data-controls>
          <If condition={id !== 'cover'}>
            <Tooltip tag="button" className="card-controls-button" title="Align" data-controls onClick={_ => onAction('align-moment')}>
              <EditorMomentCardControlAlign />
            </Tooltip>
          </If>
          <Tooltip tag="label" className="card-controls-button" title="Upload image" data-controls>
            <EditorMomentCardControlMedia />
            <input className="card-input-hidden" type="file" onChange={this.onFileChange} onClick={this.onFileClick} data-controls />
          </Tooltip>
        </div>
      </If>
      <If condition={(id !== 'cover' && total > 1) || livestream}>
        <div className="column" data-controls>
          <If condition={id !== 'cover' && total > 1}>
            <Tooltip tag="button" className="card-controls-button" title="Delete moment" data-controls onClick={_ => onAction('delete-moment')}>
              <EditorMomentCardControlDelete />
            </Tooltip>
          </If>
          <If condition={livestream}>
            <Tooltip tag="button" className="card-controls-button" title={published ? "Already published" : "Publish moment"} data-controls onClick={_ => onAction('publish-moment')}>
              <EditorMomentCardControlPublish active={published} />
            </Tooltip>
          </If>
        </div>
      </If>
    </div>
  }

  render() {
    return <TransitionMotion
      defaultStyles={this.getDefaultStyles()}
      styles={this.getStyles()}
      willLeave={::this.willLeave}
      willEnter={::this.willEnter}>
      { styles => styles.length > 0 ? this.renderCardControls(styles[0]) : null }
    </TransitionMotion>
  }

}
