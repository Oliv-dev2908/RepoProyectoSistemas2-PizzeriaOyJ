import {
    createProducto,
    modifyProducto,
    fetchProducto,
    deleteProducto,
  } from './../../services/products/productoService';
  
  export default defineEventHandler(async (event) => {
    const method = event.node.req.method;
  
    switch (method) {
      case 'GET': {
        const query = getQuery(event);
        let id = 0;
        if (query.id) {
          id = parseInt(query.id);
        }
  
        try {
          if (id > 0) {
            return await fetchProducto(id);
          } else {
            return await fetchProducto(); // Todas las entradas
          }
        } catch (error) {
          event.res.statusCode = 500;
          return { error: 'Error al obtener producto(s)', details: error.message };
        }
      }
  
      case 'POST': {
        try {
          const producto = await readBody(event);
          const result = await createProducto(producto);
          return { success: true, message: 'Producto insertado correctamente', result };
        } catch (error) {
          event.res.statusCode = 500;
          return { error: 'Error al insertar producto', details: error.message };
        }
      }
  
      case 'PUT': {
        try {
          const producto = await readBody(event);
          const result = await modifyProducto(producto);
          return { success: true, message: 'Producto actualizado correctamente', result };
        } catch (error) {
          event.res.statusCode = 500;
          return { error: 'Error al actualizar producto', details: error.message };
        }
      }
  
      case 'DELETE': {
        try {
          const { id_producto } = await readBody(event);
          const result = await deleteProducto({ id_producto, activo: 0 });
          return { success: true, message: 'Producto eliminado correctamente', result };
        } catch (error) {
          event.res.statusCode = 500;
          return { error: 'Error al eliminar producto', details: error.message };
        }
      }
  
      default:
        event.res.statusCode = 405;
        return { error: 'Método no permitido' };
    }
  });
  