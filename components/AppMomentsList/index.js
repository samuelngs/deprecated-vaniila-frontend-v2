
import React from 'react';
import PropTypes from 'prop-types';

import AppMomentsListItem from '../AppMomentsListItem';

export default class AppMomentsList extends React.PureComponent {

  static propTypes = {
    mode   : PropTypes.oneOf([ 'desktop', 'mobile' ]),
    moments: PropTypes.array,
  }

  static defaultProps = {
    mode   : 'desktop',
    moments: [ ],
  }

  render() {
    const { moments, mode } = this.props;
    return <ul className="base">
      <style jsx>{`
        .base {
          display: flex;
          justify-content: flex-start;
          flex-direction: row;
          flex-wrap: wrap;
        }
      `}</style>
      { moments.map((props, i) => <AppMomentsListItem key={i} mode={mode} {...props} />) }
    </ul>
  }

}

