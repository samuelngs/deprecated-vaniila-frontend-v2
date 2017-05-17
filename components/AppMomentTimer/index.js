
import React from 'react';
import PropTypes from 'prop-types';

const wpm = 213;

function getMillisecondsFromText (text) {
  const min = getMinutesFromText (text);
  return min * 60000;
}

function getMinutesFromText (text) {
  return getMinutesPerWords(wpm, text)
}

function getMinutesPerWords (wpm, text) {
  return getWords(text) / wpm
}

function getWords (text) {
  const noWordChars = /[^aábcdeéfghijklmnñoópqrstuúüvwxyzAÁBCDEÉFGHIJKLMNÑOÓPQRSTUÚÜ‌​VWXYZ0-9]/g
  return text.split(noWordChars).length
}

export default class AppMomentTimer extends React.PureComponent {

  static propTypes = {
    id            : PropTypes.string,
    live          : PropTypes.bool,
    current       : PropTypes.object,
    hasInterrupted: PropTypes.bool,
    hasNext       : PropTypes.bool,
    onNext        : PropTypes.func,
  }

  static defaultProps = {
    id            : '',
    live          : false,
    current       : { },
    hasInterrupted: false,
    hasNext       : false,
    onNext        : e => null,
  }

  lastUpdate = Date.now()

  componentScheduleTask = o => {
    if ( this.$$_SCHEDULE_$$ ) this.$$_SCHEDULE_$$ = null;
    const { onNext } = this.props;
    onNext(o, true);
    this.lastUpdate = Date.now();
  }

  componentWillUpdate({ id, live, hasInterrupted }) {
    if ( this.$$_SCHEDULE_$$ && ( this.props.id !== id || ( this.props.live !== live && !live ) || ( this.props.hasInterrupted !== hasInterrupted && hasInterrupted ) ) ) {
      window.clearTimeout(this.$$_SCHEDULE_$$);
    }
  }

  componentDidUpdate({ id, hasInterrupted, hasNext }) {

    if ( typeof window === 'undefined' || !id || !hasNext ) return;

    const wpms = this.getMilliseconds();

    if ( ( Date.now() - this.lastUpdate ) > wpms ) {
      this.$$_SCHEDULE_$$ = window.setTimeout(this.componentScheduleTask, 0);
    } else {
      this.$$_SCHEDULE_$$ = window.setTimeout(this.componentScheduleTask, wpms);
    }
  }

  componentDidMount() {

    const { id, hasNext } = this.props;

    if ( typeof window === 'undefined' || !id || !hasNext ) return;

    const wpms = this.getMilliseconds();

    if ( ( Date.now() - this.lastUpdate ) > wpms ) {
      this.$$_SCHEDULE_$$ = window.setTimeout(this.componentScheduleTask, 0);
    } else {
      this.$$_SCHEDULE_$$ = window.setTimeout(this.componentScheduleTask, wpms);
    }

  }

  getMilliseconds() {
    const { current } = this.props;
    if ( current.data && Array.isArray(current.data.blocks) ) {
      let v = '';
      for ( const block of current.data.blocks ) {
        v += ` ${block.data}`;
      }
      const ms = getMillisecondsFromText(v);
      if ( ms > 5000 ) return ms;
    }
    return 5000;
  }

  render() {
    return null;
  }

}


