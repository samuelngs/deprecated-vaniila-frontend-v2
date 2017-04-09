
import Codes from './codes';
import onCompositionResolve from '../composition/CompositionResolve';

/**
 * trigger when the (keyboard) key down
 */
export default function onKeyDown(e) {
  e.persist && e.persist();
  const { which } = e;
  const { contentCompositionIsComposing } = this.get();
  if ( !contentCompositionIsComposing ) {
    onCompositionResolve.call(this, 'onKeyDown', e);
    return;
  }
  if (which === Codes.RIGHT || which === Codes.LEFT) {
    e.preventDefault && e.preventDefault();
  }
}
