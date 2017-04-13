
import Codes from '../shared/Codes.js';

/**
 * trigger when the (keyboard) key down
 */
export default function onKeyDown(e) {
  e.persist && e.persist();

  const { which } = e;

  switch ( which ) {

    case Codes.ENTER:
      e.preventDefault && e.preventDefault();
      break;

    case Codes.ESC:
      e.preventDefault && e.preventDefault();
      return;

    case Codes.TAB:
      return;

    case Codes.UP:
    case Codes.DOWN:
      return;

    case Codes.SPACE:
      return;

    case Codes.BACKSPACE:
    case Codes.DELETE:
      e.preventDefault && e.preventDefault();
      return this.emit('edit', 'delete-character');

  }

}
