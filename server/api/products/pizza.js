import { createCategorias, modifyCategorias, fetchCategorias, deleteCategorias } from './../../services/products/categoriaService';
import { usePostres } from '../../utils/postgres'; // Asegúrate de importar tu conexión a la base de datos

export default defineEventHandler(async (event) => {
    const method = event.node.req.method;

    switch (method) {
        case 'GET':
            // Obtener una categoría específica por ID
            const query = getQuery(event);
            let id = 0;
            if (query.id) {
                id = query.id;
            }
            if (id > 0) {
                try {
                    return fetchCategorias(id);
                } catch (error) {
                    event.res.statusCode = 500; // Error interno del servidor
                    return { error: 'Error al obtener categoría', details: error.message };
                }
            } else {
                // Obtener todas las categorías
                try {
                    return fetchCategorias(); // Llama a la función para obtener todas las categorías
                } catch (error) {
                    event.res.statusCode = 500; // Error interno del servidor
                    return { error: 'Error al obtener categorías', details: error.message };
                }
            }

        case 'POST':
            // Insertar una nueva categoría
            try {
                const categoria = await readBody(event); // Lee el cuerpo de la solicitud
                const result = await createCategorias(categoria); // Llama al servicio para insertar la categoría
                return { success: true, message: 'Categoría insertada correctamente', result };
            } catch (error) {
                event.res.statusCode = 500; // Error interno del servidor
                return { error: 'Error al insertar categoría', details: error.message };
            }

        case 'PUT':
            // Actualizar una categoría existente
            try {
                const categoria = await readBody(event); // Lee el cuerpo de la solicitud
                const result = await modifyCategorias(categoria); // Llama al servicio para modificar la categoría
                return { success: true, message: 'Categoría actualizada correctamente', result };
            } catch (error) {
                event.res.statusCode = 500; // Error interno del servidor
                return { error: 'Error al actualizar categoría', details: error.message };
            }

        case 'DELETE':
            // Borrado lógico de una categoría
            try {
                const { id_categoria } = await readBody(event); // Lee el cuerpo de la solicitud
                const result = await deleteCategorias({ id_categoria, activo: 0 }); // Actualiza el campo 'activo' a false
                return { success: true, message: 'Categoría eliminada correctamente', result };
            } catch (error) {
                event.res.statusCode = 500; // Error interno del servidor
                return { error: 'Error al eliminar categoría', details: error.message };
            }

        default:
            event.res.statusCode = 405; // Método no permitido
            return { error: 'Método no permitido' };
    }
});