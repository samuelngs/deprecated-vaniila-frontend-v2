
import Codes from '../shared/Codes';

/**
 * trigger when keydown event
 */
export default function onKeyDown(e) {
  e.persist && e.persist();

  this.emit('composition', 'keydown');

  const { which } = e;

  switch ( which ) {
    case Codes.RIGHT:
    case Codes.LEFT:
      return e.preventDefault && e.preventDefault();
  }

}
