
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import EditorMomentCardImageInline from '../EditorMomentCardImageInline';
import EditorMomentCardImageFullscreen from '../EditorMomentCardImageFullscreen';

export default class MomentCardImage extends React.Component {

  static propTypes = {
    position    : PropTypes.number,
    block       : PropTypes.shape({
      type      : PropTypes.string,
      key       : PropTypes.string,
      data      : PropTypes.string,
      styles    : PropTypes.array,
    }),
    total       : PropTypes.number,
    scale       : PropTypes.number,
    editmode    : PropTypes.bool,
    editable    : PropTypes.bool,
    files       : PropTypes.object,
    editorState : PropTypes.object,
    onSelect    : PropTypes.func,
  }

  static defaultProps = {
    position    : 0,
    block       : {
      type      : '',
      key       : '',
      data      : '',
      styles    : [ ],
    },
    total       : 0,
    scale       : 1,
    editmode    : false,
    editable    : false,
    files       : { },
    editorState : { },
    onSelect    : _ => null,
  }

  _forceFlag = false;

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  componentWillUpdate(nextProps) {
    // By flipping this flag, we also keep flipping keys which forces
    // React to remount this node every time it rerenders.
    // this._forceFlag = !this._forceFlag;
  }

  handleClick() {
    const { block, onSelect } = this.props;
    const { key, type } = block;
    return onSelect(key, type);
  }

  getStyle(type) {
    return {
      position: 'relative',
      marginTop: 10,
      marginBottom: 10,
      marginLeft: 0,
      marginRight: 0,
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      paddingRight: 0,
    };
  }

  getImageStyle() {
    return {
      display: 'block',
      maxWidth: '100%',
      marginLeft: 'auto',
      marginRight: 'auto',
    }
  }

  renderStyleControls() {
    return <div className="image-controls">
      <style jsx>{`
        .image-controls {
          position: absolute;
          top: 10px;
          right: 10px;
          z-index: 5;
          display: flex;
          flex-direction: row;
          padding-left: 7px;
          padding-right: 5px;
          background-color: #fff;
          border-radius: 2px;
        }
      `}</style>
      <EditorMomentCardImageInline />
      <EditorMomentCardImageFullscreen />
    </div>
  }

  render() {

    const { position, block, files, editorState: { editorStartKey, editorEndKey } } = this.props;
    const { key, type, data, styles } = block;

    const isImageSelected = (
      key === editorStartKey &&
      key === editorEndKey
    );

    const style = this.getStyle(type);

    const props = {
      key: this._forceFlag
        ? 'A'
        : 'B',
      style,
      'aria-label': 'moment-card-block',
      'data-offset-key': key,
      'data-offset-position': position,
    };

    const src = (data || '').indexOf('local:') === 0
      ? (files[data.substr(6)] || { }).base64
      : `${CDN_URL}/${data}`;

    return <figure { ...props } onClick={this.handleClick} draggable={false}>
      { isImageSelected && this.renderStyleControls() }
      <img src={src} data-offset-key={key} data-offset-position={position} data-offset-group={0} data-moment-image style={this.getImageStyle()} draggable={false} />
    </figure>;
  }

}

