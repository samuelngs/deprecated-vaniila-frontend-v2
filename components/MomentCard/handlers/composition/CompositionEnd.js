
import onCompositionResolve from './CompositionResolve';

const RESOLVE_DELAY = 20;

/**
 * trigger when composition ends (IME)
 */
export default function onCompositionEnd(e) {
  e.persist && e.persist();
  this.set({ contentCompositionIsComposing: false, contentCompositionHasResolved: false });
  setTimeout(() => {
    const { contentCompositionHasResolved } = this.get();
    if ( !contentCompositionHasResolved ) onCompositionResolve.call(this, 'onCompositionEnd', e);
  }, RESOLVE_DELAY);
  this.emit('compositionend');
}
