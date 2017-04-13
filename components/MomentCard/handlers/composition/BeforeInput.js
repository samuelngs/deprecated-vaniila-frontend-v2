
/**
 * trigger before input
 */
export default function onBeforeInput(e) {
  e.persist && e.persist();
  e.preventDefault && e.preventDefault();

  const { root, store: { dispatch, getState } } = this;
  const { editorInputData } = getState().editorStates[root];

  const data = (editorInputData || '') + e.data;

  this.emit('composition', 'insert-character', data);

  dispatch(api.setEditorState(root, { inputData: data })).then(state => {
    this.emit('composition', 'beforeinput', data);
  });

}

