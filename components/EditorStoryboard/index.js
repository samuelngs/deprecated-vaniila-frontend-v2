
import React from 'react';
import PropTypes from 'prop-types';

import EditorMomentCards from '../EditorMomentCards';
import EditorContextualToolBar from '../EditorContextualToolbar';

import { scrollToLeft } from '../Scroller';
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

    dragging: false,  // dragging state
    sx      : 0,      // start x
    sy      : 0,      // start y
    cx      : 0,      // current x
    cy      : 0,      // current y

    scrollLeft: 0,
  }

  componentDidMount() {
    window.addEventListener('touchstart', this.handleTouchStart);
    window.addEventListener('touchmove', this.handleTouchMove);
    window.addEventListener('touchend', this.handleTouchEnd);
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('mousedown', this.handleMouseDown);
    window.addEventListener('mouseup', this.handleMouseUp);
    if ( this.n && this.n.lastChild ) this.n.scrollLeft = this.n.lastChild.offsetWidth;
  }

  componentWillUnmount() {
    window.removeEventListener('touchstart', this.handleTouchStart);
    window.removeEventListener('touchmove', this.handleTouchMove);
    window.removeEventListener('touchend', this.handleTouchEnd);
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('mousedown', this.handleMouseDown);
    window.removeEventListener('mouseup', this.handleMouseUp);
  }

  componentDidUpdate({ editorState: { editorMoment: prevMoment, editorHasFocus: prevHasFocus } }) {
    const { editorState: { editorMoment, editorHasFocus } } = this.props;
    if ( editorMoment && editorHasFocus && ( ( editorMoment !== prevMoment ) || ( editorMoment === prevMoment && editorHasFocus !== prevHasFocus ) ) ) {
      this.refocus(editorMoment);
    }
  }

  /**
   * on touch start
   */
  handleTouchStart = e => {
    const { targetTouches: touches } = e;
    const { pageX, pageY, screenX, screenY, clientX, clientY, force, identifier, radiusX, radiusY, rotationAngle } = e.targetTouches[0];
    const c = { nativeEvent: e, pageX, pageY, screenX, screenY, clientX, clientY, force, identifier, radiusX, radiusY, rotationAngle };
    return this.handleMouseDown(c, 'touch');
  }

  /**
   * on touch move
   */
  handleTouchMove = e => {
    const { targetTouches: touches } = e;
    const { pageX, pageY, screenX, screenY, clientX, clientY, force, identifier, radiusX, radiusY, rotationAngle } = e.targetTouches[0];
    const c = { nativeEvent: e, touches, pageX, pageY, screenX, screenY, clientX, clientY, force, identifier, radiusX, radiusY, rotationAngle };
    return this.handleMouseMove(c, 'touch');
  }

  /**
   * on touch release
   */
  handleTouchEnd = e => {
    const { changedTouches: touches } = e;
    const { pageX, pageY, screenX, screenY, clientX, clientY, force, identifier, radiusX, radiusY, rotationAngle } = e.changedTouches[0];
    const c = { nativeEvent: e, touches, pageX, pageY, screenX, screenY, clientX, clientY, force, identifier, radiusX, radiusY, rotationAngle };
    return this.handleMouseUp(c, 'touch');
  }

  /**
   * on mouse down
   */
  handleMouseDown = (e, t = 'mouse') => {

    this.setState({
      dragging: true,
      sx      : e.pageX,
      sy      : e.pageY,
      cx      : e.pageX,
      cy      : e.pageY,
    });

    // retrieve native event
    const evt = e.nativeEvent || e;

    // override contextual and controls behavior
    if (
      (
       evt.target.hasAttribute('data-contextual-menu') ||
       evt.target.hasAttribute('data-controls')
      )
      && evt.preventDefault
    ) return evt.preventDefault();
  }

  /**
   * on mouse move
   */
  handleMouseMove = (e, t = 'mouse') => {

    const { dragging, sx, cx } = this.state;
    if ( !dragging ) return;

    this.setState(state => state.dragging && {
      cx: e.pageX,
      cy: e.pageY,
    });

    // retrieve native event
    const evt = e.nativeEvent || e;
    const { card: { width, padding, mode } } = this.size(0);

    switch ( mode ) {

      case 'mobile':
        const dx = Math.abs(sx - e.pageX) <= ( width + padding )
          ? cx - e.pageX
          : 0;
        if ( this.n ) this.n.scrollLeft += dx;
        break;
    }

  }

  /**
   * on mouse up
   */
  handleMouseUp = (e, t = 'mouse') => {

    const { dragging, sx, cx } = this.state;

    this.setState(state => state.dragging && { dragging: false });

    if ( !dragging ) return;

    // retrieve native event
    const evt = e.nativeEvent || e;

    const { ids } = this.doc();
    const { card: { width, padding, mode } } = this.size(0);

    switch ( mode ) {

      case 'mobile':

        const swipeMin = width / 5;
        const swipeLen = Math.round(Math.sqrt(Math.pow(e.pageX - sx, 2)));
        const swipeOffset = e.pageX > sx
          ? -1
          : 1;
        const swipeModified = Math.abs(sx - cx) < width / 2;

        if ( swipeLen > swipeMin ) {

          const nearest = this.nearest();
          const offsets = [ 0, ...ids.map(
            (n, i) => (i + 1) * (width + padding),
          ) ];
          const idx = offsets.indexOf(nearest);

          if ( idx > -1 ) {
            let next = swipeModified
              ? idx + swipeOffset
              : idx;
            if ( next < 0 ) next = 0;
            if ( next > ids.length ) next = ids.length;
            const offset = offsets[next];
            this.scroll(offset);
          }
        } else {
          this.scroll(this.nearest());
        }

        break;

    }

  }

  /**
   * on scroll event
   */
  handleScroll = e => {
    this.handlePositionCapture(e);
    this.handleAfterScroll(e);
  }

  /**
   * handle after scroll moment
   */
  handleAfterScroll = e => {
    if ( this.$$_cancel_scroll_$$ ) return;
    this.$$_after_scroll_$$ && window.clearTimeout(this.$$_after_scroll_$$);
    this.$$_after_scroll_$$ = window.setTimeout(this.recenter, 200);
  }

  /**
   * handle position capture
   */
  handlePositionCapture = e => {
    if ( this.n ) {
      const { scrollLeft } = this.n;
      this.setState({ scrollLeft });
    }
  }

  /**
   * on contextual toolbar press
   */
  handleContextualToolbarPress = action => {
    const { editorState: { editorMoment } } = this.props;
    this.cards && this.cards.emit(editorMoment, 'edit', 'style', action);
  }

  /**
   * animate scroll helper
   */
  scroll = offset => {
    if ( this.$$_cancel_scroll_$$ ) this.$$_cancel_scroll_$$();
    if ( this.n ) {
      const { card: { mode } } = this.size(0);
      const { scroll, cancel } = scrollToLeft(this.n, offset, {
        autoCancel: mode !== 'mobile',
        before    : _ => ( this.$$_cancel_scroll_$$ = cancel ),
        after     : _ => ( this.$$_cancel_scroll_$$ = null ),
      });
      scroll();
    }
  }

  /**
   * refocus on a moment card
   */
  refocus = id => {
    if ( !id ) return;
    const { ids } = this.doc();
    const { card: { width, padding } } = this.size(0);
    const idx = ids.indexOf(id);
    if ( idx > -1 ) {
      const offset = ids.map(
        (n, i) => (i + 1) * (width + padding),
      )[idx];
      this.scroll(offset);
    }
  }

  /**
   * re-center scroll location
   */
  recenter = offset => {
    if ( this.$$_cancel_scroll_$$ ) return;
    if ( typeof offset === 'number' ) {
      return this.scroll(offset);
    }
    const nearest = this.nearest();
    return this.scroll(nearest);
  }

  /**
   * return organized doc
   */
  doc() {
    const { doc } = this.props;
    const data = (doc.data || { });
    const moments = (data.slides || { });
    const ids = Object.keys(moments);
    const count = ids.length;
    return { ids, count, moments };
  }

  /**
   * calculate card, list and screen size
   */
  size(count) {

    const { windowSize: screen } = this.props;
    const { width, height } = screen;

    const defaults = {
      padding     : 40.0,
      maxWidth    : 1024,
      maxHeight   : 768,
      offsetWidth : 0,
      offsetHeight: 160.0,
    };

    const res = {
      card  : { width: ( width - defaults.padding ), height: ( height - defaults.offsetHeight ), padding: defaults.padding, ratio: ( width - defaults.padding ) / defaults.maxWidth, mode: 'desktop' },
      list  : { width: 0, height: 0, padding: 0 },
      screen,
    };

    if ( res.card.width >= defaults.maxHeight ) {
      res.card.width = Math.ceil(res.card.width * .5);
      res.card.ratio = res.card.width / defaults.maxWidth;
      let h = Math.ceil(defaults.maxHeight * res.card.ratio);
      res.card.height = res.card.height > h
        ? h
        : res.card.height;
      res.card.mode = 'desktop';
    } else {
      let r = res.card.height / defaults.maxHeight;
      res.card.ratio = res.card.ratio > r
        ? r
        : res.card.ratio;
      res.card.mode = 'mobile';
    }

    if ( res.card.width > defaults.maxWidth ) res.card.width = defaults.maxWidth;
    if ( res.card.height > defaults.maxHeight ) res.card.height = defaults.maxHeight;

    res.list.width = ( res.card.width + res.card.padding) * (count + 1) + ( width - res.card.width ) / 2;
    res.list.height = ( res.card.height );
    res.list.padding = ( width - res.card.width ) / 2;

    return res;
  }

  /**
   * return nearest moment offsets
   */
  nearest() {
    const { scrollLeft } = this.n;
    const { ids, count, moments } = this.doc();
    const { card: { width, padding } } = this.size(ids.length);
    return [ 0, ...ids.map((n, i) => (i + 1) * (width + padding)) ].reduce(
      (prev, curr) => Math.abs(curr - scrollLeft) < Math.abs(prev - scrollLeft)
        ? curr
        : prev
    );
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

    const size = this.size(ids.length);
    const { card: { mode } } = size;

    const className = mode === 'mobile'
      ? 'base base-mobile'
      : 'base';

    return <div ref={n => this.n = n} className={className} data-moments={true} onScroll={this.handleScroll}>
      <style jsx>{`
        .base {
          margin-top: 46px;
          flex: 1;
          display: flex;
          overflow-x: auto!important;
          overflow-y: hidden!important;
          align-items: center;
        }
        .base-mobile {
          overflow-x: hidden!important;
          overflow-y: hidden!important;
        }
      `}</style>
      <EditorContextualToolBar
        root={id}
        editorState={editorState}
        windowSize={windowSize}
        onPress={this.handleContextualToolbarPress}
      />
      <EditorMomentCards
        ref={n => this.cards = n}
        id={id}
        ids={ids}
        count={count}
        moments={moments}
        size={size}
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

