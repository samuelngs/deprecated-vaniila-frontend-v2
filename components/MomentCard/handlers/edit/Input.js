
import Codes from '../shared/Codes.js';

/**
 * trigger when content input event
 */
export default function onInput(e) {

  if ( !window.getSelection ) return;

  const selection = window.getSelection();
  const { root, store: { dispatch, getState } } = this;
  const { editorHasFocus } = getState().editorStates[root];

  const { anchorNode, isCollapsed } = selection;
  if ( anchorNode.nodeType !== Node.TEXT_NODE ) return;

  this.emit('edit', 'input', e.data);

  let domText = anchorNode.textContent;

}

