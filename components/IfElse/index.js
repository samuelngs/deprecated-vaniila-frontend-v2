
import React from 'react';
import PropTypes from 'prop-types';

export default class IfElse extends React.PureComponent {

  static propTypes = {
    condition : PropTypes.bool,
    yes       : PropTypes.node,
    no        : PropTypes.node,
  };

  static defaultProps = {
    condition : false,
    yes       : null,
    no        : null,
  };

  render() {
    const { condition, yes, no } = this.props;
    return condition
      ? React.Children.only(yes)
      : React.Children.only(no);
  }

}



