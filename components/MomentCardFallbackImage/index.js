
import React from 'react';
import PropTypes from 'prop-types';

import { Motion, spring } from 'react-motion';

function isHighDensity() {
  return (
    typeof window !== 'undefined' &&
    (window.matchMedia && (window.matchMedia('only screen and (min-resolution: 124dpi), only screen and (min-resolution: 1.3dppx), only screen and (min-resolution: 48.8dpcm)').matches || window.matchMedia('only screen and (-webkit-min-device-pixel-ratio: 1.3), only screen and (-o-min-device-pixel-ratio: 2.6/2), only screen and (min--moz-device-pixel-ratio: 1.3), only screen and (min-device-pixel-ratio: 1.3)').matches)) || (window.devicePixelRatio && window.devicePixelRatio > 1.3)
  );
}

function isRetina() {
  return (
    typeof window !== 'undefined' && ((window.matchMedia && (window.matchMedia('only screen and (min-resolution: 192dpi), only screen and (min-resolution: 2dppx), only screen and (min-resolution: 75.6dpcm)').matches || window.matchMedia('only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (-o-min-device-pixel-ratio: 2/1), only screen and (min--moz-device-pixel-ratio: 2), only screen and (min-device-pixel-ratio: 2)').matches)) || (window.devicePixelRatio && window.devicePixelRatio >= 2)) &&
    typeof navigator !== 'undefined' && /(iPad|iPhone|iPod)/g.test(navigator.userAgent)
  );
}

export default class MomentCardFallbackImage extends React.Component {

  static propTypes = {
    src   : PropTypes.string,
    srchd : PropTypes.string,
    cover : PropTypes.bool,
    width : PropTypes.number,
    height: PropTypes.number,
  }

  static defaultProps = {
    src   : null,
    srchd : null,
    cover : false,
    width : 0,
    height: 0,
  }

  state = {
    progressiveLoadedSuccessful: undefined,
    progressiveHasCache: false,
    regularLoadedSuccessful: undefined,
    regularHasCache: false,
    allLoadedSuccessful: undefined,
  }

  componentDidMount() {
    this.mounted = true;
    this.componentFetchProgressive();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  componentDidUpdate({ src: psrc, srchd: psrchd }) {
    const { src: nsrc, srchd: nsrchd } = this.props;
    if ( psrc !== nsrc || psrchd !== nsrchd ) {
      this.componentFetchProgressive();
    }
  }

  componentFetchProgressive(src = this.props.src) {
    this.setState(state => state.progressiveLoadedSuccessful !== undefined && state.regularLoadedSuccessful !== undefined && state.allLoadedSuccessful !== undefined && { progressiveLoadedSuccessful: undefined, regularLoadedSuccessful: undefined, allLoadedSuccessful: undefined }, _ => {
      if ( !src ) return;
      const img = new Image();
      img.onload = this.onProgressiveLoad;
      img.onerror = this.onProgressiveError;
      img.src = src;
      if ( img.complete || ( img.width + img.height ) > 0 ) {
        this.setState({ progressiveHasCache: true });
      } else {
        this.setState({ progressiveHasCache: false });
      }
    });
  }

  componentFetchRegular(src = this.props.srchd) {
    const { progressiveLoadedSuccessful, regularLoadedSuccessful, allLoadedSuccessful } = this.state;
    if ( !src || !progressiveLoadedSuccessful || regularLoadedSuccessful || allLoadedSuccessful ) return;
    const img = new Image();
    img.onload = this.onRegularLoad;
    img.onerror = this.onRegularError;
    img.src = src;
    if ( img.complete || ( img.width + img.height ) > 0 ) {
      this.setState({ regularHasCache: true });
    } else {
      this.setState({ regularHasCache: false });
    }
  }

  onProgressiveLoad = e => {
    this.mounted && this.setState(state => !state.progressiveLoadedSuccessful && { progressiveLoadedSuccessful: true }, _ => {
      this.componentFetchRegular();
    });
  }

  onProgressiveError = e => {
    this.mounted && this.setState(state => state.progressiveLoadedSuccessful && { progressiveLoadedSuccessful: false });
  }

  onRegularLoad = e => {
    this.mounted && this.setState(state => !state.regularLoadedSuccessful && { regularLoadedSuccessful: true }, _ => {
      setImmediate(_ => {
        this.mounted && this.setState(state => !state.allLoadedSuccessful && { allLoadedSuccessful: true });
      });
    });
  }

  onRegularError = e => {
    this.mounted && this.setState(state => state.regularLoadedSuccessful && { regularLoadedSuccessful: false });
  }

  renderFallback() {
    const { src, srchd, cover, className, ...props } = this.props;
    const scale = isHighDensity()
      ? 'image-2x'
      : 'image-1x';
    const classname = className
      ? `no-select image-fallback ${scale} ${className}`
      : `no-select image-fallback ${scale}`;
    return <div className={classname} { ...props }>
      <style jsx>{`
        .image-fallback {
          position: relative;
          min-width: 202px;
          max-width: 100%;
          width: 300px;
          height: 202px;
          background-color: #eee;
        }
        .image-1x {  }
        .image-2x {  }
        .reload-btn {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          padding-top: 10px;
          padding-bottom: 10px;
          padding-left: 12px;
          padding-right: 12px;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 2px;
          background-color: #fff;
          border: 1px solid #eee;
          border-radius: 2px;
          outline: none;
          cursor: pointer;
        }
        .reload-btn:hover {
          color: #185be7;
        }
        .reload-btn:active {
          color: #084bd7;
        }
      `}</style>
      <button className="reload-btn no-select">RELOAD IMAGE</button>
    </div>
  }

  renderCoverImage() {
    const { src, srchd, cover, width, height, style, ...props } = this.props;
    const { progressiveLoadedSuccessful, regularLoadedSuccessful, allLoadedSuccessful, progressiveHasCache, regularHasCache } = this.state;
    return <div style={{
      ...style,
      width,
      height,
      position: 'relative',
      backgroundColor: '#000',
    }}>
      { src && <Motion style={{ opacity: spring(progressiveLoadedSuccessful === true && !allLoadedSuccessful ? 1 : 0) }}>
        {({ opacity }) => (
          <div { ...props } style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1,
            width,
            height,
            opacity: progressiveHasCache && !regularHasCache ? 1 : opacity,
            backgroundImage: progressiveLoadedSuccessful && `url(${src})`,
            backgroundPosition: progressiveLoadedSuccessful && 'center',
            backgroundSize: progressiveLoadedSuccessful && 'contain',
            backgroundRepeat: progressiveLoadedSuccessful && 'no-repeat',
          }} />
        )}
      </Motion> }
      { srchd && <Motion defaultStyle={{ opacity: 0 }} style={{ opacity: spring(progressiveLoadedSuccessful === true && regularLoadedSuccessful === true ? 1 : 0) }}>
        {({ opacity }) => (
          <div { ...props } style={{
            width,
            height,
            opacity: progressiveHasCache && regularHasCache ? 1 : opacity,
            backgroundImage: progressiveLoadedSuccessful && `url(${srchd})`,
            backgroundPosition: progressiveLoadedSuccessful && 'center',
            backgroundSize: progressiveLoadedSuccessful && 'contain',
            backgroundRepeat: progressiveLoadedSuccessful && 'no-repeat',
          }} />
        )}
      </Motion> }
    </div>
  }

  renderImage() {
    const { src, srchd, cover, ...props } = this.props;
    return <img
      { ...props }
      src={srchd || src}
      onLoad={this.onLoad}
      onError={this.onError}
    />
  }

  render() {
    const { cover } = this.props;
    const { progressiveLoadedSuccessful } = this.state;
    if ( progressiveLoadedSuccessful === false ) {
      return this.renderFallback();
    }
    if ( cover === false ) {
      return this.renderImage();
    }
    return this.renderCoverImage();
  }

}
