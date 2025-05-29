<template>
  <div v-if="loading">
    Cargando . . .
  </div>
  <div v-else class="container mx-auto p-6 relative">
    <!-- Botón Volver -->
    <el-button type="info" class="absolute top-4 left-4 pizza-button-back" size="small" @click="goBack">
      ←Volver
    </el-button>

    <h1 class="text-4xl font-pizza-title mb-8 text-pizza-red text-center drop-shadow-lg">
      Editar Categoría
    </h1>

    <el-card class="pizza-card p-6 max-w-lg mx-auto" v-if="!success">
      <el-form @submit.prevent="submitForm" label-position="top" :model="categoria" class="space-y-6">

        <el-form-item label="Nombre de la Categoría" :error="errors.nombre">
          <el-input v-model="categoria.nombre" placeholder="Ej: Bebidas, Postres, Entradas"
            class="shadow-inner rounded-lg" maxlength="100" />


        </el-form-item>

        <el-form-item label="Precio Extra ($)" :error="errors.precio_extra">
          <el-input v-model.number="categoria.precio_extra" placeholder="Ej: 10" type="number" min="0" max="1000"
            class="shadow-inner rounded-lg" @input="onPrecioInput" />
        </el-form-item>

        <el-form-item>
          <el-button type="success" native-type="submit" class="w-full pulse-button"
            style="background: linear-gradient(45deg, #e63946, #f1faee); color: #7f1d1d; font-weight: 700;">
            Actualizar Categoría
          </el-button>
        </el-form-item>

      </el-form>
    </el-card>

    <!-- Animación de éxito -->
    <transition name="fade">
      <div v-if="success" class="text-center p-8 bg-green-100 rounded-lg max-w-lg mx-auto">
        <h2 class="text-2xl font-bold text-green-700 mb-4">¡Categoría actualizada exitosamente!</h2>
        <el-button type="primary" @click="goBack" class="pulse-button"
          style="background: linear-gradient(45deg, #e63946, #f1faee); color: #7f1d1d; font-weight: 700;">
          Volver a Categorías
        </el-button>
      </div>
    </transition>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';

const router = useRouter();
const loading = ref(true);

const categoria = ref({
  id_categoria: null,
  nombre: '',
  precio_extra: 0,
});

const errors = ref({
  nombre: '',
  precio_extra: '',
});

const success = ref(false);

// Validar formulario

const onPrecioInput = () => {
  // Limitar a 2 decimales y máximo 1000
  let val = categoria.value.precio_extra;

  if (val > 1000) {
    categoria.value.precio_extra = 1000;
  }

  // Forzar máximo 2 decimales
  if (val !== null && val !== undefined) {
    const strVal = val.toString();
    if (strVal.includes('.')) {
      const parts = strVal.split('.');
      if (parts[1].length > 2) {
        categoria.value.precio_extra = parseFloat(parts[0] + '.' + parts[1].slice(0, 2));
      }
    }
  }
};


const validateForm = () => {
  let valid = true;
  errors.value.nombre = '';
  errors.value.precio_extra = '';

  const nombreTrim = categoria.value.nombre.trim();

  const palabrasProhibidas = ['script', 'drop', 'delete', 'update', 'insert', 'select', 'truncate', 'alert', 'onerror', 'onload'];
  const contienePalabraProhibida = palabrasProhibidas.some(p => nombreTrim.toLowerCase().includes(p));

  if (!nombreTrim) {
    errors.value.nombre = 'El nombre es obligatorio.';
    valid = false;
  } else if (nombreTrim.length < 3) {
    errors.value.nombre = 'El nombre debe tener al menos 3 caracteres.';
    valid = false;
  } else if (nombreTrim.length > 100) {
    errors.value.nombre = 'El nombre no puede exceder los 100 caracteres.';
    valid = false;
  } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/.test(nombreTrim)) {
    errors.value.nombre = 'El nombre solo puede contener letras y espacios.';
    valid = false;
  } else if (/^(.)\1{2,}$/.test(nombreTrim)) {
    errors.value.nombre = 'El nombre no puede tener el mismo carácter repetido muchas veces.';
    valid = false;
  } else if (contienePalabraProhibida) {
    errors.value.nombre = 'El nombre contiene palabras no permitidas.';
    valid = false;
  }

  const precio = categoria.value.precio_extra;
  if (precio === null || precio === '') {
    errors.value.precio_extra = 'El precio es obligatorio.';
    valid = false;
  } else if (isNaN(precio)) {
    errors.value.precio_extra = 'El precio debe ser un número.';
    valid = false;
  } else if (precio < 0) {
    errors.value.precio_extra = 'El precio debe ser 0 o mayor.';
    valid = false;
  } else if (precio > 1000) {
    errors.value.precio_extra = 'El precio no puede ser mayor a 1000.';
    valid = false;
  } else if (!Number.isInteger(precio * 100)) {
    errors.value.precio_extra = 'El precio solo puede tener hasta 2 decimales.';
    valid = false;
  }

  return valid;
};

// Cargar categoría
const loadCategoria = async (id) => {
  try {
    const response = await fetch(`/api/products/categoria?id=${id}`);
    if (!response.ok) {
      throw new Error('Error fetching categoría');
    }
    const data = await response.json();
    if (Array.isArray(data) && data.length > 0) {
      categoria.value = data[0];
    } else {
      categoria.value = data;
    }
  } catch (error) {
    console.error(error.message);
    ElMessage.error('No se pudo cargar la categoría.');
  } finally {
    loading.value = false;
  }
};

// Actualizar categoría
const submitForm = async () => {
  if (!validateForm()) {
    return;
  }

  try {
    const response = await fetch(`/api/products/categoria`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([categoria.value]), // <---- envías un array
    });

    if (!response.ok) {
      throw new Error('Error al actualizar categoría');
    }

    await response.json();
    ElMessage.success('Categoría actualizada correctamente');
    success.value = true;
  } catch (error) {
    console.error(error.message);
    ElMessage.error(error.message);
  }
};

// Volver con confirmación si hay cambios sin guardar
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
      // No hacemos nada si cancela
    }
  } else {
    router.push('/products/categoria');
  }
};

// Cuando monta el componente
onMounted(() => {
  const id = new URLSearchParams(window.location.search).get('id');
  if (id) loadCategoria(id);
});
</script>

<style scoped>
.pizza-button-back {
  position: absolute;
  top: 1rem;
  /* 16px */
  left: 1rem;
  /* 16px */
  z-index: 9999;
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

/* Animación de pulso para botón */
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

/* Inputs personalizados */
.el-input input {
  border-radius: 10px !important;
  font-weight: 600;
  color: var(--pizza-brown);
}

/* Transición fade para el mensaje de éxito */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>