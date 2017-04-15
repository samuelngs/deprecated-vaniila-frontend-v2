
import UUID from 'uuid';

import { analyze } from '../../../MomentCardText/utils';
import deepClone from '../../../../utils/clone';
import { api } from '../../../../reducers/editor';

const blockTemplate = {
  key   : '',
  type  : 'unstyled',
  data  : '',
  styles: [ ],
};

export default function onNewLineCollapsed() {

  const { moment, editorState, root, id, onChange } = this.props;
  const { store: { dispatch, getState } } = this.context;

  const {
    editorStartKey,
    editorStartGroup,
    editorStartOffset,
  } = editorState;

  // retrieve anchor and focus offset group id
  // valid offset group should be number
  let startOffsetGroup = Number(editorStartGroup);

  if ( isNaN(startOffsetGroup) ) startOffsetGroup = 0;

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
      blockStyleGroups;

  for ( const [ i, b ] of blocks.entries() ) {
    if ( b.key === editorStartKey ) {
      block = b;
      blockIndex = i;
      blockStyleGroups = analyze(b);
      break;
    }
  }

  if ( !block || typeof blockStyleGroups[startOffsetGroup] !== 'string' ) return;

  const startGroup = blockStyleGroups[startOffsetGroup];
  const startOffset = (() => {
    for ( let i = 0, c = editorStartOffset; i < startOffsetGroup && i < blockStyleGroups.length; i++ ) {
      c += (blockStyleGroups[i] || '').length;
      if ( i + 1 === startOffsetGroup ) return c;
    }
    return editorStartOffset;
  })();

  const divideIndex = startOffset;

  const textA = block.data.substr(0, divideIndex);
  const textB = block.data.substr(divideIndex, block.data.length);

  let originalBlock, newBlock;

  // if part A text length is 0, push everything to new block
  if ( textA.length === 0 ) {

    originalBlock = { ...blockTemplate, key: block.key };
    newBlock = { ...blockTemplate, ...block, key: UUID.v4() };

  // if part B text length is 0, keep original block and initialize new block
  } else if ( textB.length === 0 ) {

    originalBlock = { ...blockTemplate, ...block };
    newBlock = { ...blockTemplate, key: UUID.v4() };

  } else {

    const stylesA = [ ];
    const stylesB = [ ];

    if ( Array.isArray(block.styles) ) {
      for ( const { offset, length, style } of block.styles ) {
        const start = offset;
        const end = offset + length;
        if ( start >= divideIndex ) {
          stylesB.push({ offset: start - divideIndex, length, style });
        } else if ( start < divideIndex && end > divideIndex ) {
          stylesA.push({ offset: start, length: divideIndex - start, style });
          stylesB.push({ offset: 0, length: end - divideIndex, style });
        } else {
          stylesA.push({ offset, length, style });
        }
      }
    }

    originalBlock = { ...blockTemplate, ...block, data: textA, styles: stylesA };
    newBlock = { ...blockTemplate, key: UUID.v4(), data: textB, styles: stylesB };

  }

  blocks[blockIndex] = originalBlock;
  blocks.splice(blockIndex + 1, 0, newBlock);

  Promise.resolve(onChange(id, clone)).then(_ => {
    return dispatch(api.setEditorState(root, {
      anchorKey         : newBlock.key,
      anchorGroup       : '0',
      anchorOffset      : 0,
      focusKey          : newBlock.key,
      focusGroup        : '0',
      focusOffset       : 0,
      selectionRecovery : true,
    }));
  });

}
