
import React from 'react';
import PropTypes from 'prop-types';
import { TransitionMotion, spring, presets } from 'react-motion';

export default class EditorPeersList extends React.Component {

  static contextTypes = {
    store: PropTypes.object,
  }

  static propTypes = {
    headerHeight: PropTypes.number,
    peers: PropTypes.array,
  }

  static defaultProps = {
    headerHeight: 60,
    peers: [ ],
  }

  getDefaultStyles() {
    const { peers } = this.props;
    return peers.map(data => ({
      key: data.id,
      data,
      style: {
        x: 0,
        opacity: 0,
      },
    }));
  }

  getStyles() {
    const { peers } = this.props;
    return peers.map(data => ({
      key: data.id,
      data,
      style: {
        x: spring(-10),
        opacity: spring(1),
      },
    }));
  }

  willEnter() {
    return {
      x: 0,
      opacity: 0,
    };
  }

  willLeave() {
    return {
      x: spring(0),
      opacity: spring(0),
    };
  }

  renderPeer({ key, style, data }) {
    const { shortname, avatar, background } = data;
    return <li key={key} className="peer no-select" style={{
      opacity: style.opacity,
      transform: `translateX(${style.x}px)`,
      WebkitTransform: `translateX(${style.x}px)`,
    }}>
      <style jsx>{`
        .peer {
          margin-top: 0;
          margin-bottom: 0;
          margin-left: -10px;
          margin-right: 0;
          padding-top: 0;
          padding-bottom: 0;
          padding-left: 0;
          padding-right: 0;
          list-style: none;
          display: flex;
          width: 22px;
          height: 22px;
          border-radius: 11px;
          border: 2px solid #fff;
          background-color: #fff;
          position: relative;
          cursor: pointer;
        }
        .peer:nth-child(1) { z-index: 5; }
        .peer:nth-child(2) { z-index: 4; }
        .peer:nth-child(3) { z-index: 3; }
        .peer:nth-child(4) { z-index: 2; }
        .peer:nth-child(5) { z-index: 1; }
        .container {
          opacity: .5;
          filter: grayscale(100%);
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: filter ease .3s, opacity ease .3s;
          overflow: hidden;
        }
        .container-active {
          filter: none;
          opacity: 1;
        }
        .peer:nth-child(1) .container { background-color: #4d95fa; }
        .peer:nth-child(2) .container { background-color: #4db1d4; }
        .peer:nth-child(3) .container { background-color: #4dceae; }
        .peer:nth-child(4) .container { background-color: #4deb88; }
        .peer:nth-child(5) .container { background-color: #4dfa75; }
        .name {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 1px;
          color: #ffffff;
        }
        .avatar {
          height: 22px;
          width: 22px;
          border-radius: 11px;
        }
      `}</style>
      <div className={['container', !background && 'container-active'].filter(n => n).join(' ')}>
        {
          avatar && false
          ? <img draggable={false} className="avatar" src={avatar} />
          : <span className="name">{ shortname }</span>
        }
      </div>
    </li>
  }

  render() {
    const { headerHeight } = this.props;
    const { store: { getState } } = this.context;
    const { accountUsername, accountFullname, accountAvatar } = getState();
    return <div className="base no-select" style={{ height: headerHeight }}>
      <style jsx>{`
        .base {
          margin-top: 0;
          margin-bottom: 0;
          margin-left: 0;
          margin-right: 0;
          padding-top: 0;
          padding-bottom: 0;
          padding-left: 0;
          padding-right: 0;
          display: none;
          width: 155px;
        }
        .peers-list {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: flex-end;
          margin-top: 0;
          margin-bottom: 0;
          margin-left: 0;
          margin-right: 0;
          padding-top: 0;
          padding-bottom: 0;
          padding-left: 0;
          padding-right: 0;
          width: 155px;
        }
        @media (min-width: 760px) {
          .base {
            display: initial;
          }
        }
      `}</style>
      <TransitionMotion
        defaultStyles={this.getDefaultStyles()}
        styles={this.getStyles()}
        willLeave={::this.willLeave}
        willEnter={::this.willEnter}>
        { styles => <ul className="peers-list" style={{ height: headerHeight }}>
          { styles.map(style => this.renderPeer(style)) }
        </ul> }
      </TransitionMotion>
    </div>
  }

}

