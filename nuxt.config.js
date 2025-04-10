export default defineNuxtConfig({
  server: {
    host: '0.0.0.0'
  },
  modules: ["@nuxtjs/supabase", '@nuxtjs/tailwindcss'],
  supabase: {
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: ['/signup'],
    }
  },
  css: ['@/assets/css/tailwind.css'],
  compatibilityDate: '2025-03-28'
})