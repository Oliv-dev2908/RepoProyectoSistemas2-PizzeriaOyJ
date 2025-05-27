<template>
  <h1 class="text-4xl font-pizza-title mb-8 text-pizza-red text-center drop-shadow-lg">
    Agregar Ingrediente
  </h1>

  <el-button type="info" class="absolute top-4 left-4 pizza-button-back" size="small" @click="goBack">
    ←Volver
  </el-button>

  <el-card class="pizza-card p-6 max-w-lg mx-auto" v-if="!success">
    <el-form @submit.prevent="submitForm" label-position="top" :model="ingrediente" class="space-y-6">
      <el-form-item label="Nombre del Ingrediente" :error="errors.nombre">
        <el-input
          v-model="ingrediente.nombre"
          placeholder="Ej: Tomate, Queso, Pepperoni"
          class="shadow-inner rounded-lg"
        />
      </el-form-item>

      <el-form-item label="Costo Unitario ($)" :error="errors.costo_unitario">
        <el-input
          v-model.number="ingrediente.costo_unitario"
          type="number"
          min="0"
          step="0.01"
          placeholder="Ej: 2.50"
          class="shadow-inner rounded-lg"
        />
      </el-form-item>

      <el-form-item label="Tipo de Ingrediente" :error="errors.tipo">
        <el-select
          v-model="ingrediente.tipo"
          placeholder="Seleccione un tipo"
          class="w-full"
        >
          <el-option v-for="tipo in tiposIngrediente" :key="tipo" :label="tipo" :value="tipo" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button
          type="success"
          native-type="submit"
          class="w-full pulse-button"
          style="background: linear-gradient(45deg, #e63946, #f1faee); color: #7f1d1d; font-weight: 700;"
        >
          Agregar Ingrediente
        </el-button>
      </el-form-item>
    </el-form>
  </el-card>

  <transition name="fade">
    <div v-if="success" class="text-center p-8 bg-green-100 rounded-lg max-w-lg mx-auto">
      <h2 class="text-2xl font-bold text-green-700 mb-4">¡Ingrediente agregado exitosamente!</h2>
      <el-button
        type="primary"
        @click="goBack"
        class="pulse-button"
        style="background: linear-gradient(45deg, #e63946, #f1faee); color: #7f1d1d; font-weight: 700;"
      >
        Volver a Ingredientes
      </el-button>
    </div>
  </transition>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';

const router = useRouter();
const ingrediente = ref({
  nombre: '',
  costo_unitario: 0.0,
  tipo: '',
});

const errors = ref({
  nombre: '',
  costo_unitario: '',
  tipo: '',
});

const success = ref(false);

const tiposIngrediente = [
  'Vegetal',
  'Cárnico',
  'Lácteo',
  'Mariscos',
  'Frutas',
  'Salsas',
  'Otro',
];

const palabrasProhibidas = ['mierda', 'prueba', 'xd', 'tonto', 'puto', 'falso'];

const validarNombre = (nombre) => {
  const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{2,50}$/;
  return regex.test(nombre);
};

const validarCosto = (costo) => {
  return /^\d{1,3}(\.\d{1,2})?$/.test(costo.toString()) && costo <= 500;
};

const contienePalabrasProhibidas = (texto) => {
  return palabrasProhibidas.some(p => texto.toLowerCase().includes(p));
};

const validateForm = () => {
  let valid = true;
  errors.value = { nombre: '', costo_unitario: '', tipo: '' };

  const nombre = ingrediente.value.nombre.trim();

  if (!nombre) {
    errors.value.nombre = 'El nombre es obligatorio.';
    valid = false;
  } else if (!validarNombre(nombre)) {
    errors.value.nombre = 'Solo letras y espacios (2-50 caracteres).';
    valid = false;
  } else if (contienePalabrasProhibidas(nombre)) {
    errors.value.nombre = 'Nombre no permitido.';
    valid = false;
  }

  const costo = ingrediente.value.costo_unitario;

  if (costo === null || isNaN(costo)) {
    errors.value.costo_unitario = 'El costo es obligatorio.';
    valid = false;
  } else if (!validarCosto(costo)) {
    errors.value.costo_unitario = 'Máximo $500 y hasta 2 decimales.';
    valid = false;
  }

  if (!ingrediente.value.tipo) {
    errors.value.tipo = 'Debe seleccionar un tipo.';
    valid = false;
  }

  return valid;
};

const submitForm = async () => {
  if (!validateForm()) return;

  try {
    const response = await fetch('/api/products/ingrediente', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ingrediente.value),
    });

    if (!response.ok) throw new Error('Error al agregar ingrediente');

    await response.json();
    ElMessage.success('Ingrediente agregado correctamente');
    success.value = true;
  } catch (error) {
    ElMessage.error(error.message);
  }
};

const goBack = () => {
  router.push('/products/ingrediente');
};
</script>
