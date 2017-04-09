
import Codes from './codes';

function isWebkit() {
  return !!('WebkitAppearance' in document.documentElement.style);
}

/**
 * trigger when the content area has been blured / lost focused
 */
export default function onBlur(e) {

  // Webkit has a bug in which blurring a contenteditable by clicking on
  // other active elements will trigger the `blur` event but will not remove
  // the DOM selection from the contenteditable. We therefore force the
  // issue to be certain, checking whether the active element is `body`
  // to force it when blurring occurs within the window (as opposed to
  // clicking to another tab or window).
  const isWebKit = isWebkit();
  if (isWebKit && document.activeElement === document.body) {
    window.getSelection().removeAllRanges();
  }

  this.dispatch({ contentFocused: false });
  this.emit('blur');
}
