
import React from 'react';
import PropTypes from 'prop-types';

import AppMomentPlayer from '../AppMomentPlayer';

export default class AppMomentViewer extends React.PureComponent {

  static propTypes = {
    id            : PropTypes.string,
    doc           : PropTypes.object,

    modal         : PropTypes.bool,
    live          : PropTypes.bool,
    pulse         : PropTypes.bool,
    moments       : PropTypes.arrayOf(PropTypes.string),
    current       : PropTypes.string,
    previous      : PropTypes.string,
    next          : PropTypes.string,

    sizes         : PropTypes.object,

    hasPrevious   : PropTypes.bool,
    hasNext       : PropTypes.bool,
    onPrevious    : PropTypes.func,
    onNext        : PropTypes.func,
  }

  static defaultProps = {
    id            : '',
    doc           : { },

    modal         : false,
    live          : false,
    pulse         : false,
    moments       : [ ],
    current       : null,
    previous      : '',
    next          : '',

    sizes         : { },

    hasPrevious   : false,
    hasNext       : false,
    onPrevious    : e => null,
    onNext        : e => null,
  }

  state = {
    hover: false,
  }

  componentDidMount() {
    this.$$_mounted_$$ = true;
    window.addEventListener('keydown', this.handleKeydown);
  }

  componentWillUnmount() {
    this.$$_mounted_$$ = false;
    window.removeEventListener('keydown', this.handleKeydown);
  }

  handleKeydown = e => {
    const { code } = e;
    const { hasPrevious, hasNext, onPrevious, onNext } = this.props;
    const el = document.activeElement;
    switch ( code ) {
      case 'ArrowRight':
      case 'ArrowDown':
      case 'Space':
        if ( el && ( el.getAttribute('contenteditable') === 'true' || el.tagName === 'INPUT' ) ) el.preventDefault();
        if ( hasNext ) onNext(e);
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        if ( el && ( el.getAttribute('contenteditable') === 'true' || el.tagName === 'INPUT' ) ) el.preventDefault();
        if ( hasPrevious ) onPrevious(e);
        break;
    }
  }

  onPlayerEnter = e => {
    this.$$_mounted_$$ && this.setState(state => !state.hover && { hover: true });
  }

  onPlayerLeave = e => {
    this.$$_mounted_$$ && this.setState(state => state.hover && { hover: false });
  }

  cover() {
    const { doc, modal } = this.props;
    const { livestream, created_at, started_at } = doc;
    return {
      id      : 'cover',
      hash    : `${Date.now()}`,
      when    : new Date(
        livestream && started_at.indexOf('000') !== 0
        ? started_at
        : created_at
      ).getTime(),
      data    : {
        blocks: [
          {
            key   : 'cover',
            type  : modal && !doc.name
              ? 'header-two'
              : 'header-one',
            data  : doc.name || '',
            styles: [ ],
          }
        ]
      },
      style   : { },
      align   : 1,
      order   : -1,
    };
  }

  /**
   * return organized doc
   */
  doc() {

    const { doc, moments: ids, current, next: nid, previous: pid, hasNext, hasPrevious } = this.props;
    const moments = ((((doc || { }).document || { }).data || { }).slides || { });
    const { livestream, created_at, started_at, ended_at } = (doc || { });

    const livestreamStartedAt = new Date(started_at || created_at).getTime();
    const livestreamEndedAt = new Date(ended_at).getTime();
    const { when: firstMomentWhen } = moments[ids[0]] || { };
    const { when: latestMomentWhen } = moments[ids[ids.length - 1]] || { };

    const begins = livestream
      ? livestreamStartedAt
      : firstMomentWhen;

    const ends = livestream
      ? (
        ended_at
        ? latestMomentWhen < livestreamEndedAt ? latestMomentWhen : livestreamEndedAt
        : new Date().getTime()
      )
      : latestMomentWhen;

    /**
     * retrieve current moment
     */
    const moment = current === 'cover'
      ? this.cover()
      : { ...moments[current], id: current }

    /**
     * retrieve next moment
     */
    const next = hasNext
      ? (
        nid === 'cover'
        ? this.cover()
        : { ...moments[nid], id: nid }
      )
      : null;

    /**
     * retrieve previous moment
     */
    const previous = hasPrevious
      ? (
        pid === 'cover'
        ? this.cover()
        : { ...moments[pid], id: pid }
      )
      : null;

    return { moment, next, previous, begins, ends };
  }

  render() {
    const { id, sizes, modal, live, pulse, hasNext, hasPrevious, onNext, onPrevious } = this.props;
    const { hover } = this.state;
    const { moment, next, previous, begins, ends } = this.doc();
    return <div className={ modal ? "base base-modal" : "base" }>
      <style jsx>{`
        .base {
          margin-top: 0;
          margin-bottom: 0;
          margin-left: 0;
          margin-right: 0;
          padding-top: 47px;
          padding-bottom: 0;
          padding-left: 0;
          padding-right: 0;
        }
        .base-modal {
          padding-top: 0;
        }
        .player-container {
          margin-top: 0;
          margin-bottom: 0;
          margin-left: 0;
          margin-right: 0;
          padding-top: 0;
          padding-left: 0;
          padding-bottom: 0;
          padding-right: 0;
          background-color: #fff;
        }
      `}</style>
      <div
        className="player-container"
        onMouseEnter={this.onPlayerEnter}
        onMouseLeave={this.onPlayerLeave}
        onMouseMove={this.onPlayerEnter}
      >
        <AppMomentPlayer
          id={id}
          modal={modal}
          live={live}
          pulse={pulse}
          hover={hover}
          begins={begins}
          ends={ends}
          moment={moment}
          nextMoment={next}
          previousMoment={previous}
          sizes={sizes}
          hasPrevious={hasPrevious}
          hasNext={hasNext}
          onPrevious={onPrevious}
          onNext={onNext}
        />
      </div>
    </div>;
  }

}
