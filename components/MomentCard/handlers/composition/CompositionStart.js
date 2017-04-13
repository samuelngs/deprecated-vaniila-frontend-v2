
/**
 * trigger when composition starts (IME)
 */
export default function onCompositionStart(e) {
  e.persist && e.persist();

  const { root, store: { dispatch } } = this;

  dispatch(api.setEditorState(root, { composing: true })).then(state => {
    this.emit('composition', 'compositionstart');
  });

}
