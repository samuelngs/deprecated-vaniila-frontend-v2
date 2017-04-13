
import { api } from '../../../../reducers/editor';

/**
 * trigger when composition starts
 */
export default function CompositionStart(e) {
  e.persist && e.persist();

  const { root, store: { dispatch } } = this;

  dispatch(api.setEditorState(root, { compositionMode: true })).then(state => {
    this.emit('edit', 'compositionstart', state);
  });

}
