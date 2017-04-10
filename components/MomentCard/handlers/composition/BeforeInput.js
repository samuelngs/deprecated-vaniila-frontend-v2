
/**
 * trigger before input
 */
export default function onBeforeInput(e) {
  e.persist && e.persist();
  e.preventDefault();

  const { contentCompositionInputData: prevInput } = this.get();
  const contentCompositionInputData = (prevInput || '') + e.data;

  this.set({ contentCompositionInputData });
  this.emit('beforeinput', contentCompositionInputData);
}

