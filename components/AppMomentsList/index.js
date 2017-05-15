
import React from 'react';
import PropTypes from 'prop-types';

import AppMomentsListItem from '../AppMomentsListItem';

export default class AppMomentsList extends React.PureComponent {

  static propTypes = {
    profile: PropTypes.string,
    mode   : PropTypes.oneOf([ 'desktop', 'mobile' ]),
    moments: PropTypes.array,
  }

  static defaultProps = {
    profile: '',
    mode   : 'desktop',
    moments: [ ],
  }

  render() {
    const { moments, profile, mode } = this.props;
    return <ul className="base">
      <style jsx>{`
        .base {
          display: flex;
          justify-content: flex-start;
          flex-direction: row;
          flex-wrap: wrap;
        }
      `}</style>
      { moments.map(props => <AppMomentsListItem key={props.id} profile={profile} mode={mode} {...props} />) }
    </ul>
  }

}

