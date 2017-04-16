
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

export default class MomentCardTextSpan extends React.Component {

  static propTypes = {
    id          : PropTypes.string,
    position    : PropTypes.number,
    group       : PropTypes.number,
    total       : PropTypes.number,
    spans       : PropTypes.number,
    text        : PropTypes.string,
    style       : PropTypes.object,
    editorState : PropTypes.object,
  }

  static defaultProps = {
    id          : '',
    position    : 0,
    group       : 0,
    total       : 0,
    spans       : 0,
    text        : '',
    style       : { },
    editorState : { },
  }

  _forceFlag = false;

  shouldComponentUpdate(nextProps) {

    const node = ReactDOM.findDOMNode(this);

    const { editorState: {
      editorStartKey          : prevStartKey,
      editorStartGroup        : prevStartGroup,
      editorStartOffset       : prevStartOffset,
      editorEndKey            : prevEndKey,
      editorEndGroup          : prevEndGroup,
      editorEndOffset         : prevEndOffset,
      editorSelectionRecovery : prevSelectionRecovery,
      editorIsCompositionMode : prevIsCompositionMode,
      editorIsCollapsed       : prevIsCollapsed,
      total                   : prevTotal,
      spans                   : prevSpans,
      text                    : prevText,
      style                   : prevStyle,
    } } = this.props;

    const { editorState: {
      editorStartKey,
      editorStartGroup,
      editorStartOffset,
      editorEndKey,
      editorEndGroup,
      editorEndOffset,
      editorSelectionRecovery,
      editorIsCompositionMode,
      editorIsCollapsed
    }, id, group, total, spans, text, style } = nextProps;

    const groupName = String(group);

    // checks if text content changed
    const contentChanged = (
      ( !editorIsCompositionMode ) &&
      ( node.textContent !== nextProps.text )
    );

    // checks if selection state has been changed
    const selectionChanged = (
      (
        (
          editorEndKey ||
          ( id === editorStartKey )
        ) &&
        (
          ( groupName === editorStartGroup ) ||
          ( groupName === editorEndGroup )
        ) &&
        (
          ( prevStartGroup !== editorStartGroup ) ||
          ( prevEndGroup !== editorEndGroup )
        )
      ) ||
      (
        !editorIsCollapsed &&
        ( prevIsCollapsed !== editorIsCollapsed )
      )
    );

    // checks if selection needs to redraw
    const selectionRecovery = (
      ( prevIsCompositionMode && !editorIsCompositionMode ) ||
      ( prevSelectionRecovery !== editorSelectionRecovery && editorSelectionRecovery )
    );

    return (
      contentChanged
      || selectionChanged
      || selectionRecovery
    );
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
      editorIsCollapsed,
      editorSelectionRecovery,
    } = editorState;

    if ( id !== editorStartKey && id !== editorEndKey ) return;

    const contentGroup = String(group);
    if ( contentGroup !== editorStartGroup && contentGroup !== editorEndGroup ) return;

    if ( !window.getSelection ) return;

    let textNode = ReactDOM.findDOMNode(this).firstChild;
    if ( !textNode ) textNode = ReactDOM.findDOMNode(this);

    const selection = window.getSelection();
    const range = document.createRange();

    let start, end;
    if ( editorIsCollapsed ) {

      start = editorSelectionRecovery
            ? editorStartOffset
            : editorStartOffset + (text.length - prevText.length)
      if ( group === 0 && editorSelectionRecovery && !prevText && text ) start = text.length;
      if ( start > text.length ) start = text.length;
      if ( textNode.textContent && start > textNode.textContent.length ) start = textNode.textContent.length;
      if ( start < 0 ) start = 0;
      textNode && range.setStart(textNode, start);
      selection.removeAllRanges();
      selection.addRange(range);

      return;
    }

    // only execute selection on the start group node, prevent selection happens twice (!on both nodes)
    // if both are in the same group, this will only execute once
    if ( id !== editorStartKey || contentGroup !== editorStartGroup ) return;

    let startEl = document.querySelector(`span[data-offset-key="${editorStartKey}"][data-offset-group="${editorStartGroup}"]`);
    let endEl   = document.querySelector(`span[data-offset-key="${editorEndKey}"][data-offset-group="${editorEndGroup}"]`);

    if ( startEl && startEl.firstChild && startEl.firstChild.nodeType === Node.TEXT_NODE ) startEl = startEl.firstChild;
    if ( endEl && endEl.firstChild && endEl.firstChild.nodeType === Node.TEXT_NODE ) endEl = endEl.firstChild;

    start = editorStartOffset;
    end = editorEndOffset;

    if ( startEl && start > startEl.textContent.length ) start = startEl.textContent.length;
    if ( start < 0 ) start = 0;
    if ( endEl && end > endEl.textContent.length ) end = endEl.textContent.length;
    if ( end < 0 ) end = 0;

    startEl && range.setStart(startEl, start);
    endEl && range.setEnd(endEl, end);
    selection.removeAllRanges();
    selection.addRange(range);

  }

  render() {
    const { id, position, group, total, spans, text, style } = this.props;
    const placeholder = group === 0 && total === 1 && spans === 1 && !text;
    return <span key={this._forceFlag ? 'A' : 'B'} data-offset-key={id} data-offset-position={position} data-offset-group={group} data-moment-text="true" data-placeholder="What's happening?" style={style} className={placeholder ? "placeholder" : "moment-card-span"}>{ text }</span>;
  }

}

