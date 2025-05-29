<template>
  <!-- Botón Volver en la esquina superior izquierda -->
  <h1
    class="text-4xl font-pizza-title mb-8 text-pizza-red text-center drop-shadow-lg"
  >
    Agregar Tamaño
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
    <el-form @submit.prevent="submitForm" label-position="top" :model="tamaño" class="space-y-6">

      <el-form-item label="Nombre del Tamaño" :error="errors.nombre">
        <el-input
          v-model="tamaño.nombre"
          placeholder="Ej: Pequeña, Mediana, Grande"
          class="shadow-inner rounded-lg"
        />
      </el-form-item>

      <el-form-item label="Descripción" :error="errors.descripcion">
        <el-input
          v-model="tamaño.descripcion"
          placeholder="Ej: Tamaño individual, familiar..."
          class="shadow-inner rounded-lg"
        />
      </el-form-item>

      <el-form-item label="Precio Base ($)" :error="errors.precio_base">
        <el-input
          v-model.number="tamaño.precio_base"
          placeholder="Ej: 100"
          type="number"
          min="0"
          step="0.01"
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
          Agregar Tamaño
        </el-button>
      </el-form-item>

    </el-form>
  </el-card>

  <!-- Animación de éxito -->
  <transition name="fade">
    <div v-if="success" class="text-center p-8 bg-green-100 rounded-lg max-w-lg mx-auto">
      <h2 class="text-2xl font-bold text-green-700 mb-4">¡Tamaño agregado exitosamente!</h2>
      <el-button
        type="primary"
        @click="goBack"
        class="pulse-button"
        style="background: linear-gradient(45deg, #e63946, #f1faee); color: #7f1d1d; font-weight: 700;"
      >
        Volver a Tamaños
      </el-button>
    </div>
  </transition>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';

const router = useRouter();

const tamaño = ref({
  nombre: '',
  descripcion: '',
  precio_base: 100,
});

const errors = ref({
  nombre: '',
  descripcion: '',
  precio_base: '',
});

const success = ref(false);

// Validación
const palabrasProhibidas = [
  'malo', 'feo', 'idiota', 'tonto', 'spam', 'hack', 'malware', 'virus', 'script', 'drop', 'delete',
  'mierda', 'puta', 'estúpido', 'imbécil', 'pendejo', 'maldito', 'cabron', 'chingada', 'joder',
  'pedo', 'cabrón', 'coño', 'verga', 'fuck', 'shit', 'bitch', 'asshole',
  'retardado', 'sexo', 'pornografía', 'droga', 'terrorismo', 'asesinato'
];

const contienePatronesMaliciosos = (texto) => {
  const patrones = [/script/i, /insert\s+into/i, /drop\s+table/i, /delete\s+from/i];
  return patrones.some(p => p.test(texto));
};

const contieneRepeticiones = (texto) => {
  return /(.)\1{4,}/.test(texto); // 5 o más repeticiones consecutivas
};

const contienePalabrasProhibidas = (texto) => {
  const lower = texto.toLowerCase();
  return palabrasProhibidas.some(palabra => lower.includes(palabra));
};

const validateForm = () => {
  let valid = true;
  errors.value = { nombre: '', descripcion: '', precio_base: '' };

  const nombreTrim = tamaño.value.nombre.trim();
  const descTrim = tamaño.value.descripcion.trim();
  const precio = tamaño.value.precio_base;

  // Validación de nombre
  if (!nombreTrim) {
    errors.value.nombre = 'El nombre es obligatorio.';
    valid = false;
  } else if (nombreTrim.length < 3 || nombreTrim.length > 50) {
    errors.value.nombre = 'Debe tener entre 3 y 50 caracteres.';
    valid = false;
  } else if (contieneRepeticiones(nombreTrim) || contienePatronesMaliciosos(nombreTrim) || contienePalabrasProhibidas(nombreTrim)) {
    errors.value.nombre = 'El nombre contiene texto no permitido.';
    valid = false;
  }

  // Validación de descripción
  if (!descTrim) {
    errors.value.descripcion = 'La descripción es obligatoria.';
    valid = false;
  } else if (descTrim.length < 3 || descTrim.length > 100) {
    errors.value.descripcion = 'Debe tener entre 3 y 100 caracteres.';
    valid = false;
  } else if (contieneRepeticiones(descTrim) || contienePatronesMaliciosos(descTrim) || contienePalabrasProhibidas(descTrim)) {
    errors.value.descripcion = 'La descripción contiene texto no permitido.';
    valid = false;
  }

  // Validación de precio
  if (precio === null || precio === '' || isNaN(precio)) {
    errors.value.precio_base = 'El precio es obligatorio y debe ser numérico.';
    valid = false;
  } else if (precio < 1 || precio > 1000) {
    errors.value.precio_base = 'Debe estar entre 1 y 1000.';
    valid = false;
  } else if (!/^\d+(\.\d{1,2})?$/.test(precio)) {
    errors.value.precio_base = 'Máximo 2 decimales permitidos.';
    valid = false;
  }

  return valid;
};



// Enviar formulario
const submitForm = async () => {
  if (!validateForm()) return;

  try {
    const response = await fetch('/api/products/tamano', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tamaño.value),
    });

    if (!response.ok) throw new Error('Error al agregar tamaño');

    await response.json();
    ElMessage.success('Tamaño agregado correctamente');
    success.value = true;
  } catch (error) {
    ElMessage.error(error.message);
  }
};

// Volver con confirmación
const goBack = async () => {
  const hasChanges =
    tamaño.value.nombre.trim() !== '' ||
    tamaño.value.descripcion.trim() !== '' ||
    tamaño.value.precio_base !== 100;

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
      router.push('/products/tamano');
    } catch {
      // Si cancela, no hacemos nada
    }
  } else {
    router.push('/products/tamano');
  }
};
</script>

<style scoped>
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

.el-input input {
  border-radius: 10px !important;
  font-weight: 600;
  color: var(--pizza-brown);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
