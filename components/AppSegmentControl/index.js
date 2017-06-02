
import React from 'react';
import PropTypes from 'prop-types';

export default class AppSegmentControl extends React.PureComponent {

  static propTypes = {
    selected: PropTypes.string,
    children: PropTypes.node,
    onChange: PropTypes.func,
  }

  static defaultProps = {
    selected: '',
    children: null,
    onChange: e => null,
  }

  render() {
    const { children, selected, onChange: onPress } = this.props;
    const render = React.Children.map(children, child => React.cloneElement(child, { selected, onPress }));
    return <ul>
      <style jsx>{`
        ul {
          display: flex;
          margin-top: 0;
          margin-bottom: 0;
          margin-left: 0;
          margin-right: 0;
          padding-top: 0;
          padding-bottom: 0;
          padding-left: 0;
          padding-right: 0;
          border: 1px solid #82a3b7;
          border-radius: 3px;
        }
      `}</style>
      { render }
    </ul>
  }

}
