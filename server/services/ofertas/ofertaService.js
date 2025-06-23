import { getAllOfertas, insertOferta, updateOferta, deleteLogicOferta } from "../../repositories/ofertas/ofertas";

export const fetchOfertas = async (categoria) => {
    try {
        const products = await getAllOfertas(categoria);
        return products;
    } catch (error) {
        console.error("Error fetching ofertas:", error);
        throw error;
    }
};

export const modifyOfertas = async (categoria) => {
    try {
        // Aquí puedes agregar validaciones si es necesario
        const result = await updateOferta(categoria);
        return result;
    } catch (error) {
        console.error("Error updating ofertas:", error);
        throw error;
    }
};

export const createOfertas = async (oferta) => {
    try {
        // Aquí puedes agregar validaciones si es necesario
        const result = await insertOferta(oferta);
        return result;
    } catch (error) {
        console.error("Error inserting ofertas:", error);
        throw error;
    }
};

export const deleteOfertas  = async (categoria) => {
    try {
        // Aquí puedes agregar validaciones si es necesario
        const result = await deleteLogicOferta(categoria);
        return result;
    } catch (error) {
        console.error("Error updating ofertas:", error);
        throw error;
    }
};