
import React from 'react';
import PropTypes from 'prop-types';

export default class EditorCreateCard extends React.Component {

  static propTypes = {
    x       : PropTypes.number,
    y       : PropTypes.number,
    width   : PropTypes.number,
    height  : PropTypes.number,
    onClick : PropTypes.func,
  }

  static defaultProps = {
    x       : 0,
    y       : 0,
    width   : 250,
    height  : 200,
    onClick : _ => null,
  }

  shouldComponentUpdate({ x, y, height }) {
    return (
      x !== this.props.x ||
      y !== this.props.y ||
      height !== this.props.height
    )
  }

  getStyle() {
    const { x, y, width, height } = this.props;
    return {
      width,
      height,
      transform: `translate3d(${x}px, ${y}px, 0px) scale(1)`,
    }
  }

  render() {
    const { width, onClick } = this.props;
    return <div className="base" style={this.getStyle()}>
      <style jsx>{`
        .base {
          width: 250px;
          padding-right: 40px;
          opacity: .8;
        }
        .container {
          width: 250px;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        button {
          margin: 0;
          padding: 0;
          background-color: #f8f8f8;
          border: none;
          outline: none;
          width: 250px;
          height: 100%;
          border-radius: 4px;
          box-shadow: inset 0 0 .5px rgba(0, 0, 0, 0.3), 0 1px 4px rgba(0, 0, 0, 0.05);
          transition: background-color .4s ease;
          cursor: pointer;
        }
        button:hover {
          background-color: #fff;
        }
        svg {
          fill: #bbb;
          height: 40px;
          width: 40px;
          margin-bottom: 20px;
        }
        p {
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 2px;
          color: #bbb;
        }
        p + p {
          margin-top: 5px;
        }
      `}</style>
      <button onClick={onClick} style={{ width }}>
        <div className="container" style={{ width }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
            <path d="M30.4 4.1c-.7-.3-1.5-.1-2.1.4-.1.1-.2.2-.3.4L15.3 26.4c-.3.6-.4 1.3 0 1.9.3.6 1 1 1.7 1h5.1l-3.6 14.5c-.2.9.2 1.8 1.1 2.2.2.1.5.1.7.1.5 0 1-.2 1.3-.6.1-.1.2-.2.3-.4L34.7 24c.4-.6.4-1.3 0-1.9-.3-.6-1-1-1.7-1h-5.1l3.6-15c.3-.8-.2-1.7-1.1-2zm-.2 1.8l-4 16.7h6.9c.2 0 .3.1.4.2.1.1.1.3 0 .5L20.7 44.4s0 .1-.1.1c-.1.1-.2.1-.3.1h-.2c-.2-.1-.3-.3-.3-.6l4-16.3h-6.9c-.2 0-.3-.1-.4-.2-.1-.1-.1-.3 0-.5L29.3 5.6s0-.1.1-.1c.1-.1.3-.2.5-.1s.3.3.3.5z"/>
            <path d="M20.3 46.3c-.3 0-.6-.1-.8-.2-1-.4-1.5-1.5-1.3-2.5l3.5-14.2h-4.8c-.8 0-1.5-.4-1.9-1.1-.4-.7-.4-1.5 0-2.2L27.8 4.7c.1-.2.2-.3.3-.4.6-.6 1.5-.8 2.3-.5 1 .4 1.5 1.5 1.3 2.5L28.3 21h4.8c.8 0 1.5.4 1.9 1.1.4.7.4 1.5 0 2.2l-12.9 21c-.1.1-.2.3-.3.4-.4.4-.9.6-1.5.6zm2-17.3l-3.6 14.8c-.2.8.2 1.6 1 1.9.6.3 1.3.1 1.8-.4.1-.1.2-.2.2-.3l12.8-21c.3-.5.3-1.1 0-1.7-.3-.5-.8-.8-1.4-.8h-5.5l3.7-15.3c.2-.8-.2-1.6-1-1.9-.6-.3-1.3-.1-1.8.3-.1.1-.2.2-.2.3L15.5 26.5c-.3.5-.3 1.1 0 1.7.3.5.8.8 1.4.8h5.4zm-2 15.9c-.1 0-.2 0-.3-.1-.3-.1-.5-.5-.4-.8l3.9-16h-6.6c-.3 0-.5-.1-.6-.4-.1-.2-.1-.5 0-.7L29.1 5.4c0-.1.1-.1.1-.1.2-.2.5-.3.8-.2.3.1.5.5.4.8l-3.9 16.4h6.6c.3 0 .5.1.6.4.1.2.1.5 0 .7L20.9 44.6c0 .1-.1.1-.1.1-.1.1-.3.2-.5.2zm3.9-17.4l-4.1 16.6c0 .1 0 .2.1.3h.2l12.8-21.1v-.2c0-.1-.1-.1-.2-.1h-7.3l4.1-17c0-.1 0-.2-.1-.3h-.2L16.7 27.2v.2s.1.1.2.1h7.3z"/>
          </svg>
          <p>BAM! NEXT!</p>
        </div>
      </button>
    </div>
  }

}


