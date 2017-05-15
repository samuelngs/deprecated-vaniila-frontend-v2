
import React from 'react';
import PropTypes from 'prop-types';

import If from '../If';
import { TransitionMotion, spring } from 'react-motion';

const active   = [ { key: 'dropdown-context' } ];
const inactive = [ ];

export default class AppDropdownButton extends React.PureComponent {

  static propTypes = {
    id        : PropTypes.string,
    icon      : PropTypes.bool,
    className : PropTypes.string,
    render    : PropTypes.node,
    children  : PropTypes.node,
  }

  static defaultProps = {
    id        : '',
    icon      : false,
    className : '',
    render    : null,
    children  : null,
  }

  state = {
    active: false,
  }

  componentDidMount() {
    this.$$_mounted_$$ = true;
  }

  componentWillUnmount() {
    this.$$_mounted_$$ = false;
  }

  willEnter = o => {
    return { opacity: 0, y: 10 }
  }

  willLeave = o => {
    return { opacity: spring(0), y: spring(10) }
  }

  getDefaultStyles = o => {
    const { children: data } = this.props;
    const { active: visible } = this.state;
    const arr = visible
      ? active
      : inactive;
    return arr.map(o => ({ ...o, data, style: { y: 10, opacity: 0 } }));
  }

  getStyles = o => {
    const { children: data } = this.props;
    const { active: visible } = this.state;
    const arr = visible
      ? active
      : inactive;
    return arr.map(o => ({ ...o, data, style: { y: spring(15), opacity: spring(1) } }));
  }

  addEventListener = o => {
    if ( this.$$_events_$$ ) return;
    this.$$_events_$$ = true;
    window.addEventListener('click', this.handleOnCancellable);
  }

  removeEventListener = o => {
    if ( !this.$$_events_$$ ) return;
    this.$$_events_$$ = false;
    window.removeEventListener('click', this.handleOnCancellable);
  }

  handleOnCancellable = e => {

    e.preventDefault && e.preventDefault();

    const { id } = this.props;

    let el = e.target;
    let found = false;

    while ( el.parentNode ) {
      if ( el.getAttribute('data-dropdown') === id ) {
        found = true;
        break;
      }
      el = el.parentNode;
    }
    if ( !found ) {
      this.handleOnDismiss();
    }
  }

  handleOnClick = e => {
    const { active } = this.state;
    this.$$_mounted_$$ && this.setState({ active: !active }, this.addEventListener);
  }

  handleOnDismiss = e => {
    const { active } = this.state;
    this.$$_mounted_$$ && active && this.setState({ active: false }, this.removeEventListener);
  }

  render() {
    const { id, className, icon, render } = this.props;
    const { active } = this.state;
    return <div data-dropdown={id}>
      <style jsx>{`
        .icon {
          width: 30px;
          height: 30px;
          fill: #82a3b7;
        }
        .icon-active {
          fill: #18e7a3;
        }
      `}</style>
      <button className={className} onClick={this.handleOnClick}>
        <If condition={icon}>
          <svg className={active ? "icon icon-active" : "icon"} xmlns="http://www.w3.org/2000/svg" viewBox="-255 347 100 100">
            <circle cx="-227.4" cy="397" r="7.6"/>
            <circle cx="-205" cy="397" r="7.6"/>
            <circle cx="-182.6" cy="397" r="7.6"/>
          </svg>
        </If>
        <If condition={!icon}>
          { render }
        </If>
      </button>
      <TransitionMotion
        defaultStyles={this.getDefaultStyles()}
        styles={this.getStyles()}
        willLeave={this.willLeave}
        willEnter={this.willEnter}>
        { ([ dropdown, ...etc ]) => dropdown ? <div key={dropdown.key} style={{ opacity: dropdown.style.opacity, transform: `translate3d(-120px, ${dropdown.style.y}px, 0px)` }}>
          { React.Children.map(dropdown.data, child => React.cloneElement(child, { dismiss: this.handleOnDismiss })) }
        </div> : null }
      </TransitionMotion>
    </div>
  }

}
