
import React from 'react';
import PropTypes from 'prop-types';

import { Motion, spring } from 'react-motion';
import MomentCardMediaControls from '../MomentCardMediaControls';

const callbacks = [ ];

function addScript (src, cb) {
  if (callbacks.length === 0) {
    callbacks.push(cb)
    var s = document.createElement('script')
    s.setAttribute('src', src)
    s.onload = () => callbacks.forEach((cb) => cb())
    document.body.appendChild(s)
  } else {
    callbacks.push(cb)
  }
}

export default class MomentCardTwitter extends React.PureComponent {

  static propTypes = {
    position    : PropTypes.number,
    block       : PropTypes.shape({
      type      : PropTypes.string,
      key       : PropTypes.string,
      data      : PropTypes.string,
      styles    : PropTypes.array,
    }),
    total       : PropTypes.number,
    scale       : PropTypes.number,
    editmode    : PropTypes.bool,
    width       : PropTypes.number,
    height      : PropTypes.number,
    fullscreen  : PropTypes.bool,
    files       : PropTypes.object,
    editorState : PropTypes.object,
    onSelect    : PropTypes.func,
    onChange    : PropTypes.func,
  }

  static defaultProps = {
    position    : 0,
    block       : {
      type      : '',
      key       : '',
      data      : '',
      styles    : [ ],
    },
    total       : 0,
    scale       : 1,
    editmode    : false,
    width       : 0,
    height      : 0,
    fullscreen  : false,
    files       : { },
    editorState : { },
    onSelect    : _ => null,
    onChange    : _ => null,
  }

  _forceFlag = false;

  state = {
    rendered: false,
  }

  componentDidMount() {
    if ( !window.twttr ) {
      const isLocal = window.location.protocol.indexOf('file') >= 0
      const protocol = isLocal ? this.props.protocol : ''
      addScript(`${protocol}//platform.twitter.com/widgets.js`, this.renderTweet);
    } else {
      this.renderTweet();
    }
  }

  componentWillUpdate({ width, height }) {
    if ( this.props.width !== width || this.props.height !== height ) {
      // By flipping this flag, we also keep flipping keys which forces
      // React to remount this node every time it rerenders.
      this._forceFlag = !this._forceFlag;
    }
  }

  componentDidUpdate({ width, height }) {
    if ( this.props.width !== width || this.props.height !== height ) {
      this.renderTweet();
    }
  }

  renderTweet = e => {
    this.setState(state => state.rendered && { rendered: false }, () => {
      const { width, height, fullscreen, block: { data } } = this.props;
      const opts = {
        conversation: 'none',
        width: width < 250
          ? 250
          : (
            width > 500
            ? 500
            : width - 40
          ),
        align: 'center',
        dnt: true,
      };
      if ( fullscreen && height < 500.0 ) {
        opts.cards = 'hidden';
      }
      window.twttr.ready().then(({ widgets }) => {
        widgets
          .createTweetEmbed(data, this.n, opts)
          .then(_ => {
            this.setState(state => !state.rendered && { rendered: true });
          });
      });
    });
  }

  handleClick = e => {
    const { block, onSelect } = this.props;
    const { key, type } = block;
    return onSelect(key, type);
  }

  getStyle(type) {
    const { editmode, fullscreen, height, width } = this.props;
    return {
      position: 'relative',
      marginTop: fullscreen ? 0 : 10,
      marginBottom: fullscreen ? 0 : 10,
      marginLeft: 0,
      marginRight: 0,
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      paddingRight: 0,
      width: fullscreen ? width : '100%',
      height: fullscreen && height,
      borderRadius: fullscreen && 4,
      overflow: fullscreen && 'hidden',
      display: fullscreen && 'flex',
      alignItems: fullscreen && 'center',
      justifyContent: fullscreen && 'center',
    };
  }

  onChange = type => {
    const { block: { key }, onChange } = this.props;
    return onChange(type, key);
  }

  render() {

    const { rendered } = this.state;
    const { position, block, files, editmode, fullscreen, editorState: { editorStartKey, editorEndKey } } = this.props;
    const { key, type, data, styles } = block;

    const isSelected = (
      key === editorStartKey &&
      key === editorEndKey
    );

    const style = this.getStyle(type);
    const className = editmode
      ? (
        isSelected
        ? 'tweet no-select'
        : 'tweet tweet-editable no-select'
      )
      : 'tweet';

    const props = {
      key: this._forceFlag
        ? 'A'
        : 'B',
      style,
      'aria-label': 'moment-card-block',
      'data-offset-key': key,
      'data-offset-position': position,
    };

    return <div { ...props } onClick={this.handleClick} draggable={false} contentEditable={false}>
      <style jsx>{`
        .tweet {
          margin-top: 0;
          margin-bottom: 0;
          padding-top: 5px;
          padding-bottom: 5px;
          padding-left: 0;
          padding-right: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .tweet-editable {
          pointer-events: none;
          cursor: default;
        }
      `}</style>
      <MomentCardMediaControls active={isSelected} fullscreen={fullscreen} onChange={this.onChange} />
      <Motion defaultStyle={{ opacity: 0 }} style={{ opacity: spring(rendered ? 1 : 0) }}>
        { ({ opacity }) => <blockquote className={className} style={{ opacity }} ref={n => this.n = n} /> }
      </Motion>
    </div>
  }

}

