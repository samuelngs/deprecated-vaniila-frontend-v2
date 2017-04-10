
import { analyze, migrateRemoveStyle } from '../../../MomentCardText/utils';
import deepClone from '../../../../utils/clone';

function hookTextDeleteWithinBlock({ focusBlock, focusOffset, anchorOffset, anchorBlockIdx, clone, blocks, id, onChange }) {

  const { data } = focusBlock;

  const start = anchorOffset >= focusOffset ? focusOffset : anchorOffset;
  const end = anchorOffset >= focusOffset ? anchorOffset : focusOffset;

  // select more than a single character / word
  const selections = start !== end;

  const text = selections
    ? `${data.substr(0, start)}${data.substr(end)}`
    : `${data.substr(0, start - 1)}${data.substr(start)}`;

  const style = migrateRemoveStyle(start, end, focusBlock.styles);

  blocks[anchorBlockIdx].data = text;
  blocks[anchorBlockIdx].styles = style;
  clone.data || (clone.data = { });
  clone.data.blocks = blocks;
  clone.hash = `${Date.now()}`;

  return onChange(id, clone);
}

/**
 * trigger when delete event within content area
 */
export function onTextDelete() {

  const {
    id,
    moment,
    onChange,
  } = this.props;

  const {
    contentAnchorOffsetKey,
    contentAnchorOffsetGroup,
    contentAnchorOffset,
    contentFocusOffsetKey,
    contentFocusOffsetGroup,
    contentFocusOffset,
  } = this.state;

  // retrieve anchor and focus offset group id
  // valid offset group should be number
  let anchorOffsetGroup = Number(contentAnchorOffsetGroup);
  let focusOffsetGroup = Number(contentFocusOffsetGroup);

  if ( isNaN(anchorOffsetGroup) ) anchorOffsetGroup = 0;
  if ( isNaN(focusOffsetGroup) ) focusOffsetGroup = 0;

  const clone = { };
  deepClone(clone, moment);
  const blocks = (clone && clone.data && clone.data.blocks) || [ ];
  let anchorBlock, anchorBlockIdx, anchorGroups, focusBlock, focusBlockIdx, focusGroups, singleBlock, singleSelection;

  for ( const [ i, b ] of blocks.entries() ) {
    if ( b.key === contentAnchorOffsetKey ) {
      anchorBlock = b;
      anchorBlockIdx = i;
      anchorGroups = analyze(b);
    }
    if ( b.key === contentFocusOffsetKey ) {
      focusBlock = b;
      focusBlockIdx = i;
      focusGroups = analyze(b);
    }
    if ( anchorBlock && focusBlock ) break;
  }
  singleBlock = anchorBlock === focusBlock;
  singleSelection = singleBlock && contentAnchorOffset === contentFocusOffset;

  // valid anchor and focus block
  if ( !anchorBlock || !focusBlock ) return;
  if ( typeof anchorGroups[anchorOffsetGroup] !== 'string' || typeof focusGroups[focusOffsetGroup] !== 'string' ) return;

  const anchorGroup = anchorGroups[anchorOffsetGroup];
  const anchorOffset = (() => {
    for ( let i = 0, c = 0; i < anchorOffsetGroup && i < anchorGroups.length; i++ ) {
      c += (anchorGroups[i] || '').length;
      if ( i + 1 === anchorOffsetGroup ) return c + contentAnchorOffset;
    }
    return contentAnchorOffset;
  })();

  const focusGroup = focusGroups[focusOffsetGroup];
  const focusOffset = (() => {
    for ( let i = 0, c = 0; i < focusOffsetGroup && i < focusGroups.length; i++ ) {
      c += (focusGroups[i] || '').length;
      if ( i + 1 === focusOffsetGroup ) return c + contentFocusOffset;
    }
    return contentFocusOffset;
  })();

  const opts = {
    id,
    clone,
    blocks,
    onChange,
    contentAnchorOffsetKey,
    contentAnchorOffsetGroup,
    contentAnchorOffset,
    contentFocusOffsetKey,
    contentFocusOffsetGroup,
    contentFocusOffset,
    anchorBlock,
    anchorBlockIdx,
    anchorGroups,
    anchorGroup,
    anchorOffset,
    focusBlock,
    focusBlockIdx,
    focusGroups,
    focusGroup,
    focusOffset,
    singleBlock,
    singleSelection,
  };

  // single block selection remove
  if ( singleBlock ) {
    return hookTextDeleteWithinBlock.call(this, opts);
  }

}


