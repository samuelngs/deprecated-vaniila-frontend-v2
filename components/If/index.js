
import React from 'react';
import PropTypes from 'prop-types';

export default class If extends React.PureComponent {

  static propTypes = {
    condition : PropTypes.bool,
    children  : PropTypes.node,
  };

  static defaultProps = {
    condition : false,
    children  : null,
  };

  render() {
    const { condition, children } = this.props;
    return condition
      ? React.Children.only(children)
      : null;
  }

}


