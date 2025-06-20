import { obtenerDatosDashboard } from '~/server/repositories/admin/dashboard'

export const obtenerResumenDashboard = async () => {
  const datos = await obtenerDatosDashboard()
  return {
    costosIngredientes: datos.costosIngredientes,
    evolucionVentas: datos.evolucionVentas,
    productosMasVendidos: datos.productosMasVendidos,
    ventasPorCategoria: datos.ventasPorCategoria,
  }
}
