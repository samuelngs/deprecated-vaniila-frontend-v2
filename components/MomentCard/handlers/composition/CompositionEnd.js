
import onCompositionResolve from './CompositionResolve';
import { api } from '../../../../reducers/editor';

const RESOLVE_DELAY = 20;

/**
 * trigger when composition ends (IME)
 */
export default function onCompositionEnd(e) {
  e.persist && e.persist();

  this.emit('composition', 'compositionend');

  const { root, store: { dispatch, getState } } = this;

  dispatch(api.setEditorState(root, { compositionResolved: false, composing: false })).then(state => {
    setTimeout(_ => {
      const { editorIsCompositionResolved } = getState().editorStates[root];
      if ( !editorIsCompositionResolved ) onCompositionResolve.call(this, 'onCompositionEnd', e);
    }, RESOLVE_DELAY);
  });

}
