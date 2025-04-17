import { useDark } from '@vueuse/core';

export default defineNuxtPlugin((nuxtApp) => {
  const themeCookie = useCookie('theme');
  const isDark = useDark({
    initialValue: themeCookie.value,
  });

  nuxtApp.provide('isDark', isDark);
});