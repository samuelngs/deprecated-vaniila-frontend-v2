
import OMomentEditHandler from './edit/MomentEditHandler';
import OMomentCompositionHandler from './composition/MomentCompositionHandler';

export const defaultState = {
  // composition
  contentCompositionIsActive: false,
  contentCompositionIsComposing: false,
  contentCompositionHasResolved: false,
  contentCompositionInputData: '',
}

export function MomentEditHandler (context) {
  const handlers = { ...OMomentEditHandler };
  for ( let i in handlers ) {
    handlers[i] = handlers[i].bind(context);
  }
  return handlers;
}

export function MomentCompositionHandler (context) {
  const handlers = { ...OMomentCompositionHandler };
  for ( let i in handlers ) {
    handlers[i] = handlers[i].bind(context);
  }
  return handlers;
}

