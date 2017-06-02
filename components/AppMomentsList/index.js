
import React from 'react';
import PropTypes from 'prop-types';

import AppMomentsListItem from '../AppMomentsListItem';
import AppMomentsListPlaceholderItem from '../AppMomentsListPlaceholderItem';

const placeholders = [ 0, 0, 0, 0, 0 ];

export default class AppMomentsList extends React.PureComponent {

  static propTypes = {
    placeholder : PropTypes.bool,
    whoami      : PropTypes.string,
    profile     : PropTypes.string,
    mode        : PropTypes.oneOf([ 'desktop', 'mobile' ]),
    moments     : PropTypes.array,
    permissions : PropTypes.object,
  }

  static defaultProps = {
    placeholder : false,
    whoami      : '',
    profile     : '',
    mode        : 'desktop',
    moments     : [ ],
    permissions : { },
  }

  render() {
    const { placeholder, moments, permissions, whoami, profile, mode } = this.props;
    return <ul className="base">
      <style jsx>{`
        .base {
          display: flex;
          justify-content: flex-start;
          flex-direction: row;
          flex-wrap: wrap;
        }
      `}</style>
      { (placeholder
          ? [ ...moments, ...placeholders ]
          : moments
        ).map(
          (props, i) => ( props === 0 )
            ? <AppMomentsListPlaceholderItem key={i} />
            : <AppMomentsListItem key={props.id} whoami={whoami} profile={profile} permissions={permissions[props.id]} mode={mode} {...props} />
        )
      }
    </ul>
  }

}

