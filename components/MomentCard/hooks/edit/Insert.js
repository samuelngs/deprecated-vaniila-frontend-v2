
import onTextInsertCollapsed from './Insert.Collapsed';
import onTextInsertReplace from './Insert.Replace';

export function onTextInsert(character) {

  const { editorState: { editorIsCollapsed } } = this.props;

  if ( editorIsCollapsed ) {
    return onTextInsertCollapsed.call(this, character);
  }

  return onTextInsertReplace.call(this, character);

}

export function onImageInsert(blobs) {

  if ( blobs.length === 0 ) return;

  const { base64, file } = blobs[0];
  const { name, size = 0 } = file;

}
