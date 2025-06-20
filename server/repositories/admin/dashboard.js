import { usePostres } from '~/server/utils/postgres.js'

export const obtenerDatosDashboard = async () => {
  try {
    const sql = usePostres()

    const costosIngredientes = await sql`SELECT * FROM costos_y_uso_ingredientes ORDER BY id_ingrediente`
    const evolucionVentas = await sql`SELECT * FROM evolucion_mensual_ventas_producto ORDER BY mes, id_producto`
    const productosMasVendidos = await sql`SELECT * FROM productos_mas_vendidos ORDER BY total_vendido DESC`
    const ventasPorCategoria = await sql`SELECT * FROM ventas_totales_por_categoria ORDER BY id_categoria`

    return {
      costosIngredientes,
      evolucionVentas,
      productosMasVendidos,
      ventasPorCategoria,
    }
  } catch (error) {
    throw new Error('Error al consultar el dashboard: ' + error.message)
  }
}


