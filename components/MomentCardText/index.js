
import React from 'react';

export default class MomentCardText extends React.Component {

  static propTypes = {
    scale   : React.PropTypes.number,
    editmode: React.PropTypes.bool,
    editable: React.PropTypes.bool,
  }

  static defaultProps = {
    scale   : 1,
    editmode: false,
    editable: false,
  }

  getStyle() {
    const { scale } = this.props;
    return {
      fontWeight: 300,
      lineHeight: 1.2,
    };
  }

  render() {
    const style = this.getStyle();
    return <p aria-label="moment-card-text" className="base" style={style}>
      <style jsx>{`
        .base {
          font-size: .9em;
        }
        .base + .base { margin-top: 20px; }
      `}</style>
    </p>;
  }

}


