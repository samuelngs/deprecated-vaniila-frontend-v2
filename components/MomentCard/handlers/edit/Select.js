
import Codes from './codes';

/**
 * throw error if value is null
 */
function nullthrows(x) {
  if (x != null) {
    return x;
  }
  throw new Error('Got unexpected null or undefined');
};

/**
 * retrieve selection offset key from `data-offset-key` attribute
 */
function getSelectionOffsetKeyFromNode(node) {
  if ( node instanceof Element ) {
    const offsetKey = node.getAttribute('data-offset-key');
    if ( offsetKey ) return offsetKey;
    for ( let i = 0; i < node.childNodes.length; i++ ) {
      const childOffsetKey = getSelectionOffsetKeyFromNode(node.childNodes[i]);
      if ( childOffsetKey ) return childOffsetKey;
    }
  }
  return null;
}

/**
 * retrieve offset key
 */
function findOffsetKey(node) {
  let _node = node;
  while (_node && _node !== document.documentElement) {
    const key = getSelectionOffsetKeyFromNode(_node);
    if ( key ) return key;
    _node = _node.parentNode;
  }
  return null;
}

/**
 * identify the first leaf descendant for the given node.
 */
function getFirstLeaf(node) {
  while (node.firstChild && getSelectionOffsetKeyFromNode(node.firstChild)) {
    node = node.firstChild;
  }
  return node;
}

/**
 * identify the last leaf descendant for the given node.
 */
function getLastLeaf(node) {
  while (node.lastChild && getSelectionOffsetKeyFromNode(node.lastChild)) {
    node = node.lastChild;
  }
  return node;
}

/**
 * Return the length of a node's textContent, regarding single newline
 * characters as zero-length. This allows us to avoid problems with identifying
 * the correct selection offset for empty blocks in IE, in which we
 * render newlines instead of break tags.
 */
function getTextContentLength(node) {
  let textContent = node.textContent;
  return textContent === '\n' ? 0 : textContent.length;
}

/**
 * retrieve point for non text element node
 */
function getPointFromNonTextNode(root, startNode, childOffset) {

  let node = startNode;
  let offsetKey = findOffsetKey(node);

  // If the editorRoot is the selection, step downward into the content
  // wrapper.
  if ( root === node ) {
    node = node.firstChild;
    if ( childOffset > 0 ) {
      childOffset = node.childNodes.length;
    }
  }

  // If the child offset is zero and we have an offset key, we're done.
  // If there's no offset key because the entire editor is selected,
  // find the leftmost ("first") leaf in the tree and use that as the offset
  // key.
  if ( childOffset === 0 ) {
    let key = null;
    if ( offsetKey != null ) {
      key = offsetKey;
    } else {
      key = nullthrows(getSelectionOffsetKeyFromNode(getFirstLeaf(node)));
    }
    return { key, offset: 0 };
  }

  let nodeBeforeCursor = node.childNodes[childOffset - 1];
  let leafKey = null;
  let textLength = null;

  if ( !getSelectionOffsetKeyFromNode(nodeBeforeCursor) ) {
    // Our target node may be a leaf or a text node, in which case we're
    // already where we want to be and can just use the child's length as
    // our offset.
    leafKey = nullthrows(offsetKey);
    textLength = getTextContentLength(nodeBeforeCursor);
  } else {
    // Otherwise, we'll look at the child to the left of the cursor and find
    // the last leaf node in its subtree.
    const lastLeaf = getLastLeaf(nodeBeforeCursor);
    leafKey = nullthrows(getSelectionOffsetKeyFromNode(lastLeaf));
    textLength = getTextContentLength(lastLeaf);
  }

  return { key: leafKey, offset: textLength };
}

/**
 * trigger when content has been selected
 */
export default function onSelect(e) {

  if ( !window.getSelection ) return;

  /**
   * retrieve anchor and focus node and their offsets
   */
  const {
    anchorNode,
    anchorOffset,
    focusNode,
    focusOffset,
    isCollapsed,
  } = window.getSelection();

  // check if anchor and focus nodes are text nodes
  const isAnchorTextNode = anchorNode.nodeType === Node.TEXT_NODE;
  const isFocusTextNode = focusNode.nodeType === Node.TEXT_NODE;

  if ( isAnchorTextNode && isFocusTextNode ) {
    const anchorOffsetKey = nullthrows(findOffsetKey(anchorNode));
    const focusOffsetKey = nullthrows(findOffsetKey(focusNode));
    return this.dispatch({
      contentAnchorOffsetKey    : anchorOffsetKey,
      contentAnchorOffset       : anchorOffset,
      contentFocusOffsetKey     : focusOffsetKey,
      contentFocusOffset        : focusOffset,
      contentSelectionRecovery  : false,
    });
  }

  let anchorPoint = null;
  let focusPoint = null;
  let contentSelectionRecovery = false;

  const { target } = e;

  if ( isAnchorTextNode ) {
    anchorPoint = { key: nullthrows(findOffsetKey(anchorNode)), offset: anchorOffset };
    focusPoint = getPointFromNonTextNode(target, focusNode, focusOffset);
  } else if ( isFocusTextNode ) {
    focusPoint = { key: nullthrows(findOffsetKey(focusNode)), offset: focusOffset };
    anchorPoint = getPointFromNonTextNode(target, anchorNode, anchorOffset);
  } else {
    focusPoint = getPointFromNonTextNode(target, focusNode, focusOffset);
    anchorPoint = getPointFromNonTextNode(target, anchorNode, anchorOffset);
    if ( anchorNode === focusNode && anchorOffset === focusOffset ) {
      contentSelectionRecovery = !!anchorNode.firstChild && anchorNode.firstChild.nodeName !== 'DIV';
    }
  }

  return this.dispatch({
    contentAnchorOffsetKey    : anchorPoint.key,
    contentAnchorOffset       : anchorPoint.offset,
    contentFocusOffsetKey     : focusPoint.key,
    contentFocusOffset        : focusPoint.offset,
    contentSelectionRecovery,
  });
}

