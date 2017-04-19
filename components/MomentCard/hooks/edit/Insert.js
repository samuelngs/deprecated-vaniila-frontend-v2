
import onTextInsertCollapsed from './Insert.Collapsed';
import onTextInsertReplace from './Insert.Replace';
import onImageInsertHandler from './Insert.Image';

export function onTextInsert(character) {

  const { editorState: { editorIsCollapsed } } = this.props;

  if ( editorIsCollapsed ) {
    return onTextInsertCollapsed.call(this, character);
  }

  return onTextInsertReplace.call(this, character);

}

export function onImageInsert(blobs) {
  if ( blobs.length === 0 ) return;
  return onImageInsertHandler.call(this, blobs[0]);
}
