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
  head: {
    link: [
      {
        rel: 'preload',
        href: '/_nuxt/builds/meta/dev.json',
        as: 'json' // Asegúrate de que el tipo sea correcto
      }
    ]
  },
  css: ['@/assets/css/tailwind.css'],
  compatibilityDate: '2025-03-28'
})