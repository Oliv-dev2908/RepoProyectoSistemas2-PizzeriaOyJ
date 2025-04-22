<template>
  <div class="container mx-auto p-6 relative">
    <!-- Botón Volver en la esquina superior izquierda -->
    <el-button
      type="info"
      class="absolute top-4 left-4"
      size="small"
      @click="goBack"
    >
      Volver
    </el-button>

    <h1 class="text-3xl font-bold mb-6 text-gray-800 text-center">Agregar Categoría</h1>

    <el-card class="p-4" v-if="!success">
      <el-form @submit.prevent="submitForm" label-position="top" :model="categoria" class="space-y-4">

        <el-form-item label="Nombre de la Categoría" :error="errors.nombre">
          <el-input v-model="categoria.nombre" placeholder="Ej: Bebidas, Postres, Entradas" />
        </el-form-item>

        <el-form-item label="Precio Extra ($)" :error="errors.precio_extra">
          <el-input
            v-model.number="categoria.precio_extra"
            placeholder="Ej: 10"
            type="number"
            min="0"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="success" native-type="submit" class="w-full">
            Agregar Categoría
          </el-button>
        </el-form-item>

      </el-form>
    </el-card>

    <!-- Animación de éxito -->
    <transition name="fade">
      <div v-if="success" class="text-center p-8 bg-green-100 rounded-lg">
        <h2 class="text-2xl font-bold text-green-700 mb-4">¡Categoría agregada exitosamente!</h2>
        <el-button type="primary" @click="goBack">Volver a Categorías</el-button>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus'; // Importamos ElMessageBox

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

  if (!categoria.value.nombre.trim()) {
    errors.value.nombre = 'El nombre es obligatorio.';
    valid = false;
  }

  if (categoria.value.precio_extra === null || categoria.value.precio_extra < 0) {
    errors.value.precio_extra = 'El precio debe ser 0 o mayor.';
    valid = false;
  }

  return valid;
};

const submitForm = async () => {
  if (!validateForm()) {
    return;
  }

  try {
    const response = await fetch('/api/products/categoria', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(categoria.value),
    });

    if (!response.ok) {
      throw new Error('Error al agregar categoría');
    }

    await response.json();
    ElMessage.success('Categoría agregada correctamente');
    success.value = true;

  } catch (error) {
    console.error(error.message);
    ElMessage.error(error.message);
  }
};

const goBack = async () => {
  const hasChanges =
    categoria.value.nombre.trim() !== '' ||
    categoria.value.precio_extra !== 0;

  if (hasChanges && !success.value) {
    try {
      await ElMessageBox.confirm(
        'Tienes cambios sin guardar. ¿Seguro que quieres salir? Se perderán los datos.',
        'Confirmar salida',
        {
          confirmButtonText: 'Sí, salir',
          cancelButtonText: 'Cancelar',
          type: 'warning',
        }
      );
      router.push('/products/categoria');
    } catch {
      // Si cancela, no hacemos nada
    }
  } else {
    router.push('/products/categoria');
  }
};
</script>

<style scoped>
.container {
  max-width: 600px;
  position: relative;
}

/* Animación de fade */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
