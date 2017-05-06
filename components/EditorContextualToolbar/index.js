
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import { TransitionMotion, spring, presets } from 'react-motion';

import Tooltip from '../Tooltip';
import EditorContextualToolbarBold from '../EditorContextualToolbarBold';
import EditorContextualToolbarItalic from '../EditorContextualToolbarItalic';
import EditorContextualToolbarStrikethrough from '../EditorContextualToolbarStrikethrough';
import EditorContextualToolbarH1 from '../EditorContextualToolbarH1';
import EditorContextualToolbarH2 from '../EditorContextualToolbarH2';
import EditorContextualToolbarQuote from '../EditorContextualToolbarQuote';
import EditorContextualToolbarCode from '../EditorContextualToolbarCode';
import EditorContextualToolbarBullet from '../EditorContextualToolbarBullet';
import EditorContextualToolbarNumber from '../EditorContextualToolbarNumber';

const active   = [ { key: 'contextual-toolbar' } ];
const inactive = [ ];

export default class EditorContextualToolBar extends React.PureComponent {

  static contextTypes = {
    store: PropTypes.object,
  }

  static propTypes = {
    root        : PropTypes.string,
    editorState : PropTypes.object,
    windowSize  : PropTypes.object,
    onPress     : PropTypes.func,
  }

  static defaultProps = {
    root        : '',
    editorState : { },
    windowSize  : {
      width     : typeof window !== 'undefined' ? window.innerWidth : 0,
      height    : typeof window !== 'undefined' ? window.innerHeight : 0,
    },
    onPress     : _ => null,
  }

  static cssVariables = {
    contextualToolbarHeight: 40,
    contextualToolbarWidth: 348,
  }

  handlePress(type) {
    const { onPress } = this.props;
    return onPress(type);
  }

  willEnter() {
    return { y: 0, opacity: 1 };
  }

  willLeave() {
    return { y: 0, opacity: 0 };
  }

  getDefaultStyles() {
    const { editorState: { editorStartKey, editorSelectionTop, editorSelectionLeft, editorIsCollapsed, editorHasFocus } } = this.props;
    const arr = editorStartKey !== 'cover' && !editorIsCollapsed && editorSelectionTop !== 0 && editorSelectionLeft !== 0 && editorHasFocus
      ? active
      : inactive;
    return arr.map(o => ({ ...o, style: { y: 0, opacity: 1 } }));
  }

  getStyles() {
    const { editorState: { editorStartKey, editorSelectionTop, editorSelectionLeft, editorIsCollapsed, editorHasFocus } } = this.props;
    const arr = editorStartKey !== 'cover' && !editorIsCollapsed && editorSelectionTop !== 0 && editorSelectionLeft !== 0 && editorHasFocus
      ? active
      : inactive;
    return arr.map(o => ({ ...o, style: { y: spring(20), opacity: spring(1) } }));
  }

  /**
   * get card style
   */
  getToolbarStyle({ y, opacity }) {
    const { windowSize, editorState: { editorSelectionTop, editorSelectionLeft, editorSelectionRight } } = this.props;
    const top = editorSelectionTop;
    const left = (editorSelectionLeft + editorSelectionRight) / 2 - EditorContextualToolBar.cssVariables.contextualToolbarWidth / 2;
    const bottom = top + EditorContextualToolBar.cssVariables.contextualToolbarHeight;
    const right = left + EditorContextualToolBar.cssVariables.contextualToolbarWidth;
    const cx = (
      left >= 20
      ? (
        windowSize.width - left >= ( EditorContextualToolBar.cssVariables.contextualToolbarWidth + 20 )
        ? left
        : windowSize.width - ( EditorContextualToolBar.cssVariables.contextualToolbarWidth + 20 )
      )
      : 20
    );
    const cy = (
      top - 30 >= 80
      ? (
        windowSize.height - top >= ( EditorContextualToolBar.cssVariables.contextualToolbarHeight + 30 )
        ? top - 30
        : windowSize.height - ( EditorContextualToolBar.cssVariables.contextualToolbarHeight + 30 )
      )
      : 80
    );
    return {
      height    : EditorContextualToolBar.cssVariables.contextualToolbarHeight,
      width     : EditorContextualToolBar.cssVariables.contextualToolbarWidth,
      top       : top - 30,
      top       : cy,
      left      : cx,
      transform : `translate3d(0px, -${y}px, 0px) scale(1)`,
      opacity,
    };
  }

  /**
   * render contextual toolbar
   */
  renderContextualToolbar(key, style) {
    return <div key={key} className="base" style={this.getToolbarStyle(style)} data-contextual-menu={true}>
      <style jsx>{`
        .base {
          position: absolute;
          margin-top: 0;
          margin-left: 0;
          margin-bottom: 0;
          margin-right: 0;
          display: flex;
          flex-direction: row;
          background-color: #1A2A38;
          border-radius: 3px;
          box-sizing: border-box;
          box-shadow: 0 0 0 1px #000, 0 8px 16px rgba(27,39,51,0.16);
          white-space: nowrap;
          z-index: 10;
        }
      `}</style>
      <style jsx global>{`
        .contextual-toolbar-button:first-child { margin-left: 5px; }
        .contextual-toolbar-button:last-child { margin-right: 5px; }
        .contextual-toolbar-button {
          display: block;
          padding-top: 5px;
          padding-left: 5px;
          padding-bottom: 5px;
          padding-right: 5px;
          height: 30px;
          width: 30px;
          background-color: transparent;
          border: none;
          outline: none;
          opacity: .5;
        }
        .contextual-toolbar-button:hover,
        .contextual-toolbar-button:active {
          opacity: 1;
        }
        .contextual-toolbar-button-list {
          margin-left: 4px;
          margin-right: 4px;
        }
        .contextual-toolbar-button-title {
          margin-left: 2px;
          margin-right: 5px;
        }
        .contextual-toolbar-button-subtitle {
          margin-right: 10px;
        }
        .contextual-toolbar-separator {
          margin-left: 10px;
          margin-right: 10px;
          height: 100%;
          width: 0px;
          background-color: #000;
          border-right: 1px solid #000;
        }
      `}</style>
      <Tooltip tag="button" className="contextual-toolbar-button" title="Bold" position="top" data-contextual-menu onClick={_ => this.handlePress('bold')}>
        <EditorContextualToolbarBold />
      </Tooltip>
      <Tooltip tag="button" className="contextual-toolbar-button" title="Italic" position="top" data-contextual-menu onClick={_ => this.handlePress('italic')}>
        <EditorContextualToolbarItalic />
      </Tooltip>
      <Tooltip tag="button" className="contextual-toolbar-button" title="Strikethrough" position="top" data-contextual-menu onClick={_ => this.handlePress('strikethrough')}>
        <EditorContextualToolbarStrikethrough />
      </Tooltip>
      <Tooltip tag="button" className="contextual-toolbar-button contextual-toolbar-button-list" title="Bulleted list" position="top" data-contextual-menu onClick={_ => this.handlePress('unordered-list')}>
        <EditorContextualToolbarBullet />
      </Tooltip>
      <Tooltip tag="button" className="contextual-toolbar-button contextual-toolbar-button-list" title="Numbered list" position="top" data-contextual-menu onClick={_ => this.handlePress('ordered-list')}>
        <EditorContextualToolbarNumber />
      </Tooltip>
      <Tooltip tag="button" className="contextual-toolbar-button contextual-toolbar-button-title" title="Large header" position="top" data-contextual-menu onClick={_ => this.handlePress('h1')}>
        <EditorContextualToolbarH1 />
      </Tooltip>
      <Tooltip tag="button" className="contextual-toolbar-button contextual-toolbar-button-title" title="Medium header" position="top" data-contextual-menu onClick={_ => this.handlePress('h2')}>
        <EditorContextualToolbarH2 />
      </Tooltip>
      <div className="contextual-toolbar-separator" data-contextual-menu={true} />
      <Tooltip tag="button" className="contextual-toolbar-button" title="Quote" position="top" data-contextual-menu onClick={_ => this.handlePress('quote')}>
        <EditorContextualToolbarQuote />
      </Tooltip>
      <Tooltip tag="button" className="contextual-toolbar-button" title="Code" position="top" data-contextual-menu onClick={_ => this.handlePress('code')}>
        <EditorContextualToolbarCode />
      </Tooltip>
    </div>;
  }

  /**
   * render component view
   */
  render() {
    return <TransitionMotion
      defaultStyles={this.getDefaultStyles()}
      styles={this.getStyles()}
      willLeave={::this.willLeave}
      willEnter={::this.willEnter}>
      { styles => <div>
        { styles.map(({ key, style, data }) => this.renderContextualToolbar(key, style)) }
      </div> }
    </TransitionMotion>
  }

}

