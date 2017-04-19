
import UUID from 'uuid';

import { api as filesReducerApi } from '../../../../reducers/file';
import { api as editorReducerApi } from '../../../../reducers/editor';
import deepClone from '../../../../utils/clone';

import { isText } from '../../types';

import {
  image as imageBlockTemplate,
  text as textBlockTemplate,
} from '../../template';

/**
 * trigger when upload event within content area
 */
export default function onImageInsert(blob) {

  const { moment, editorState, root, id, onChange } = this.props;
  const { store: { dispatch, getState } } = this.context;

  const {
    editorEndKey,
    editorEndGroup,
    editorEndOffset,
  } = editorState;

  // retrieve focus offset group id
  // valid offset group should be number
  let endOffsetGroup = Number(editorEndGroup);
  if ( isNaN(endOffsetGroup) ) endOffsetGroup = 0;

  // clone for moment state
  const clone = { };
  deepClone(clone, moment);

  clone.hash = `${Date.now()}`;
  clone.data = (clone.data || { });
  clone.data.blocks = (clone.data.blocks || [ ]);

  // retrieve moment blocks
  const blocks = clone.data.blocks;

  let blockIndex,
      blockStyleGroups;

  for ( const [ i, b ] of blocks.entries() ) {
    if ( b.key === editorEndKey ) {
      blockIndex = i;
      break;
    }
  }

  if ( typeof blockIndex === 'undefined' ) return;

  const addTextBlockAfterImage = !(
    typeof blocks[blockIndex + 1] === 'object' &&
    blocks[blockIndex + 1] !== null &&
    isText(blocks[blockIndex + 1])
  );

  const newImageBlock = { ...imageBlockTemplate, key: UUID.v4() };
  const newTextBlock = { ...textBlockTemplate, key: UUID.v4() };

  return dispatch(filesReducerApi.upload(blob)).then(file => {

    if ( file.url ) {
      newImageBlock.data = file.url;
    } else {
      newImageBlock.data = `local:${file.name}`;
    }

    if ( addTextBlockAfterImage ) {
      blocks.splice(blockIndex + 1, 0, newImageBlock, newTextBlock);
    } else {
      blocks.splice(blockIndex + 1, 0, newImageBlock);
    }

    const target = addTextBlockAfterImage ? newTextBlock : blocks[blockIndex + 2];

    Promise.resolve(onChange(id, clone)).then(_ => {
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

  });
}
