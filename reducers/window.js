
const defaults = {
  size  : typeof window === 'undefined' ? { width: 1024, height: 768 } : { width: window.innerWidth, height: window.innerHeight },
  action: { },
};

export const actions = {
  SetWindowSize: 'set_window_size',
};

function windowSize (size = defaults.size, action = defaults.action) {
  switch ( action.type ) {
    case actions.SetWindowSize:
      if ( typeof action.size === 'object' && action.size !== null && typeof action.size.width === 'number' && typeof action.size.height === 'number' ) {
        return action.size;
      }
      return size;
    default:
      return size;
  }
}
windowSize.cookie = { type: actions.SetWindowSize, name: 'size', def: defaults.size };

export default {
  windowSize,
}
