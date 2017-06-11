
import React from 'react';
import PropTypes from 'prop-types';

import { TransitionMotion, Motion, spring } from 'react-motion';

import MomentCard from '../MomentCard';
import EditorCreateCard from '../EditorCreateCard';
import EditorInsertCard from '../EditorInsertCard';

import { api } from '../../reducers/editor';

export default class EditorMomentCards extends React.Component {

  static contextTypes = {
    store: PropTypes.object,
  }

  static propTypes = {
    // moments collection id
    id              : PropTypes.string,
    // moments' items id(s)
    ids             : PropTypes.arrayOf(PropTypes.string),
    // peers list
    peers           : PropTypes.array,
    // number of moment items
    count           : PropTypes.number,
    // moments datastore
    cover           : PropTypes.object,
    moments         : PropTypes.object,
    // sizing units
    size            : PropTypes.shape({
      list          : PropTypes.shape({
        width       : PropTypes.number,
        height      : PropTypes.number,
        padding     : PropTypes.number,
      }),
      card          : PropTypes.shape({
        width       : PropTypes.number,
        height      : PropTypes.number,
        padding     : PropTypes.number,
        ratio       : PropTypes.number,
      }),
      screen        : PropTypes.shape({
        width       : PropTypes.number,
        height      : PropTypes.number,
      }),
    }),
    gridview        : PropTypes.bool,
    livestream      : PropTypes.bool,
    // scroll state
    scrollLeft      : PropTypes.number,
    scrollTop       : PropTypes.number,
    // editor state
    state           : PropTypes.object,
    files           : PropTypes.object,
    // callbacks
    onCreate        : PropTypes.func,
    onChange        : PropTypes.func,
    onProgress      : PropTypes.func,
  }

  static defaultProps = {
    id              : '',
    ids             : [ ],
    peers           : [ ],
    count           : 0,
    cover           : { data: { } },
    moments         : { },
    size            : { },
    gridview        : false,
    livestream      : false,
    scrollLeft      : 0,
    scrollTop       : 0,
    state           : { },
    files           : { },
    onCreate        : _ => null,
    onChange        : _ => null,
    onProgress      : _ => null,
  }

  /**
   * default component state
   */
  state = {
    initialized: false,
  }

  /**
   * card references
   */
  cards = { }

  componentDidMount() {
    const { initialized } = this.state;
    if ( !initialized ) {
      this.setState({ initialized: true });
    }
  }

  emit(id, type, event, data) {
    return this.cards[id]
      && this.cards[id].contextReceiveEvent
      && this.cards[id].contextReceiveEvent(type, event, data);
  }

  handleOnCreate = e => {
    const { id: root, onCreate } = this.props;
    const { store: { dispatch } } = this.context;
    return onCreate().then(({ name, block }) => {
      return dispatch(api.setEditorState(root, { nextId: name }));
    });
  }

  willEnter = o => {
    const { gridview } = this.props;
    const { style: { x: ox, y: oy } } = o;
    const x = typeof ox === 'object'
      ? ox.val
      : ox;
    const y = typeof oy === 'object'
      ? oy.val
      : oy;
    return { x, y: gridview ? y : 10, opacity: 1 };
  }

  willLeave = o => {
    const { gridview } = this.props;
    const { style: { x: ox, y: oy } } = o;
    const x = typeof ox === 'object'
      ? ox.val
      : ox;
    const y = typeof oy === 'object'
      ? oy.val
      : oy;
    return { x: spring(x), y: spring(gridview ? y : -10), opacity: spring(0) };
  }

  getDefaultStyles() {
    const {
      id: root,
      ids,
      moments,
      gridview,
      peers,
      cover: { data: { blocks: [ { data: title }, ...etc ] } },
      livestream,
      scrollLeft,
      scrollTop,
      state,
      files,
      size: {
        card: { width, height, padding, space, ratio: scale },
        list: { columns }
      },
      onCreate,
      onChange,
      onProgress,
    } = this.props;
    return ids.map((id, i) => ({
      key       : id,
      data      : {
        root,
        id,
        peers,
        no          : i + 1,
        total       : ids.length,
        ref         : n => this.cards[id] = n,
        key         : id,
        moment      : moments[id],
        editmode    : !gridview && ( !livestream || livestream && title.trim().length > 0 ),
        editorState : state,
        gridview,
        scrollLeft,
        scrollTop,
        files,
        onCreate,
        onChange,
        onProgress,
      },
      style     : {
        x       : gridview
          ? ( ( i + 1 ) % columns ) * ( width + padding )
          : ( i + 1 ) * (width + padding),
        y       : gridview
          ? Math.abs( Math.floor( ( i + 1 ) / columns ) * ( height + padding + space ) ) + padding
          : 0,
        opacity : (
          livestream
          ? (
            title.trim().length === 0
            ? 0.3
            : 1
          )
          : 1
        ),
        scale,
        width,
        height,
      },
    }));
  }

  getStyles() {

    const {
      id: root,
      ids,
      moments,
      gridview,
      peers,
      cover: { data: { blocks: [ { data: title }, ...etc ] } },
      livestream,
      scrollLeft,
      scrollTop,
      state,
      files,
      size: {
        card: { width, height, padding, space, ratio: scale },
        list: { columns }
      },
      onCreate,
      onChange,
      onProgress,
    } = this.props;

    const {
      editorMoment,
    } = state;

    return ids.map((id, i) => ({
      key       : id,
      data      : {
        root,
        id,
        peers,
        no          : i + 1,
        total       : ids.length,
        ref         : n => this.cards[id] = n,
        key         : id,
        moment      : moments[id],
        editmode    : !gridview && ( !livestream || livestream && title.trim().length > 0 ),
        editorState : state,
        livestream,
        gridview,
        scrollLeft,
        scrollTop,
        files,
        onCreate,
        onChange,
        onProgress,
      },
      style     : {
        x       : gridview
          ? spring(( ( i + 1 ) % columns ) * ( width + padding ))
          : (
            editorMoment === id
            ? ( i + 1 ) * (width + padding)
            : spring(( i + 1 ) * (width + padding))
          ),
        y       : gridview
          ? spring( Math.abs( Math.floor( ( i + 1 ) / columns ) * ( height + padding + space ) ) + padding )
          : spring( 0 ),
        opacity : spring(
          livestream
          ? (
            title.trim().length === 0
            ? 0.3
            : 1
          )
          : 1
        ),
        scale,
        width,
        height,
      },
    }));
  }

  getListStyle({ opacity }) {
    const { size: { list: { width, height, padding, offset } } } = this.props;
    return {
      opacity,
      width       : width + offset,
      height,
      minWidth    : width + offset,
      minHeight   : height,
      maxWidth    : width + offset,
      maxHeight   : height,
      paddingLeft : padding,
    };
  }

  renderCard = ({ key, data: props, style }) => {
    const { scrollLeft, scrollTop, gridview, size: { screen: { width, height }, card: { padding: cardPadding }, list: { padding: listPadding } } } = this.props;
    if (
      (
        !gridview &&
        style.x >= ( scrollLeft - style.width - listPadding - cardPadding * 2 ) &&
        style.x <= scrollLeft + width + style.width + listPadding + cardPadding * 2
      ) || (
        gridview &&
        style.y >= scrollTop - style.height - cardPadding * 2 &&
        style.y <= scrollTop + height
      )
    ) {
      return [
        <MomentCard
          { ...props }
          x={style.x}
          y={style.y}
          opacity={style.opacity}
          scale={style.scale}
          width={style.width}
          height={style.height}
        />,
        !gridview && <EditorInsertCard
          key={style.x}
          x={style.x - cardPadding + cardPadding / 4}
          y={style.y}
          width={cardPadding / 2}
          height={style.height}
          onInsert={_ => this.emit(key, 'edit', 'insert-moment', props.moment.order)}
        />,
      ]
    }
    return null;
  }

  render() {

    const {
      id: root,
      ids,
      cover,
      cover: { data: { blocks: [ { data: title }, ...etc ] } },
      livestream,
      gridview,
      moments,
      state,
      size: { card: { width, height, padding, ratio, space }, list: { columns, rows } },
      onChange,
    } = this.props;

    const {
      initialized,
    } = this.state;

    return <TransitionMotion
      defaultStyles={this.getDefaultStyles()}
      styles={this.getStyles()}
      willLeave={this.willLeave}
      willEnter={this.willEnter}>
      { styles => <Motion defaultStyle={{ opacity: 0 }} style={{ opacity: spring(initialized ? 1 : 0) }}>
        { style => <div className="base" style={this.getListStyle(style)}>
          <style jsx>{`
            .base { position: relative; }
          `}</style>
          <MomentCard
            id="cover"
            key="cover"
            root={root}
            no={-1}
            total={ids.length}
            cover={true}
            moment={cover}
            y={ gridview ? padding : 0 }
            scale={ratio}
            width={width}
            height={height}
            gridview={gridview}
            editmode={!gridview}
            editorState={state}
            placeholder="What's this all about? (~ﾟ∀ﾟ)~"
            onChange={onChange}
          />
          { styles.map(this.renderCard) }
          <EditorCreateCard
            x={ gridview ? ( ( ids.length + 1 ) % columns) * ( width + padding ) : ((ids.length + 1) * width + (ids.length + 1) * padding) }
            y={ gridview ? ( rows - 1 ) * ( height + padding + space ) + padding : 0 }
            width={ gridview ? width : 250 }
            height={height}
            active={( !livestream || livestream && title.trim().length > 0 )}
            onClick={this.handleOnCreate}
          />
        </div> }
      </Motion> }
    </TransitionMotion>
  }

}
