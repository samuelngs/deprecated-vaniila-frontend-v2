
export default function onStyleTextBlock(calculated, TYPE_NAME) {

  const {
    blocks,

    startBlockIndex,
    endBlockIndex,

    isBlocksEqual,

  } = calculated;

  if ( isBlocksEqual ) {
    if ( blocks[startBlockIndex].type === TYPE_NAME ) {
      blocks[startBlockIndex].type = 'unstyled';
    } else {
      blocks[startBlockIndex].type = TYPE_NAME;
    }
    return;
  }

  let allOrdered = true;
  for ( let i = startBlockIndex; i <= endBlockIndex; i++ ) {
    const { type } = blocks[i];
    if ( type !== TYPE_NAME ) {
      allOrdered = false;
      break;
    }
  }

  for ( let i = startBlockIndex; i <= endBlockIndex; i++ ) {
    blocks[i].type = allOrdered
      ? (
        blocks[i].type === TYPE_NAME
        ? 'unstyled'
        : TYPE_NAME
      )
      : TYPE_NAME;
  }

}


