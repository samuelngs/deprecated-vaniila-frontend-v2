
import React from 'react';

import { actions } from '../../reducers/window';

export default class WindowObserver extends React.Component {

  static contextTypes = {
    store: React.PropTypes.object,
  }

  componentDidMount() {
    this.bind();
    this.resize();
    this.addEventListener();
  }

  componentWillUnmount() {
    this.removeEventListener();
  }

  bind() {
    this.resize = this.resize.bind(this);
  }

  addEventListener() {
    window.addEventListener('resize', this.resize);
  }

  removeEventListener() {
    window.removeEventListener('resize', this.resize);
  }

  resize(e) {
    const { store: { dispatch } } = this.context;
    const size = { width: window.innerWidth, height: window.innerHeight };
    return dispatch({ type: actions.SetWindowSize, size });
  }

  render() {
    return null;
  }

}


