
import { analyze } from '../../../MomentCardText/utils';
import deepClone from '../../../../utils/clone';

function findActualOffset(group, groups, offset) {
  for ( let i = 0, c = offset; i < group && i < groups.length; i++ ) {
    c += (groups[i] || '').length;
    if ( i + 1 === group ) return c;
  }
  return offset;
}

/**
 * trigger when input event within content area
 */
export default function onTextInsertCollapsed(character) {

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

  const text = `${block.data.substr(0, actualOffset)}${character}${block.data.substr(actualOffset)}`;
  const styles = [ ];

  if ( Array.isArray(block.styles) ) {
    const extendHead = actualOffset === 0;
    for ( const { length, offset, style } of block.styles ) {
      const start = offset;
      const end = start + length;
      const next = { length, offset, style };
      if ( actualOffset > start && actualOffset <= end ) {
        next.length += character.length;
      } else if ( actualOffset <= start ) {
        if ( extendHead && offset === 0 ) {
          next.length += character.length;
        } else {
          next.offset += character.length;
        }
      }
      styles.push(next);
    }
  }

  block.data = text;
  block.styles = styles;

  return onChange(id, clone);
}


