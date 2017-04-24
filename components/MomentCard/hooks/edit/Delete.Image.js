
import { api } from '../../../../reducers/editor';
import deepClone from '../../../../utils/clone';

import { findRelativeOffset } from '../../utils';
import { isText } from '../../types';

export default function (key) {

  const { moment, editorState, root, id, onChange } = this.props;
  const { store: { dispatch, getState } } = this.context;

  // clone for moment state
  const clone = { };
  deepClone(clone, moment);

  clone.hash = `${Date.now()}`;
  clone.data = (clone.data || { });
  clone.data.blocks = (clone.data.blocks || [ ]);

  // retrieve moment blocks
  const blocks = clone.data.blocks;

  let block,
      blockIndex,
      blockStyleGroups,
      removeNextBlock;

  for ( const [ i, b ] of blocks.entries() ) {
    if ( b.key === key ) {
      block = b;
      blockIndex = i;
      break;
    }
  }

  if ( !block ) return;

  if ( blocks.length === 1 ) {

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

    return;
  }

  const nextBlock = blocks[blockIndex + 1];
  if ( nextBlock && isText(nextBlock) && !nextBlock.data ) {
    removeNextBlock = true;
  }

  blocks.splice(
    blockIndex,
    removeNextBlock
    ? 2
    : 1,
  );

  const focusBlock = blocks[blockIndex - 1];

  const { recoveryGroup, recoveryOffset } = findRelativeOffset(
    focusBlock,
    focusBlock.data.length,
  );

  return Promise.resolve(onChange(id, clone)).then(_ => {
    this
      .focus()
      .then(_ => dispatch(api.setEditorState(root, {
        anchorKey         : focusBlock.key,
        anchorGroup       : recoveryGroup,
        anchorOffset      : recoveryOffset,
        focusKey          : focusBlock.key,
        focusGroup        : recoveryGroup,
        focusOffset       : recoveryOffset,
        selectionRecovery : true,
        selectionCollapsed: true,
      })));
  });

}
