
import React from 'react';
import PropTypes from 'prop-types';

export default class AppFixedLayer extends React.PureComponent {

  static propTypes = {
    offset: PropTypes.number,
    width : PropTypes.number,
  }

  static defaultProps = {
    offset: 0,
    width : 300,
  }

  state = {
    fixed: false,
  }

  componentDidMount() {
    if ( typeof window === 'undefined' ) return;

    const { n, props: { offset }, state: { fixed } } = this;
    const { scrollY } = window;
    const { offsetTop } = n;

    if ( scrollY + offset >= offsetTop ) {
      this.setState({ fixed: true });
    }

    window.addEventListener('scroll', this.onScroll);
  }

  componentWillUnmount() {
    if ( typeof window === 'undefined' ) return;
    window.removeEventListener('scroll', this.onScroll);
  }

  onScroll = e => {

    const { n, props: { offset }, state: { fixed } } = this;
    if ( !n ) return;

    const { scrollY } = window;
    const { offsetTop } = n;

    if ( scrollY + offset >= offsetTop ) {
      if ( !fixed ) this.setState({ fixed: true });
    } else {
      if ( fixed ) this.setState({ fixed: false });
    }

  }

  render() {
    const { offset, width, children } = this.props;
    const { fixed } = this.state;
    return <div ref={n => this.n = n} className="base">
      <style jsx>{`
        .base {
          position: relative;
        }
        .layer-fixed {
          position: fixed;
        }
      `}</style>
      <div className={ fixed ? "layer-fixed" : "layer" } style={ fixed ? { top: offset, width } : null }>
        { children }
      </div>
    </div>
  }

}
