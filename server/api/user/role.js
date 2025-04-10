import { userRole } from "../../services/signuploginService";

export default eventHandler(async event => {
    const method = event.node.req.method;
    if (method == 'GET'){
        const id = getQuery(event);
        try {
            const user = userRole(id);
            event.res.statusCode = 200;
            return user;
        } catch (error) {
            event.res.statusCode = 500;
            return { error: 'Error al obtener el rol'};
        }
    }else{
        event.res.statusCode = 405;
        return { error: 'Metodo no permitido'};
    }
})