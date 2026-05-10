<template>
    <el-dialog v-model="dialogVisible" fullscreen top="40vh" width="70%" draggable>
        <div class="survey-container">
            <h1>Encuesta De Satisfacción</h1>

            <!-- Sección 1: Satisfacción General -->
            <el-card class="survey-section">
                <h2>✨ Sección 1: Satisfacción General (Escala 1-5)</h2>
                <div v-for="(question, index) in satisfactionQuestions" :key="index" class="question">
                    <p>{{ question.text }}</p>
                    <el-rate v-model="responses.satisfaction[index]"
                        :texts="['Muy Insatisfecho', 'Insatisfecho', 'Neutral', 'Satisfecho', 'Muy Satisfecho']"
                        :max="5" show-text />
                </div>
            </el-card>

            <!-- Sección 2: Preferencias de Consumo -->
            <el-card class="survey-section">
                <h2>🍕 Sección 2: Preferencias de Consumo</h2>
                <div class="question">
                    <p>¿Con qué frecuencia consumes nuestras pizzas?</p>
                    <el-radio-group v-model="responses.consumption.frequency" size="small">
                        <el-radio label="1">Más de una vez por semana</el-radio>
                        <el-radio label="2">Una vez por semana</el-radio>
                        <el-radio label="3">Dos veces al mes</el-radio>
                        <el-radio label="4">Una vez al mes</el-radio>
                        <el-radio label="5">Menos de una vez al mes</el-radio>
                    </el-radio-group>
                </div>
            </el-card>

            <!-- Sección 3: Experiencia de Pedido y Entrega -->
            <el-card class="survey-section">
                <h2>🚚 Sección 3: Experiencia de Pedido y Entrega (Escala 1-5)</h2>
                <div v-for="(question, index) in deliveryExperienceQuestions" :key="index" class="question">
                    <p>{{ question.text }}</p>
                    <el-rate v-model="responses.deliveryExperience[index]" :max="5" :texts="question.rating"
                        show-text />
                </div>
            </el-card>

            <!-- Sección 4: Opinión y Retroalimentación -->
            <el-card class="survey-section">
                <h2>💬 Sección 4: Opinión y Retroalimentación</h2>
                <div class="question">
                    <p>¿Cuál es tu principal motivo para elegirnos frente a otras pizzerías?</p>
                    <el-radio-group v-model="responses.feedback.reasonToChoose" size="small">
                        <el-radio label="10">Sabor</el-radio>
                        <el-radio label="11">Variedad</el-radio>
                        <el-radio label="12">Precio</el-radio>
                        <el-radio label="13">Promociones</el-radio>
                        <el-radio label="14">Atención al cliente</el-radio>
                    </el-radio-group>
                </div>

                <div class="question">
                    <p>¿Qué tan probable es que pruebes nuevos productos o promociones?</p>
                    <el-radio-group v-model="responses.feedback.tryNewProducts" size="small">
                        <el-radio label="15">Muy probable</el-radio>
                        <el-radio label="16">Algo probable</el-radio>
                        <el-radio label="17">No muy probable</el-radio>
                        <el-radio label="18">No lo haría</el-radio>
                    </el-radio-group>
                </div>

                <div class="question">
                    <p>¿Has considerado cambiar a otra pizzería en los últimos 3 meses?</p>
                    <el-radio-group v-model="responses.feedback.consideredChanging" size="small">
                        <el-radio label="19">Sí</el-radio>
                        <el-radio label="20">No</el-radio>
                    </el-radio-group>
                </div>
            </el-card>

            <!-- Botón de envío -->
            <div class="submit-button">
                <el-button type="primary" size="large" @click="submitSurvey">Enviar Encuesta</el-button>
            </div>
        </div>
    </el-dialog>
</template>

<script>
import { ElMessage } from 'element-plus'

export default {
    data() {
        return {
            dialogVisible: true,
            responses: {
                satisfaction: Array(5).fill(null),
                consumption: {
                    frequency: null,
                },
                deliveryExperience: Array(5).fill(null),
                feedback: {
                    reasonToChoose: null,
                    tryNewProducts: null,
                    consideredChanging: null,
                },
            },
            satisfactionQuestions: [
                { text: "¿Qué tan satisfecho estás con el sabor de nuestras pizzas?" },
                { text: "¿Qué tan satisfecho estás con el tiempo de entrega o atención?" },
                { text: "¿Qué tan satisfecho estás con la variedad de productos disponibles?" },
                { text: "¿Qué tan satisfecho estás con los precios en comparación a la calidad?" },
                { text: "¿Qué tan satisfecho estás con la atención al cliente?" },
            ],
            deliveryExperienceQuestions: [
                { text: "¿Qué tan fácil te resulta hacer un pedido?", rating: ['Muy Dificil', 'Dificil', 'Normal', 'Fácil', 'Muy Fácil'] },
                { text: "¿Qué tan puntual suele ser la entrega o atención en el local?", rating: ['Muy Lento', 'Lento', 'A tiempo', 'Rapido', 'Muy Rapido'] },
                { text: "¿Qué tan bien empaquetado llega tu pedido?", rating: ['Muy Malo', 'Malo', 'Normal', 'Bueno', 'Muy Bueno'] },
                { text: "¿Qué tan precisos son los pedidos (sin errores)?", rating: ['Impreciso', 'Poco Preciso', 'Normal', 'Preciso', 'Muy Preciso'] },
                { text: "¿Qué tan probable es que recomiendes nuestra pizzería a otros?", rating: ['Muy Improbable', 'Improbable', 'Probable', 'Muy Probable', 'Definitivamente'] },
            ],
        };
    },
    methods: {
        successMsg() {
            ElMessage({
                message: 'Encuesta enviada con éxito',
                type: 'success',
            });
        },
        async submitSurvey() {
            // Validaciónes
            const allRated = this.responses.satisfaction.every(r => r !== null) &&
                this.responses.deliveryExperience.every(r => r !== null) &&
                this.responses.consumption.frequency &&
                this.responses.feedback.reasonToChoose &&
                this.responses.feedback.tryNewProducts &&
                this.responses.feedback.consideredChanging;

            if (!allRated) {
                ElMessage({
                    message: 'Por favor, completa todas las preguntas antes de enviar.',
                    type: 'warning',
                });
                return;
            }
            try {
                const user = useSupabaseUser().value;
                if (!user) {
                    ElMessage.error('Usuario no autenticado');
                    return;
                }
                const id_cliente = user.id;
                const payload = {
                    id_cliente: id_cliente,
                    id_encuesta: 1,
                    respuestas: this.responses
                };
                this.dialogVisible = false;
                //Enviar datos a la API
                const response = await $fetch('/api/forms/general', {
                    method: 'POST',
                    body: JSON.stringify(payload),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                console.log('Respuesta del servidor:', response);
                this.successMsg();

            } catch (error) {
                console.error('Error al enviar la encuesta:', error);
                ElMessage({
                    message: 'Hubo un error al enviar la encuesta. Inténtalo más tarde.',
                    type: 'error',
                });
            }
        },
    },
};
</script>


