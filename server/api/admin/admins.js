// server/api/admin/admins.js
import { asignarAdmin } from '~/server/services/admin/adminsService'
import { createClient } from '@supabase/supabase-js'
import { sendError, createError } from 'h3'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

export default defineEventHandler(async (event) => {
  const method = event.req.method

  // Obtener usuarios (seguimos usando GET sin parámetros)
  if (method === 'GET') {
    try {
      const { data, error } = await supabase.from('usuarios').select('*')
      if (error) {
        return sendError(event, createError({ statusCode: 500, statusMessage: error.message }))
      }
      return data
    } catch (error) {
      return sendError(event, createError({ statusCode: 500, statusMessage: error.message }))
    }
  }

  // Nueva forma: Asignar admin por POST
  if (method === 'POST') {
    try {
      const body = await readBody(event)
      const id = body.id
      if (!id) {
        return sendError(event, createError({ statusCode: 400, statusMessage: 'Falta el ID del usuario' }))
      }

      console.log('ID recibido en POST:', id)

      await asignarAdmin(id)
      return { message: 'Rol actualizado a administrador correctamente' }
    } catch (error) {
      return sendError(event, createError({ statusCode: 500, statusMessage: error.message }))
    }
  }

  return sendError(event, createError({ statusCode: 405, statusMessage: 'Método no permitido o ruta incorrecta' }))
})

