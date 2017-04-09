
/**
 * trigger when composition starts (IME)
 */
export default function onCompositionStart(e) {
  this.set({ contentCompositionIsComposing: true });
  this.emit('compositionstart');
}
