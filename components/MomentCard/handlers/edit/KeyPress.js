
import Codes from '../shared/Codes.js';

/**
 * trigger when the key press action
 */
export default function onKeyPress(e) {
  e.persist && e.persist();
  const { which } = e;
  if ( which === Codes.ENTER ) {
    e.preventDefault && e.preventDefault();
  }
}
