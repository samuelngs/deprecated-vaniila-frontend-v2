
import { analyze, simplify } from '../../../MomentCardText/utils';
import { api } from '../../../../reducers/editor';
import deepClone from '../../../../utils/clone';

import { findActualOffset, findRelativeOffset } from '../../utils';
import { isText, isMedia } from '../../types';

/**
 * trigger when delete text event within content area
 */
export default function onTextDeleteCollapsed() {

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

  const actualOffset = findActualOffset(startOffsetGroup, blockStyleGroups, editorStartOffset);

  const affactedLength = ( startOffsetGroup === 0 && editorStartOffset > 0 ) || startOffsetGroup > 0 ? 1 : 0;

  const textLength = blockStyleGroups[startOffsetGroup].length;
  const shiftLeft = editorStartOffset === 1 && textLength === 1 && startOffsetGroup > 0;
  const shiftHead = editorStartOffset === 1 && textLength === 1 && startOffsetGroup === 0;

  let text;
  let styles = [ ];

  if ( textLength === 0 && blockIndex === 0 ) {

    if ( id !== 'cover' && isText(block) && block.type !== 'unstyled' ) {
      block.type = 'unstyled';
      return Promise.resolve(onChange(id, clone)).then(_ => {
        return dispatch(api.setEditorState(root, {
          anchorKey         : editorStartKey,
          anchorGroup       : editorStartGroup,
          anchorOffset      : editorStartOffset,
          focusKey          : editorStartKey,
          focusGroup        : editorStartGroup,
          focusOffset       : editorStartOffset,
          selectionRecovery : true,
          selectionCollapsed: true,
        }));
      });
    }

    if ( id !== 'cover' && blocks.length === 1 ) {
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
    return;
  }

  if ( affactedLength === 0 && blockIndex > 0 ) {

    if ( id !== 'cover' && isText(block) && block.type !== 'unstyled' ) {
      block.type = 'unstyled';
      return Promise.resolve(onChange(id, clone)).then(_ => {
        return dispatch(api.setEditorState(root, {
          anchorKey         : editorStartKey,
          anchorGroup       : editorStartGroup,
          anchorOffset      : editorStartOffset,
          focusKey          : editorStartKey,
          focusGroup        : editorStartGroup,
          focusOffset       : editorStartOffset,
          selectionRecovery : true,
          selectionCollapsed: true,
        }));
      });
    }

    const targetBlock = clone.data.blocks[blockIndex - 1];
    const targetStartOffset = targetBlock.data.length;

    if ( isMedia(targetBlock) ) {

      if ( textLength === 0 ) {
        blocks.splice(blockIndex - 1, 2);

        const focusBlock = blocks[blockIndex - 2];

        const { recoveryGroup, recoveryOffset } = findRelativeOffset(
          focusBlock,
          focusBlock.data.length,
        );

        return Promise.resolve(onChange(id, clone)).then(_ => {
          return dispatch(api.setEditorState(root, {
            anchorKey         : focusBlock.key,
            anchorGroup       : recoveryGroup,
            anchorOffset      : recoveryOffset,
            focusKey          : focusBlock.key,
            focusGroup        : recoveryGroup,
            focusOffset       : recoveryOffset,
            selectionRecovery : true,
            selectionCollapsed: true,
          }));
        });
      } else {
        blocks.splice(blockIndex - 1, 1);
        return Promise.resolve(onChange(id, clone)).then(_ => {
          return dispatch(api.setEditorState(root, {
            anchorKey         : editorStartKey,
            anchorGroup       : editorStartGroup,
            anchorOffset      : editorStartOffset,
            focusKey          : editorStartKey,
            focusGroup        : editorStartGroup,
            focusOffset       : editorStartOffset,
            selectionRecovery : true,
            selectionCollapsed: true,
          }));
        });
      }
    }

    const mergeText = `${targetBlock.data}${block.data.substr(0, actualOffset - affactedLength)}${block.data.substr(actualOffset)}`;

    targetBlock.styles = (targetBlock.styles || [ ]);
    if ( Array.isArray(block.styles) ) {
      for ( const { offset, length, style } of block.styles ) {
        targetBlock.styles.push({ offset: offset + targetBlock.data.length, length, style });
      }
    }

    targetBlock.data = mergeText;
    targetBlock.styles = simplify(targetBlock);
    if ( isText(targetBlock) && mergeText.length === 0 && targetBlock.type !== 'unstyled' ) targetBlock.type = 'unstyled';

    const targetBlockStyleGroups = analyze(targetBlock);
    let recoveryGroup = 0, recoveryOffset = 0;
    for ( let i = 0, t = 0; i < targetBlockStyleGroups.length; i++ ) {
      const text = targetBlockStyleGroups[i];
      const start = t;
      const end = t + text.length;
      if ( targetStartOffset > start && targetStartOffset <= end ) {
        recoveryGroup = i;
        recoveryOffset = targetStartOffset - start;
        break;
      }
      t = end;
    }

    blocks[blockIndex - 1] = targetBlock;
    blocks.splice(blockIndex, 1);

    return Promise.resolve(onChange(id, clone)).then(_ => {
      return dispatch(api.setEditorState(root, {
        anchorKey         : targetBlock.key,
        anchorGroup       : `${recoveryGroup}`,
        anchorOffset      : recoveryOffset,
        focusKey          : targetBlock.key,
        focusGroup        : `${recoveryGroup}`,
        focusOffset       : recoveryOffset,
        selectionRecovery : true,
        selectionCollapsed: true,
      }));
    });
  }


  text = `${block.data.substr(0, actualOffset - affactedLength)}${block.data.substr(actualOffset)}`;
  styles = [ ];

  if ( Array.isArray(block.styles) ) {
    for ( const { length, offset, style } of block.styles ) {
      const from = offset;
      const to = from + length;
      const next = { length, offset, style };
      if ( actualOffset > from && actualOffset <= to ) {
        next.length -= affactedLength;
      } else if ( actualOffset <= from ) {
        next.offset -= affactedLength;
      }
      if ( next.length > 0 ) {
        styles.push(next);
      }
    }
  }

  block.data = text;
  block.styles = styles;

  shiftLeft && dispatch(api.setEditorState(root, {
    anchorKey         : editorStartKey,
    anchorGroup       : `${startOffsetGroup - 1}`,
    anchorOffset      : blockStyleGroups[startOffsetGroup - 1].length,
    focusKey          : editorStartKey,
    focusGroup        : `${startOffsetGroup - 1}`,
    focusOffset       : blockStyleGroups[startOffsetGroup - 1].length,
    selectionRecovery : true,
    selectionCollapsed: true,
  }));

  shiftHead && dispatch(api.setEditorState(root, {
    anchorKey         : editorStartKey,
    anchorGroup       : '0',
    anchorOffset      : 0,
    focusKey          : editorStartKey,
    focusGroup        : '0',
    focusOffset       : 0,
    selectionRecovery : true,
    selectionCollapsed: true,
  }));

  return onChange(id, clone);

}

