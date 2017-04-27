
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
    // scroll state
    scrollLeft      : PropTypes.number,
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
    count           : 0,
    cover           : { data: { } },
    moments         : { },
    size            : { },
    scrollLeft      : 0,
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

  handleOnCreate(e) {
    const { id: root, onCreate } = this.props;
    const { store: { dispatch } } = this.context;
    return onCreate().then(({ name, block }) => {
      return dispatch(api.setEditorState(root, { nextId: name }));
    });
  }

  willEnter(o) {
    const { style: { x: ox } } = o;
    const x = typeof ox === 'object'
      ? ox.val
      : ox;
    return { x, y: 10, opacity: 1 };
  }

  willLeave(o) {
    const { style: { x: ox } } = o;
    const x = typeof ox === 'object'
      ? ox.val
      : ox;
    return { x: spring(x), y: spring(-10), opacity: spring(0) };
  }

  getDefaultStyles() {
    const {
      id: root,
      ids,
      moments,
      scrollLeft,
      state,
      files,
      size: { card: { width, height, padding, ratio: scale } },
      onCreate,
      onChange,
      onProgress,
    } = this.props;
    return ids.map((id, i) => ({
      key       : id,
      data      : {
        root,
        id,
        no          : i + 1,
        total       : ids.length,
        ref         : n => this.cards[id] = n,
        key         : id,
        moment      : moments[id],
        editmode    : true,
        editorState : state,
        scrollLeft,
        files,
        onCreate,
        onChange,
        onProgress,
      },
      style     : {
        x       : ( i + 1 ) * (width + padding),
        y       : 0,
        opacity : 1,
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
      scrollLeft,
      state,
      files,
      size: { card: { width, height, padding, ratio: scale } },
      onCreate,
      onChange,
      onProgress,
    } = this.props;
    return ids.map((id, i) => ({
      key       : id,
      data      : {
        root,
        id,
        no          : i + 1,
        total       : ids.length,
        ref         : n => this.cards[id] = n,
        key         : id,
        moment      : moments[id],
        editmode    : true,
        editorState : state,
        scrollLeft,
        files,
        onCreate,
        onChange,
        onProgress,
      },
      style     : {
        x       : spring(( i + 1 ) * (width + padding)),
        y       : spring(0),
        opacity : spring(1),
        scale,
        width,
        height,
      },
    }));
  }

  getListStyle({ opacity }) {
    const { size: { list: { width, height, padding } } } = this.props;
    return {
      opacity,
      width,
      height,
      minWidth    : width,
      minHeight   : height,
      paddingLeft : padding,
    };
  }

  renderCard = ({ key, data: props, style }) => {
    const { scrollLeft, size: { screen: { width }, card: { padding: cardPadding }, list: { padding: listPadding } } } = this.props;
    if (
      style.x >= ( scrollLeft - style.width - listPadding - cardPadding * 2 ) &&
      style.x <= scrollLeft + width + style.width + listPadding + cardPadding * 2
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
        <EditorInsertCard
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
      moments,
      state,
      size: { card: { width, height, padding, ratio } },
      onChange,
    } = this.props;

    const {
      initialized,
    } = this.state;

    return <TransitionMotion
      defaultStyles={this.getDefaultStyles()}
      styles={this.getStyles()}
      willLeave={::this.willLeave}
      willEnter={::this.willEnter}>
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
            scale={ratio}
            width={width}
            height={height}
            editmode={true}
            editorState={state}
            placeholder="What's this all about? (~ﾟ∀ﾟ)~"
            onChange={onChange}
          />
          { styles.map(this.renderCard) }
          <EditorCreateCard
            x={((ids.length + 1) * width + (ids.length + 1) * padding)}
            y={0}
            height={height}
            onClick={::this.handleOnCreate}
          />
        </div> }
      </Motion> }
    </TransitionMotion>
  }

}
