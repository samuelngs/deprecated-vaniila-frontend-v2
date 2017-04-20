
import { analyze, simplify } from '../../../MomentCardText/utils';
import { isText } from '../../types';

function findSingleRecoveryPoint(block, actualStartOffset, actualEndOffset) {

  const recoveryPoint = {
    recoveryStartKey: block.key,
    recoveryStartGroup: 0,
    recoveryStartOffset: 0,
    recoveryEndKey: block.key,
    recoveryEndGroup: 0,
    recoveryEndOffset: 0,
  };

  const styleGroups = analyze(block);

  let foundStart, foundEnd;
  for ( let i = 0, t = 0; i < styleGroups.length; i++ ) {
    const text = styleGroups[i];
    const start = t;
    const end = t + text.length;
    if ( actualStartOffset > start && actualStartOffset <= end ) {
      recoveryPoint.recoveryStartGroup = i;
      recoveryPoint.recoveryStartOffset = actualStartOffset - start;
      foundStart = true;
    }
    if ( actualEndOffset > start && actualEndOffset <= end ) {
      recoveryPoint.recoveryEndGroup = i;
      recoveryPoint.recoveryEndOffset = actualEndOffset - start;
      foundEnd = true;
    }
    if ( foundStart && foundEnd ) {
      break;
    }
    t = end;
  }

  return recoveryPoint;
}

function findMultipleRecoveryPoint(startBlock, endBlock, actualStartOffset, actualEndOffset) {

  const recoveryPoint = {
    recoveryStartKey: startBlock.key,
    recoveryStartGroup: 0,
    recoveryStartOffset: 0,
    recoveryEndKey: endBlock.key,
    recoveryEndGroup: 0,
    recoveryEndOffset: 0,
  };

  const startStyleGroups = analyze(startBlock);
  const endStyleGroups = analyze(endBlock);

  for ( let i = 0, t = 0; i < startStyleGroups.length; i++ ) {
    const text = startStyleGroups[i];
    const start = t;
    const end = t + text.length;
    if ( actualStartOffset > start && actualStartOffset <= end ) {
      recoveryPoint.recoveryStartGroup = i;
      recoveryPoint.recoveryStartOffset = actualStartOffset - start;
    }
    t = end;
  }

  for ( let i = 0, t = 0; i < endStyleGroups.length; i++ ) {
    const text = endStyleGroups[i];
    const start = t;
    const end = t + text.length;
    if ( actualEndOffset > start && actualEndOffset <= end ) {
      recoveryPoint.recoveryEndGroup = i;
      recoveryPoint.recoveryEndOffset = actualEndOffset - start;
    }
    t = end;
  }

  return recoveryPoint;
}

export default function onStyleTextHelper(calculated, STYLE_NAME) {

  const {
    blocks,

    startBlock,
    startBlockIndex,
    endBlock,
    endBlockIndex,

    actualStartOffset,
    actualEndOffset,

    isBlocksEqual,

  } = calculated;

  if ( isBlocksEqual ) {

    if ( !isText(startBlock) ) return;

    let matches = false;
    let distance = actualEndOffset - actualStartOffset;

    startBlock.styles = simplify(startBlock);

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
      startBlock.styles.push({ offset: actualStartOffset, length: actualEndOffset - actualStartOffset, style: STYLE_NAME });
    }

    startBlock.styles = simplify(startBlock);

    return findSingleRecoveryPoint(
      startBlock,
      actualStartOffset,
      actualEndOffset,
    );
  }

  startBlock.styles = simplify(startBlock);
  endBlock.styles = simplify(endBlock);

  let matchesAll = true;
  let foundStyle = false;

  if ( isText(startBlock) ) {
    for ( let i = 0, t = startBlock.data.length; i < startBlock.styles.length; i++ ) {
      const { offset, length, style } = startBlock.styles[i];
      if ( style !== STYLE_NAME ) continue;
      const start = offset;
      const end = offset + length;
      const matches = actualStartOffset === start && t === end;
      if ( !matches ) matchesAll = false;
      if ( !foundStyle ) foundStyle = true;
    }
  }

  if ( isText(endBlock) && matchesAll ) {
    for ( let i = 0, t = 0; i < endBlock.styles.length; i++ ) {
      const { offset, length, style } = endBlock.styles[i];
      if ( style !== STYLE_NAME ) continue;
      const start = offset;
      const end = offset + length;
      const matches = t === start && actualEndOffset === end;
      if ( !matches ) matchesAll = false;
      if ( !foundStyle ) foundStyle = true;
    }
  }

  if ( matchesAll ) {
    for ( let i = startBlockIndex + 1; matchesAll && i < endBlockIndex; i++ ) {
      const { type, data, styles } = blocks[i];
      if ( !isText(type) ) continue;
      if ( data.length === 0 ) continue;
      if ( styles.length === 0 ) {
        matchesAll = false;
        break;
      }
      for ( let y = 0; y < matchesAll && styles.length; y++ ) {
        const { offset, length, style } = styles[y];
        if ( style !== STYLE_NAME ) continue;
        const start = offset;
        const end = offset + length;
        const matches = start === 0 && end === data.length;
        if ( !matches) {
          matchesAll = false;
          break;
        }
        if ( !foundStyle ) foundStyle = true;
      }
    }
  }

  if ( matchesAll && foundStyle ) {

    if ( isText(startBlock) ) {
      for ( let i = 0; i < startBlock.styles.length; i++ ) {
        const { offset, length, style } = startBlock.styles[i];
        if ( style !== STYLE_NAME ) continue;
        if ( offset === actualStartOffset && length === ( startBlock.data.length - actualStartOffset ) ) startBlock.styles[i] = { };
      }
      startBlock.styles = simplify(startBlock);
    }

    for ( let i = startBlockIndex + 1; i < endBlockIndex; i++ ) {
      const { type, data, styles } = blocks[i];
      if ( !isText(type) ) continue;
      for ( let y = 0; y < styles.length; y++ ) {
        const { offset, length, style } = styles[y];
        if ( style !== STYLE_NAME ) continue;
        if ( offset === 0 && length === data.length ) styles[y] = { };
      }
      blocks[i].styles = simplify(blocks[i]);
    }

    if ( isText(endBlock) ) {
      for ( let i = 0; i < endBlock.styles.length; i++ ) {
        const { offset, length, style } = endBlock.styles[i];
        if ( style !== STYLE_NAME ) continue;
        if ( offset === 0 && length == actualEndOffset ) endBlock.styles[i] = { };
      }
      endBlock.styles = simplify(endBlock);
    }

  } else {

    if ( isText(startBlock) ) {
      startBlock.styles.unshift({ offset: actualStartOffset, length: startBlock.data.length - actualStartOffset, style: STYLE_NAME });
      startBlock.styles = simplify(startBlock);
    }

    for ( let i = startBlockIndex + 1; i < endBlockIndex; i++ ) {
      if ( !isText(blocks[i]) ) continue;
      blocks[i].styles.unshift({ offset: 0, length: blocks[i].data.length, style: STYLE_NAME });
      blocks[i].styles = simplify(blocks[i]);
    }

    if ( isText(endBlock) ) {
      endBlock.styles.unshift({ offset: 0, length: actualEndOffset, style: STYLE_NAME });
      endBlock.styles = simplify(endBlock);
    }

  }

  return findMultipleRecoveryPoint(startBlock, endBlock, actualStartOffset, actualEndOffset);
}
