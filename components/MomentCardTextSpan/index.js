
import React from 'react';
import ReactDOM from 'react-dom';

export default class MomentCardTextSpan extends React.Component {

  static propTypes = {
    contentFocused            : React.PropTypes.bool,
    contentAnchorOffsetKey    : React.PropTypes.string,
    contentAnchorOffsetGroup  : React.PropTypes.string,
    contentAnchorOffset       : React.PropTypes.number,
    contentFocusOffsetKey     : React.PropTypes.string,
    contentFocusOffsetGroup   : React.PropTypes.string,
    contentFocusOffset        : React.PropTypes.number,
    contentSelectionRecovery  : React.PropTypes.bool,
    id                        : React.PropTypes.string,
    group                     : React.PropTypes.number,
    text                      : React.PropTypes.string,
    style                     : React.PropTypes.object,
  }

  static defaultProps = {
    contentFocused            : false,
    contentAnchorOffsetKey    : null,
    contentAnchorOffsetGroup  : null,
    contentAnchorOffset       : 0,
    contentFocusOffsetKey     : null,
    contentFocusOffsetGroup   : null,
    contentFocusOffset        : 0,
    contentSelectionRecovery  : false,
    id                        : '',
    group                     : 0,
    text                      : '',
    style                     : { },
  }

  _forceFlag = false;

  shouldComponentUpdate(nextProps) {
    const node = ReactDOM.findDOMNode(this);
    return node.textContent !== nextProps.text;
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
      contentFocused,
      contentAnchorOffsetKey,
      contentAnchorOffsetGroup,
      contentAnchorOffset,
      contentFocusOffsetKey,
      contentFocusOffsetGroup,
      contentFocusOffset,
      contentSelectionRecovery,
    } = this.props;

    if ( id !== contentAnchorOffsetKey && id !== contentFocusOffsetKey ) return;

    const contentGroup = `${group}`;
    if ( contentGroup !== contentAnchorOffsetGroup && contentGroup !== contentFocusOffsetGroup ) return;

    if ( !contentFocused ) return;
    if ( !window.getSelection ) return;

    const textNode = ReactDOM.findDOMNode(this).firstChild;
    if ( !textNode ) return;

    const offset = contentAnchorOffset + (text.length - prevText.length);

    const selection = window.getSelection();
    const range = document.createRange();
    range.setStart(textNode, offset);
    range.setEnd(textNode, offset);
    selection.removeAllRanges();
    selection.addRange(range);

  }

  render() {
    const { id, group, text, style } = this.props;
    return <span key={this._forceFlag ? 'A' : 'B'} data-offset-key={id} data-offset-group={group} data-moment-text="true" style={style}>{ text }</span>;
  }

}

