import {
  crearPedido,
  agregarDetallePizza,
  agregarDetalleProducto, // <-- nuevo
  getPedidosPorCliente
} from '~/server/repositories/usuario/pedirPizza';

export const crearPedidoConDetalles = async (data) => {
  const {
    id_cliente,
    pizza, // Cambié id_pizza, id_tamano, cantidad, precio_unitario por un objeto pizza
    productos // Cambié id_producto, cantidad_producto, precio_unitario_producto por un array productos
  } = data;

  // Validación lógica: al menos pizza o producto debe estar presente
  const hayPizza = pizza?.id_pizza && pizza?.id_tamano && pizza?.cantidad && pizza?.precio_unitario;
  const hayProducto = Array.isArray(productos) && productos.length > 0;

  if (!hayPizza && !hayProducto) {
    throw new Error('Debe seleccionar al menos una pizza o un producto');
  }

  // Cálculo del total
  let total = 0;
  if (hayPizza) total += pizza.precio_unitario * pizza.cantidad;
  if (hayProducto) {
    total += productos.reduce((acc, producto) => acc + (producto.precio_unitario * producto.cantidad), 0);
  }

  // Crear el pedido
  const pedido = await crearPedido({ id_cliente, total });

  // Si hay pizza, agregar detalle pizza
  if (hayPizza) {
    await agregarDetallePizza({
      id_pedido: pedido.id_pedido,
      id_pizza: pizza.id_pizza,
      id_tamano: pizza.id_tamano,
      cantidad: pizza.cantidad,
      precio_unitario: pizza.precio_unitario
    });
  }

  // Si hay productos, agregar detalles de productos
  if (hayProducto) {
    for (const producto of productos) {
      await agregarDetalleProducto({
        id_pedido: pedido.id_pedido,
        id_producto: producto.id_producto,
        cantidad: producto.cantidad,
        precio_unitario: producto.precio_unitario
      });
    }
  }

  return { id_pedido: pedido.id_pedido };
};

export const obtenerPedidosDeCliente = async (id_cliente) => {
  return await getPedidosPorCliente(id_cliente);
};
