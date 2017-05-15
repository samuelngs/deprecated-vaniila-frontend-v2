
import React from 'react';
import PropTypes from 'prop-types';

export default class BackToTop extends React.PureComponent {

  static propTypes = {
    id: PropTypes.string,
  }

  static defaultProps = {
    id: '',
  }

  componentDidMount() {
    if ( typeof window !== 'undefined' ) {
      window.scrollTo(0, 0);
    }
  }

  componentWillUpdate({ id: next }) {
    const { id: prev } = this.props;
    if ( typeof window !== 'undefined' && next !== prev ) {
      window.scrollTo(0, 0);
    }
  }

  render() {
    return null;
  }

}

