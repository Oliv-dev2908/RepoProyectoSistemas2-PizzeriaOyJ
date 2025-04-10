import {
    fetchPizzaIngredientes as getPizzaIngredientes,
    addIngredienteToPizza as insertIngrediente,
    removeIngredienteFromPizza as deleteIngrediente
  } from "../../repositories/products/pizzaIngrediente.js";
  
  // Obtener los ingredientes de una pizza específica
  export const fetchPizzaIngredientes = async (idPizza) => {
    try {
      const ingredientes = await getPizzaIngredientes(idPizza);
      return ingredientes;
    } catch (error) {
      console.error("Error fetching pizza ingredients:", error);
      throw error;
    }
  };
  
  // Agregar un ingrediente a una pizza
  export const addIngredienteToPizza = async (idPizza, idIngrediente, cantidad) => {
    try {
      const result = await insertIngrediente(idPizza, idIngrediente, cantidad);
      return result;
    } catch (error) {
      console.error("Error adding ingredient to pizza:", error);
      throw error;
    }
  };
  
  // Eliminar un ingrediente de una pizza
  export const removeIngredienteFromPizza = async (idPizza, idIngrediente) => {
    try {
      const result = await deleteIngrediente(idPizza, idIngrediente);
      return result;
    } catch (error) {
      console.error("Error removing ingredient from pizza:", error);
      throw error;
    }
  };
  