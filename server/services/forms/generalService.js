import { getGeneralTime, insertSurveyAnswer} from "../../repositories/forms/general";
export const fetchGeneralTime = async(data) => {
    try {
        const {id_cliente, titulo_encuesta } = data;
        if(!id_cliente || !titulo_encuesta){
            return 0;
        }
        //Tras validar realizamos la solicitud
        const timeInMonths = getGeneralTime(data);
        return timeInMonths;
    } catch (error) {
        console.error("Error fetching general time:", error);
    }
}
export const createSurveyAnswer = async (surveyData) => {
  try {
    const { id_cliente, id_encuesta, respuestas } = surveyData
    if (!id_cliente || !id_encuesta || !respuestas) {
      console.warn("Datos incompletos o inválidos en la encuesta.")
      return false
    }
    const result = await insertSurveyAnswer(surveyData)
    if (!result || result.error) {
      console.warn("Hubo un problema al guardar la encuesta." + result)
      return false
    }
    return true
  } catch (error) {
    console.error("Error al enviar datos de la encuesta:", error)
    return false
  }
}