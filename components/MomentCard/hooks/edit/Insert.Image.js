
import UUID from 'uuid';

import { api as filesReducerApi } from '../../../../reducers/file';
import { api as editorReducerApi } from '../../../../reducers/editor';
import deepClone from '../../../../utils/clone';

import { isText } from '../../types';

import {
  media as mediaBlockTemplate,
  text as textBlockTemplate,
} from '../../template';

/**
 * trigger when upload event within content area
 */
export default function onImageInsert(blob) {

  const { moment, editorState, root, id, onChange, onProgress } = this.props;
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

  const { dimensions: { width, height } } = blob;

  const shouldFullscreen = (
    blocks.length === 1 &&
    typeof blocks[0] === 'object' &&
    blocks[0] !== null &&
    isText(blocks[0]) &&
    blocks[0].data.length === 0 &&
    (
      width >= 300 ||
      height >= 300
    )
  );

  const addTextBlockAfterImage = !(
    typeof blocks[blockIndex + 1] === 'object' &&
    blocks[blockIndex + 1] !== null &&
    isText(blocks[blockIndex + 1])
  );

  const newImageBlock = { ...mediaBlockTemplate, type: 'image', key: UUID.v4() };
  const newTextBlock = { ...textBlockTemplate, key: UUID.v4() };

  if ( shouldFullscreen ) {
    clone.parent = newImageBlock.key;
  }

  const progress = state => {
    const { name, type, progress, error } = state;
    const update = {
      name,
      type,
      progress,
    };
    if ( error ) update.error = error;
    onProgress(id, update);
  }

  const callback = state => {

    const { present: doc } = getState().editorHistories[root];
    if ( !doc ) return;

    doc.data = (doc.data || { });
    doc.data.slides = (doc.data.slides || { });

    const moment = doc.data.slides[id];
    if ( !moment ) return;

    const clone = { };
    deepClone(clone, moment);

    clone.hash = `${Date.now()}`;
    clone.data = (clone.data || { });
    clone.data.blocks = (clone.data.blocks || [ ]);

    let imageBlock, imageBlockIdx;
    for ( let i = 0; i < clone.data.blocks.length; i++ ) {
      const block = clone.data.blocks[i];
      if ( block.key === newImageBlock.key ) {
        imageBlock = block;
        imageBlockIdx = i;
      }
    }

    if ( !imageBlock ) return;

    if ( state.error ) {
      blocks.splice(imageBlockIdx, 1);
    } else {
      imageBlock.data = state.url;
    }

    onChange(id, clone);
  }

  return dispatch(filesReducerApi.upload(blob, callback, progress)).then(file => {

    if ( file.url ) {
      newImageBlock.data = file.url;
    } else {
      newImageBlock.data = `local:${file.name}`;
    }

    if ( shouldFullscreen ) {
      clone.data.blocks = [ newImageBlock ];
    } else {
      if ( addTextBlockAfterImage ) {
        blocks.splice(blockIndex + 1, 0, newImageBlock, newTextBlock);
      } else {
        blocks.splice(blockIndex + 1, 0, newImageBlock);
      }
    }

    const target = shouldFullscreen
      ? newImageBlock
      : (
        addTextBlockAfterImage
        ? newTextBlock
        : blocks[blockIndex + 2]
      );

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
