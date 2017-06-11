
import deepClone from '../../../../utils/clone';
import { api } from '../../../../reducers/editor';

export function onMomentPublish(create) {

  const { moment, root, id, onCreate, onChange } = this.props;
  const { store: { dispatch } } = this.context;

  if ( moment.published === true ) return;

  // clone for moment state
  const clone = { };
  deepClone(clone, moment);

  clone.hash = `${Date.now()}`;
  clone.published = true;

  if ( create ) {
    return Promise.resolve(onChange(id, clone)).then(_ => {
      return onCreate().then(({ name, block }) => {
        return dispatch(api.setEditorState(root, { grid: false, nextId: name, focus: true }));
      });
    });
  }

  return Promise.resolve(onChange(id, clone));
}
