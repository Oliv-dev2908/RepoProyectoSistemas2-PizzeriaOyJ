import { modifyConfiguracion } from "../../services/configuracionService";
import { readBody } from 'h3';

export default defineEventHandler(async (event) => {
  if (event.node.req.method !== 'PUT') {
    event.res.statusCode = 405;
    return { error: 'Método no permitido' };
  }

  try {
    const body = await readBody(event);
    const { nombre_pizzeria, logo_url, theme_flavor, custom_colors_light, custom_colors_dark } = body;

    if (!nombre_pizzeria || !logo_url || !theme_flavor) {
      event.res.statusCode = 400;
      return { error: 'Faltan datos obligatorios para actualizar la configuración' };
    }

    const result = await modifyConfiguracion({ 
      nombre_pizzeria, 
      logo_url, 
      theme_flavor,
      custom_colors_light: custom_colors_light || {},
      custom_colors_dark: custom_colors_dark || {}
    });

    return {
      success: true,
      message: 'Configuración actualizada correctamente',
      result,
    };
  } catch (error) {
    console.error(error);
    event.res.statusCode = 500;
    return {
      error: 'Error al actualizar la configuración',
      details: error.message,
    };
  }
});
