
import UUID from 'uuid';

import { analyze, simplify } from '../../../MomentCardText/utils';
import deepClone from '../../../../utils/clone';
import { api } from '../../../../reducers/editor';

const blockTemplate = {
  key   : '',
  type  : 'text',
  data  : '',
  styles: [ ],
};

function findActualOffset(group, groups, offset) {
  for ( let i = 0, c = offset; i < group && i < groups.length; i++ ) {
    c += (groups[i] || '').length;
    if ( i + 1 === group ) return c;
  }
  return offset;
}

export default function onNewLineReplace() {

  const { moment, editorState, root, id, onChange } = this.props;
  const { store: { dispatch } } = this.context;

  const {
    editorStartKey,
    editorStartGroup,
    editorStartOffset,
    editorEndKey,
    editorEndGroup,
    editorEndOffset,
  } = editorState;

  // retrieve anchor and focus offset group id
  // valid offset group should be number
  let startOffsetGroup = Number(editorStartGroup);
  let endOffsetGroup = Number(editorEndGroup);

  if ( isNaN(startOffsetGroup) ) startOffsetGroup = 0;
  if ( isNaN(endOffsetGroup) ) endOffsetGroup = 0;

  // clone for moment state
  const clone = { };
  deepClone(clone, moment);

  clone.hash = `${Date.now()}`;
  clone.data = (clone.data || { });
  clone.data.blocks = (clone.data.blocks || [ ]);

  // retrieve moment blocks
  const blocks = clone.data.blocks;

  let startBlock,
      startBlockIndex,
      startStyleGroups,
      endBlock,
      endBlockIndex,
      endStyleGroups;

  for ( const [ i, b ] of blocks.entries() ) {
    if ( b.key === editorStartKey ) {
      startBlock = b;
      startBlockIndex = i;
      startStyleGroups = analyze(b);
    }
    if ( b.key === editorEndKey ) {
      endBlock = b;
      endBlockIndex = i;
      endStyleGroups = analyze(b);
    }
    if ( startBlock && endBlock ) break;
  }

  // if two selected blocks (position) are actually the same block
  const isBlocksEqual = startBlockIndex === endBlockIndex;

  // count affected blocks;
  // if start and end blocks are not the same block, deduct 1;
  const affactedBlocksCount = endBlockIndex - startBlockIndex - (!isBlocksEqual ? 1 : 0);

  const startStyleGroup = startStyleGroups[startOffsetGroup];
  const endStyleGroup = endStyleGroups[endOffsetGroup];

  if ( !startBlock || !endBlock || typeof startStyleGroup !== 'string' || typeof endStyleGroup !== 'string' ) return;

  const actualStartOffset = findActualOffset(startOffsetGroup, startStyleGroups, editorStartOffset);
  const actualEndOffset = findActualOffset(endOffsetGroup, endStyleGroups, editorEndOffset);

  let textA, textB;
  let newStartBlock, newEndBlock, newTextBlock;
  const stylesA = [ ], stylesB = [ ];

  // handle anything happens within the same block
  if ( isBlocksEqual ) {

    textA = startBlock.data.substr(0, actualStartOffset);
    textB = startBlock.data.substr(actualEndOffset, startBlock.data.length);

    if ( Array.isArray(startBlock.styles) ) {
      for ( const { offset, length, style } of startBlock.styles ) {
        const start = offset;
        const end = offset + length;
        if ( start >= actualEndOffset ) {
          stylesB.push({ offset: 0, length, style });
        } else if ( start < actualStartOffset ) {
          let len = actualStartOffset - offset;
          if ( len > length ) len = length;
          stylesA.push({ offset, length: len, style });
        }
      }
    }

    if ( textA.length === 0 && textB.length === 0 ) {

      newStartBlock = { ...blockTemplate, key: startBlock.key };
      newTextBlock = { ...blockTemplate, key: UUID.v4() };

    } else {

      newStartBlock = { ...blockTemplate, key: startBlock.key, data: textA, styles: stylesA };
      newTextBlock = { ...blockTemplate, key: UUID.v4(), data: textB, styles: stylesB };

    }

    newStartBlock.styles = simplify(newStartBlock);
    newTextBlock.styles = simplify(newTextBlock);

    blocks[startBlockIndex] = newStartBlock;
    blocks.splice(startBlockIndex + 1, 0, newTextBlock);

    return Promise.resolve(onChange(id, clone)).then(_ => {
      return dispatch(api.setEditorState(root, {
        anchorKey         : newTextBlock.key,
        anchorGroup       : '0',
        anchorOffset      : 0,
        focusKey          : newTextBlock.key,
        focusGroup        : '0',
        focusOffset       : 0,
        selectionRecovery : true,
      }));
    });

  }

  // handle anything happens equal or over two blocks

  textA = startBlock.data.substr(0, actualStartOffset);
  textB = endBlock.data.substr(actualEndOffset, endBlock.data.length);

  if ( Array.isArray(startBlock.styles) ) {
    for ( const { offset, length, style } of startBlock.styles ) {
      const start = offset;
      const end = offset + length;
      if ( start < actualStartOffset ) {
        let len = actualStartOffset - offset;
        if ( len > length ) len = length;
        stylesA.push({ offset, length: len, style });
      }
    }
  }

  if ( Array.isArray(endBlock.styles) ) {
    for ( const { offset, length, style } of endBlock.styles ) {
      const start = offset;
      const end = offset + length;
      if ( start >= actualEndOffset ) {
        stylesB.push({ offset: 0, length, style });
      }
    }
  }

  newStartBlock = { ...startBlock, data: textA, styles: stylesA };
  newStartBlock.styles = simplify(newStartBlock);
  newEndBlock = { ...endBlock, data: textB, styles: stylesB };
  newEndBlock.styles = simplify(newEndBlock);

  blocks[startBlockIndex] = newStartBlock;
  blocks[endBlockIndex] = newEndBlock;
  if ( affactedBlocksCount > 0 ) blocks.splice(startBlockIndex + 1, affactedBlocksCount);

  return Promise.resolve(onChange(id, clone)).then(_ => {
    return dispatch(api.setEditorState(root, {
      anchorKey         : endBlock.key,
      anchorGroup       : '0',
      anchorOffset      : 0,
      focusKey          : endBlock.key,
      focusGroup        : '0',
      focusOffset       : 0,
      selectionRecovery : true,
    }));
  });
}
