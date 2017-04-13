
import Codes from '../shared/Codes.js';
import { api } from '../../../../reducers/editor';

/**
 * trigger when content area has been focused
 */
export default function onFocus(e) {

  const { root, id, store: { dispatch, getState } } = this;
  const { editorHasFocus } = getState().editorStates[root];

  if ( editorHasFocus ) return;

  dispatch(api.setEditorState(root, { id, focus: true })).then(state => {
    this.emit('edit', 'focus', state);
  });

}

