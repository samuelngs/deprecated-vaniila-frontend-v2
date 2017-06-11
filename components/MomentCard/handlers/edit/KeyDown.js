
import Codes from '../shared/Codes.js';

/**
 * trigger when the (keyboard) key down
 */
export default function onKeyDown(e) {
  e.persist && e.persist();

  const { id, root, store: { getState } } = this;
  const { which } = e;

  switch ( which ) {

    case Codes.ENTER:
      e.preventDefault && e.preventDefault();
      if ( e.ctrlKey || e.metaKey ) {
        const { livestream, started_at: startedAt, ended_at: endedAt } = (getState().momentDocuments[root] || { });
        const streaming = livestream && new Date(startedAt).getTime() > 0 && new Date(endedAt).getTime() <= 0;
        if ( streaming ) {
          return this.emit('edit', 'publish-moment', e.shiftKey);
        }
        return this.emit('edit', 'append-moment');
      }
      return this.emit('edit', 'insert-newline');

    case Codes.ESC:
      e.preventDefault && e.preventDefault();
      return;

    case Codes.TAB:
      e.preventDefault && e.preventDefault();
      return this.emit('edit', 'last-moment', e.shiftKey);

    case Codes.UP:
    case Codes.DOWN:
      return;

    case Codes.SPACE:
      return;

    case Codes.BACKSPACE:
    case Codes.DELETE:
      e.preventDefault && e.preventDefault();
      return this.emit('edit', 'delete-character');

  }

}
