
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
    if ( /windows phone/i.test(userAgent) ) return 'windows';
    if ( /android/i.test(userAgent) ) return 'android';
    if ( /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream ) return 'ios';
    return false;
  }

  calculateOffset(os) {
    switch ( os ) {
      case 'windows':
        return 0;
      case 'android':
        return 38;
      case 'ios':
        return 40 + 64;
      default:
        return 0;
    }
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
    window.addEventListener('orientationchange', this.resize);
  }

  removeEventListener() {
    if ( this.shouldOverrideHorizontalScroll() ) {
      window.removeEventListener('mousewheel', this.mousewheel);
    }
    window.removeEventListener('resize', this.resize);
    window.removeEventListener('orientationchange', this.resize);
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

    const mobile = this.isMobileOperatingSystem();
    const offset = this.calculateOffset(mobile);

    const orientation = window.screen && window.screen.orientation && window.screen.orientation.type
      ? ( window.screen.orientation.type === 'landscape-primary' || window.screen.orientation.type === 'landscape-secondary' ? 0 : 1 )
      : ( window.orientation === 0 || window.orientation === 180 ? 0 : 1 );

    const portrait = orientation === 1;

    const width = mobile && window.screen
      ? window.screen.availWidth || window.screen.width || window.innerWidth
      : window.innerWidth;

    const height = mobile && window.screen
      ? window.screen.availHeight - offset || ( window.screen.height - offset ) || window.innerHeight
      : window.innerHeight;

    const size = portrait
      ? { width, height }
      : { width: height, height: width };

    return dispatch({ type: actions.SetWindowSize, size });
  }

  render() {
    return null;
  }

}


