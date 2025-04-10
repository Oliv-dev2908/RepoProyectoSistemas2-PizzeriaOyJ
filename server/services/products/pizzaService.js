import { getAllCategorias, insertCategorias, updateCategorias, deleteLogicCategorias } from "../../repositories/products/categoria";

export const fetchCategorias = async (categoria) => {
    try {
        const products = await getAllCategorias(categoria);
        return products;
    } catch (error) {
        console.error("Error fetching categorías:", error);
        throw error;
    }
};

export const modifyCategorias = async (categoria) => {
    try {
        // Aquí puedes agregar validaciones si es necesario
        const result = await updateCategorias(categoria);
        return result;
    } catch (error) {
        console.error("Error updating categoría:", error);
        throw error;
    }
};

export const createCategorias = async (categoria) => {
    try {
        // Aquí puedes agregar validaciones si es necesario
        const result = await insertCategorias(categoria);
        return result;
    } catch (error) {
        console.error("Error inserting categoría:", error);
        throw error;
    }
};

export const deleteCategorias = async (categoria) => {
    try {
        // Aquí puedes agregar validaciones si es necesario
        const result = await deleteLogicCategorias(categoria);
        return result;
    } catch (error) {
        console.error("Error updating categoría:", error);
        throw error;
    }
};