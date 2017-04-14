
import onTextDeleteCollapsed from './Delete.Collapsed';
import onTextDeleteSelection from './Delete.Selection';

export function onTextDelete() {

  const { editorState: { editorIsCollapsed } } = this.props;

  if ( editorIsCollapsed ) {
    return onTextDeleteCollapsed.call(this);
  }

  return onTextDeleteSelection.call(this);

}

