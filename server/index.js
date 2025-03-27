import { createServer } from 'http'
import express from 'express'
import { createApp } from '@nuxt/nitro'

const app = express()

// Configuración de Nitro (opcional)
app.use((req, res) => {
  const nitroApp = createApp()
  return nitroApp(req, res)
})

const server = createServer(app)

server.listen(3000, () => {
  console.log('Servidor Nitro con Express corriendo en http://localhost:3000')
})
