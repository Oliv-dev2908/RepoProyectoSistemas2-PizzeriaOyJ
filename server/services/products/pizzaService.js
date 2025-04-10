import {
    fetchPizza as getAllPizzas,
    createPizza as insertPizza,
    modifyPizza as updatePizza,
    deletePizza as deleteLogicPizza
} from "../../repositories/products/pizza.js";

// Obtener una o todas las pizzas
export const fetchPizza = async (pizza) => {
    try {
        const pizzas = await getAllPizzas(pizza);
        return pizzas;
    } catch (error) {
        console.error("Error fetching pizzas:", error);
        throw error;
    }
};

// Crear nueva pizza
export const createPizza = async (pizza) => {
    try {
        const result = await insertPizza(pizza);
        return result;
    } catch (error) {
        console.error("Error inserting pizza:", error);
        throw error;
    }
};

// Actualizar pizza
export const modifyPizza = async (pizza) => {
    try {
        const result = await updatePizza(pizza);
        return result;
    } catch (error) {
        console.error("Error updating pizza:", error);
        throw error;
    }
};

// Eliminar pizza lógicamente
export const deletePizza = async (pizza) => {
    try {
        const result = await deleteLogicPizza(pizza);
        return result;
    } catch (error) {
        console.error("Error deleting pizza:", error);
        throw error;
    }
};
