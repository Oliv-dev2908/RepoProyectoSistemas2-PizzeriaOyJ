import { getConfiguracion, updateConfiguracion } from "../repositories/configuracion";

export const fetchConfiguracion = async () => {
    return await getConfiguracion();
};

export const modifyConfiguracion = async (config) => {
    return await updateConfiguracion(config);
};
