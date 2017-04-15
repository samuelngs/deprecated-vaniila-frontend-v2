
export default function onStyleNumberText(calculated) {

  const {
    blocks,

    startBlockIndex,
    endBlockIndex,

    isBlocksEqual,

  } = calculated;

  if ( isBlocksEqual ) {
    if ( blocks[startBlockIndex].type === 'ordered-list-item' ) {
      blocks[startBlockIndex].type = 'unstyled';
    } else {
      blocks[startBlockIndex].type = 'ordered-list-item';
    }
    return;
  }

  let allOrdered = true;
  for ( let i = startBlockIndex; i <= endBlockIndex; i++ ) {
    const { type } = blocks[i];
    if ( type !== 'ordered-list-item' ) {
      allOrdered = false;
      break;
    }
  }

  for ( let i = startBlockIndex; i <= endBlockIndex; i++ ) {
    blocks[i].type = allOrdered
      ? (
        blocks[i].type === 'ordered-list-item'
        ? 'unstyled'
        : 'ordered-list-item'
      )
      : 'ordered-list-item';
  }

}

