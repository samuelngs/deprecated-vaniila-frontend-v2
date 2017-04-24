
import UUID from 'uuid';
import { api } from '../../../../reducers/editor';
import deepClone from '../../../../utils/clone';

import {
  text as textBlockTemplate,
} from '../../template';

export function onInline (key) {

  const { moment, editorState, root, id, onChange } = this.props;
  const { store: { dispatch } } = this.context;

  // clone for moment state
  const clone = { };
  deepClone(clone, moment);

  clone.hash = `${Date.now()}`;
  clone.data = (clone.data || { });
  clone.data.blocks = (clone.data.blocks || [ ]);

  if ( !clone.parent ) return;

  clone.parent = '';

  // retrieve moment blocks
  const blocks = clone.data.blocks;

  if ( blocks.length !== 1 ) return;

  const newBeforeBlock = { ...textBlockTemplate, key: UUID.v4() };
  const newAfterBlock = { ...textBlockTemplate, key: UUID.v4() };

  blocks.unshift(newBeforeBlock);
  blocks.push(newAfterBlock);

  return Promise.resolve(onChange(id, clone)).then(_ => {
    return dispatch(api.setEditorState(root, {
      anchorKey         : newAfterBlock,
      anchorGroup       : '0',
      anchorOffset      : 0,
      focusKey          : newAfterBlock,
      focusGroup        : '0',
      focusOffset       : 0,
      selectionRecovery : true,
      selectionCollapsed: true,
    }));
  });
}
