
import { analyze } from '../../../MomentCardText/utils';
import { api } from '../../../../reducers/editor';
import deepClone from '../../../../utils/clone';

function findActualOffset(group, groups, offset) {
  for ( let i = 0, c = offset; i < group && i < groups.length; i++ ) {
    c += (groups[i] || '').length;
    if ( i + 1 === group ) return c;
  }
  return offset;
}

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

  const text = `${block.data.substr(0, actualOffset - affactedLength)}${block.data.substr(actualOffset)}`;
  const styles = [ ];

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
  }));

  shiftHead && dispatch(api.setEditorState(root, {
    anchorKey         : editorStartKey,
    anchorGroup       : '0',
    anchorOffset      : 0,
    focusKey          : editorStartKey,
    focusGroup        : '0',
    focusOffset       : 0,
    selectionRecovery : true,
  }));

  return onChange(id, clone);
}

