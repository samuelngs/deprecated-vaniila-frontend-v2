
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import { MomentEditHandler, MomentCompositionHandler, defaultState } from './handlers';
import MomentEditorHook from './hooks';
import MomentCardControls from '../MomentCardControls';
import MomentCardText from '../MomentCardText';
import MomentCardImage from '../MomentCardImage';
import MomentCardTwitter from '../MomentCardTwitter';
import MomentCardYoutube from '../MomentCardYoutube';

import { analyze } from '../MomentCardText/utils';
import { api } from '../../reducers/editor';

export default class MomentCard extends React.Component {

  static contextTypes = {
    store: PropTypes.object,
  }

  static propTypes = {
    root        : PropTypes.string,
    id          : PropTypes.string,
    x           : PropTypes.number,
    y           : PropTypes.number,
    no          : PropTypes.number,
    total       : PropTypes.number,
    opacity     : PropTypes.number,
    scale       : PropTypes.number,
    width       : PropTypes.number,
    height      : PropTypes.number,
    cover       : PropTypes.bool,
    placeholder : PropTypes.string,
    editmode    : PropTypes.bool,
    editable    : PropTypes.bool,
    moment      : PropTypes.object,
    files       : PropTypes.object,
    editorState : PropTypes.object,
    onCreate    : PropTypes.func,
    onChange    : PropTypes.func,
    onProgress  : PropTypes.func,
  }

  static defaultProps = {
    root        : '',
    id          : '',
    x           : 0,
    y           : 0,
    no          : 0,
    total       : 0,
    opacity     : 1,
    scale       : 1,
    width       : 0,
    height      : 0,
    cover       : false,
    placeholder : 'What\'s happening?',
    editmode    : false,
    editable    : false,
    moment      : {
      data      : {
        blocks  : [ ],
      },
      hash      : 0,
      order     : 1,
      parent    : null,
      style     : { },
    },
    files       : { },
    editorState : { },
    onCreate    : _ => null,
    onChange    : _ => null,
    onProgress  : _ => null,
  }

  componentDidMount() {
    this.override();
    this.bind();
    this.shouldAutoFocus();
  }

  componentDidUpdate() {
    this.shouldAutoFocus();
  }

  shouldAutoFocus() {
    const {
      props   : { root, id, moment, editorState: { editorNextMoment } },
      context : { store: { dispatch } },
    } = this;
    if ( editorNextMoment && id === editorNextMoment ) {
      const blocks = (moment && moment.data && moment.data.blocks) || [ ];
      const update = {
        id,
        nextId: null,
      };
      const block = blocks[blocks.length - 1];
      const groups = analyze(block);
      if ( block ) {
        update.anchorKey         = block.key;
        update.anchorGroup       = `${groups.length - 1}`;
        update.anchorOffset      = groups[groups.length - 1].length;
        update.focusKey          = block.key;
        update.focusGroup        = `${groups.length - 1}`;
        update.focusOffset       = groups[groups.length - 1].length;
        update.selectionRecovery = true;
      }
      this
        .focus()
        .then(_ => dispatch(api.setEditorState(root, update)))
    }
  }

  focus() {
    return new Promise(resolve => {
      return resolve(this.n && this.n.focus());
    });
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

    this.handleControlAction = this.handleControlAction.bind(this);
    this.handleSelectAction = this.handleSelectAction.bind(this);
    this.handleChangeAction = this.handleChangeAction.bind(this);
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
    const { editorState, onCreate } = this.props;
    switch ( event ) {
      case 'media-upload':
        return MomentEditorHook.onImageInsert.call(this, data);
      case 'inline-media':
        return MomentEditorHook.onInline.call(this, data);
      case 'fullscreen-media':
        return MomentEditorHook.onFullscreen.call(this, data);;
      case 'insert-character':
        return MomentEditorHook.onTextInsert.call(this, data);
      case 'insert-newline':
        return MomentEditorHook.onNewLine.call(this);
      case 'delete-character':
        return MomentEditorHook.onTextDelete.call(this);
      case 'delete-image':
        return MomentEditorHook.onImageDelete.call(this, data);
      case 'style':
        return MomentEditorHook.onStyle.call(this, data);
      case 'align-moment':
        return MomentEditorHook.onAlign.call(this);
      case 'delete-moment':
        return MomentEditorHook.onMomentDelete.call(this);
      case 'append-moment':
        return onCreate().then(({ name, block }) => {
          const { root } = this.props;
          const { store: { dispatch } } = this.context;
          return dispatch(api.setEditorState(root, { nextId: name, focus: true }));
        });
      case 'insert-moment':
        return onCreate(data).then(({ name, block }) => {
          const { root } = this.props;
          const { store: { dispatch } } = this.context;
          return dispatch(api.setEditorState(root, { nextId: name, focus: true }));
        });
    }
  }

  contextReceiveComposition(event, data) {
    switch ( event ) {
      case 'insert-character':
        return MomentEditorHook.onTextInsert.call(this, data);
    }
  }

  handleControlAction(event, data) {
    return this.contextReceiveEvent
      && this.contextReceiveEvent('edit', event, data);
  }

  handleChangeAction(event, key) {
    return this.contextReceiveEvent
      && this.contextReceiveEvent('edit', event, key);
  }

  handleSelectAction(key, type) {
    const { root, editmode } = this.props;
    const { store: { dispatch } } = this.context;
    if ( !editmode ) return;
    document.activeElement && document.activeElement.blur();
    return dispatch(api.setEditorState(root, {
      anchorKey         : key,
      anchorGroup       : '0',
      anchorOffset      : 0,
      focusKey          : key,
      focusGroup        : '0',
      focusOffset       : 0,
      selectionRecovery : false,
    }));
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
    const { width, height, x, y, opacity } = this.props;
    return {
      width,
      height,
      opacity,
      transform: `translate3d(${x}px, ${y}px, 0px) scale(1)`,
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
   * render blocks
   */
  renderBlocks(blocks) {

    const { scale, editmode, editable, editorState } = this.props;

    const groups = [ ];
    for ( let i = 0; i < blocks.length; i++ ) {
      const block = blocks[i];
      const { key, type } = block;

      switch ( type ) {
        case 'unordered-list-item':
          const unorderedList = [ ];
          while ( i < blocks.length && blocks[i].type === 'unordered-list-item' ) {
            unorderedList.push(
              this.renderBlock(blocks, blocks[i], i)
            );
            i++;
          }
          groups.push(<ul key={groups.length - 1} style={{ paddingLeft: 50 }}>{ unorderedList }</ul>);
          i--;
          break;
        case 'ordered-list-item':
          const orderedList = [ ];
          while ( i < blocks.length && blocks[i].type === 'ordered-list-item' ) {
            orderedList.push(
              this.renderBlock(blocks, blocks[i], i)
            );
            i++;
          }
          groups.push(<ol key={groups.length - 1} style={{ paddingLeft: '2.1em' }}>{ orderedList }</ol>);
          i--;
          break;
        case 'code':
          const code = [ ];
          while ( i < blocks.length && blocks[i].type === 'code' ) {
            code.push(
              this.renderBlock(blocks, blocks[i], i)
            );
            i++;
          }
          groups.push(<ol key={groups.length - 1} style={{ paddingLeft: '2.1em' }} className="code">{ code }</ol>);
          i--;
          break;
        default:
          groups.push(
            this.renderBlock(blocks, blocks[i], i)
          );
          break;
      }
    }

    return groups;

  }

  /**
   * render block view
   */
  renderBlock(blocks, block, i) {

    const { scale, placeholder, moment: { parent }, editmode, editable, width, height, files, editorState } = this.props;
    const { key, type, data } = block;

    switch ( type ) {
      case 'unstyled':
      case 'header-one':
      case 'header-two':
      case 'blockquote':
      case 'code':
      case 'unordered-list-item':
      case 'ordered-list-item':
        return <MomentCardText
          key={key}
          position={i}
          block={block}
          total={blocks.length}
          scale={scale}
          placeholder={placeholder}
          editmode={editmode}
          editable={editable}
          files={files}
          editorState={editorState}
        />
      case 'image':
        return <MomentCardImage
          key={key}
          position={i}
          block={block}
          total={blocks.length}
          scale={scale}
          editmode={editmode}
          editable={editable}
          width={width}
          height={height}
          fullscreen={parent === key}
          files={files}
          editorState={editorState}
          onSelect={this.handleSelectAction}
          onChange={this.handleChangeAction}
        />
      case 'twitter':
        return <MomentCardTwitter
          key={key}
          position={i}
          block={block}
          total={blocks.length}
          scale={scale}
          editmode={editmode}
          editable={editable}
          width={width}
          height={height}
          fullscreen={parent === key}
          files={files}
          editorState={editorState}
          onSelect={this.handleSelectAction}
          onChange={this.handleChangeAction}
        />
      case 'youtube':
        return <MomentCardYoutube
          key={key}
          position={i}
          block={block}
          total={blocks.length}
          scale={scale}
          editmode={editmode}
          editable={editable}
          width={width}
          height={height}
          fullscreen={parent === key}
          files={files}
          editorState={editorState}
          onSelect={this.handleSelectAction}
          onChange={this.handleChangeAction}
        />
      default:
        return null;
    }
  }

  /**
   * render component view
   */
  render() {
    const { id, no, total, scale, cover, editmode, editable, moment, editorState, width } = this.props;
    const { editorMoment, editorSelectionTop, editorSelectionLeft, editorIsCollapsed, editorIsCompositionMode } = editorState;
    const when = moment.when;
    const fullscreen = !!moment.parent;
    const align = (moment && moment.align) || 0;
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
          outline: none;
          -webkit-user-modify: read-write-plaintext-only;
        }
        .base-inner {
          margin: auto;
          padding-top: 10px;
          padding-bottom: 10px;
          display: flex;
          overflow-y: auto;
          overflow-x: hidden;
          flex-direction: column;
        }
        .base-vcenter {
          justify-content: center;
        }
        .base-hcenter {
          align-items: center;
          text-align: center;
        }
        .base-word {
          white-space: pre-wrap;
          word-break: break-word;
          word-wrap: break-word;
        }
      `}</style>
      <MomentCardControls
        id={id}
        no={no}
        when={when}
        total={total}
        editmode={editmode && !cover}
        fullscreen={fullscreen}
        active={id === editorMoment}
        onAction={this.handleControlAction}
      />
      <div
        { ...handlers }
        ref={n => this.n = n}
        className={cover || align === 1 ? "base-content base-word" : "base-content base-word"}
        aria-label="moment-content"
        data-moment-contenteditable={id}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        contentEditable={editmode}
        autoFocus={editmode}
        suppressContentEditableWarning={true}
        style={contentStyle}
      >
        <div className={cover || align === 1 ? "base-inner base-hcenter" : "base-inner"} style={{ width, paddingTop: fullscreen && 0, paddingBottom: fullscreen && 0 }}>
          { this.renderBlocks(blocks) }
        </div>
      </div>
    </article>;
  }

}

