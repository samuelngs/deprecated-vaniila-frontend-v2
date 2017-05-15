
import React from 'react';

export default class AppDropdownSeparator extends React.PureComponent {

  render() {
    return <div className="base" onClick={this.handleOnClick}>
      <style jsx>{`
        .base {
          margin-top: 0;
          margin-bottom: 0;
          margin-left: 0;
          margin-right: 0;
          padding-top: 0;
          padding-bottom: 0;
          padding-left: 0;
          padding-right: 0;
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
        }
      `}</style>
    </div>
  }

}

