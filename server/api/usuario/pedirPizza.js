import { crearPedidoConDetalles } from '~/server/services/usuario/pedirPizzaService';
import { readBody } from 'h3';

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;

  switch (method) {
    case 'POST': {
      try {
        const body = await readBody(event);
        const { id_cliente, pedido, fecha } = body;

        if (!id_cliente || !pedido || pedido.length === 0) {
          event.res.statusCode = 400;
          return { error: 'Faltan datos del pedido' };
        }

        // Separar pizzas y productos
        const pizzas = pedido.filter(item => item.tipo === 'pizza').map(pizza => ({
          id_pizza: pizza.id_pizza,
          id_tamano: pizza.id_tamano,
          cantidad: pizza.cantidad,
          precio_unitario: pizza.precioUnitario,
        }));

        const productos = pedido.filter(item => item.tipo === 'producto').map(producto => ({
          id_producto: producto.id_producto,
          cantidad: producto.cantidadProducto,
          precio_unitario: producto.precioUnitario,
        }));

        // Crear pedido con sus detalles
        const result = await crearPedidoConDetalles({
          id_cliente,
          pizzas,
          productos,
          fecha
        });

        return { success: true, message: 'Pedido creado correctamente', result };

      } catch (error) {
        console.error(error);
        event.res.statusCode = 500;
        return { error: 'Error al crear el pedido', details: error.message };
      }
    }

    default:
      event.res.statusCode = 405;
      return { error: 'Método no permitido' };
  }
});
