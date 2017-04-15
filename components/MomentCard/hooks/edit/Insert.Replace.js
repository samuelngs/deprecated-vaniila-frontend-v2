
import UUID from 'uuid';

import { analyze, simplify } from '../../../MomentCardText/utils';
import deepClone from '../../../../utils/clone';
import { api } from '../../../../reducers/editor';

const blockTemplate = {
  key   : '',
  type  : 'unstyled',
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

export default function onTextInsertReplace(data) {

  const character = data.replace(/(\r\n|\n|\r)/gm, '');

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
  const actualTargetOffset = actualStartOffset + character.length;

  let textA, textB, mergeText;
  let newStartBlock, newBlockStyleGroups;
  let recoveryGroup = 0, recoveryOffset = 0;
  const styles = [ ];

  // handle anything happens within the same block
  if ( isBlocksEqual ) {

    textA = startBlock.data.substr(0, actualStartOffset);
    textB = startBlock.data.substr(actualEndOffset, startBlock.data.length);

    if ( Array.isArray(startBlock.styles) ) {
      const extendHead = actualStartOffset === 0;
      const distance = actualEndOffset - actualStartOffset;
      for ( const { offset, length, style } of startBlock.styles ) {
        const start = offset;
        const end = offset + length;
        if ( start < actualEndOffset && end >= actualEndOffset ) {
          styles.push({ offset, length: length - distance + character.length, style });
        } else if ( start >= actualEndOffset ) {
          styles.push({ offset: offset - (distance - character.length), length, style });
        } else if ( start < actualStartOffset ) {
          let len = actualStartOffset - start + character.length;
          if ( len > length ) len = length;
          styles.push({ offset, length: len, style });
        }
      }
    }

    mergeText = `${textA}${character}${textB}`;

    newStartBlock = { ...blockTemplate, key: startBlock.key, data: mergeText, styles };
    newStartBlock.styles = simplify(newStartBlock);
    blocks[startBlockIndex] = newStartBlock;

    newBlockStyleGroups = analyze(newStartBlock);
    for ( let i = 0, t = 0; i < newBlockStyleGroups.length; i++ ) {
      const text = newBlockStyleGroups[i];
      const start = t;
      const end = t + text.length;
      if ( actualTargetOffset > start && actualTargetOffset <= end ) {
        recoveryGroup = i;
        recoveryOffset = actualTargetOffset - start;
        break;
      }
      t = end;
    }

    return Promise.resolve(onChange(id, clone)).then(_ => {
      return dispatch(api.setEditorState(root, {
        anchorKey         : newStartBlock.key,
        anchorGroup       : `${recoveryGroup}`,
        anchorOffset      : recoveryOffset,
        focusKey          : newStartBlock.key,
        focusGroup        : `${recoveryGroup}`,
        focusOffset       : recoveryOffset,
        selectionRecovery : true,
      }));
    });

  }

  // handle anything happens equal or over two blocks
  textA = startBlock.data.substr(0, actualStartOffset);
  textB = endBlock.data.substr(actualEndOffset, endBlock.data.length);

  mergeText = `${textA}${character}${textB}`;

  if ( Array.isArray(startBlock.styles) ) {
    for ( const { offset, length, style } of startBlock.styles ) {
      const start = offset;
      const end = offset + length;
      if ( start <= actualStartOffset ) {
        let len = actualStartOffset - offset;
        if ( len > length ) len = length;
        if ( end >= actualStartOffset ) {
          len += character.length;
        }
        styles.push({ offset, length: len, style });
      }
    }
  }

  if ( Array.isArray(endBlock.styles) ) {
    for ( const { offset, length, style } of endBlock.styles ) {
      const start = offset;
      const end = offset + length;
      if ( start >= actualEndOffset ) {
        styles.push({ offset: actualStartOffset + character.length, length, style });
      } else if ( start < actualStartOffset && end >= actualEndOffset ) {
        styles.push({ offset: actualStartOffset + character.length, length: end - actualEndOffset, style });
      }
    }
  }

  newStartBlock = { ...startBlock, data: mergeText, styles: styles };
  newStartBlock.styles = simplify(newStartBlock);
  blocks[startBlockIndex] = newStartBlock;

  blocks.splice(startBlockIndex + 1, affactedBlocksCount + 1);

  newBlockStyleGroups = analyze(newStartBlock);
  for ( let i = 0, t = 0; i < newBlockStyleGroups.length; i++ ) {
    const text = newBlockStyleGroups[i];
    const start = t;
    const end = t + text.length;
    if ( actualTargetOffset > start && actualTargetOffset <= end ) {
      recoveryGroup = i;
      recoveryOffset = actualTargetOffset - start;
      break;
    }
    t = end;
  }

  return Promise.resolve(onChange(id, clone)).then(_ => {
    return dispatch(api.setEditorState(root, {
      anchorKey         : newStartBlock.key,
      anchorGroup       : `${recoveryGroup}`,
      anchorOffset      : recoveryOffset,
      focusKey          : newStartBlock.key,
      focusGroup        : `${recoveryGroup}`,
      focusOffset       : recoveryOffset,
      selectionRecovery : true,
    }));
  });

}
