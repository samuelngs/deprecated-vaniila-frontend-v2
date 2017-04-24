
import { api } from '../../../../reducers/editor';

import deepClone from '../../../../utils/clone';
import { isText } from '../../types';

export function onFullscreen (key) {

  const { moment, editorState, root, id, onCreate, onChange } = this.props;
  const { store: { dispatch } } = this.context;

  // clone for moment state
  const clone = { };
  deepClone(clone, moment);

  clone.hash = `${Date.now()}`;
  clone.data = (clone.data || { });
  clone.data.blocks = (clone.data.blocks || [ ]);

  if ( !!clone.parent ) return;

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

  const prevBlock = blocks[blockIndex - 1];
  const nextBlock = blocks[blockIndex + 1];

  if ( nextBlock && isText(nextBlock) && !nextBlock.data ) {
    removeNextBlock = true;
  }

  if (
    blocks.length === 3 &&
    isText(prevBlock) &&
    isText(nextBlock) &&
    prevBlock.data.length === 0 &&
    nextBlock.data.length === 0
  ) {
    clone.parent = block.key;
    clone.data.blocks = [ block ];
    return onChange(id, clone);
  }

  blocks.splice(
    blockIndex,
    removeNextBlock
    ? 2
    : 1,
  );

  Promise.resolve(
    onChange(id, clone),
  )
  .then(_ => Promise.resolve(
    onCreate(moment.order + 1, {
      parent: block.key,
      blocks: [ block ],
    }),
  ))
  .then(({ name, block }) => {
    const { root } = this.props;
    const { store: { dispatch } } = this.context;
    return dispatch(api.setEditorState(root, { nextId: name }));
  })

}
