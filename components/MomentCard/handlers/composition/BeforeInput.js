
/**
 * trigger before input
 */
export default function onBeforeInput(e) {
  const { contentCompositionInputData: prevInput } = this.get();
  const contentCompositionInputData = (prevInput || '') + e.data;
  this.set({ contentCompositionInputData });
  this.emit('beforeinput', contentCompositionInputData);
}

