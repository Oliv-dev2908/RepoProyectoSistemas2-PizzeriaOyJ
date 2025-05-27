export const getGeneralTime = async (data) => {
    const { id_cliente, titulo_encuesta } = data;
    const sql = usePostres();
    const response = await sql`SELECT * FROM get_time_since_answer(${id_cliente}, ${titulo_encuesta})`;
    //Recuperamos la cantidad de meses
    const meses = response[0]?.get_time_since_answer
    return meses;
};
export const insertSurveyAnswer = async (data) => {
    try {
        const { id_cliente, id_encuesta, respuestas } = data;
        const sql = usePostres();
        console.log('Insertando encuesta:', {
            id_cliente,
            id_encuesta,
            respuestas
        });
        // Llamar a la función SQL
        const result = await sql`
            SELECT public.insert_full_survey_answer(
                ${id_cliente}, 
                ${id_encuesta}, 
                ${respuestas}
            )
        `;
        const id_respuesta = result[0]?.insert_full_survey_answer;
        if (!id_respuesta) {
            throw new Error("No se generó una respuesta válida");
        }
        return {
            ok: true,
            id_respuesta
        };
    } catch (err) {
        console.error("Error al guardar la encuesta:", err);
        return {
            ok: false,
            error: err.message || 'Error desconocido'
        };
    }
};