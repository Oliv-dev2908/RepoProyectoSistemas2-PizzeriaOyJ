export default defineNuxtConfig({
  server: {
    host: '0.0.0.0'
  },
  modules: ["@nuxtjs/supabase", '@nuxtjs/tailwindcss', '@element-plus/nuxt'],
  supabase: {
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: ['/signup'],
    }
  },

  css: [
    '@/assets/css/main.css',
    'element-plus/theme-chalk/index.css'
  ],
  elementPlus: {
    importStyle: 'css'
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


  compatibilityDate: '2025-03-28'
})