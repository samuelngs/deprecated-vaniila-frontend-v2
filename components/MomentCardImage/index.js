
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import If from '../If';
import MomentCardFallbackImage from '../MomentCardFallbackImage';
import MomentCardMediaControls from '../MomentCardMediaControls';
import MomentCardImageProgress from '../MomentCardImageProgress';

export default class MomentCardImage extends React.PureComponent {

  static propTypes = {
    position    : PropTypes.number,
    block       : PropTypes.shape({
      type      : PropTypes.string,
      key       : PropTypes.string,
      data      : PropTypes.string,
      styles    : PropTypes.array,
    }),
    mode        : PropTypes.oneOf([ 'default', 'background' ]),
    total       : PropTypes.number,
    scale       : PropTypes.number,
    player      : PropTypes.bool,
    editmode    : PropTypes.bool,
    width       : PropTypes.number,
    height      : PropTypes.number,
    fullscreen  : PropTypes.bool,
    files       : PropTypes.object,
    editorState : PropTypes.object,
    onSelect    : PropTypes.func,
    onChange    : PropTypes.func,
  }

  static defaultProps = {
    position    : 0,
    block       : {
      type      : '',
      key       : '',
      data      : '',
      styles    : [ ],
    },
    mode        : 'default',
    total       : 0,
    scale       : 1,
    player      : false,
    editmode    : false,
    width       : 0,
    height      : 0,
    fullscreen  : false,
    files       : { },
    editorState : { },
    onSelect    : _ => null,
    onChange    : _ => null,
  }

  _forceFlag = false;

  constructor(props) {
    super(props);
  }

  handleClick = e => {
    e.preventDefault && e.preventDefault();
    const { block, onSelect } = this.props;
    const { key, type } = block;
    return onSelect(key, type);
  }

  getStyle(type) {
    const { mode, player, fullscreen, height, width } = this.props;
    return {
      position: mode === 'background'
        ? 'absolute'
        : 'relative',
      top: mode === 'background'
        ? 0
        : 'initial',
      left: mode === 'background'
        ? 0
        : 'initial',
      bottom: mode === 'background'
        ? 0
        : 'initial',
      right: mode === 'background'
        ? 0
        : 'initial',
      zIndex: mode === 'background'
        ? -1
        : 'initial',
      marginTop: fullscreen ? 0 : 10,
      marginBottom: fullscreen ? 0 : 10,
      marginLeft: 0,
      marginRight: 0,
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      paddingRight: 0,
      width: fullscreen ? width : '100%',
      height: fullscreen && height,
      borderRadius: !player && fullscreen && 4,
      overflow: fullscreen && 'hidden',
      display: fullscreen && 'flex',
      alignItems: fullscreen && 'center',
      justifyContent: fullscreen && 'center',
    };
  }

  getImageStyle(isUploading) {
    const { fullscreen, height, width } = this.props;
    const args = { };
    if ( fullscreen && height >= width ) {
      args.height = height;
    } else if ( fullscreen && width > height ) {
      args.width = width;
    } else {
      args.maxWidth = '100%';
    }
    return {
      display: 'block',
      marginLeft: !fullscreen && 'auto',
      marginRight: !fullscreen && 'auto',
      height: 'auto',
      maxWidth: fullscreen && width,
      maxHeight: fullscreen && height,
      opacity: isUploading ? .5 : null,
      ...args,
    }
  }

  getDarkenStyle() {
    const { width, height } = this.props;
    return {
      width,
      height,
      position: 'absolute',
      top: 0,
      left: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
    }
  }

  onChange = type => {
    const { block: { key }, onChange } = this.props;
    return onChange(type, key);
  }

  render() {

    const { mode, position, block, files, width, height, fullscreen, player, editmode, editorState: { editorStartKey, editorEndKey } } = this.props;
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
      : `${CDN_URL}/${data}/progressive`;

    const srchd = !(isLocal && file) ? `${CDN_URL}/${data}/regular` : undefined;

    let progress = isLocal && file && file.progress;
    if ( typeof progress !== 'number' ) progress = 0;

    if ( ( isLocal && file && file.base64 ) || !isLocal ) {
      return <figure { ...props } onClick={this.handleClick} draggable={false} contentEditable={false}>
        { editmode && <MomentCardMediaControls active={isImageSelected} fullscreen={fullscreen} onChange={this.onChange} /> }
        <MomentCardImageProgress active={isLocal && !!file && !!progress && !file.url} progress={progress} />
        <MomentCardFallbackImage
          key={key}
          src={src}
          mode={mode === 'background' ? 'cover' : 'contain'}
          reload={mode !== 'background'}
          srchd={srchd}
          player={player}
          cover={fullscreen}
          width={width}
          height={height}
          data-offset-key={key}
          data-offset-position={position}
          data-offset-group={0}
          data-moment-image
          style={this.getImageStyle(isLocal && !!file && !!progress && !file.url)}
          draggable={false}
        />
        <If condition={mode === 'background'}>
          <div style={this.getDarkenStyle()} />
        </If>
      </figure>;
    }

    return <figure { ...props } onClick={this.handleClick} draggable={false} contentEditable={false}>
      { editmode && <MomentCardMediaControls active={isImageSelected} fullscreen={fullscreen} onChange={this.onChange} /> }
      <MomentCardImageProgress active={isLocal && !!file && !!progress && !file.url} progress={progress} />
      <div
        data-offset-key={key}
        data-offset-position={position}
        data-offset-group={0}
        data-moment-image
        style={this.getImageStyle(isLocal && !!file && !!progress && !file.url)}
        draggable={false}
      />
      <If condition={mode === 'background'}>
        <div style={this.getDarkenStyle()} />
      </If>
    </figure>;

  }

}

