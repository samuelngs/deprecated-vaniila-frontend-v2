
import { simplify } from '../../../MomentCardText/utils';

const STYLE_NAME = 'BOLD';

export default function onStyleBoldText(calculated) {

  const {
    blocks,

    startBlock,
    startBlockIndex,
    endBlockIndex,

    actualStartOffset,
    actualEndOffset,

    isBlocksEqual,

  } = calculated;

  if ( isBlocksEqual ) {

    startBlock.styles = simplify(startBlock);

    let matches = false;
    let distance = actualEndOffset - actualStartOffset;

    for ( let i = 0; i < startBlock.styles.length; i++ ) {

      const { offset, length, style } = startBlock.styles[i];
      if ( style !== STYLE_NAME ) continue;

      const start = offset;
      const end = offset + length;

      if ( actualStartOffset === start && actualEndOffset === end ) {
        startBlock.styles[i] = { };
        matches = true;
      } else if ( actualStartOffset >= start && actualEndOffset <= end ) {
        if ( actualStartOffset === start ) {
          startBlock.styles[i].offset += distance;
          startBlock.styles[i].length -= distance;
        } else if ( actualEndOffset === end ) {
          startBlock.styles[i].length -= distance;
        } else {
          startBlock.styles[i].length = actualStartOffset - start;
          startBlock.styles.splice(i + 1, 0, { offset: actualEndOffset, length: end - actualEndOffset, style: style });
        }
        matches = true;
      }
    }
    if ( !matches ) {
      startBlock.styles.push({ offset: actualStartOffset, length: actualEndOffset - actualStartOffset, style: 'BOLD' });
    }

    startBlock.styles = simplify(startBlock);
    return;
  }

}

