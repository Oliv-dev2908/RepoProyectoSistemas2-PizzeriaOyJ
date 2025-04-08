<template>
    <div class="p-4">
        <h2 class="text-2xl font-bold mb-4">Elabora una encuesta</h2>
        
        <label for="questionType" class="block mb-2">Tipo de Pregunta</label>
        <select v-model="selectedQuestionType" id="questionType" class="border p-2 mb-4 w-full">
            <option value="open">Pregunta Abierta</option>
            <option value="single">Opción Única</option>
            <option value="multiple">Opción Múltiple</option>
            <option value="likert">Escala de Likert</option>
        </select>

        <label for="questionName" class="block mb-2">Nombre de la Pregunta</label>
        <input type="text" v-model="questionName" id="questionName" class="border p-2 mb-4 w-full">
        
        <button @click="addQuestion" class="bg-blue-500 text-white p-2 rounded mb-4">
            Agregar Pregunta
        </button>

        <div id="form">
            <div v-for="(question, index) in questions" :key="index" class="mb-4 border p-4 rounded">
                <div class="flex items-center mb-2">
                    <input type="text" v-model="question.text" class="border p-2 w-full mr-2" placeholder="Nombre de la Pregunta">
                    <button @click="removeQuestion(index)" class="bg-red-500 text-white p-1 rounded">
                        Eliminar
                    </button>
                </div>
                
                <div v-if="question.type === 'open'">
                    <select v-model="question.responseType" class="border p-2 mb-2 w-full">
                        <option value="text">Texto</option>
                        <option value="number">Numérico</option>
                    </select>
                    <input type="text" :name="'Pregunta' + index" :id="'Pregunta' + index" class="border p-2 mb-2 w-full" placeholder="Respuesta abierta">
                </div>

                <div v-else-if="question.type === 'single'">
                    <div v-for="(option, optionIndex) in question.options" :key="optionIndex" class="flex items-center mb-2">
                        <input type="radio" :name="'Pregunta' + index" :id="'Pregunta' + index + 'Opcion' + optionIndex" :value="option.text" class="mr-2">
                        <input type="text" v-model="option.text" class="border p-2 w-full mr-2" placeholder="Opción">
                        <button @click="removeOption(index, optionIndex)" class="bg-red-500 text-white p-1 rounded">
                            Eliminar
                        </button>
                    </div>
                    <button @click="addOption(index)" class="bg-green-500 text-white p-1 rounded">
                        Agregar Opción
                    </button>
                </div>

                <div v-else-if="question.type === 'multiple'">
                    <div v-for="(option, optionIndex) in question.options" :key="optionIndex" class="flex items-center mb-2">
                        <input type="checkbox" :id="'Pregunta' + index + 'Opcion' + optionIndex" :value="option.text" class="mr-2">
                        <input type="text" v-model="option.text" class="border p-2 w-full mr-2" placeholder="Opción">
                        <button @click="removeOption(index, optionIndex)" class="bg-red-500 text-white p-1 rounded">
                            Eliminar
                        </button>
                    </div>
                    <button @click="addOption(index)" class="bg-green-500 text-white p-1 rounded">
                        Agregar Opción
                    </button>
                </div>

                <div v-else-if="question.type === 'likert'">
                    <label class="block mb-2">Escala de Likert</label>
                    <select v-model="question.scaleType" class="border p-2 mb-2 w-full">
                        <option value="3">3 Parámetros</option>
                        <option value="5">5 Parámetros</option>
                    </select>
                    <div class="flex items-center mb-2">
                        <input type="text" v-model="question.labels[0].text" class="border p-2 w-full mr-2" placeholder="Etiqueta 1">
                        <input type="text" v-model="question.labels[1].text" class="border p-2 w-full mr-2" placeholder="Etiqueta 2">
                        <input type="text" v-model="question.labels[2].text" class="border p-2 w-full mr-2" placeholder="Etiqueta 3">
                        <div v-if="question.scaleType === '5'">
                            <input type="text" v-model="question.labels[3].text" class="border p-2 w-full mr-2" placeholder="Etiqueta 4">
                            <input type="text" v-model="question.labels[4].text" class="border p-2 w-full mr-2" placeholder="Etiqueta 5">
                        </div>
                    </div>
                    <button @click="toggleNestedQuestion(index)" class="bg-yellow-500 text-white p-1 rounded">
                        {{ question.nested ? 'Eliminar Pregunta Anidada' : 'Agregar Pregunta Anidada' }}
                    </button>
                    <div v-if="question.nested">
                        <label class="block mb-2">Condición para habilitar pregunta anidada</label>
                        <select v-model="question.nestedCondition" class="border p-2 mb-2 w-full">
                            <option value="greaterThan2">Si se selecciona en el nivel 2 o más</option>
                            <option value="lessThan3">Si se selecciona en el nivel 3 o menos</option>
                            <option value="exactly5">Si se selecciona en el nivel 5</option>
                        </select>
                        <input type="text" v-model="question.nestedQuestion" class="border p-2 mb-2 w-full" placeholder="Pregunta Anidada">
                    </div>
                </div>
            </div>
        </div>

        <button @click="submitForm" class="bg-blue-600 text-white p-2 rounded">
            Enviar Formulario
        </button>
    </div>
</template>

<script>
export default {
    data() {
        return {
            questionName: '',
            selectedQuestionType: 'open',
            questions: []
        };
    },
    methods: {
        addQuestion() {
            if (this.questionName) {
                this.questions.push({ 
                    text: this.questionName, 
                    type: this.selectedQuestionType, 
                    responseType: this.selectedQuestionType === 'open' ? 'text' : null, 
                    options: [], 
                    labels: [{ text: 'Satisfecho' }, { text: 'Indiferente' }, { text: 'Insatisfecho' }, {text: 'Opcion 4'}, {text: 'Opcion 5'}],
                    scaleType: '3',
                    nested: false,
                    nestedQuestion: '',
                    nestedCondition: ''
                });
                this.questionName = ''; 
                this.selectedQuestionType = 'open'; 
            }
        },
        toggleNestedQuestion(questionIndex) {
            this.questions[questionIndex].nested = !this.questions[questionIndex].nested;
        },
        addOption(questionIndex) {
            const optionText = prompt("Ingrese el texto de la opción:");
            if (optionText) {
                this.questions[questionIndex].options.push({ text: optionText });
            }
        },
        removeOption(questionIndex, optionIndex) {
            this.questions[questionIndex].options.splice(optionIndex, 1);
        },
        removeQuestion(index) {
            this.questions.splice(index, 1);
        },
        submitForm() {
            const formData = this.questions.map(question => ({
                text: question.text,
                type: question.type,
                options: question.options.map(option => option.text),
                labels: question.labels.map(label => label.text),
                nestedQuestion: question.nested ? question.nestedQuestion : null,
                nestedCondition: question.nested ? question.nestedCondition : null
            }));
            console.log(JSON.stringify(formData, null, 2));
        }
    }
}
</script>

<style scoped>
/* Puedes agregar estilos adicionales aquí si es necesario */
</style>