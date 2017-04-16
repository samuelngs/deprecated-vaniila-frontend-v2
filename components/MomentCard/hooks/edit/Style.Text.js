
import UUID from 'uuid';

import { analyze, simplify } from '../../../MomentCardText/utils';
import deepClone from '../../../../utils/clone';
import { api } from '../../../../reducers/editor';

import onStyleBulletText from './Style.Text.Bullet';
import onStyleNumberText from './Style.Text.Number';
import onStyleSimpleText from './Style.Text.Simple';

function findActualOffset(group, groups, offset) {
  for ( let i = 0, c = offset; i < group && i < groups.length; i++ ) {
    c += (groups[i] || '').length;
    if ( i + 1 === group ) return c;
  }
  return offset;
}

export default function onTextStyle(type) {

  const { moment, editorState, root, id, onChange } = this.props;
  const { store: { dispatch } } = this.context;

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

  // clone for moment state
  const clone = { };
  deepClone(clone, moment);

  clone.hash = `${Date.now()}`;
  clone.data = (clone.data || { });
  clone.data.blocks = (clone.data.blocks || [ ]);

  // retrieve moment blocks
  const blocks = clone.data.blocks;

  let startBlock,
      startBlockIndex,
      startStyleGroups,
      endBlock,
      endBlockIndex,
      endStyleGroups;

  for ( const [ i, b ] of blocks.entries() ) {
    if ( b.key === editorStartKey ) {
      startBlock = b;
      startBlockIndex = i;
      startStyleGroups = analyze(b);
    }
    if ( b.key === editorEndKey ) {
      endBlock = b;
      endBlockIndex = i;
      endStyleGroups = analyze(b);
    }
    if ( startBlock && endBlock ) break;
  }

  // if two selected blocks (position) are actually the same block
  const isBlocksEqual = startBlockIndex === endBlockIndex;

  // count affected blocks;
  // if start and end blocks are not the same block, deduct 1;
  const affactedBlocksCount = endBlockIndex - startBlockIndex - (!isBlocksEqual ? 1 : 0);

  const startStyleGroup = startStyleGroups[startOffsetGroup];
  const endStyleGroup = endStyleGroups[endOffsetGroup];

  if ( !startBlock || !endBlock || typeof startStyleGroup !== 'string' || typeof endStyleGroup !== 'string' ) return;

  const actualStartOffset = findActualOffset(startOffsetGroup, startStyleGroups, editorStartOffset);
  const actualEndOffset = findActualOffset(endOffsetGroup, endStyleGroups, editorEndOffset);

  const calculated = {
    clone,
    blocks,
    startBlock,
    startBlockIndex,
    startStyleGroups,
    endBlock,
    endBlockIndex,
    endStyleGroups,
    affactedBlocksCount,
    isBlocksEqual,
    actualStartOffset,
    actualEndOffset,
  };

  const defaultRecoveryPoint = {
    recoveryStartKey: editorStartKey,
    recoveryStartGroup: editorStartGroup,
    recoveryStartOffset: editorStartOffset,
    recoveryEndKey: editorEndKey,
    recoveryEndGroup: editorEndGroup,
    recoveryEndOffset: editorEndOffset,
  };

  let recoveryPoint;

  switch ( type ) {
    case 'unordered-list':
      recoveryPoint = { ...defaultRecoveryPoint, ...onStyleBulletText.call(this, calculated) }
      break;
    case 'ordered-list':
      recoveryPoint = { ...defaultRecoveryPoint, ...onStyleNumberText.call(this, calculated) }
      break;
    case 'bold':
      recoveryPoint = { ...defaultRecoveryPoint, ...onStyleSimpleText.call(this, calculated, 'BOLD') }
      break;
    case 'italic':
      recoveryPoint = { ...defaultRecoveryPoint, ...onStyleSimpleText.call(this, calculated, 'ITALIC') }
      break;
    case 'strikethrough':
      recoveryPoint = { ...defaultRecoveryPoint, ...onStyleSimpleText.call(this, calculated, 'STRIKETHROUGH') }
      break;
    default:
      recoveryPoint = defaultRecoveryPoint;
      break;
  }

  return Promise.resolve(onChange(id, clone)).then(_ => {
    return dispatch(api.setEditorState(root, {
      anchorKey         : recoveryPoint.recoveryStartKey,
      anchorGroup       : `${recoveryPoint.recoveryStartGroup}`,
      anchorOffset      : recoveryPoint.recoveryStartOffset,
      focusKey          : recoveryPoint.recoveryEndKey,
      focusGroup        : `${recoveryPoint.recoveryEndGroup}`,
      focusOffset       : recoveryPoint.recoveryEndOffset,
      selectionRecovery : true,
    }));
  });

}

