
/**
 * trigger when before input event
 */
export default function BeforeInput(e) {
  e.persist && e.persist();
  e.preventDefault && e.preventDefault();

  const characters = e.data;
  if ( !characters ) return;

  this.emit('edit', 'insert-character', characters);

  const { root, store: { dispatch, getState } } = this;
  const { editorIsCollapsed } = getState().editorStates[root];

  if ( !editorIsCollapsed ) {
    e.preventDefault && e.preventDefault();
    return;
  }

}
