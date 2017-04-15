
import onTextStyle from './Style.Text';

export function onStyle(type) {

  const { editorState: { editorIsCollapsed } } = this.props;
  if ( editorIsCollapsed ) return;

  return onTextStyle.call(this, type);
}

