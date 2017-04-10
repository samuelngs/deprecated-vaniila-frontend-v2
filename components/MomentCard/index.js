
import React from 'react';
import ReactDOM from 'react-dom';

import MomentEditorHandler, { defaultState } from './handlers';
import MomentEditorHook from './hooks';
import MomentCardText from '../MomentCardText';

export default class MomentCard extends React.Component {

  static propTypes = {
    id      : React.PropTypes.string,
    x       : React.PropTypes.number,
    scale   : React.PropTypes.number,
    width   : React.PropTypes.number,
    height  : React.PropTypes.number,
    cover   : React.PropTypes.bool,
    editmode: React.PropTypes.bool,
    editable: React.PropTypes.bool,
    moment  : React.PropTypes.object,
    onChange: React.PropTypes.func,
  }

  static defaultProps = {
    id      : '',
    x       : 0,
    scale   : 1,
    width   : 0,
    height  : 0,
    cover   : false,
    editmode: false,
    editable: false,
    moment  : {
      data  : {
        blocks: [ ],
      },
      hash  : 0,
      order : 1,
      style : { },
    },
    onChange: _ => null,
  }

  state = {
    contentFocused            : false,
    contentAnchorOffsetKey    : null,
    contentAnchorOffsetGroup  : null,
    contentAnchorOffset       : 0,
    contentFocusOffsetKey     : null,
    contentFocusOffsetGroup   : null,
    contentFocusOffset        : 0,
    contentSelectionRecovery  : false,
  }

  componentDidMount() {
    this.override();
    this.bind();
  }

  override() {
    /**
     * IE has a hardcoded "feature" that attempts to convert link text into
     * anchors in contentEditable DOM. This breaks the editor's expectations of
     * the DOM, and control is lost. Disable it to make IE behave.
     * See: http://blogs.msdn.com/b/ieinternals/archive/2010/09/15/
     * ie9-beta-minor-change-list.aspx
     */
    document.execCommand('AutoUrlDetect', false, false);
  }

  bind() {
    const {
      setState,
      contextReceiveProps: props,
      contextReceiveState: state,
      contextReceiveEvent: emit,
      contextReceiveSelection: getSelection,
    } = this;
    const store = { ...defaultState };
    this.handlers = MomentEditorHandler({
      set         : o => o && Object.keys(o).forEach(k => store[k] = o[k]),
      get         : o => store,
      dispatch    : setState.bind(this),
      emit        : emit.bind(this),
      props       : props.bind(this),
      state       : state.bind(this),
      getSelection: getSelection.bind(this),
    });
  }

  /**
   * function to receive props and state
   */
  contextReceiveProps() { return this.props; }
  contextReceiveState() { return this.state; }

  /**
   * function to receive selection
   */
  contextReceiveSelection() {
    return { };
  }

  /**
   * trigger when receiving callback from handlers
   */
  contextReceiveEvent(event, data) {
    switch ( event ) {
      case 'beforeinput':
        return this.onContentInput(data);
      case 'delete':
        return this.onContentDelete();
    }
  }

  /**
   * trigger when input event within content area
   */
  onContentInput(character) {
    MomentEditorHook.onTextInsert.call(this, character);
  }

  /**
   * trigger when delete event
   */
  onContentDelete() {
    MomentEditorHook.onTextDelete.call(this);
  }

  /**
   * get card style
   */
  getCardStyle() {
    const { width, height, x } = this.props;
    return {
      width,
      height,
      transform: `translate3d(${x}px, 0px, 0px) scale(1)`,
    };
  }

  /**
   * get content area style
   */
  getContentStyle() {
    const { scale, width, height } = this.props;
    const padding = 20.0;
    return {
      padding,
      width: width - padding * 2,
      height: height - padding * 2,
      maxWidth: width - padding * 2,
      maxHeight: height - padding * 2,
      fontSize: `${3.6 * scale + .1 / scale}em`,
      fontWeight: 300,
      lineHeight: 1.2,
    };
  }

  /**
   * render block view
   */
  renderBlock(block, i) {

    const {
      contentFocused,
      contentAnchorOffsetKey,
      contentAnchorOffsetGroup,
      contentAnchorOffset,
      contentFocusOffsetKey,
      contentFocusOffsetGroup,
      contentFocusOffset,
      contentSelectionRecovery,
    } = this.state;

    const { scale, editmode, editable } = this.props;
    const { key, type, data } = block;

    switch ( type ) {
      case 'text':
        return <MomentCardText
          key={key}
          block={block}
          scale={scale}
          editmode={editmode}
          editable={editable}
          contentFocused={contentFocused}
          contentAnchorOffsetKey={contentAnchorOffsetKey}
          contentAnchorOffsetGroup={contentAnchorOffsetGroup}
          contentAnchorOffset={contentAnchorOffset}
          contentFocusOffsetKey={contentFocusOffsetKey}
          contentFocusOffsetGroup={contentFocusOffsetGroup}
          contentFocusOffset={contentFocusOffset}
          contentSelectionRecovery={contentSelectionRecovery}
        />
      default:
        return null;
    }
  }

  /**
   * render component view
   */
  render() {
    const { scale, cover, editmode, editable, moment } = this.props;
    const blocks = (moment && moment.data && moment.data.blocks) || [ ];
    const cardStyle = this.getCardStyle();
    const contentStyle = this.getContentStyle();
    return <article aria-label="moment-card" className={ editmode ? "base base-editor" : "base"} style={cardStyle}>
      <style jsx>{`
        .base {
          background-color: #fff;
          border-radius: 5px;
          box-shadow: inset rgba(181, 189, 198, 0.27451) 0px 0px 0px 1px, rgba(31, 45, 61, .05) 0 1px 8px 0;
          transition: box-shadow ease .2s;
          position: absolute;
          display: flex;
          overflow: hidden;
        }
        .base-dragging {
          box-shadow: rgba(0, 0, 0, 0.2) 0px 16px 32px 0px;
        }
        .base-editor:hover {
          box-shadow: inset rgba(181, 189, 198, 0.37451) 0px 0px 0px 1px, rgba(31, 45, 61, .12) 0 1px 12px 0;
        }
        .base-content {
          display: flex;
          flex: 1;
          flex-direction: column;
          overflow: auto;
          outline: none;
        }
        .base-vcenter {
          justify-content: center;
        }
        .base-hcenter {
          align-items: center;
          text-aligin: center;
        }
        .base-word {
          white-space: pre-wrap;
          word-break: break-word;
          word-wrap: break-word;
        }
      `}</style>
      <div
        { ...this.handlers }
        className={cover ? "base-content base-word base-vcenter base-hcenter" : "base-content base-word base-vcenter"}
        aria-label="moment-content"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        contentEditable={editmode}
        suppressContentEditableWarning={true}
        style={contentStyle}
      >
        { blocks.map((block, i) => this.renderBlock(block, i)) }
      </div>
    </article>;
  }

}

