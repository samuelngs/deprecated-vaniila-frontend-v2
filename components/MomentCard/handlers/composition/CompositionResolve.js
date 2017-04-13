
export default function resolveComposition(type, e) {

  const { root, store: { dispatch } } = this;
  const { editorIsComposing, editorInputData } = getState().editorStates[root];

  if ( editorIsComposing ) return;

  const data = editorInputData;
  this.emit('composition', 'resolve', data);

  dispatch(api.setEditorState(root, { compositionMode: false, compositionResolved: false, inputData: '' }));

}

