
import React from 'react';
import PropTypes from 'prop-types';

import { actions } from '../../reducers/window';

export default class WindowObserver extends React.Component {

  static contextTypes = {
    store: PropTypes.object,
  }

  componentDidMount() {
    this.resize();
    this.addEventListener();
  }

  componentWillUnmount() {
    this.removeEventListener();
  }

  isMobileOperatingSystem() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    return /windows phone/i.test(userAgent) || /android/i.test(userAgent) || /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
  }

  shouldOverrideHorizontalScroll() {
    return (
      navigator.userAgent.match(/Macintosh/) &&
      (
        navigator.userAgent.indexOf('Chrome') > -1 ||
        navigator.userAgent.indexOf('Safari') > -1 ||
        navigator.userAgent.indexOf('Firefox') > -1
      )
    );
  }

  addEventListener() {
    if ( this.shouldOverrideHorizontalScroll() ) {
      window.addEventListener('mousewheel', this.mousewheel);
    }
    window.addEventListener('resize', this.resize);
  }

  removeEventListener() {
    if ( this.shouldOverrideHorizontalScroll() ) {
      window.removeEventListener('mousewheel', this.mousewheel);
    }
    window.removeEventListener('resize', this.resize);
  }

  // Prevent horizontal scroll for Back page in Mac 10.7+
  //
  // Supported browsers: Mac OSX Chrome, Mac OSX Safari, Mac OSX Firefox
  // On all other browsers this script won't do anything
  mousewheel = e => {

    const parents = (el => {
      const res = [ ];
      while ( el.parentNode ) {
        el = el.parentNode;
        res.push(el);
      }
      return res;
    })(e.target);

    const l = e.deltaX < 0 && parents.filter(el => {
      if ( el === window ) {
        return ( el.scrollX || el.pageXOffset ) > 0;
      }
      return ( el.scrollLeft || el.clientLeft ) > 0;
    }).length === 0;

    const r = e.deltaX > 0 && parents.filter(el => {
      if (
        el === window ||
        el.nodeType !== 1
      ) return false;
      const style = window.getComputedStyle(el, null);
      if (
        style &&
        style.overflowX !== 'scroll' &&
        style.overflowX !== 'auto'
      ) return false;
      const x = el.scrollLeft || el.clientLeft;
      const w = el.offsetWidth || el.clientWidth;
      const s = el.scrollWidth || el.clientWidth;
      return x + w >= s;
    }).length !== 0;

    if ( ( l || r ) && e.preventDefault ) e.preventDefault();
  }

  resize = e => {
    const { store: { dispatch } } = this.context;
    const size = this.isMobileOperatingSystem() && window.screen
      ? { width: window.screen.width || window.innerWidth, height: window.screen.height || window.innerHeight }
      : { width: window.innerWidth, height: window.innerHeight };
    return dispatch({ type: actions.SetWindowSize, size });
  }

  render() {
    return null;
  }

}


