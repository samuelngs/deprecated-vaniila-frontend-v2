
import Codes from './codes';

/**
 * trigger when the content area has been blured / lost focused
 */
export default function onBlur(e) {
  this.dispatch({ contentFocused: false });
  this.emit('blur');
}
