
import React from 'react';
import PropTypes from 'prop-types';

import { TransitionMotion, Motion, spring } from 'react-motion';

import MomentCard from '../MomentCard';

export default class EditorMomentCards extends React.Component {

  static propTypes = {
    // moments collection id
    id              : PropTypes.string,
    // moments' items id(s)
    ids             : PropTypes.arrayOf(PropTypes.string),
    // number of moment items
    count           : PropTypes.number,
    // moments datastore
    moments         : PropTypes.object,
    // sizing units
    size            : PropTypes.shape({
      list          : PropTypes.shape({
        width       : PropTypes.number,
        height      : PropTypes.number,
        padding     : PropTypes.number,
      }),
      card          : PropTypes.shape({
        width       : PropTypes.number,
        height      : PropTypes.number,
        padding     : PropTypes.number,
        ratio       : PropTypes.number,
      }),
      screen        : PropTypes.shape({
        width       : PropTypes.number,
        height      : PropTypes.number,
      }),
    }),
    // editor state
    state           : PropTypes.object,
    files           : PropTypes.object,
    // callbacks
    onCreate        : PropTypes.func,
    onChange        : PropTypes.func,
  }

  static defaultProps = {
    id              : '',
    ids             : [ ],
    count           : 0,
    moments         : { },
    size            : { },
    state           : { },
    files           : { },
    onCreate        : _ => null,
    onChange        : _ => null,
  }

  /**
   * default component state
   */
  state = {
    initialized: false,
  }

  /**
   * card references
   */
  cards = { }

  componentDidMount() {
    const { initialized } = this.state;
    if ( !initialized ) {
      this.setState({ initialized: true });
    }
  }

  emit(id, type, event, data) {
    return this.cards[id]
      && this.cards[id].contextReceiveEvent
      && this.cards[id].contextReceiveEvent(type, event, data);
  }

  willEnter(o) {
    const { style: { x } } = o;
    return { x, y: 10, opacity: 1 };
  }

  willLeave(o) {
    const { style: { x } } = o;
    return { x, y: spring(-10), opacity: spring(0) };
  }

  getDefaultStyles() {
    const {
      id: root,
      ids,
      moments,
      state,
      files,
      size: { card: { width, height, padding, ratio: scale } },
      onCreate,
      onChange,
    } = this.props;
    return ids.map((id, i) => ({
      key       : id,
      data      : {
        root,
        id,
        no          : i + 1,
        total       : ids.length,
        ref         : n => this.cards[id] = n,
        key         : id,
        moment      : moments[id],
        editmode    : true,
        editorState : state,
        files,
        onCreate,
        onChange,
      },
      style     : {
        x       : ( i + 1 ) * width + ( i + 1 ) * padding,
        y       : 0,
        opacity : 1,
        scale,
        width,
        height,
      },
    }));
  }

  getStyles() {
    const {
      id: root,
      ids,
      moments,
      state,
      files,
      size: { card: { width, height, padding, ratio: scale } },
      onCreate,
      onChange,
    } = this.props;
    return ids.map((id, i) => ({
      key       : id,
      data      : {
        root,
        id,
        no          : i + 1,
        total       : ids.length,
        ref         : n => this.cards[id] = n,
        key         : id,
        moment      : moments[id],
        editmode    : true,
        editorState : state,
        files,
        onCreate,
        onChange,
      },
      style     : {
        x       : ( i + 1 ) * width + ( i + 1 ) * padding,
        y       : spring(0),
        opacity : spring(1),
        scale,
        width,
        height,
      },
    }));
  }

  getListStyle({ opacity }) {
    const { size: { list: { width, height, padding } } } = this.props;
    return {
      opacity,
      width,
      height,
      minWidth    : width,
      minHeight   : height,
      paddingLeft : padding,
    };
  }

  renderCard({ key, data: props, style }) {
    return <MomentCard
      { ...props }
      x={style.x}
      y={style.y}
      opacity={style.opacity}
      scale={style.scale}
      width={style.width}
      height={style.height}
    />
  }

  render() {
    const { size: { card: { width, height, ratio } } } = this.props;
    const { initialized } = this.state;
    return <TransitionMotion
      defaultStyles={this.getDefaultStyles()}
      styles={this.getStyles()}
      willLeave={::this.willLeave}
      willEnter={::this.willEnter}>
      { styles => <Motion defaultStyle={{ opacity: 0 }} style={{ opacity: spring(initialized ? 1 : 0) }}>
        { style => <div className="base" style={this.getListStyle(style)}>
          <style jsx>{`
            .base { position: relative; }
          `}</style>
          <MomentCard
            cover={true}
            scale={ratio}
            width={width}
            height={height}
            editmode={true}
          />
          { styles.map(this.renderCard) }
        </div> }
      </Motion> }
    </TransitionMotion>
  }

}
