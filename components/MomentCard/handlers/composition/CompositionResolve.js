
export default function resolveComposition(type, e) {

  // retrieve composing state and data
  const { contentCompositionIsComposing, contentCompositionInputData } = this.get();

  // cancel resolving composition if it has already ended
  if ( contentCompositionIsComposing ) return;

  // composition has resolved
  this.set({ contentCompositionHasResolved: true, contentCompositionIsActive: false, contentCompositionInputData: '' });

  console.log('input', contentCompositionInputData);

}

