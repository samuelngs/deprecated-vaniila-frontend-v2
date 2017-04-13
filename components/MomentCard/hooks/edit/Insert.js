
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
    editorState,
  } = this.props;

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
  let anchorBlock, anchorBlockIdx, anchorGroups, focusBlock, focusBlockIdx, focusGroups, singleBlock, singleSelection;

  for ( const [ i, b ] of blocks.entries() ) {
    if ( b.key === editorStartKey ) {
      anchorBlock = b;
      anchorBlockIdx = i;
      anchorGroups = analyze(b);
    }
    if ( b.key === editorEndKey ) {
      focusBlock = b;
      focusBlockIdx = i;
      focusGroups = analyze(b);
    }
    if ( anchorBlock && focusBlock ) break;
  }
  singleBlock = anchorBlock === focusBlock;
  singleSelection = singleBlock && editorStartOffset === editorEndOffset;

  // valid anchor and focus block
  if ( !anchorBlock || !focusBlock ) return;
  if ( typeof anchorGroups[startOffsetGroup] !== 'string' || typeof focusGroups[endOffsetGroup] !== 'string' ) return;

  const anchorGroup = anchorGroups[startOffsetGroup];
  const anchorOffset = (() => {
    for ( let i = 0, c = 0; i < startOffsetGroup && i < anchorGroups.length; i++ ) {
      c += (anchorGroups[i] || '').length;
      if ( i + 1 === startOffsetGroup ) return c + editorStartOffset;
    }
    return editorStartOffset;
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

  const focusGroup = focusGroups[endOffsetGroup];
  const focusOffset = (() => {
    for ( let i = 0, c = 0; i < endOffsetGroup && i < focusGroups.length; i++ ) {
      c += (focusGroups[i] || '').length;
      if ( i + 1 === endOffsetGroup ) return c + editorEndOffset;
    }
    return editorEndOffset;
  })();

  // replace word here

}

