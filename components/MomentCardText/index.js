
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import { collection } from './utils';
import MomentCardTextSpan from '../MomentCardTextSpan';

export default class MomentCardText extends React.PureComponent {

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
    placeholder : PropTypes.string,
    editmode    : PropTypes.bool,
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
    placeholder : '',
    editmode    : false,
    editorState : { },
  }

  _forceFlag = false;

  getFontSize(type) {
    switch ( type ) {
      case 'header-one':
        return '1.20em';
      case 'header-two':
        return '.85em';
      case 'blockquote':
        return '.65em';
      case 'code':
        return '.55em';
      default:
        return '.65em';
    }
  }

  getFontWeight(type) {
    switch ( type ) {
      case 'header-one':
        return 500;
      case 'header-two':
        return 400;
      default:
        return 300;
    }
  }

  getStyle(data, type) {
    const { scale } = this.props;
    const isListItem = (
      type === 'unordered-list-item' ||
      type === 'ordered-list-item' ||
      type === 'code'
    );
    return {
      fontSize: this.getFontSize(type),
      fontWeight: this.getFontWeight(type),
      lineHeight: 1.4,
      minHeight : data.length === 0 ? '1.4em' : 'min-content',
      maxWidth: '100%',
      paddingLeft: '5%',
      paddingRight: '5%',
      paddingTop: type === 'blockquote' && 5,
      paddingBottom: type === 'blockquote' && 5,
      marginTop: type === 'blockquote' && 0,
      marginBottom: type === 'blockquote' && 0,
      display: isListItem
        ? 'list-item'
        : 'inline-block',
      backgroundColor: type === 'code'
        ? '#ebfff6'
        : null,
      textAlign: type === 'code'
        ? 'left'
        : null,
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
    const { position, total, editorState, placeholder } = this.props;
    return groups.map(({ text, style }, i) => <MomentCardTextSpan
      key={i}
      id={key}
      position={position}
      group={i}
      total={total}
      spans={groups.length}
      text={text}
      style={style}
      placeholder={placeholder}
      editorState={editorState}
    />)
  }

  render() {

    const { position, block } = this.props;
    const { key, type, data, styles } = block;

    const style = this.getStyle(data, type);
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
      case 'code':
        return <li { ...props }><p style={{ display: 'inline-block', verticalAlign: 'top', color: '#585858' }}>{ this.renderGroups(key, groups) }</p></li>;
      case 'header-one':
        return <h1 { ...props }>{ this.renderGroups(key, groups) }</h1>;
      case 'header-two':
        return <h2 { ...props }>{ this.renderGroups(key, groups) }</h2>;
      case 'blockquote':
        return <blockquote { ...props }>{ this.renderGroups(key, groups) }</blockquote>;
      default:
        return <div { ...props }>{ this.renderGroups(key, groups) }</div>;
    }

  }

}


