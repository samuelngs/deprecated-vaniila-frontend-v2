
import UUID from 'uuid';

import { analyze } from '../../../MomentCardText/utils';
import { api as editorReducerApi } from '../../../../reducers/editor';
import deepClone from '../../../../utils/clone';
import parse from './Parse';

import { findActualOffset } from '../../utils';
import { isText } from '../../types';

import {
  media as mediaBlockTemplate,
  text as textBlockTemplate,
} from '../../template';

/**
 * trigger when input event within content area
 */
export default function onTextInsertCollapsed(data) {

  const character = data.replace(/(\r\n|\n|\r)/gm, '');

  const embed = character.length > 1
    ? parse(character)
    : null;

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

  if ( embed ) {

    const { type, data } = embed;

    const addTextBlockAfterMedia = !(
      typeof blocks[blockIndex + 1] === 'object' &&
      blocks[blockIndex + 1] !== null &&
      isText(blocks[blockIndex + 1])
    );

    const newMediaBlock = { ...mediaBlockTemplate, key: UUID.v4(), type, data };
    const newTextBlock = addTextBlockAfterMedia
      ? { ...textBlockTemplate, key: UUID.v4() }
      : null;

    if ( addTextBlockAfterMedia ) {
      blocks.splice(blockIndex + 1, 0, newMediaBlock, newTextBlock);
    } else {
      blocks.splice(blockIndex + 1, 0, newMediaBlock);
    }

    const target = addTextBlockAfterMedia
      ? newTextBlock
      : blocks[blockIndex + 2];

    return Promise.resolve(onChange(id, clone)).then(_ => {
      return dispatch(editorReducerApi.setEditorState(root, {
        anchorKey         : target.key,
        anchorGroup       : '0',
        anchorOffset      : 0,
        focusKey          : target.key,
        focusGroup        : '0',
        focusOffset       : 0,
        selectionRecovery : true,
      }));
    });
  }

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


