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
      Editar Pizza
    </h1>

    <el-card class="pizza-card p-6 max-w-lg mx-auto" v-if="!success">
      <el-form @submit.prevent="submitForm" label-position="top" :model="pizza" class="space-y-6">
        <el-form-item label="Nombre de la Pizza" :error="errors.nombre">
          <el-input v-model="pizza.nombre" placeholder="Ej: Pepperoni, Margarita"
            class="shadow-inner rounded-lg" />
        </el-form-item>

        <el-form-item label="Descripción" :error="errors.descripcion">
          <el-input type="textarea" v-model="pizza.descripcion" placeholder="Describe tu pizza"
            class="shadow-inner rounded-lg" rows="4" />
        </el-form-item>

        <el-form-item>
          <el-button type="success" native-type="submit" class="w-full pulse-button"
            style="background: linear-gradient(45deg, #e63946, #f1faee); color: #7f1d1d; font-weight: 700;">
            Actualizar Pizza
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- Animación de éxito -->
    <transition name="fade">
      <div v-if="success" class="text-center p-8 bg-green-100 rounded-lg max-w-lg mx-auto">
        <h2 class="text-2xl font-bold text-green-700 mb-4">¡Pizza actualizada exitosamente!</h2>
        <el-button type="primary" @click="goBack" class="pulse-button"
          style="background: linear-gradient(45deg, #e63946, #f1faee); color: #7f1d1d; font-weight: 700;">
          Volver a Pizzas
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
const success = ref(false);

const pizza = ref({
  id_pizza: null,
  nombre: '',
  descripcion: '',
});

const errors = ref({
  nombre: '',
  descripcion: '',
});

// Validaciones
const palabrasProhibidas = [
  'puta', 'puto', 'mierda', 'imbécil', 'estúpido', 'perra', 'culero',
  'pendejo', 'jodido', 'idiota', 'cabron', 'fuck', 'shit', 'bitch',
  'asshole', 'bastard', 'dumb', 'gay', 'marica'
];

const caracteresNombreValidos = /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s-]+$/;
const patronesMaliciosos = /(SELECT|INSERT|DELETE|UPDATE|DROP|UNION|--|<script>|<\/script>|document\.cookie|base64|OR\s+1=1)/i;
const contenidoBasura = /^(.)\1{5,}$|^(?:[xX\d\s]{4,}|[a-z]{3,}\d{3,})$/i;

const contienePalabraProhibida = (texto) => {
  const lowerText = texto.toLowerCase();
  return palabrasProhibidas.some(palabra => lowerText.includes(palabra));
};

const validateForm = () => {
  let valid = true;
  errors.value.nombre = '';
  errors.value.descripcion = '';

  const nombreTrim = pizza.value.nombre.trim();
  const descripcionTrim = pizza.value.descripcion.trim();

  // Validación nombre
  if (!nombreTrim) {
    errors.value.nombre = 'El nombre es obligatorio.';
    valid = false;
  } else if (nombreTrim.length > 100) {
    errors.value.nombre = 'El nombre no puede exceder los 100 caracteres.';
    valid = false;
  } else if (!caracteresNombreValidos.test(nombreTrim)) {
    errors.value.nombre = 'El nombre solo puede contener letras, espacios y guiones.';
    valid = false;
  } else if (contenidoBasura.test(nombreTrim)) {
    errors.value.nombre = 'El nombre contiene texto inválido o repetitivo.';
    valid = false;
  } else if (contienePalabraProhibida(nombreTrim)) {
    errors.value.nombre = 'El nombre contiene palabras inapropiadas.';
    valid = false;
  } else if (patronesMaliciosos.test(nombreTrim)) {
    errors.value.nombre = 'El nombre contiene posibles patrones maliciosos.';
    valid = false;
  }

  // Validación descripción
  if (!descripcionTrim) {
    errors.value.descripcion = 'La descripción es obligatoria.';
    valid = false;
  } else if (descripcionTrim.length > 1000) {
    errors.value.descripcion = 'La descripción no puede exceder los 1000 caracteres.';
    valid = false;
  } else if (contenidoBasura.test(descripcionTrim)) {
    errors.value.descripcion = 'La descripción contiene texto repetitivo o inválido.';
    valid = false;
  } else if (contienePalabraProhibida(descripcionTrim)) {
    errors.value.descripcion = 'La descripción contiene palabras inapropiadas.';
    valid = false;
  } else if (patronesMaliciosos.test(descripcionTrim)) {
    errors.value.descripcion = 'La descripción contiene posibles patrones maliciosos.';
    valid = false;
  }

  return valid;
};

const loadPizza = async (id) => {
  try {
    const response = await fetch(`/api/products/pizza?id=${id}`);
    if (!response.ok) throw new Error('Error al obtener los detalles de la pizza');
    const data = await response.json();
    if (Array.isArray(data) && data.length > 0) {
      pizza.value = data[0];
    } else {
      pizza.value = data;
    }
  } catch (error) {
    console.error(error.message);
    ElMessage.error('No se pudo cargar la pizza.');
  } finally {
    loading.value = false;
  }
};

const submitForm = async () => {
  if (!validateForm()) return;

  try {
    const response = await fetch(`/api/products/pizza`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify([pizza.value]),
    });

    if (!response.ok) throw new Error('Error al actualizar la pizza');

    await response.json();
    ElMessage.success('Pizza actualizada correctamente');
    success.value = true;
  } catch (error) {
    console.error(error.message);
    ElMessage.error(error.message);
  }
};

const goBack = async () => {
  const hasChanges =
    pizza.value.nombre.trim() !== '' ||
    pizza.value.descripcion.trim() !== '';

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
      router.push('/products/pizza');
    } catch {
      // Usuario canceló
    }
  } else {
    router.push('/products/pizza');
  }
};

onMounted(() => {
  const id = new URLSearchParams(window.location.search).get('id');
  if (id) loadPizza(id);
});
</script>

<style scoped>
.pizza-button-back {
  position: absolute;
  top: 1rem;
  left: 1rem;
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

.el-input input, .el-textarea__inner {
  border-radius: 10px !important;
  font-weight: 600;
  color: var(--pizza-brown);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
