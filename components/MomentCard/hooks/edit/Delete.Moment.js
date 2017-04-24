
import { api } from '../../../../reducers/editor';

export default function () {

  const { root, id, onChange } = this.props;
  const { store: { dispatch, getState } } = this.context;

  const { editorHistories } = getState();
  const { present: doc } = editorHistories[root] || { };
  const moments = doc && doc.data && doc.data.slides || { };
  const ids = Object.keys(moments);

  if ( ids.length > 1 ) {
    ids.sort((a, b) => moments[a].order - moments[b].order);
    const idx = ids.indexOf(id);
    const key = ids[idx + 1]
      ? ids[idx + 1]
      : ids[idx + ( idx === 0 ? 1 : -1 )];
    if ( !key ) return;
    dispatch(api.setEditorState(root, {
      nextId: key,
    }));
    return onChange(id, undefined);
  }

}
