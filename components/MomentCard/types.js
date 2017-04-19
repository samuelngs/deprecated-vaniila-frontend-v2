
const text = [
  'unstyled',
  'header-one',
  'header-two',
  'blockquote',
  'code',
  'unordered-list-item',
  'ordered-list-item',
];

const media = [
  'image',
  'video',
];

function extractBlockType(o) {
  if ( typeof o === 'object' && o !== null && typeof o.type === 'string' ) {
    return o.type;
  }
  if ( typeof o === 'string' ) {
    return o;
  }
  return null;
}

export const types = {
  text,
  media,
};

/**
 * function to determine if the block is text type
 */
export function isText(blockOrBlockType) {
  const type = extractBlockType(blockOrBlockType);
  return text.indexOf(type) > -1;
}

/**
 * function to determine if the block is media type
 */
export function isMedia(blockOrBlockType) {
  const type = extractBlockType(blockOrBlockType);
  return media.indexOf(type) > -1;
}
