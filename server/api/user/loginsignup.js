import { verifyUser } from "../../services/signuploginService";

export default eventHandler(async event => {
    const method = event.node.req.method;
    if (method == 'GET'){
        const query = getQuery(event);
        try {
            const user = verifyUser(query);
            return user;
        } catch (error) {
            event.res.statusCode = 500;
            return { error: 'Error al obtener productos'};
        }
    }else{
        event.res.statusCode = 405;
        return { error: 'Metodo no permitido'};
    }
})