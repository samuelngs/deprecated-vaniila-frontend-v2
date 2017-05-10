
import React from 'react';
import PropTypes from 'prop-types';

export default class AfterEvent extends React.PureComponent {

  static propTypes = {
    id      : PropTypes.string,
    run     : PropTypes.func,
    then    : PropTypes.func,
    timeout : PropTypes.number,
  };

  static defaultProps = {
    id      : '',
    run     : e => null,
    then    : e => null,
    timeout : 0,
  };

  componentDidMount() {
    this.$$_mounted_$$ = true;
    this.run();
  }

  componentWillUnmount() {
    this.$$_mounted_$$ = false;
  }

  componentDidUpdate({ id: prev }) {
    const { id: next } = this.props;
    if ( next !== prev ) {
      this.run();
    }
  }

  run() {
    const { run, then, timeout } = this.props;
    const start = Date.now();
    Promise.resolve(run()).then(o => {
      const end = Date.now();
      const diff = end - start;
      if ( typeof then !== 'function' ) return o;
      if ( diff >= timeout ) {
        return this.$$_mounted_$$ && then(o);
      }
      return window.setTimeout(_ => this.$$_mounted_$$ && then(o), (timeout - diff));
    })
  }

  render() {
    return null;
  }

}

