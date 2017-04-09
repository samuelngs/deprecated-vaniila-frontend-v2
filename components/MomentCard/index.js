
import React from 'react';

import MomentEditorHandler, { defaultState } from './handlers';
import MomentCardText from '../MomentCardText';

export default class MomentCard extends React.Component {

  static propTypes = {
    x       : React.PropTypes.number,
    scale   : React.PropTypes.number,
    width   : React.PropTypes.number,
    height  : React.PropTypes.number,
    editmode: React.PropTypes.bool,
    editable: React.PropTypes.bool,
  }

  static defaultProps = {
    x       : 0,
    scale   : 1,
    width   : 0,
    height  : 0,
    editmode: false,
    editable: false,
  }

  state = {
    contentFocused: false,
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
    } = this;
    const store = { ...defaultState };
    this.handlers = MomentEditorHandler({
      set     : o => o && Object.keys(o).forEach(k => store[k] = o[k]),
      get     : o => store,
      dispatch: setState.bind(this),
      emit    : emit.bind(this),
      props   : props.bind(this),
      state   : state.bind(this),
    });
  }

  /**
   * function to receive props and state
   */
  contextReceiveProps() { return this.props; }
  contextReceiveState() { return this.state; }

  /**
   * trigger when receiving callback from handlers
   */
  contextReceiveEvent(event, data) {
    console.log(event);
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
   * render component view
   */
  render() {
    const { scale, editmode, editable } = this.props;
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
        }
        .base-word {
          word-break: break-word;
          word-wrap: break-word;
        }
      `}</style>
      <div
        { ...this.handlers }
        className="base-content base-word base-vcenter"
        aria-label="moment-content"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        contentEditable={true}
        suppressContentEditableWarning={true}
        style={contentStyle}
      >
        <MomentCardText scale={scale} editmode={editmode} editable={editable} />
        <MomentCardText scale={scale} editmode={editmode} editable={editable} />
      </div>
    </article>;
  }

}

