
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

export default class MomentCardTextSpan extends React.Component {

  static propTypes = {
    id          : PropTypes.string,
    position    : PropTypes.number,
    group       : PropTypes.number,
    text        : PropTypes.string,
    style       : PropTypes.object,
    editorState : PropTypes.object,
  }

  static defaultProps = {
    id          : '',
    position    : 0,
    group       : 0,
    text        : '',
    style       : { },
    editorState : { },
  }

  _forceFlag = false;

  shouldComponentUpdate(nextProps) {

    const node = ReactDOM.findDOMNode(this);
    const contentChanged = node.textContent !== nextProps.text;

    const { editorState: { editorStartGroup: prevStartGroup, editorEndGroup: prevEndGroup } } = this.props;
    const { id, group, editorState: { editorStartKey, editorStartGroup, editorEndKey, editorEndGroup } } = nextProps;
    const groupName = String(group);

    const selectionChanged = (
      ( id === editorStartKey || editorEndKey ) &&
      ( groupName === editorStartGroup || groupName === editorEndGroup ) &&
      ( prevStartGroup !== editorStartGroup || prevEndGroup !== editorEndGroup )
    );

    return contentChanged || selectionChanged;
  }

  componentWillUpdate(nextProps) {
    // By flipping this flag, we also keep flipping keys which forces
    // React to remount this node every time it rerenders.
    this._forceFlag = !this._forceFlag;
  }

  componentDidUpdate({ text: prevText }) {

    // Reset selection position
    const {
      id,
      group,
      text,
      editorState,
    } = this.props;

    const {
      editorHasFocus,
      editorStartKey,
      editorStartGroup,
      editorStartOffset,
      editorEndKey,
      editorEndGroup,
      editorEndOffset,
      editorSelectionRecovery,
    } = editorState;

    if ( id !== editorStartKey && id !== editorEndKey ) return;

    const contentGroup = String(group);
    if ( contentGroup !== editorStartGroup && contentGroup !== editorEndGroup ) return;

    if ( !editorHasFocus ) return;
    if ( !window.getSelection ) return;

    let textNode = ReactDOM.findDOMNode(this).firstChild;
    if ( !textNode ) textNode = ReactDOM.findDOMNode(this);

    let offset = editorSelectionRecovery
      ? editorStartOffset
      : editorStartOffset + (text.length - prevText.length);
    if ( group === 0 && editorSelectionRecovery && !prevText && text ) offset = text.length;
    if ( offset > text.length ) offset = text.length;
    if ( textNode.textContent && offset > textNode.textContent.length ) offset = textNode.textContent.length;

    const selection = window.getSelection();
    const range = document.createRange();
    range.setStart(textNode, offset);
    range.setEnd(textNode, offset);
    selection.removeAllRanges();
    selection.addRange(range);

  }

  render() {
    const { id, position, group, text, style } = this.props;
    return <span key={this._forceFlag ? 'A' : 'B'} data-offset-key={id} data-offset-position={position} data-offset-group={group} data-moment-text="true" style={style}>{ text }</span>;
  }

}

