
import Codes from './codes';

/**
 * trigger when the key press action
 */
export default function onKeyPress(e) {
  const { which } = e;
  if ( which === Codes.ENTER ) {
    e.preventDefault && e.preventDefault();
  }
}
