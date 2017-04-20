
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import MomentCardImageControls from '../MomentCardImageControls';
import MomentCardImageProgress from '../MomentCardImageProgress';

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
      width: '100%',
    };
  }

  getImageStyle(isUploading) {
    return {
      display: 'block',
      maxWidth: '100%',
      marginLeft: 'auto',
      marginRight: 'auto',
      opacity: isUploading ? .5 : null,
    }
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

    const isLocal = (data || '').indexOf('local:') === 0;
    const file = isLocal && files[data.substr(6)];

    const src = isLocal && file
      ? file.base64
      : `${CDN_URL}/${data}/regular`;

    let progress = isLocal && file && file.progress;
    if ( typeof progress !== 'number' ) progress = 0;

    return <figure { ...props } onClick={this.handleClick} draggable={false} contentEditable={false}>
      <MomentCardImageControls active={isImageSelected} />
      <MomentCardImageProgress active={isLocal && !!file && !!progress && !file.url} progress={progress} />
      <img
        src={src}
        data-offset-key={key}
        data-offset-position={position}
        data-offset-group={0}
        data-moment-image
        style={this.getImageStyle(isLocal && !!file && !!progress && !file.url)}
        draggable={false}
      />
    </figure>;
  }

}

