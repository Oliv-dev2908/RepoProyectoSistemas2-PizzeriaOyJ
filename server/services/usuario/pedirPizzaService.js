import {
  crearPedido,
  agregarDetallePizza,
  agregarDetalleProducto,
  getPedidosPorCliente
} from '~/server/repositories/usuario/pedirPizza';

export const crearPedidoConDetalles = async (data) => {
  const { id_cliente, pizzas, productos, fecha } = data;

  // Validación
  const hayPizzas = Array.isArray(pizzas) && pizzas.length > 0;
  const hayProductos = Array.isArray(productos) && productos.length > 0;

  if (!hayPizzas && !hayProductos) {
    throw new Error('Debe seleccionar al menos una pizza o un producto');
  }

  // Calcular total
  let total = 0;
  if (hayPizzas) {
    total += pizzas.reduce((acc, pizza) => acc + (pizza.precio_unitario * pizza.cantidad), 0);
  }
  if (hayProductos) {
    total += productos.reduce((acc, producto) => acc + (producto.precio_unitario * producto.cantidad), 0);
  }

  // Crear pedido
  const pedido = await crearPedido({ id_cliente, total });

  // Insertar detalles de pizzas
  if (hayPizzas) {
    for (const pizza of pizzas) {
      await agregarDetallePizza({
        id_pedido: pedido.id_pedido,
        id_pizza: pizza.id_pizza,
        id_tamano: pizza.id_tamano,
        cantidad: pizza.cantidad,
        precio_unitario: pizza.precio_unitario
      });
    }
  }

  // Insertar detalles de productos
  if (hayProductos) {
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