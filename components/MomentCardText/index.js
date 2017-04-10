
import React from 'react';

import { collection } from './utils';
import MomentCardTextSpan from '../MomentCardTextSpan';

export default class MomentCardText extends React.Component {

  static propTypes = {
    contentFocused            : React.PropTypes.bool,
    contentAnchorOffsetKey    : React.PropTypes.string,
    contentAnchorOffsetGroup  : React.PropTypes.string,
    contentAnchorOffset       : React.PropTypes.number,
    contentFocusOffsetKey     : React.PropTypes.string,
    contentFocusOffsetGroup   : React.PropTypes.string,
    contentFocusOffset        : React.PropTypes.number,
    contentSelectionRecovery  : React.PropTypes.bool,
    block                     : React.PropTypes.shape({
      type                    : React.PropTypes.string,
      key                     : React.PropTypes.string,
      data                    : React.PropTypes.string,
      styles                  : React.PropTypes.array,
    }),
    scale                     : React.PropTypes.number,
    editmode                  : React.PropTypes.bool,
    editable                  : React.PropTypes.bool,
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
    block                     : {
      type                    : '',
      key                     : '',
      data                    : '',
      styles                  : [ ],
    },
    scale                     : 1,
    editmode                  : false,
    editable                  : false,
  }

  getStyle() {
    const { scale } = this.props;
    return {
      fontWeight: 300,
      lineHeight: 1.2,
      minHeight : '1.2em',
      display   : 'inline-block',
    };
  }

  render() {

    const {
      block,
      contentFocused,
      contentAnchorOffsetKey,
      contentAnchorOffsetGroup,
      contentAnchorOffset,
      contentFocusOffsetKey,
      contentFocusOffsetGroup,
      contentFocusOffset,
      contentSelectionRecovery,
    } = this.props;

    const { key, data, styles } = block;

    const style = this.getStyle();
    const groups = collection(block);

    return <div aria-label="moment-card-block" data-offset-key={key} className="base" style={style}>
      <style jsx>{`
        .base {
          font-size: .9em;
        }
        .base + .base { margin-top: 20px; }
      `}</style>
      { groups.map(({ text, style }, i) => <MomentCardTextSpan
        key={i}
        id={key}
        group={i}
        text={text}
        style={style}
        contentFocused={contentFocused}
        contentAnchorOffsetKey={contentAnchorOffsetKey}
        contentAnchorOffsetGroup={contentAnchorOffsetGroup}
        contentAnchorOffset={contentAnchorOffset}
        contentFocusOffsetKey={contentFocusOffsetKey}
        contentFocusOffsetGroup={contentFocusOffsetGroup}
        contentFocusOffset={contentFocusOffset}
        contentSelectionRecovery={contentSelectionRecovery}
      />) }
    </div>;
  }

}


