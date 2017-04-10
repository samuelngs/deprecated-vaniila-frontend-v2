
import { analyze, migrateInsertStyle } from '../../../MomentCardText/utils';
import deepClone from '../../../../utils/clone';

/**
 * trigger when input event within content area
 */
export function onTextInsert(character) {

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

  // single selection
  if ( singleSelection ) {
    const text = `${anchorBlock.data.substr(0, anchorOffset)}${character}${anchorBlock.data.substr(anchorOffset)}`;
    const style = migrateInsertStyle(character, anchorOffset, anchorBlock.styles);
    blocks[anchorBlockIdx].data = text;
    blocks[anchorBlockIdx].styles = style;
    clone.data || (clone.data = { });
    clone.data.blocks = blocks;
    clone.hash = `${Date.now()}`;
    return onChange(id, clone);
  }

  const focusGroup = focusGroups[focusOffsetGroup];
  const focusOffset = (() => {
    for ( let i = 0, c = 0; i < focusOffsetGroup && i < focusGroups.length; i++ ) {
      c += (focusGroups[i] || '').length;
      if ( i + 1 === focusOffsetGroup ) return c + contentFocusOffset;
    }
    return contentFocusOffset;
  })();

  // replace word here

}

