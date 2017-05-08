
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

  onPlayerEnter = e => {
    this.setState(state => !state.hover && { hover: true });
  }

  onPlayerLeave = e => {
    this.setState(state => state.hover && { hover: false });
  }

  cover() {
    const { doc } = this.props;
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
            type  : 'header-one',
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

    const { doc, current, next: nid, previous: pid, hasNext, hasPrevious } = this.props;
    const moments = ((((doc || { }).document || { }).data || { }).slides || { });
    const { livestream, created_at, started_at, ended_at } = doc;

    const begins = livestream
      ? new Date(started_at || created_at).getTime()
      : -1;

    const ends = livestream
      ? (
        ended_at
        ? new Date(ended_at).getTime()
        : new Date().getTime()
      )
      : -1;

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
