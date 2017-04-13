
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import { collection } from './utils';
import MomentCardTextSpan from '../MomentCardTextSpan';

export default class MomentCardText extends React.Component {

  static propTypes = {
    position    : PropTypes.number,
    block       : PropTypes.shape({
      type      : PropTypes.string,
      key       : PropTypes.string,
      data      : PropTypes.string,
      styles    : PropTypes.array,
    }),
    scale       : PropTypes.number,
    editmode    : PropTypes.bool,
    editable    : PropTypes.bool,
    editorState : PropTypes.object,
  }

  static defaultProps = {
    position    : 0,
    block       : {
      type      : '',
      key       : '',
      data      : '',
      styles    : [ ],
    },
    scale       : 1,
    editmode    : false,
    editable    : false,
    editorState : { },
  }

  _forceFlag = false;

  getStyle() {
    const { scale } = this.props;
    return {
      fontWeight: 300,
      lineHeight: 1.2,
      minHeight : '1.2em',
      display   : 'inline-block',
    };
  }

  componentWillUpdate(nextProps) {
    const node = ReactDOM.findDOMNode(this);
    let forceRedraw = false;
    for ( let i = 0; i < node.childNodes.length; i++ ) {
      const el = node.childNodes[i];
      if ( el.nodeType === Node.TEXT_NODE ) {
        forceRedraw = true;
        break;
      }
    }
    if ( forceRedraw ) {
      // By flipping this flag, we also keep flipping keys which forces
      // React to remount this node every time it rerenders.
      this._forceFlag = !this._forceFlag;
    }
  }

  render() {

    const {
      position,
      block,
      editorState,
    } = this.props;

    const { key, data, styles } = block;

    const style = this.getStyle();
    const groups = collection(block);

    return <div key={this._forceFlag ? 'A' : 'B'} aria-label="moment-card-block" data-offset-key={key} data-offset-position={position} className="base" style={style}>
      <style jsx>{`
        .base {
          font-size: .9em;
        }
        .base + .base { margin-top: 20px; }
      `}</style>
      { groups.map(({ text, style }, i) => <MomentCardTextSpan
        key={i}
        id={key}
        position={position}
        group={i}
        text={text}
        style={style}
        editorState={editorState}
      />) }
    </div>;
  }

}


