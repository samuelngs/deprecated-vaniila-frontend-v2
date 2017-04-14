
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import { MomentEditHandler, MomentCompositionHandler, defaultState } from './handlers';
import MomentEditorHook from './hooks';
import MomentCardText from '../MomentCardText';

export default class MomentCard extends React.Component {

  static contextTypes = {
    store: PropTypes.object,
  }

  static propTypes = {
    root        : PropTypes.string,
    id          : PropTypes.string,
    x           : PropTypes.number,
    scale       : PropTypes.number,
    width       : PropTypes.number,
    height      : PropTypes.number,
    cover       : PropTypes.bool,
    editmode    : PropTypes.bool,
    editable    : PropTypes.bool,
    moment      : PropTypes.object,
    editorState : PropTypes.object,
    onChange    : PropTypes.func,
  }

  static defaultProps = {
    root        : '',
    id          : '',
    x           : 0,
    scale       : 1,
    width       : 0,
    height      : 0,
    cover       : false,
    editmode    : false,
    editable    : false,
    moment      : {
      data      : {
        blocks  : [ ],
      },
      hash      : 0,
      order     : 1,
      style     : { },
    },
    editorState : { },
    onChange    : _ => null,
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
    const { contextReceiveEvent, props: { root, id }, context: { store } } = this;
    const context = { root, id, store, emit: contextReceiveEvent.bind(this) };
    this.editHandler = new MomentEditHandler(context);
    this.compositionHandler = new MomentCompositionHandler(context);
  }

  /**
   * trigger when receiving event from handlers
   */
  contextReceiveEvent(type, event, data) {
    switch ( type ) {
      case 'edit':
        return this.contextReceiveEdit(event, data);
      case 'composition':
        return this.contextReceiveComposition(event, data);
    }
  }

  /**
   * trigger when receiving event from edit handler
   */
  contextReceiveEdit(event, data) {
    const { editorState } = this.props;
    switch ( event ) {
      case 'insert-character':
        return MomentEditorHook.onTextInsert.call(this, data);
      case 'delete-character':
        return MomentEditorHook.onTextDelete.call(this);
      case 'insert-newline':
        return MomentEditorHook.onNewLine.call(this);
    }
  }

  contextReceiveComposition(event, data) {
    switch ( event ) {
      case 'insert-character':
        return MomentEditorHook.onTextInsert.call(this, data);
    }
  }

  /**
   * get editor state
   */
  getEditorState() {
    const { editorState } = this.props;
    return editorState;
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
      width: width,
      height: height,
      maxWidth: width,
      maxHeight: height,
      fontSize: `${3.6 * scale + .1 / scale}em`,
      fontWeight: 300,
      lineHeight: 1.2,
    };
  }

  /**
   * render block view
   */
  renderBlock(blocks, block, i) {

    const { scale, editmode, editable, editorState } = this.props;
    const { key, type, data } = block;

    switch ( type ) {
      case 'text':
        return <MomentCardText
          key={key}
          position={i}
          block={block}
          total={blocks.length}
          scale={scale}
          editmode={editmode}
          editable={editable}
          editorState={editorState}
        />
      default:
        return null;
    }
  }

  /**
   * render component view
   */
  render() {
    const { id, scale, cover, editmode, editable, moment, editorState } = this.props;
    const { editorMoment, editorSelectionTop, editorSelectionLeft, editorIsCollapsed, editorIsCompositionMode } = editorState;
    const blocks = (moment && moment.data && moment.data.blocks) || [ ];
    const cardStyle = this.getCardStyle();
    const contentStyle = this.getContentStyle();
    const handlers = id
      ? (id === editorMoment && editorIsCompositionMode)
        ? this.compositionHandler
        : this.editHandler
      : null;
    return <article aria-label="moment-card" className={[ 'base', editmode && 'base-editor', id === editorMoment && 'base-editor-focus' ].filter(n => n).join(' ')} style={cardStyle}>
      <style jsx>{`
        .base {
          background-color: #fff;
          border-radius: 4px;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
          transition: box-shadow ease .2s;
          position: absolute;
          display: flex;
          overflow: hidden;
        }
        .base-dragging {
          box-shadow: rgba(0, 0, 0, 0.2) 0px 16px 32px 0px;
        }
        .base-editor-focus,
        .base-editor:hover {
          box-shadow: 0 1px 9px rgba(0, 0, 0, 0.09);
        }
        .base-content {
          display: flex;
          flex: 1;
          flex-direction: column;
          overflow: auto;
          outline: none;
          -webkit-user-modify: read-write-plaintext-only;
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
        { ...handlers }
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
        { blocks.map((block, i) => this.renderBlock(blocks, block, i)) }
      </div>
    </article>;
  }

}

