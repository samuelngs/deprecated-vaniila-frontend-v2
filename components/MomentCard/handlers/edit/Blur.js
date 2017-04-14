
import Codes from '../shared/Codes.js';
import { api } from '../../../../reducers/editor';

function isWebkit() {
  return !!('WebkitAppearance' in document.documentElement.style);
}

/**
 * trigger when the content area has been blured / lost focused
 */
export default function onBlur(e) {

  // Webkit has a bug in which blurring a contenteditable by clicking on
  // other active elements will trigger the `blur` event but will not remove
  // the DOM selection from the contenteditable. We therefore force the
  // issue to be certain, checking whether the active element is `body`
  // to force it when blurring occurs within the window (as opposed to
  // clicking to another tab or window).
  const isWebKit = isWebkit();
  if (isWebKit && document.activeElement === document.body) {
    window.getSelection().removeAllRanges();
  }

  const { root, store: { dispatch, getState } } = this;
  const { editorHasFocus } = getState().editorStates[root];

  if ( !editorHasFocus ) return;

  dispatch(api.setEditorState(root, { id: '', focus: false })).then(state => {
    this.emit('edit', 'blur', state);
  });

}
