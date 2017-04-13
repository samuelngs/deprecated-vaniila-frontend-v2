
/**
 * trigger before input
 */
export default function onBeforeInput(e) {
  e.persist && e.persist();

  const { root, store: { dispatch, getState } } = this;
  const { editorInputData } = getState().editorStates[root];

  const data = (editorInputData || '') + e.data;

  dispatch(api.setEditorState(root, { inputData: data })).then(state => {
    this.emit('composition', 'beforeinput');
  });

}

