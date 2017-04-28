
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
    src   : PropTypes.string,
    cover : PropTypes.bool,
  }

  static defaultProps = {
    src   : null,
    cover : false,
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

  componentDidMount() {
    this.componentFetchImage();
  }

  componentWillUpdate({ src: next }) {
    const { src: prev } = this.props;
    if ( prev !== next ) {
      this.componentFetchImage(next);
    }
  }

  componentFetchImage(src = this.props.src) {
    const { loadedSuccessful } = this.state;
    if ( typeof loadedSuccessful !== 'undefined' ) {
      this.setState({ loadedSuccessful: undefined });
    }
    const img = new Image();
    img.onload = this.onLoad;
    img.onerror = this.onError;
    img.src = src;
  }

  renderFallback() {
    const { src, cover, className, ...props } = this.props;
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
    const { src, cover, style, ...props } = this.props;
    const styles = {
      ...style,
      backgroundImage: `url(${src})`,
      backgroundPosition: 'center',
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      backgroundColor: '#000',
    };
    return <div { ...props } style={styles} />
  }

  renderPlaceholderImage() {
    const { src, cover, ...props } = this.props;
    return <div { ...props } />
  }

  renderImage() {
    const { src, cover, ...props } = this.props;
    return <img
      { ...props }
      src={src}
      onLoad={this.onLoad}
      onError={this.onError}
    />
  }

  render() {
    const { cover } = this.props;
    const { loadedSuccessful } = this.state;
    if ( loadedSuccessful === false ) {
      return this.renderFallback();
    }
    if ( loadedSuccessful === true && cover === true ) {
      return this.renderCoverImage();
    }
    if ( loadedSuccessful === true && cover === false ) {
      return this.renderImage();
    }
    return this.renderPlaceholderImage();
  }

}
