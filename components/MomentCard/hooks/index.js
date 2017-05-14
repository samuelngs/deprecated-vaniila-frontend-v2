
import { onTextInsert, onImageInsert } from './edit/Insert';
import { onTextDelete, onImageDelete, onMomentDelete } from './edit/Delete';
import { onMomentPublish } from './edit/Publish';
import { onNewLine } from './edit/NewLine';
import { onStyle } from './edit/Style';
import { onAlign } from './edit/Align';
import { onInline } from './edit/Inline';
import { onFullscreen } from './edit/Fullscreen';

export default {
  onMomentPublish,
  onMomentDelete,
  onImageInsert,
  onImageDelete,
  onTextInsert,
  onTextDelete,
  onNewLine,
  onStyle,
  onAlign,
  onInline,
  onFullscreen,
};
