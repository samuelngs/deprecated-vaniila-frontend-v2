
import React from 'react';
import PropTypes from 'prop-types';

import If from '../If';
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
    const ismobile = width < 800;
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
      borderRadius: !ismobile && fullscreen && 4,
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

    const ismobile = width < 800;

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
          position: relative;
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
        .youtube-play {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          display: flex;
          justify-content: center;
          align-items: center;
          width: 60px;
          height: 60px;
          border: none;
          border-radius: 30px;
          background-color: #fff;
          outline: none;
        }
        .youtube-play:active {
          background-color: #00d68f;
        }
        .youtube-icon {
          margin-left: 4px;
          width: 30px;
          height: 30px;
          fill: #00d68f;
        }
        .youtube-play:active .youtube-icon {
          fill: #fff;
        }
      `}</style>
      <MomentCardMediaControls active={isSelected} fullscreen={fullscreen} onChange={this.onChange} />
      <If condition={ismobile}>
        <div className={className} style={{
          width: iframeWidth,
          height: iframeHeight,
          backgroundColor: '#000',
          backgroundImage: `url(http://i.ytimg.com/vi/${data}/hqdefault.jpg)`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}>
          <a className="youtube-play" href={`https://www.youtube.com/watch?v=${data}`} target="_blank" data-moment-control>
            <svg className="youtube-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
              <path d="M74.437 53.96c1.59-1.59 1.59-4.167 0-5.756-.416-.416-40.53-25.48-40.766-25.598l-.03-.02v.002c-.54-.263-1.136-.424-1.775-.424-2.015 0-3.676 1.468-4 3.39l-.07 50.376c0 2.247 1.822 4.07 4.07 4.07.634 0 1.227-.16 1.762-.418l40.81-25.623z"/>
            </svg>
          </a>
        </div>
      </If>
      <If condition={!ismobile}>
        <iframe className={className} width={iframeWidth} height={iframeHeight} src={iframeSrc} frameBorder={0} allowFullScreen />
      </If>
    </div>
  }

}

