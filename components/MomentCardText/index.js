
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
    total       : PropTypes.number,
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
    total       : 0,
    scale       : 1,
    editmode    : false,
    editable    : false,
    editorState : { },
  }

  _forceFlag = false;

  getStyle(type) {
    const { scale } = this.props;
    const isListItem = (
      type === 'unordered-list-item' ||
      type === 'ordered-list-item'
    );
    return {
      fontSize: '.65em',
      fontWeight: 300,
      lineHeight: 1.4,
      minHeight : '1.2em',
      paddingLeft: 40,
      paddingRight: 40,
      display:isListItem
        ? 'list-item'
        : 'inline-block',
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

  renderGroups(key, groups) {
    const { position, total, editorState } = this.props;
    return groups.map(({ text, style }, i) => <MomentCardTextSpan
      key={i}
      id={key}
      position={position}
      group={i}
      total={total}
      spans={groups.length}
      text={text}
      style={style}
      editorState={editorState}
    />)
  }

  render() {

    const { position, block } = this.props;
    const { key, type, data, styles } = block;

    const style = this.getStyle(type);
    const groups = collection(block);

    const props = {
      key: this._forceFlag
        ? 'A'
        : 'B',
      style,
      'aria-label': 'moment-card-block',
      'data-offset-key': key,
      'data-offset-position': position,
    };

    switch ( type ) {
      case 'unordered-list-item':
      case 'ordered-list-item':
        return <li { ...props }><p style={{ display: 'inline-block', verticalAlign: 'top' }}>{ this.renderGroups(key, groups) }</p></li>;
      default:
        return <div { ...props }>{ this.renderGroups(key, groups) }</div>;
    }

  }

}


