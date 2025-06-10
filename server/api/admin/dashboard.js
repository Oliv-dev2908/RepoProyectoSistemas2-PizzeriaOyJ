import { obtenerResumenDashboard } from '~/server/services/admin/dashboardService'

export default defineEventHandler(async (event) => {
  if (event.node.req.method !== 'GET') {
    event.res.statusCode = 405
    return { error: 'Método no permitido' }
  }

  try {
    const resumen = await obtenerResumenDashboard()

    return {
      success: true,
      resumen,
    }
  } catch (error) {
    console.error('[API] Error en dashboard:', error)
    event.res.statusCode = 500
    return {
      error: 'Error al recuperar el resumen del dashboard',
      details: error.message,
    }
  }
})
