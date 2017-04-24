
import React from 'react';
import PropTypes from 'prop-types';

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
    src: PropTypes.string,
  }

  static defaultProps = {
    src: null,
  }

  state = {
    loadedSuccessful: undefined,
  }

  onLoad = e => {
    this.setState({ loadedSuccessful: true });
  }

  onError = e => {
    this.setState({ loadedSuccessful: false });
  }

  renderFallback() {
    const { src, className, ...props } = this.props;
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
          background-image: url('/static/editor/dot.png');
          background-repeat: repeat;
          background-position: center;
        }
        .image-1x { background-size: 25px; }
        .image-2x { background-size: 12.5px; }
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
          box-shadow: 0 1px 1px 0 rgba(200, 200, 200, 0.2);
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

  renderImage() {
    const { src, ...props } = this.props;
    return <img
      { ...props }
      src={src}
      onLoad={this.onLoad}
      onError={this.onError}
    />
  }

  render() {
    const { loadedSuccessful } = this.state;
    if ( loadedSuccessful === false ) {
      return this.renderFallback();
    }
    return this.renderImage();
  }

}
