export default defineNuxtConfig({
  server: {
    host: '0.0.0.0', // Esto permite que tu app sea accesible desde cualquier dirección IP
    port: 3000, // Puedes configurar un puerto si lo necesitas
  },

  nitro: {
    // Esto asegura que Nitro se habilite correctamente.
    preset: 'node', // 'node' es el preset más común, también puedes elegir otros como 'serverless', etc.
  },

  build: {
    transpile: ['@nuxt/ui'], // Si usas alguna librería que necesita transpile
  },

  compatibilityDate: '2025-03-27'
})