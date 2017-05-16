
import React from 'react';
import PropTypes from 'prop-types';

export default class AfterEvent extends React.PureComponent {

  static propTypes = {
    id        : PropTypes.string,
    autostart : PropTypes.bool,
    run       : PropTypes.func,
    then      : PropTypes.func,
    timeout   : PropTypes.number,
  };

  static defaultProps = {
    id        : '',
    autostart : true,
    run       : e => null,
    then      : e => null,
    timeout   : 0,
  };

  componentDidMount() {
    const { autostart } = this.props;
    this.$$_mounted_$$ = true;
    autostart && this.run();
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

