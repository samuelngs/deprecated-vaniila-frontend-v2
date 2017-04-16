
const blockTypeWhiteList = [
  'unordered-list-item',
  'ordered-list-item',
  'unstyled',
];

function getSimplifiedStyle(block) {

  const clone = Array.isArray(block.styles) ? [ ...block.styles ] : [ ];
  const data = block.data || '';
  clone.sort((a, b) => a.offset - b.offset);

  let styles = [ ];
  const refs = { };

  if ( blockTypeWhiteList.indexOf(block.type) === -1 ) {
    return styles;
  }

  if ( Array.isArray(clone) ) {
    for ( const [ i, { offset, length, style } ] of clone.entries() ) {
      if ( !style ) continue;
      if ( length < 0 || offset + length > data.length ) continue;
      if ( offset < 0 || offset > data.length ) continue;
      refs[style] = (refs[style] || [ ]);
      refs[style].push(i);
    }
  }

  for ( const ref in refs ) {
    const idxs = refs[ref];

    // handle unique styles
    if ( idxs.length === 1 ) {
      styles.push(clone[idxs[0]]);
      continue;
    }

    // handle repeated styles

    let min = -10000;
    const ranges = [ ];

    for ( const ref of idxs ) {
      const { offset, length, style } = clone[ref];
      const start = offset;
      const end = offset + length;
      if ( start > min ) {
        ranges.push({ offset, length, style });
      } else if ( start <= min ) {
        let latest = ranges[ranges.length - 1];
        if ( latest && end > ( latest.offset + latest.length ) ) {
          latest.length += ( end - ( latest.offset + latest.length ) );
        }
      }
      min = end;
    }

    styles = styles.concat(ranges);
  }

  styles.sort((a, b) => a.offset - b.offset);

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
      case 'BOLD':
        o['fontWeight'] = 500;
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

export function simplify(block) {
  return getSimplifiedStyle(block);
}

