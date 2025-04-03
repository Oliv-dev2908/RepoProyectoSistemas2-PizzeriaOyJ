import { getAllTamanos, insertTamanos, updateTamanos, deleteLogicTamano } from "../../repositories/products/tamanos";

export const fetchTamanos = async (tamano) => {
    try {
        const products = await getAllTamanos(tamano);
        return products;
    } catch (error) {
        console.error("Error fetching tamaños:", error);
        throw error;
    }
};
export const modifyTamanos = async (tamano) => {
    try {
        // Aquí puedes agregar validaciones si es necesario
        const result = await updateTamanos(tamano);
        return result;
    } catch (error) {
        console.error("Error inserting tamaño:", error);
        throw error;
    }
};
export const createTamanos = async (tamano) => {
    try {
        // Aquí puedes agregar validaciones si es necesario
        const result = await insertTamanos(tamano);
        return result;
    } catch (error) {
        console.error("Error inserting tamaño:", error);
        throw error;
    }
};

export const deleteTamano = async (tamano) => {
    try {
        // Aquí puedes agregar validaciones si es necesario
        const result = await deleteLogicTamano(tamano);
        return result;
    } catch (error) {
        console.error("Error inserting tamaño:", error);
        throw error;
    }
};