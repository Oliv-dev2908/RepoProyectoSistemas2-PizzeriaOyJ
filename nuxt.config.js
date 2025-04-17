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
    '@/assets/css/tailwind.css',
    'element-plus/theme-chalk/index.css',
    'element-plus/theme-chalk/dark/css-vars.css'
  ],
  elementPlus: {
    importStyle: 'css', // Importa los estilos CSS
    themes: ['dark']    // Habilita el tema oscuro
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