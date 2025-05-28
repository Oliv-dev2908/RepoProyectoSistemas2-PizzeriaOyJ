<template>
  <h1 class="text-4xl font-pizza-title mb-8 text-pizza-red text-center drop-shadow-lg">
    Agregar Pizza
  </h1>

  <el-button type="info" class="absolute top-4 left-4 pizza-button-back" size="small" @click="goBack">
    ←Volver
  </el-button>

  <el-card class="pizza-card p-6 max-w-lg mx-auto" v-if="!success">
    <el-form @submit.prevent="submitForm" label-position="top" :model="pizza" class="space-y-6">

      <el-form-item label="Nombre de la Pizza" :error="errors.nombre">
        <el-input v-model="pizza.nombre" placeholder="Ej: Margarita, Pepperoni, Hawaiana"
          class="shadow-inner rounded-lg" />
      </el-form-item>

      <el-form-item label="Descripción" :error="errors.descripcion">
        <el-input type="textarea" v-model="pizza.descripcion"
          placeholder="Ej: Pizza con salsa de tomate, mozzarella y albahaca" rows="3" class="shadow-inner rounded-lg" />
      </el-form-item>

      <el-form-item>
        <el-button type="success" native-type="submit" class="w-full pulse-button"
          style="background: linear-gradient(45deg, #e63946, #f1faee); color: #7f1d1d; font-weight: 700;">
          Agregar Pizza
        </el-button>
      </el-form-item>

    </el-form>
  </el-card>

  <!-- Animación de éxito -->
  <transition name="fade">
    <div v-if="success" class="text-center p-8 bg-green-100 rounded-lg max-w-lg mx-auto">
      <h2 class="text-2xl font-bold text-green-700 mb-4">¡Pizza agregada exitosamente!</h2>
      <el-button type="primary" @click="goBack" class="pulse-button"
        style="background: linear-gradient(45deg, #e63946, #f1faee); color: #7f1d1d; font-weight: 700;">
        Volver a Pizzas
      </el-button>
    </div>
  </transition>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';

const router = useRouter();
const pizza = ref({
  nombre: '',
  descripcion: '',
});

const errors = ref({
  nombre: '',
  descripcion: '',
});

const success = ref(false);

const validateForm = () => {
  let valid = true;
  errors.value.nombre = '';
  errors.value.descripcion = '';

  const nombreTrim = pizza.value.nombre.trim();
  const descripcionTrim = pizza.value.descripcion.trim();

  // Reglas comunes
  const caracteresNombreValidos = /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s-]+$/;
  const patronesMaliciosos = /(SELECT|INSERT|DELETE|UPDATE|DROP|UNION|--|<script>|<\/script>|document\.cookie|base64|OR\s+1=1)/i;
  const contenidoBasura = /^(.)\1{5,}$|^(?:[xX\d\s]{4,}|[a-z]{3,}\d{3,})$/;

  const palabrasProhibidas = [
    'mierda', 'puta', 'estúpido', 'imbécil', 'tonto', 'idiota',
    'pendejo', 'maldito', 'cabron', 'chingada', 'joder', 'pedo',
    'cabrón', 'coño', 'verga', 'fuck', 'shit', 'bitch', 'asshole',
    'retardado', 'sexo', 'pornografía', 'droga', 'terrorismo', 'asesinato'
  ];

  const contienePalabraProhibida = (texto) => {
    const textoLower = texto.toLowerCase();
    return palabrasProhibidas.some(palabra => textoLower.includes(palabra));
  };

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
  } else if (patronesMaliciosos.test(nombreTrim)) {
    errors.value.nombre = 'El nombre contiene posibles patrones maliciosos.';
    valid = false;
  } else if (contienePalabraProhibida(nombreTrim)) {
    errors.value.nombre = 'El nombre contiene palabras inapropiadas.';
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
  } else if (patronesMaliciosos.test(descripcionTrim)) {
    errors.value.descripcion = 'La descripción contiene posibles patrones maliciosos.';
    valid = false;
  } else if (contienePalabraProhibida(descripcionTrim)) {
    errors.value.descripcion = 'La descripción contiene palabras inapropiadas.';
    valid = false;
  }

  return valid;
};



const submitForm = async () => {
  if (!validateForm()) return;

  try {
    const response = await fetch('/api/products/pizza', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pizza.value),
    });

    if (!response.ok) throw new Error('Error al agregar pizza');

    await response.json();
    ElMessage.success('Pizza agregada correctamente');
    success.value = true;
  } catch (error) {
    ElMessage.error(error.message);
  }
};

const goBack = () => {
  router.push('/products/pizza');
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

.el-input input,
.el-textarea__inner {
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
