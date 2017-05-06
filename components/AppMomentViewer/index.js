
import React from 'react';
import PropTypes from 'prop-types';

import AppMomentPlayer from '../AppMomentPlayer';

export default class AppMomentViewer extends React.Component {

  static propTypes = {
    id            : PropTypes.string,
    doc           : PropTypes.object,

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

  cover() {
    const { doc } = this.props;
    return {
      id      : 'cover',
      hash    : `${Date.now()}`,
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

    return { moment, next, previous };
  }

  render() {
    const { id, sizes, live, pulse, hasNext, hasPrevious, onNext, onPrevious } = this.props;
    const { moment, next, previous } = this.doc();
    return <div className="base">
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
        .player-container {
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
      `}</style>
      <div className="player-container">
        <AppMomentPlayer
          id={id}
          live={live}
          pulse={pulse}
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
