
import React from 'react';
import PropTypes from 'prop-types';

import { scrollToLeft } from '../Scroller';

import EditorMomentCards from '../EditorMomentCards';
import EditorContextualToolBar from '../EditorContextualToolbar';

import { api } from '../../reducers/editor';

export default class EditorStoryboard extends React.Component {

  static contextTypes = {
    store: PropTypes.object,
  }

  static propTypes = {
    id              : PropTypes.string,
    doc             : PropTypes.object,
    files           : PropTypes.object,
    editorState     : PropTypes.object,
    windowSize      : PropTypes.shape({
      width         : PropTypes.number,
      height        : PropTypes.number,
    }),
    onMomentCreate  : PropTypes.func,
    onMomentChange  : PropTypes.func,
    onMomentProgress: PropTypes.func,
  }

  static defaultProps = {
    id              : '',
    doc             : { data: { slides: { } } },
    files           : { },
    editorState     : { },
    windowSize      : {
      width         : typeof window !== 'undefined' ? window.innerWidth : 0,
      height        : typeof window !== 'undefined' ? window.innerHeight : 0,
    },
    onMomentCreate  : _ => null,
    onMomentChange  : _ => null,
    onMomentProgress: _ => null,
  }

  state = {
    scrollLeft: 0,
    isPressed: false,
    topDeltaX: 0,
    mouseX: 0,
    originalPosOfLastPressed: 0,
  }

  doc() {
    const { doc } = this.props;
    const data = (doc.data || { });
    const moments = (data.slides || { });
    const ids = Object.keys(moments);
    const count = ids.length;
    return { ids, count, moments };
  }

  componentDidMount() {
    this.bind();
    this.addEventListener();
    this.defaultLayout();
  }

  componentWillUnmount() {
    this.removeEventListener();
  }

  componentDidUpdate({ editorState: { editorMoment: prevMoment, editorHasFocus: prevHasFocus } }) {
    const { editorState: { editorMoment, editorHasFocus } } = this.props;
    if ( this.n && editorMoment && ( editorMoment !== prevMoment || editorHasFocus !== prevHasFocus ) ) {
      this.onMomentsRelocation && clearTimeout(this.onMomentsRelocation);
      this.onMomentsRelocation = setTimeout(_ => {
        const { ids } = this.doc();
        const { itemWidth, itemPadding } = this.getMomentStyle(ids.length);
        const idx = ids.indexOf(editorMoment);
        if ( idx === -1 ) return;
        const widths = ids.map((n, i) => (i + 1) * itemWidth + (i + 1) * itemPadding);
        const offset = widths[idx];
        if ( this.scrollCancellable ) this.scrollCancellable();
        this.scrollCancellable = scrollToLeft(this.n, offset);
      }, 200);
    }
  }

  defaultLayout() {
    if ( this.n && this.n.lastChild ) {
      this.n.scrollLeft = this.n.lastChild.offsetWidth;
    }
  }

  bind() {
    this.handleTouchUp = this.handleTouchUp.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
  }

  addEventListener() {
    window.addEventListener('touchstart', this.handleTouchStart);
    window.addEventListener('touchmove', this.handleTouchMove);
    window.addEventListener('touchend', this.handleTouchUp);
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('mousedown', this.handleMouseDown);
    window.addEventListener('mouseup', this.handleMouseUp);
  }

  removeEventListener() {
    window.removeEventListener('touchstart', this.handleTouchStart);
    window.removeEventListener('touchmove', this.handleTouchMove);
    window.removeEventListener('touchend', this.handleTouchUp);
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('mousedown', this.handleMouseDown);
    window.removeEventListener('mouseup', this.handleMouseUp);
  }

  onContextualMenuPress(action) {
    const { editorState: { editorMoment } } = this.props;
    this.cards && this.cards.emit(editorMoment, 'edit', 'style', action);
  }

  onContextualMenuOverride(e) {
    (
     e.target.hasAttribute('data-contextual-menu') ||
     e.target.hasAttribute('data-controls')
    ) && e.preventDefault && e.preventDefault();
  }

  handleTouchUp(e) {
    this.handleMouseUp(e);
  }

  handleTouchStart(e) {
  }

  handleTouchMove(e) {
  }

  handleMouseUp(e) {
  }

  handleMouseDown(e) {
    this.onContextualMenuOverride(e);
  }

  handleMouseMove({ pageX }) {

    const { isPressed, topDeltaX, originalPosOfLastPressed } = this.state;

    // if it's not pressed, ignored action
    if ( !isPressed ) return;

    const mouseX = pageX - topDeltaX;

  }

  handleScroll() {
    const { id, editorState: { editorSelectionTop, editorSelectionLeft, editorIsCollapsed } } = this.props;
    if ( !editorIsCollapsed && editorSelectionTop !== 0 && editorSelectionLeft !== 0 ) {
      this.onContextualMenuRelocation && clearImmediate(this.onContextualMenuRelocation);
      this.onContextualMenuRelocation = setImmediate(_ => {
        const rect = window.getSelection().getRangeAt(0).getBoundingClientRect() || { };
        const { store: { dispatch } } = this.context;
        dispatch(api.setEditorState(id, {
          selectionTop      : rect.top,
          selectionLeft     : rect.left,
          selectionBottom   : rect.bottom,
          selectionRight    : rect.right,
          selectionHeight   : rect.height,
          selectionWidth    : rect.width,
        }));
      });
    }
    if ( this.n ) {
      const { scrollLeft } = this.n;
      this.setState({ scrollLeft });
    }
    this.handleRelocation();
  }

  handleRelocation() {
    if ( !this.n ) return;
    this.onMomentsRelocation && clearTimeout(this.onMomentsRelocation);
    this.onMomentsRelocation = setTimeout(_ => {
      const offset = this.getMomentOffsets();
      if ( !this.n ) return;
      if ( this.scrollCancellable ) this.scrollCancellable();
      this.scrollCancellable = scrollToLeft(this.n, offset);
    }, 500);
  }

  getMomentStyle(count) {
    const { windowSize } = this.props;
    let itemWidth = windowSize.width - 40.0;
    let itemHeight = windowSize.height - 160.0;
    let itemRatio = itemWidth / 1024.0;
    if ( itemWidth >= 760 ) {
      itemWidth = Math.ceil(itemWidth * 0.5);
      itemRatio = itemWidth / 1024.0;
      let itemRatioHeight = Math.ceil(768 * itemRatio);
      itemHeight = itemHeight > itemRatioHeight ? itemRatioHeight : itemHeight;
    } else {
      let itemHeightRatio = itemHeight / 768.0;
      itemRatio = itemRatio > itemHeightRatio ? itemHeightRatio : itemRatio;
    }
    if ( itemWidth > 1024 ) itemWidth = 1024;
    if ( itemHeight > 768 ) itemHeight = 768;
    const itemPadding = 40.0;
    const listWidth = itemWidth * (count + 1) + itemPadding * count + (windowSize.width - itemWidth) / 2;
    const listPadding = (windowSize.width - itemWidth) / 2;
    const listHeight = itemHeight;
    const maximumItems = Math.ceil(windowSize.width / itemWidth);
    return { itemWidth, itemHeight, itemPadding, itemRatio, listWidth, listHeight, listPadding, maximumItems };
  }

  getMomentOffsets() {
    const { ids, count, moments } = this.doc();
    const { itemWidth, itemPadding } = this.getMomentStyle(ids.length);
    const { scrollLeft } = this.n;
    const widths = [ 0, ...ids.map((n, i) => (i + 1) * itemWidth + (i + 1) * itemPadding) ];
    return widths.reduce((prev, curr) => (Math.abs(curr - scrollLeft) < Math.abs(prev - scrollLeft) ? curr : prev));
  }

  render() {

    const {
      id,
      files,
      editorState,
      windowSize,
      onMomentCreate,
      onMomentChange,
      onMomentProgress,
    } = this.props;

    const {
      scrollLeft,
    } = this.state;

    const {
      ids,
      count,
      moments,
    } = this.doc();

    const {
      itemWidth,
      itemHeight,
      itemPadding,
      itemRatio,
      listWidth,
      listHeight,
      listPadding,
    } = this.getMomentStyle(ids.length);

    return <div ref={n => this.n = n} className="base" data-moments={true} onScroll={this.handleScroll}>
      <style jsx>{`
        .base {
          margin-top: 46px;
          flex: 1;
          display: flex;
          overflow-x: auto!important;
          overflow-y: hidden!important;
          align-items: center;
        }
      `}</style>
      <EditorContextualToolBar
        root={id}
        editorState={editorState}
        windowSize={windowSize}
        onPress={::this.onContextualMenuPress}
      />
      <EditorMomentCards
        ref={n => this.cards = n}
        id={id}
        ids={ids}
        count={count}
        moments={moments}
        size={{
          list  : { width: listWidth, height: listHeight, padding: listPadding },
          card  : { width: itemWidth, height: itemHeight, padding: itemPadding, ratio: itemRatio },
          screen: { width: windowSize.width, height: windowSize.height },
        }}
        state={editorState}
        files={files}
        scrollLeft={scrollLeft}
        onCreate={onMomentCreate}
        onChange={onMomentChange}
        onProgress={onMomentProgress}
      />
    </div>;
  }

}

