
import { analyze, migrateRemoveStyle } from '../../../MomentCardText/utils';
import { api } from '../../../../reducers/editor';
import deepClone from '../../../../utils/clone';

function hookTextDeleteWithinBlock(opts) {

  const {
    root,
    id,
    dispatch,
    onChange,
    clone,
    blocks,
    startGroup,
    endBlock,
    endGroup,
    endOffset,
    startOffset,
    startBlockIdx,
    startGroups,
    startOffsetGroup,
    editorStartKey,
    editorStartOffset,
    editorEndKey,
    editorEndOffset,
  } = opts;

  const { data } = endBlock;

  const begins = editorStartOffset > editorEndOffset ? editorEndOffset : editorStartOffset;
  const length = startGroup.length;

  const shiftLeft = begins === 1 && length === 1 && startOffsetGroup > 0;
  const shiftHead = begins === 1 && length === 1 && startOffsetGroup === 0;

  const start = startOffset >= endOffset ? endOffset : startOffset;
  const end = startOffset >= endOffset ? startOffset : endOffset;

  // select more than a single character / word
  const selections = start !== end;

  const text = selections
    ? `${data.substr(0, start)}${data.substr(end)}`
    : `${data.substr(0, start - 1)}${data.substr(start)}`;

  if ( data === text ) return;

  const style = migrateRemoveStyle(start, end, endBlock.styles);

  blocks[startBlockIdx].data = text;
  blocks[startBlockIdx].styles = style;
  clone.data || (clone.data = { });
  clone.data.blocks = blocks;
  clone.hash = `${Date.now()}`;

  shiftLeft && dispatch(api.setEditorState(root, {
    anchorKey         : editorStartKey,
    anchorGroup       : `${startOffsetGroup - 1}`,
    anchorOffset      : startGroups[startOffsetGroup - 1].length,
    focusKey          : editorEndKey,
    focusGroup        : `${startOffsetGroup - 1}`,
    focusOffset       : startGroups[startOffsetGroup - 1].length,
    selectionRecovery : true,
  }));

  shiftHead && dispatch(api.setEditorState(root, {
    anchorKey         : editorStartKey,
    anchorGroup       : '0',
    anchorOffset      : 0,
    focusKey          : editorEndKey,
    focusGroup        : '0',
    focusOffset       : 0,
    selectionRecovery : true,
  }));

  return onChange(id, clone);
}

/**
 * trigger when delete event within content area
 */
export function onTextDelete() {

  const {
    root,
    id,
    moment,
    onChange,
    editorState,
  } = this.props;

  const {
    store: { dispatch },
  } = this.context;

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

  const clone = { };
  deepClone(clone, moment);
  const blocks = (clone && clone.data && clone.data.blocks) || [ ];
  let startBlock, startBlockIdx, startGroups, endBlock, endBlockIdx, endGroups, singleBlock, singleSelection;

  for ( const [ i, b ] of blocks.entries() ) {
    if ( b.key === editorStartKey ) {
      startBlock = b;
      startBlockIdx = i;
      startGroups = analyze(b);
    }
    if ( b.key === editorEndKey ) {
      endBlock = b;
      endBlockIdx = i;
      endGroups = analyze(b);
    }
    if ( startBlock && endBlock ) break;
  }
  singleBlock = startBlock === endBlock;
  singleSelection = singleBlock && editorStartOffset === editorEndOffset;

  // valid anchor and focus block
  if ( !startBlock || !endBlock ) return;
  if ( typeof startGroups[startOffsetGroup] !== 'string' || typeof endGroups[endOffsetGroup] !== 'string' ) return;

  const startGroup = startGroups[startOffsetGroup];
  const startOffset = (() => {
    for ( let i = 0, c = 0; i < startOffsetGroup && i < startGroups.length; i++ ) {
      c += (startGroups[i] || '').length;
      if ( i + 1 === startOffsetGroup ) return c + editorStartOffset;
    }
    return editorStartOffset;
  })();

  const endGroup = endGroups[endOffsetGroup];
  const endOffset = (() => {
    for ( let i = 0, c = 0; i < endOffsetGroup && i < endGroups.length; i++ ) {
      c += (endGroups[i] || '').length;
      if ( i + 1 === endOffsetGroup ) return c + editorEndOffset;
    }
    return editorEndOffset;
  })();

  const opts = {
    root,
    id,
    clone,
    blocks,
    dispatch,
    onChange,
    editorStartKey,
    editorStartGroup,
    editorStartOffset,
    editorEndKey,
    editorEndGroup,
    editorEndOffset,
    startOffsetGroup,
    startBlock,
    startBlockIdx,
    startGroups,
    startGroup,
    startOffset,
    endOffsetGroup,
    endBlock,
    endBlockIdx,
    endGroups,
    endGroup,
    endOffset,
    singleBlock,
    singleSelection,
  };

  // single block selection remove
  if ( singleBlock ) {
    return hookTextDeleteWithinBlock.call(this, opts);
  }

}


