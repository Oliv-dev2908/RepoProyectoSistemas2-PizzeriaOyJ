import {
    fetchIngrediente as getAllIngredientes,
    createIngrediente as insertIngrediente,
    modifyIngrediente as updateIngrediente,
    deleteIngrediente as deleteLogicIngrediente
  } from "../../repositories/products/ingrediente.js";
  
  // Obtener uno o todos los ingredientes
  export const fetchIngrediente = async (ingrediente) => {
    try {
      const ingredientes = await getAllIngredientes(ingrediente);
      return ingredientes;
    } catch (error) {
      console.error("Error fetching ingredientes:", error);
      throw error;
    }
  };
  
  // Crear nuevo ingrediente
  export const createIngrediente = async (ingrediente) => {
    try {
      const result = await insertIngrediente(ingrediente);
      return result;
    } catch (error) {
      console.error("Error inserting ingrediente:", error);
      throw error;
    }
  };
  
  // Actualizar ingrediente
  export const modifyIngrediente = async (ingrediente) => {
    try {
      const result = await updateIngrediente(ingrediente);
      return result;
    } catch (error) {
      console.error("Error updating ingrediente:", error);
      throw error;
    }
  };
  
  // Eliminar ingrediente lógicamente
  export const deleteIngrediente = async (ingrediente) => {
    try {
      const result = await deleteLogicIngrediente(ingrediente);
      return result;
    } catch (error) {
      console.error("Error deleting ingrediente:", error);
      throw error;
    }
  };
  