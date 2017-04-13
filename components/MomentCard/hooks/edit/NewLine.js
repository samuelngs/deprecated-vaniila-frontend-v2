
import onNewLineCollapsed from './NewLine.Collapsed';
import onNewLineReplace from './NewLine.Replace';

export function onNewLine() {

  const { editorState: { editorIsCollapsed } } = this.props;

  if ( editorIsCollapsed ) {
    return onNewLineCollapsed.call(this);
  }

  return onNewLineReplace.call(this);

}
