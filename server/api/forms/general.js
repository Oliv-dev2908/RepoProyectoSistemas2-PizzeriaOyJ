import { fetchGeneralTime, createSurveyAnswer } from '../../services/forms/generalService';

export default defineEventHandler(async (event) => {
    const method = event.node.req.method;

    switch (method) {
        case 'GET': {
            const query = getQuery(event);
            const { id_cliente, titulo_encuesta } = query;
            if (!id_cliente || !titulo_encuesta) {
                event.res.statusCode = 400;
                return { error: 'Faltan parámetros: id_cliente o titulo_encuesta' };
            }
            //Llamamos al servicio con las parametros adecuados
            const result = await fetchGeneralTime(query);
            return result;
        }
        case 'POST':
            const data = await readBody(event);
            const result = await createSurveyAnswer(data);
            return 1;
        case 'PUT':
        case 'DELETE':
        default:
            event.res.statusCode = 405;
            return { error: 'Método no permitido: ' + method };
    }
});