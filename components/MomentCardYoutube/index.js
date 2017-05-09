
import React from 'react';
import PropTypes from 'prop-types';

import MomentCardMediaControls from '../MomentCardMediaControls';

export default class MomentCardYoutube extends React.PureComponent {

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
    total       : 0,
    scale       : 1,
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

  handleClick = e => {
    const { block, onSelect } = this.props;
    const { key, type } = block;
    return onSelect(key, type);
  }

  getStyle(type) {
    const { editmode, fullscreen, height, width } = this.props;
    return {
      position: 'relative',
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
      borderRadius: fullscreen && 4,
      overflow: fullscreen && 'hidden',
      display: fullscreen && 'flex',
      alignItems: fullscreen && 'center',
      justifyContent: fullscreen && 'center',
    };
  }

  onChange = type => {
    const { block: { key }, onChange } = this.props;
    return onChange(type, key);
  }

  render() {

    const { width, height, position, block, files, editmode, fullscreen, editorState: { editorStartKey, editorEndKey } } = this.props;
    const { key, type, data, styles } = block;

    const isSelected = (
      key === editorStartKey &&
      key === editorEndKey
    );

    const style = this.getStyle(type);
    const className = editmode
      ? (
        isSelected
        ? 'youtube no-select'
        : 'youtube youtube-editable no-select'
      )
      : 'youtube';

    const props = {
      key: this._forceFlag
        ? 'A'
        : 'B',
      style,
      'aria-label': 'moment-card-block',
      'data-offset-key': key,
      'data-offset-position': position,
    };

    const iframeWidth = fullscreen
      ? width
      : ( 560 > width ? width : 560 );
    const iframeHeight = fullscreen
      ? height
      : ( 315 > height ? height : 315 );
    const iframeSrc = `https://www.youtube.com/embed/${data}?modestbranding=1&autohide=1&rel=0&showinfo=0&iv_load_policy=3`;

    return <div { ...props } onClick={this.handleClick} draggable={false} contentEditable={false}>
      <style jsx>{`
        .youtube {
          margin-top: 0;
          margin-bottom: 0;
          margin-left: auto;
          margin-right: auto;
          padding-top: 5px;
          padding-bottom: 5px;
          padding-left: 0;
          padding-right: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .youtube-editable {
          pointer-events: none;
          cursor: default;
        }
      `}</style>
      <MomentCardMediaControls active={isSelected} fullscreen={fullscreen} onChange={this.onChange} />
      <iframe className={className} width={iframeWidth} height={iframeHeight} src={iframeSrc} frameBorder={0} allowFullScreen />
    </div>
  }

}

