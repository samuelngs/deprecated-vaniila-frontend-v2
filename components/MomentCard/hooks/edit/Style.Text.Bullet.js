
export default function onStyleBulletText(calculated) {

  const {
    blocks,

    startBlockIndex,
    endBlockIndex,

    isBlocksEqual,

  } = calculated;

  if ( isBlocksEqual ) {
    if ( blocks[startBlockIndex].type === 'unordered-list-item' ) {
      blocks[startBlockIndex].type = 'unstyled';
    } else {
      blocks[startBlockIndex].type = 'unordered-list-item';
    }
    return;
  }

  let allUnordered = true;
  for ( let i = startBlockIndex; i <= endBlockIndex; i++ ) {
    const { type } = blocks[i];
    if ( type !== 'unordered-list-item' ) {
      allUnordered = false;
      break;
    }
  }

  for ( let i = startBlockIndex; i <= endBlockIndex; i++ ) {
    blocks[i].type = allUnordered
      ? (
        blocks[i].type === 'unordered-list-item'
        ? 'unstyled'
        : 'unordered-list-item'
      )
      : 'unordered-list-item';
  }

}
