
import onTextDeleteCollapsed from './Delete.Collapsed';
import onTextDeleteSelection from './Delete.Selection';

import onImageDeleteHandler from './Delete.Image';
import onMomentDeleteHandler from './Delete.Moment';

export function onTextDelete() {

  const { editorState: { editorIsCollapsed } } = this.props;

  if ( editorIsCollapsed ) {
    return onTextDeleteCollapsed.call(this);
  }

  return onTextDeleteSelection.call(this);

}

export function onImageDelete(key) {
  return onImageDeleteHandler.call(this, key);
}

export function onMomentDelete() {
  return onMomentDeleteHandler.call(this);
}
