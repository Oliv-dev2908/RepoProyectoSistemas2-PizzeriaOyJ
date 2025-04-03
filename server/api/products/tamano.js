import { createTamanos, modifyTamanos, fetchTamanos } from '../../services/products/tamanoService';
import { usePostres } from '../../utils/postgres'; // Asegúrate de importar tu conexión a la base de datos

export default defineEventHandler(async (event) => {
    const method = event.node.req.method;

    switch (method) {
        case 'GET':
            // Obtener un tamaño específico por ID
            const query = getQuery(event);
            var id = 0;
            if(query.id){
                id = query.id;
            }
            if (id > 0) {
                try {
                    return fetchTamanos(id);
                } catch (error) {
                    event.res.statusCode = 500; // Error interno del servidor
                    return { error: 'Error al obtener tamaños', details: error.message };
                }
            } else {
                // Obtener todos los tamaños
                try {
                    return fetchTamanos(id);
                } catch (error) {
                    event.res.statusCode = 500; // Error interno del servidor
                    return { error: 'Error al obtener tamaños', details: error.message };
                }
            }

        case 'POST':
            // Insertar un nuevo tamaño
            try {
                const tamaño = await readBody(event); // Lee el cuerpo de la solicitud
                const result = await createTamanos(tamaño); // Llama al servicio para insertar el tamaño
                return { success: true, message: 'Tamaño insertado correctamente', result };
            } catch (error) {
                event.res.statusCode = 500; // Error interno del servidor
                return { error: 'Error al insertar tamaño', details: error.message };
            }

        case 'PUT':
            // Actualizar un tamaño existente
            try {
                const tamano = await readBody(event); // Lee el cuerpo de la solicitud
                const result = await modifyTamanos(tamano); // Llama al servicio para modificar el tamaño
                return { success: true, message: 'Tamaño actualizado correctamente', result };
            } catch (error) {
                event.res.statusCode = 500; // Error interno del servidor
                return { error: 'Error al actualizar tamaño', details: error.message };
            }

        default:
            event.res.statusCode = 405; // Método no permitido
            return { error: 'Método no permitido' };
    }
});