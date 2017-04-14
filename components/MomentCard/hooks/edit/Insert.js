
import onTextInsertCollapsed from './Insert.Collapsed';
import onTextInsertReplace from './Insert.Replace';

export function onTextInsert(character) {

  const { editorState: { editorIsCollapsed } } = this.props;

  if ( editorIsCollapsed ) {
    return onTextInsertCollapsed.call(this, character);
  }

  return onTextInsertReplace.call(this, character);

}
