
function insertMigrateTextStyle(character, pos, prevStyles) {

  if ( !prevStyles ) return prevStyles;
  if ( !Array.isArray(prevStyles) ) return undefined;

  const styles = [ ];
  for ( const { length, offset, style } of prevStyles ) {
    const start = offset;
    const end = start + length;
    const next = { length, offset, style };
    if ( pos > start && pos <= end ) {
      next.length += character.length;
    } else if ( pos <= start ) {
      next.offset += character.length;
    }
    styles.push(next);
  }
  return styles;
}

function removeMigrateTextStyle(start, end, prevStyles) {

  if ( !prevStyles ) return prevStyles;
  if ( !Array.isArray(prevStyles) ) return undefined;

  const styles = [ ];
  const len = end - start + 1;
  for ( const { length, offset, style } of prevStyles ) {
    const from = offset;
    const to = from + length;
    const next = { length, offset, style };
    if ( start < from && end >= to ) {
      continue;
    }
    if ( start > from && end <= to ) {
      next.length -= len;
    } else if ( start <= from ) {
      next.offset -= len;
    }
    if ( next.length > 0 ) {
      styles.push(next);
    }
  }
  return styles;
}

function getTextStyle(style) {
  if ( !style || !Array.isArray(style) ) return null;
  let o;
  style.forEach(rule => {
    if ( !o ) o = { };
    if ( typeof rule !== 'string' ) return;
    const parts = rule.split(':');
    switch ( parts[0] ) {
      case 'ITALIC':
        o['fontStyle'] = 'italic';
        break;
      case 'UNDERLINE':
        o['textDecoration'] = ((o['textDecoration'] || '') + ' underline').trim();
        break;
      case 'STRIKETHROUGH':
        o['textDecoration'] = ((o['textDecoration'] || '') + ' line-through').trim();
        break;
      case 'COLOR':
        o['color'] = parts[1];
        break;
    }
  });
  return o;
}

function getTextCollection(block) {
  const { data: text, styles: ranges } = block;
  if ( !Array.isArray(ranges) || ranges.length === 0 || !text ) {
    return [ { text } ];
  }
  const styles = Array(text.length);
  for ( const { length, offset, style } of ranges ) {
    if ( typeof length !== 'number' || typeof offset !== 'number' || typeof style !== 'string' ) continue;
    let pos = offset;
    while ( pos < offset + length && pos < styles.length ) {
      if ( !styles[pos] ) {
        styles[pos] = [ style ];
      } else {
        styles[pos].push(style);
      }
      pos++;
    }
  }
  const groups = [ ];
  let cache = styles[0];
  for ( const [ i, style ] of styles.entries() ) {
    const group = groups[groups.length - 1];
    const character = text[i];
    if ( i === 0 ) {
      groups.push({ text: character, style: getTextStyle(style) });
      cache = style;
      continue;
    }
    let equal = style === cache;
    if ( Array.isArray(cache) && Array.isArray(style) ) {
      if ( cache.length !== style.length ) {
        equal = false;
      } else {
        equal = true;
        for ( let j = 0; j < style.length; j++ ) {
          if ( cache[j] !== style[j] && equal ) {
            equal = false;
            break;
          }
        }
      }
    }
    if ( equal ) {
      group.text += character;
    } else {
      groups.push({ text: character, style: getTextStyle(style) });
    }
    cache = style;
  }
  return groups;
}

function getTextGroups(block) {
  const { data: text, styles: ranges } = block;
  if ( !Array.isArray(ranges) || ranges.length === 0 ) {
    return [ text ];
  }
  if ( !text ) {
    return [ (text || '') ];
  }
  const styles = Array(text.length);
  for ( const { length, offset, style } of ranges ) {
    if ( typeof length !== 'number' || typeof offset !== 'number' || typeof style !== 'string' ) continue;
    let pos = offset;
    while ( pos < offset + length && pos < styles.length ) {
      if ( !styles[pos] ) {
        styles[pos] = [ style ];
      } else {
        styles[pos].push(style);
      }
      pos++;
    }
  }
  const groups = [ ];
  let cache = styles[0];
  for ( const [ i, style ] of styles.entries() ) {
    const character = text[i];
    if ( i === 0 ) {
      groups.push(character);
      cache = style;
      continue;
    }
    let equal = style === cache;
    if ( Array.isArray(cache) && Array.isArray(style) ) {
      if ( cache.length !== style.length ) {
        equal = false;
      } else {
        equal = true;
        for ( let j = 0; j < style.length; j++ ) {
          if ( cache[j] !== style[j] && equal ) {
            equal = false;
            break;
          }
        }
      }
    }
    if ( equal ) {
      groups[groups.length - 1] += character
    } else {
      groups.push(character);
    }
    cache = style;
  }
  return groups;
}

export function collection(block) {
  return getTextCollection(block);
}

export function analyze(block) {
  return getTextGroups(block);
}

export function migrateInsertStyle(character, offset, style) {
  return insertMigrateTextStyle(character, offset, style);
}

export function migrateRemoveStyle(start, end, style) {
  return removeMigrateTextStyle(start, end, style);
}

