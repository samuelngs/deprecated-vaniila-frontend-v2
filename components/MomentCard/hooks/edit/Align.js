
import { api } from '../../../../reducers/editor';
import deepClone from '../../../../utils/clone';

export function onAlign() {

  const { moment, id, onChange } = this.props;
  const { store: { dispatch } } = this.context;

  // clone for moment state
  const clone = { };
  deepClone(clone, moment);

  clone.hash = `${Date.now()}`;

  if ( !clone.align ) {
    clone.align = 1;
  } else {
    clone.align = 0;
  }

  return Promise.resolve(onChange(id, clone));
}


