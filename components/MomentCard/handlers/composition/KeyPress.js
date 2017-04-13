
import Codes from '../shared/Codes';

/**
 * trigger when keypress event
 */
export default function onKeyPress(e) {
  e.persist && e.persist();

  this.emit('composition', 'keypress');

  const { which } = e;

  switch ( which ) {
    case Codes.ENTER:
      return e.preventDefault && e.preventDefault();
  }
}

