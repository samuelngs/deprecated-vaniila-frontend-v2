
import React from 'react';
import MomentCard from '../MomentCard';

export default class EditorStoryboard extends React.Component {

  static propTypes = {
    doc       : React.PropTypes.object,
    windowSize: React.PropTypes.shape({
      width : React.PropTypes.number,
      height: React.PropTypes.number,
    }),
  }

  static defaultProps = {
    doc       : { data: { slides: { } } },
    windowSize: {
      width : typeof window !== 'undefined' ? window.innerWidth : 0,
      height: typeof window !== 'undefined' ? window.innerHeight : 0,
    },
  }

  doc() {
    const { doc } = this.props;
    const data = (doc.data || { });
    const moments = (data.slides || { });
    // const ids = Object.keys(moments);
    const ids = [ 1, 2, 3, 4, 5, 6, 7, 8 ];
    const count = ids.length;
    return { ids, count, moments };
  }

  state = {
    isPressed: false,
    topDeltaX: 0,
    mouseX: 0,
    originalPosOfLastPressed: 0,
  }

  componentDidMount() {
    this.bind();
    this.addEventListener();
  }

  componentWillUnmount() {
    this.removeEventListener();
  }

  bind() {
    this.handleTouchUp = this.handleTouchUp.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
  }

  addEventListener() {
    window.addEventListener('touchmove', this.handleTouchMove);
    window.addEventListener('touchend', this.handleTouchUp);
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('mouseup', this.handleMouseUp);
  }

  removeEventListener() {
    window.removeEventListener('touchmove', this.handleTouchMove);
    window.removeEventListener('touchend', this.handleTouchUp);
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('mouseup', this.handleMouseUp);
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

  handleMouseDown() {
  }

  handleMouseMove({ pageX }) {

    const { isPressed, topDeltaX, originalPosOfLastPressed } = this.state;

    // if it's not pressed, ignored action
    if ( !isPressed ) return;

    const mouseX = pageX - topDeltaX;

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
      itemWidth = Math.ceil(itemWidth * 0.7);
      itemRatio = itemWidth / 1024.0;
      let itemRatioHeight = Math.ceil(768 * itemRatio);
      itemHeight = itemHeight > itemRatioHeight ? itemRatioHeight : itemHeight;
    } else {
      let itemHeightRatio = itemHeight / 768.0;
      itemRatio = itemRatio > itemHeightRatio ? itemHeightRatio : itemRatio;
    }
    if ( itemWidth > 1024 ) itemWidth = 1024;
    if ( itemHeight > 768 ) itemHeight = 768;
    const itemPadding = 20.0;
    const listWidth = itemWidth * count + itemPadding * (count - 1) + (windowSize.width - itemWidth) / 2;
    const listPadding = (windowSize.width - itemWidth) / 2;
    const listHeight = itemHeight;
    return { itemWidth, itemHeight, itemPadding, itemRatio, listWidth, listHeight, listPadding };
  }

  render() {
    const { ids, count, moments } = this.doc();
    const { itemWidth, itemHeight, itemPadding, itemRatio, listWidth, listHeight, listPadding } = this.getMomentStyle(ids.length);
    return <div className="base">
      <style jsx>{`
        .base {
          margin-top: 60px;
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
      <div className="list" style={{ width: listWidth, minWidth: listWidth, height: listHeight, minHeight: listHeight, paddingLeft: listPadding }}>
        { ids.map((id, i) => <MomentCard key={id} x={i * itemWidth + i * itemPadding} scale={itemRatio} width={itemWidth} height={itemHeight} editmode={true} />) }
      </div>
    </div>;
  }

}

