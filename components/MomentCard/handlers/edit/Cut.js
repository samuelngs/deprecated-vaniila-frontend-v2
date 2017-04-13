
import Codes from '../shared/Codes.js';

/**
 * trigger when content has been cut
 */
export default function onCut(e) {
  e.persist && e.persist();

  const { root, store: { dispatch, getState } } = this;
  const { editorIsCollapsed } = getState().editorStates[root];

  // single selection, ignore copy action
  if ( !editorIsCollapsed ) {
    e.preventDefault && e.preventDefault();
    return;
  }

  this.emit('edit', 'cut', state);

}
