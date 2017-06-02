
import React from 'react';
import PropTypes from 'prop-types';

import AppPermissionsItem from '../AppPermissionsItem';

export default class AppPermissionsList extends React.PureComponent {

  static propTypes = {
    permissions: PropTypes.array,
    onRemove: PropTypes.func,
  }

  static defaultProps = {
    permissions: [ ],
    onRemove: e => null,
  }

  renderItem = (props, i) => {
    const { onRemove } = this.props;
    return <AppPermissionsItem
      key={i}
      onRemove={onRemove}
      { ...props }
    />
  }

  render() {
    const { permissions, onRemove } = this.props;
    return <div className="base">
      <style jsx>{`
        .base {
          display: flex;
          flex-direction: column;
          margin-top: 0;
          margin-bottom: 0;
          margin-left: 0;
          margin-right: 0;
          padding-top: 0;
          padding-bottom: 0;
          padding-left: 0;
          padding-right: 0;
          max-height: calc(100% - 160px);
          overflow: auto;
        }
      `}</style>
      { permissions.map(this.renderItem) }
    </div>
  }

}


