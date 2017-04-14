
import Codes from '../shared/Codes.js';
import { api } from '../../../../reducers/editor';

/**
 * throw error if value is null
 */
function nullthrows(x) {
  if (x != null) {
    return x;
  }
  console.error('Got unexpected null or undefined');
};

/**
 * retrieve selection offset key from `data-offset-key` attribute
 */
function getSelectionOffsetKeyFromNode(node) {
  if ( node instanceof Element ) {
    const offsetKey = node.getAttribute('data-offset-key');
    const offsetGroup = node.getAttribute('data-offset-group');
    if ( offsetKey ) return { offsetKey, offsetGroup };
    for ( let i = 0; i < node.childNodes.length; i++ ) {
      const childOffset = getSelectionOffsetKeyFromNode(node.childNodes[i]);
      if ( childOffset ) return childOffset;
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
    const offset = getSelectionOffsetKeyFromNode(_node);
    if ( offset ) return offset;
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
  let offset = findOffsetKey(node);
  let offsetKey = offset && offset.offsetKey;
  let offsetGroup = offset && offset.offsetGroup;

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
    let group = null;
    if ( offsetKey != null ) {
      key = offsetKey;
      group = offsetGroup;
    } else {
      const { offsetKey: selectionOffsetKey, offsetGroup: selectionOffsetGroup } = nullthrows(getSelectionOffsetKeyFromNode(getFirstLeaf(node)));
      key = selectionOffsetKey;
      group = selectionOffsetGroup;
    }
    return { key, group, offset: 0 };
  }

  let nodeBeforeCursor = node.childNodes[childOffset - 1];
  let leafKey = null;
  let leafGroup = null;
  let textLength = null;

  if ( !getSelectionOffsetKeyFromNode(nodeBeforeCursor) ) {
    // Our target node may be a leaf or a text node, in which case we're
    // already where we want to be and can just use the child's length as
    // our offset.
    leafKey = nullthrows(offsetKey);
    leafGroup = nullthrows(offsetGroup);
    textLength = getTextContentLength(nodeBeforeCursor);
  } else {
    // Otherwise, we'll look at the child to the left of the cursor and find
    // the last leaf node in its subtree.
    const lastLeaf = getLastLeaf(nodeBeforeCursor);
    const { offsetKey: selectionOffsetKey, offsetGroup: selectionOffsetGroup } = nullthrows(getSelectionOffsetKeyFromNode(lastLeaf));
    leafKey = selectionOffsetKey;
    leafGroup = selectionOffsetGroup;
    textLength = getTextContentLength(lastLeaf);
  }

  return { key: leafKey, group: leafGroup, offset: textLength };
}

/**
 * trigger when content has been selected
 */
export default function onSelect(e) {

  if ( !window.getSelection ) return;

  /**
   * retrieve anchor and focus node and their offsets
   */
  const selection = window.getSelection();

  const {
    anchorNode,
    anchorOffset,
    focusNode,
    focusOffset,
    isCollapsed,
  } = selection;

  const rect = selection.getRangeAt(0).getBoundingClientRect() || { };

  if ( !anchorNode || !focusNode ) return;

  const { root, store: { dispatch } } = this;

  // check if anchor and focus nodes are text nodes
  const isAnchorTextNode = anchorNode.nodeType === Node.TEXT_NODE;
  const isFocusTextNode = focusNode.nodeType === Node.TEXT_NODE;

  if ( isAnchorTextNode && isFocusTextNode ) {
    const { offsetKey: anchorOffsetKey, offsetGroup: anchorOffsetGroup } = nullthrows(findOffsetKey(anchorNode));
    const { offsetKey: focusOffsetKey, offsetGroup: focusOffsetGroup } = nullthrows(findOffsetKey(focusNode));
    return dispatch(api.setEditorState(root, {
      anchorKey         : anchorOffsetKey,
      anchorGroup       : anchorOffsetGroup,
      anchorOffset      : anchorOffset,
      focusKey          : focusOffsetKey,
      focusGroup        : focusOffsetGroup,
      focusOffset       : focusOffset,
      selectionTop      : rect.top,
      selectionLeft     : rect.left,
      selectionBottom   : rect.bottom,
      selectionRight    : rect.right,
      selectionHeight   : rect.height,
      selectionWidth    : rect.width,
      selectionRecovery : false,
    })).then(state => {
      this.emit('edit', 'selectionchange', state);
    });
  }

  let anchorPoint = null;
  let focusPoint = null;

  const { target } = e;

  if ( isAnchorTextNode ) {
    const { offsetKey: anchorOffsetKey, offsetGroup: anchorOffsetGroup } = nullthrows(findOffsetKey(anchorNode));
    anchorPoint = { key: anchorOffsetKey, group: anchorOffsetGroup, offset: anchorOffset };
    focusPoint = getPointFromNonTextNode(target, focusNode, focusOffset);
  } else if ( isFocusTextNode ) {
    const { offsetKey: focusOffsetKey, offsetGroup: focusOffsetGroup } = nullthrows(findOffsetKey(focusNode));
    focusPoint = { key: focusOffsetKey, group: focusOffsetGroup, offset: focusOffset };
    anchorPoint = getPointFromNonTextNode(target, anchorNode, anchorOffset);
  } else {
    anchorPoint = getPointFromNonTextNode(target, anchorNode, anchorOffset);
    focusPoint = getPointFromNonTextNode(target, focusNode, focusOffset);
  }

  return dispatch(api.setEditorState(root, {
    anchorKey         : anchorPoint.key,
    anchorGroup       : anchorPoint.group || '0',
    anchorOffset      : anchorPoint.offset,
    focusKey          : focusPoint.key,
    focusGroup        : focusPoint.group || '0',
    focusOffset       : focusPoint.offset,
    selectionTop      : rect.top,
    selectionLeft     : rect.left,
    selectionBottom   : rect.bottom,
    selectionRight    : rect.right,
    selectionHeight   : rect.height,
    selectionWidth    : rect.width,
    selectionRecovery : false,
  })).then(state => {
    this.emit('edit', 'selectionchange', state);
  });
}

