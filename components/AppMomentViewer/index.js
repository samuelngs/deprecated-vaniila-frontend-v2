
import React from 'react';
import PropTypes from 'prop-types';

import If from '../If';
import AppMomentTimer from '../AppMomentTimer';
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
    currentIndex  : PropTypes.number,
    previous      : PropTypes.string,
    previousIndex : PropTypes.number,
    next          : PropTypes.string,
    nextIndex     : PropTypes.number,

    sizes         : PropTypes.object,

    hasInterrupted: PropTypes.bool,
    hasPrevious   : PropTypes.bool,
    hasNext       : PropTypes.bool,
    onPrevious    : PropTypes.func,
    onNext        : PropTypes.func,
    onTo          : PropTypes.func,

    children      : PropTypes.node,
  }

  static defaultProps = {
    id            : '',
    doc           : { },

    modal         : false,
    live          : false,
    pulse         : false,
    moments       : [ ],
    current       : null,
    currentIndex  : -2,
    previous      : '',
    previousIndex : -2,
    next          : '',
    nextIndex     : -2,

    sizes         : { },

    hasInterrupted: false,
    hasPrevious   : false,
    hasNext       : false,
    onPrevious    : e => null,
    onNext        : e => null,
    onTo          : e => null,

    children      : null,
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
    if ( el && ( el.getAttribute('contenteditable') === 'true' || el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' ) ) {
      // ignore action if any input element is active
      return;
    };
    switch ( code ) {
      case 'ArrowRight':
      case 'ArrowDown':
      case 'Space':
        typeof e.preventDefault === 'function' && e.preventDefault();
        if ( hasNext ) onNext(e);
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        typeof e.preventDefault === 'function' && e.preventDefault();
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
    const { name, background, livestream, created_at, started_at } = doc;
    return {
      id      : 'cover',
      index   : -1,
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
            type  : modal && !name
              ? 'header-two'
              : 'header-one',
            data  : name || '',
            styles: background ? [{ offset: 0, length: (name || '').length, style: 'COLOR:#fff' }] : [ ],
          },
          background && {
            key   : 'cover-image',
            type  : 'image',
            data  : background,
            styles: [ ],
          },
        ].filter(n => n),
      },
      style   : { },
      align   : 1,
      order   : -1,
      bg      : background,
    };
  }

  /**
   * return organized doc
   */
  doc() {

    const { doc, moments: ids, current, currentIndex, next: nid, nextIndex, previous: pid, previousIndex, hasNext, hasPrevious } = this.props;
    const moments = ((((doc || { }).document || { }).data || { }).slides || { });
    const { permissions, livestream, created_at, started_at, ended_at } = (doc || { });
    const { admin = false, write = false, read = true } = (permissions || { });

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
      : { ...moments[current], id: current, index: currentIndex }

    /**
     * retrieve next moment
     */
    const next = hasNext
      ? (
        nid === 'cover'
        ? this.cover()
        : { ...moments[nid], id: nid, index: nextIndex }
      )
      : null;

    /**
     * retrieve previous moment
     */
    const previous = hasPrevious
      ? (
        pid === 'cover'
        ? this.cover()
        : { ...moments[pid], id: pid, index: previousIndex }
      )
      : null;

    return { moment, next, previous, begins, ends, permissions: { admin, write, read } };
  }

  render() {
    const { id, doc, sizes, modal, live, pulse, moments, hasInterrupted, hasNext, hasPrevious, onNext, onPrevious, onTo, currentIndex, nextIndex, previousIndex, children } = this.props;
    const { hover } = this.state;
    const { moment, next, previous, begins, ends, permissions } = this.doc();
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
          display: flex;
          flex-direction: row;
          margin-top: 0;
          margin-bottom: 0;
          margin-left: 0;
          margin-right: 0;
          padding-top: 0;
          padding-left: 0;
          padding-bottom: 0;
          padding-right: 0;
          background-color: #f8f8f8;
        }
        .player-modal-container {
          background-color: #fff;
        }
      `}</style>
      <div
        className={ modal ? "player-container player-modal-container" : "player-container" }
        onMouseEnter={this.onPlayerEnter}
        onMouseLeave={this.onPlayerLeave}
        onMouseMove={this.onPlayerEnter}
      >
        <If condition={live}>
          <AppMomentTimer
            id={id}
            live={live}
            current={moment}
            hasInterrupted={hasInterrupted}
            hasNext={hasNext}
            onNext={onNext}
          />
        </If>
        <AppMomentPlayer
          id={id}
          modal={modal}
          live={live}
          pulse={pulse}
          permissions={permissions}
          hover={hover}
          begins={begins}
          ends={ends}
          doc={doc}
          moments={moments}
          moment={moment}
          momentIndex={currentIndex}
          nextMoment={next}
          nextMomentIndex={nextIndex}
          prevMoment={previous}
          prevMomentIndex={previousIndex}
          sizes={sizes}
          hasPrevious={hasPrevious}
          hasNext={hasNext}
          onPrevious={onPrevious}
          onNext={onNext}
          onTo={onTo}
        />
        { children }
      </div>
    </div>;
  }

}
