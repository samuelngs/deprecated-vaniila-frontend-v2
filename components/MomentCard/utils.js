
import { analyze } from '../MomentCardText/utils';

export function findActualOffset(group, groups, offset) {
  for ( let i = 0, c = offset; i < group && i < groups.length; i++ ) {
    c += (groups[i] || '').length;
    if ( i + 1 === group ) return c;
  }
  return offset;
}

export function findRelativeOffset(block, offset) {
  const groups = analyze(block);
  let recoveryGroup = 0, recoveryOffset = 0;
  for ( let i = 0, t = 0; i < groups.length; i++ ) {
    const text = groups[i];
    const start = t;
    const end = t + text.length;
    if ( offset > start && offset <= end ) {
      recoveryGroup = i;
      recoveryOffset = offset - start;
      break;
    }
    t = end;
  }
  return {
    recoveryGroup,
    recoveryOffset,
  };
}
