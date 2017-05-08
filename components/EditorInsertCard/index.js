
import React from 'react';
import PropTypes from 'prop-types';
import { TransitionMotion, spring, presets } from 'react-motion';

const active   = [ { key: 'insert-card' } ];
const inactive = [ ];

export default class EditorInsertCard extends React.PureComponent {

  static propTypes = {
    root        : PropTypes.string,
    id          : PropTypes.string,
    x           : PropTypes.number,
    y           : PropTypes.number,
    width       : PropTypes.number,
    height      : PropTypes.number,
    onInsert    : PropTypes.func,
  }

  static defaultProps = {
    root        : '',
    id          : '',
    x           : 0,
    y           : 0,
    width       : 0,
    height      : 0,
    onInsert    : _ => null,
  }

  state = {
    hovered: false,
  }

  componentDidMount() {
    this.$$_mounted_$$ = true;
  }

  componentWillUnmount() {
    this.$$_mounted_$$ = false;
  }

  onEnter = e => {
    this.$$_mounted_$$ && this.setState({ hovered: true });
  }

  onLeave = e => {
    this.$$_mounted_$$ && this.setState({ hovered: false });
  }

  willEnter() {
    return { opacity: 0, scale: 0.75 };
  }

  willLeave() {
    return { opacity: spring(0), scale: spring(0.57) };
  }

  getDefaultStyles() {
    const { hovered } = this.state;
    const arr = hovered
      ? active
      : inactive;
    return arr.map(o => ({ ...o, style: { opacity: 0, scale: 0.75 } }));
  }

  getStyles() {
    const { hovered } = this.state;
    const arr = hovered
      ? active
      : inactive;
    return arr.map(o => ({ ...o, style: { opacity: spring(1), scale: spring(1) } }));
  }

  getContainerStyle() {
    const { x, y, width, height } = this.props;
    return {
      width,
      height,
      position  : 'absolute',
      display   : 'flex',
      transform : `translate3d(${x}px, ${y}px, 0px) scale(1)`,
    }
  }

  renderInsertButton = ({ key, style, data }) => {
    const { onInsert } = this.props;
    return <button
      key={key}
      className="base"
      style={{
        opacity: style.opacity,
        transform: `translate3d(-50%, -50%, 0) scale(${style.scale})`
      }}
      onClick={onInsert}
    >
      <style jsx>{`
        .base {
          position: absolute;
          top: 50%;
          left: 50%;
          height: 60px;
          width: 60px;
          outline: none;
          border: none;
          border-radius: 30px;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.09);
          background-color: #fff;
          cursor: pointer;
          z-index: 10;
        }
        svg {
          margin-top: 4px;
          height: 24px;
          width: 24px;
          fill: #185BE7;
        }
      `}</style>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
        <path d="M9.9 3c-.7.1-1.2.7-1.1 1.3v4.4H4.2c-.7.1-1.2.7-1.2 1.4s.6 1.2 1.3 1.2h4.4v4.4c0 .7.5 1.3 1.2 1.3s1.3-.5 1.3-1.2v-4.4h4.4c.7 0 1.3-.5 1.3-1.2s-.5-1.3-1.2-1.3h-4.4V4.3c0-.7-.6-1.3-1.3-1.3h-.1z"/>
      </svg>
    </button>;
  }

  render() {
    const { active } = this.state;
    return <TransitionMotion
      defaultStyles={this.getDefaultStyles()}
      styles={this.getStyles()}
      willLeave={::this.willLeave}
      willEnter={::this.willEnter}>
      { styles => <div style={this.getContainerStyle()} onMouseEnter={this.onEnter} onMouseLeave={this.onLeave}>
        { styles.map(this.renderInsertButton) }
      </div> }
    </TransitionMotion>
  }

}
