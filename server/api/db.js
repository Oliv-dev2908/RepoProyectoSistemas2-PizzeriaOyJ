import { fetchExample } from "../services/exampleService";

export default eventHandler(async event => {
    if (method == 'get'){
        try {
            const products = fetchExample();
            return products;
        } catch (error) {
            event.res.statusCode = 500;
            return { error: 'Error al obtener productos'};
        }
    }else{
        event.res.statusCode = 405;
        return { error: 'Metodo no permitido'};
    }
})