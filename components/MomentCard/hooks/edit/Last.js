
import { api } from '../../../../reducers/editor';

export function onLastMoment(shift) {

  if ( !shift ) return;

  const { moment, root, id } = this.props;
  const { store: { dispatch, getState } } = this.context;

  const { editorStates, editorHistories } = getState();

  const editorState = editorStates[root];
  const editorHistory = editorHistories[root];

  if ( !editorState || !editorHistory ) return;

  const { editorMoment } = editorState;

  const { present } = editorHistory;

  if ( !present ) return;
  if ( !present.data ) return;
  if ( !present.data.slides ) return;

  const { data: { slides } } = present;

  const items = [ ];
  for ( const key in slides ) {
    const { order } = slides[key];
    items.push({ key, order });
  }

  items.sort((a, b) => (a.order || 0) - (b.order || 0));

  const last = items[items.length - 1];
  if ( !last ) return;

  const { key } = last;
  if ( editorMoment === key ) return;

  return dispatch(api.setEditorState(root, { grid: false, nextId: key, focus: true }));
}
