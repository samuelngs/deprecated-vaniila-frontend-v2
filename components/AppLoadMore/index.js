
import React from 'react';
import PropTypes from 'prop-types';

export default class AppLoadMore extends React.PureComponent {

  static propTypes = {
    offset: PropTypes.number,
    run   : PropTypes.func,
  }

  static defaultProps = {
    offset: 200,
    run   : e => null,
  }

  componentDidMount() {
    if ( typeof window === 'undefined' ) return;
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    if ( typeof window === 'undefined' ) return;
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = e => {
    const { offset } = this.props;
    if ((window.innerHeight + window.pageYOffset) + offset >= document.body.offsetHeight) {
      this.handleLoadMore();
    }
  }

  handleLoadMore = e => {
    const { run } = this.props;
    this.$$_timeout_$$ && window.clearTimeout(this.$$_timeout_$$);
    this.$$_timeout_$$ = window.setTimeout(run, 300);
  }

  render() {
    return null;
  }

}

