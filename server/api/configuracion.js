import { fetchConfiguracion } from "../services/configuracionService";

export default defineEventHandler(async (event) => {
  if (event.node.req.method !== 'GET') {
    event.res.statusCode = 405;
    return { error: 'Método no permitido' };
  }

  try {
    const config = await fetchConfiguracion();
    return config;
  } catch (error) {
    console.error(error);
    event.res.statusCode = 500;
    return { error: 'Error al obtener la configuración' };
  }
});
