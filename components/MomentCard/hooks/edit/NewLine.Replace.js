
import UUID from 'uuid';

import { analyze } from '../../../MomentCardText/utils';
import deepClone from '../../../../utils/clone';
import { api } from '../../../../reducers/editor';

const blockTemplate = {
  key   : '',
  type  : 'text',
  data  : '',
  styles: [ ],
};

export default function onNewLineReplace() {

  const { moment, editorState } = this.props;

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

  // retrieve moment blocks
  const blocks = (clone && clone.data && clone.data.blocks) || [ ];

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

  console.log('new line replace', startBlock, endBlock);
}
