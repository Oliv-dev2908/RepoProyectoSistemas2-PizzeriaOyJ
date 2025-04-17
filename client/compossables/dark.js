// client/compossables/dark.js
import { useDark } from '@vueuse/core';
export const isDark = useDark({
  storageKey: 'dark-mode',
});