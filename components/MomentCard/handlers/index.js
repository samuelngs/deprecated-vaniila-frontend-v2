
import onFocus from './edit/Focus';
import onBlur from './edit/Blur';
import onCopy from './edit/Copy';
import onCut from './edit/Cut';
import onSelect from './edit/Select';
import onPaste from './edit/Paste';
import onInput from './edit/Input';
import onKeyUp from './edit/KeyUp';
import onKeyPress from './edit/KeyPress';
import onKeyDown from './edit/KeyDown';

import onBeforeInput from './composition/BeforeInput';
import onCompositionStart from './composition/CompositionStart';
import onCompositionEnd from './composition/CompositionEnd';
import onCompositionUpdate from './composition/CompositionUpdate';

import onMouseDown from './pointer/MouseDown';
import onTouchStart from './pointer/TouchStart';

export const defaultState = {
  // composition
  contentCompositionIsActive: false,
  contentCompositionIsComposing: false,
  contentCompositionHasResolved: false,
  contentCompositionInputData: '',
}

export default function MomentEditorHandler (context) {
  const handlers = {
    onFocus,
    onBlur,
    onCopy,
    onCut,
    onSelect,
    onPaste,
    onInput,
    onKeyUp,
    onKeyPress,
    onKeyDown,
    onBeforeInput,
    onCompositionStart,
    onCompositionEnd,
    onCompositionUpdate,
    onMouseDown,
    onTouchStart,
  };
  for ( let i in handlers ) {
    handlers[i] = handlers[i].bind(context);
  }
  return handlers;
}
