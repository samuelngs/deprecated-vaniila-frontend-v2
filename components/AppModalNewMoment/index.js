
import React from 'react';
import AppNewMoment from '../AppNewMoment';

export default class AppModalNewMoment extends React.Component {

  render() {
    return <div className="base">
      <style jsx>{`
        .base {
          display: flex;
          margin: 0 auto;
          padding: 0;
          width: 800px;
          max-width: calc(100% - 80px);
        }
      `}</style>
      <AppNewMoment />
    </div>
  }

}

