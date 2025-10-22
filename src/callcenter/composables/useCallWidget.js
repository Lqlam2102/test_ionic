// composables/useCallWidget.js (Composable)
/**
 * @description: Composable for call widget, to open, close, toggle the call widget
 */

import { ref, provide, inject, nextTick } from 'vue';

export function useCallWidget() {
  const isOpen = ref(false);
  const callHistory = ref([]);

  const open = () => {
    isOpen.value = null;
    nextTick(() => {
      isOpen.value = true;
    });
  }
  const close = () => {
    isOpen.value = null;
    nextTick(() => {
      isOpen.value = false;
    });
  };
  const toggle = () => (isOpen.value = !isOpen.value);
  const startCall = (phoneNumber) => {
    callHistory.value.push({ number: phoneNumber, time: new Date() });
    open();
  };

  // Provide cho cả app
  const provideCallWidget = () => {
    provide('callwidget', { isOpen, open, close, toggle, startCall, callHistory });
  };

  // Inject từ component con
  const injectCallWidget = () => {
    return inject('callwidget');
  };

  return { provideCallWidget, injectCallWidget };
}