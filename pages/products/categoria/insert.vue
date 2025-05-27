<template>
    <!-- Botón Volver en la esquina superior izquierda -->
   
    <h1
      class="text-4xl font-pizza-title mb-8 text-pizza-red text-center drop-shadow-lg"
    >
      Agregar Categoría
    </h1>

     <el-button
      type="info"
      class="absolute top-4 left-4 pizza-button-back"
      size="small"
      @click="goBack"
    >
      ←Volver
    </el-button>


    <el-card class="pizza-card p-6 max-w-lg mx-auto" v-if="!success">
      <el-form @submit.prevent="submitForm" label-position="top" :model="categoria" class="space-y-6">

        <el-form-item label="Nombre de la Categoría" :error="errors.nombre">
          <el-input
            v-model="categoria.nombre"
            placeholder="Ej: Bebidas, Postres, Entradas"
            class="shadow-inner rounded-lg"
          />
        </el-form-item>

        <el-form-item label="Precio Extra ($)" :error="errors.precio_extra">
          <el-input
            v-model.number="categoria.precio_extra"
            placeholder="Ej: 10"
            type="number"
            min="0"
            class="shadow-inner rounded-lg"
          />
        </el-form-item>

        <el-form-item>
          <el-button
            type="success"
            native-type="submit"
            class="w-full pulse-button"
            style="background: linear-gradient(45deg, #e63946, #f1faee); color: #7f1d1d; font-weight: 700;"
          >
            Agregar Categoría
          </el-button>
        </el-form-item>

      </el-form>
    </el-card>

    <!-- Animación de éxito -->
    <transition name="fade">
      <div v-if="success" class="text-center p-8 bg-green-100 rounded-lg max-w-lg mx-auto">
        <h2 class="text-2xl font-bold text-green-700 mb-4">¡Categoría agregada exitosamente!</h2>
        <el-button
          type="primary"
          @click="goBack"
          class="pulse-button"
          style="background: linear-gradient(45deg, #e63946, #f1faee); color: #7f1d1d; font-weight: 700;"
        >
          Volver a Categorías
        </el-button>
      </div>
    </transition>

</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';

const router = useRouter();
const categoria = ref({
  nombre: '',
  precio_extra: 0,
});

const errors = ref({
  nombre: '',
  precio_extra: '',
});

const success = ref(false);

// Validar formulario
const validateForm = () => {
  let valid = true;
  errors.value.nombre = '';
  errors.value.precio_extra = '';

  const nombreTrim = categoria.value.nombre.trim();

  if (!nombreTrim) {
    errors.value.nombre = 'El nombre es obligatorio.';
    valid = false;
  } else if (nombreTrim.length > 100) {
    errors.value.nombre = 'El nombre no puede exceder los 100 caracteres.';
    valid = false;
  } else if (!/[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ]/.test(nombreTrim)) {
    errors.value.nombre = 'El nombre debe contener al menos una letra.';
    valid = false;
  } else if (/^(.)\1+$/.test(nombreTrim)) {
    errors.value.nombre = 'El nombre no puede ser una repetición del mismo carácter.';
    valid = false;
  }

  if (categoria.value.precio_extra === null || categoria.value.precio_extra < 0) {
    errors.value.precio_extra = 'El precio debe ser 0 o mayor.';
    valid = false;
  } else if (categoria.value.precio_extra > 1000) {
    errors.value.precio_extra = 'El precio no puede ser mayor a 1000.';
    valid = false;
  }

  return valid;
};

const submitForm = async () => {
  if (!validateForm()) return;

  try {
    const response = await fetch('/api/products/categoria', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(categoria.value),
    });

    if (!response.ok) throw new Error('Error al agregar categoría');

    await response.json();
    ElMessage.success('Categoría agregada correctamente');
    success.value = true;
  } catch (error) {
    ElMessage.error(error.message);
  }
};

const goBack = () => {
  router.push('/products/categoria');
};
</script>

<style scoped>
/* Reusar variables y estilos del index para consistencia */

.pizza-button-back {
  background: linear-gradient(45deg, #e63946, #f1faee);
  color: #7f1d1d;
  font-weight: 700;
  box-shadow: 0 4px 8px rgba(230, 57, 70, 0.6);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.pizza-button-back:hover {
  background-color: #e63946;
  color: #fff;
  box-shadow: 0 6px 15px rgba(230, 57, 70, 0.7);
}

/* Animación de pulso para botón agregar y volver */
@keyframes pulse {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(230, 57, 70, 0.7);
  }
  70% {
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(230, 57, 70, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(230, 57, 70, 0);
  }
}

.pulse-button {
  animation: pulse 2s infinite;
  transition: all 0.3s ease;
  font-weight: 700;
  box-shadow: 0 4px 8px rgba(230, 57, 70, 0.6);
  border-radius: 8px;
}

/* Inputs personalizados para que mantengan el estilo pizza */
.el-input input {
  border-radius: 10px !important;
  font-weight: 600;
  color: var(--pizza-brown);
}

/* Container ya definido en global o index */

/* Transición fade para el mensaje de éxito */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
