
import Codes from './codes';

/**
 * trigger when content area has been focused
 */
export default function onFocus(e) {
  this.dispatch({ contentFocused: true });
  this.emit('focus');
}

