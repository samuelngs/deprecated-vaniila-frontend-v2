
import React from 'react';
import PropTypes from 'prop-types';

import { scrollToLeft } from '../Scroller';
import MomentCard from '../MomentCard';
import EditorContextualToolBar from '../EditorContextualToolbar';

import { api } from '../../reducers/editor';

export default class EditorStoryboard extends React.Component {

  static contextTypes = {
    store: PropTypes.object,
  }

  static propTypes = {
    id            : PropTypes.string,
    doc           : PropTypes.object,
    editorState   : PropTypes.object,
    windowSize    : PropTypes.shape({
      width       : PropTypes.number,
      height      : PropTypes.number,
    }),
    onMomentCreate: PropTypes.func,
    onMomentChange: PropTypes.func,
  }

  static defaultProps = {
    id            : '',
    doc           : { data: { slides: { } } },
    editorState   : { },
    windowSize    : {
      width       : typeof window !== 'undefined' ? window.innerWidth : 0,
      height      : typeof window !== 'undefined' ? window.innerHeight : 0,
    },
    onMomentCreate: _ => null,
    onMomentChange: _ => null,
  }

  state = {
    isPressed: false,
    topDeltaX: 0,
    mouseX: 0,
    originalPosOfLastPressed: 0,
  }

  cards = { }

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

  componentDidUpdate({ editorState: { editorMoment: prevMoment } }) {
    const { editorState: { editorMoment } } = this.props;
    if ( this.n && editorMoment !== prevMoment && editorMoment ) {
      this.onMomentsRelocation && clearTimeout(this.onMomentsRelocation);
      this.onMomentsRelocation = setTimeout(_ => {
        const { ids } = this.doc();
        const { itemWidth, itemPadding } = this.getMomentStyle(ids.length);
        const idx = ids.indexOf(editorMoment);
        if ( idx === -1 && this.scrollLock ) return;
        const widths = ids.map((n, i) => (i + 1) * itemWidth + (i + 1) * itemPadding);
        const offset = widths[idx];
        this.scrollLock = true;
        scrollToLeft(this.n, offset, {
          callback: _ => this.scrollLock = false,
        });
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
    window.addEventListener('touchmove', this.handleTouchMove);
    window.addEventListener('touchend', this.handleTouchUp);
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('mousedown', this.handleMouseDown);
    window.addEventListener('mouseup', this.handleMouseUp);
  }

  removeEventListener() {
    window.removeEventListener('touchmove', this.handleTouchMove);
    window.removeEventListener('touchend', this.handleTouchUp);
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('mousedown', this.handleMouseDown);
    window.removeEventListener('mouseup', this.handleMouseUp);
  }

  onMomentShortcut(type) {
    const { onMomentCreate } = this.props;
    switch ( type ) {
      case 'append-moment':
        return onMomentCreate().then(({ name, block }) => {
          const { id } = this.props;
          const { store: { dispatch } } = this.context;
          return dispatch(api.setEditorState(id, {
            nextId: name,
          }));
        });
    }
  }

  onContextualMenuPress(type) {
    const { editorState: { editorMoment } } = this.props;
    this.cards[editorMoment] && this.cards[editorMoment].contextReceiveEvent && this.cards[editorMoment].contextReceiveEvent('edit', 'style', type);
  }

  onContextualMenuOverride(e) {
    e.target.hasAttribute('data-contextual-menu') && e.preventDefault && e.preventDefault();
  }

  handleTouchUp(e) {
    this.handleMouseUp(e);
  }

  handleTouchStart(key, pressLocation, e) {
    this.handleMouseDown(key, pressLocation, e.touches[0]);
  }

  handleTouchMove(e) {
    this.handleMouseMove(e.touches[0]);
  }

  handleMouseUp() {
    this.setState({ isPressed: false, topDeltaX: 0 });
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
    this.handleRelocation();
  }

  handleRelocation() {
    if ( this.scrollLock ) return;
    if ( !this.n ) return;
    this.onMomentsRelocation && clearTimeout(this.onMomentsRelocation);
    this.onMomentsRelocation = setTimeout(_ => {
      const { ids, count, moments } = this.doc();
      const { itemWidth, itemPadding } = this.getMomentStyle(ids.length);
      const { scrollLeft } = this.n;
      const widths = [ 0, ...ids.map((n, i) => (i + 1) * itemWidth + (i + 1) * itemPadding) ];
      const offset = widths.reduce((prev, curr) => (Math.abs(curr - scrollLeft) < Math.abs(prev - scrollLeft) ? curr : prev));
      this.scrollLock = true;
      this.n && scrollToLeft(this.n, offset, {
        callback: _ => this.scrollLock = false,
      });
    }, 750);
  }

  getListStyle(numOfMoments) {
    return { }
  }

  getMomentStyle(count) {
    const { windowSize } = this.props;
    let itemWidth = windowSize.width - 40.0;
    let itemHeight = windowSize.height - 140.0;
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
    return { itemWidth, itemHeight, itemPadding, itemRatio, listWidth, listHeight, listPadding };
  }

  render() {
    const { id: root, editorState, windowSize, onMomentCreate, onMomentChange } = this.props;
    const { editorSelectionTop, editorSelectionLeft, editorIsCollapsed } = editorState;
    const { ids, count, moments } = this.doc();
    const { itemWidth, itemHeight, itemPadding, itemRatio, listWidth, listHeight, listPadding } = this.getMomentStyle(ids.length);
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
        .list {
          position: relative;
        }
      `}</style>
      <EditorContextualToolBar root={root} editorState={editorState} windowSize={windowSize} onPress={::this.onContextualMenuPress} />
      <div className="list" style={{ width: listWidth, minWidth: listWidth, height: listHeight, minHeight: listHeight, paddingLeft: listPadding }}>
        <MomentCard cover={true} x={0} scale={itemRatio} width={itemWidth} height={itemHeight} editmode={true} />
        { ids.map((id, i) =>
          <MomentCard
            ref={n => this.cards[id] = n}
            key={id}
            root={root}
            id={id}
            x={(i + 1) * itemWidth + (i + 1) * itemPadding}
            scale={itemRatio}
            width={itemWidth}
            height={itemHeight}
            editmode={true}
            moment={moments[id]}
            editorState={editorState}
            onShortcut={::this.onMomentShortcut}
            onChange={onMomentChange}
          />
        ) }
      </div>
    </div>;
  }

}

