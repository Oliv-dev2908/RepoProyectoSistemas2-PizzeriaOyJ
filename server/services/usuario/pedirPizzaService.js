import { crearPedido, agregarDetallePizza, getPedidosPorCliente } from '~/server/repositories/usuario/pedirPizza';

export const crearPedidoConDetalles = async ({ id_cliente, id_pizza, id_tamano, cantidad, precio_unitario }) => {
  const total = precio_unitario * cantidad;
  const pedido = await crearPedido({ id_cliente, total });

  await agregarDetallePizza({
    id_pedido: pedido.id_pedido,
    id_pizza,
    id_tamano,
    cantidad,
    precio_unitario
  });

  return { id_pedido: pedido.id_pedido };
};

export const obtenerPedidosDeCliente = async (id_cliente) => {
  return await getPedidosPorCliente(id_cliente);
};
