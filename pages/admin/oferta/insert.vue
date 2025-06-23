<template>
  <div class="container mx-auto p-6 bg-pizza-bg rounded-lg shadow-lg max-w-lg">
    <!-- Botón Volver -->
    <el-button
      type="info"
      class="absolute top-4 left-4 pizza-button-back"
      size="small"
      @click="goBack"
    >
      ← Volver
    </el-button>

    <h1
      class="text-4xl font-pizza-title mb-8 text-pizza-red text-center drop-shadow-lg"
    >
      Agregar Oferta
    </h1>

    <el-card class="pizza-card p-6" v-if="!success">
      <el-form @submit.prevent="submitForm" label-position="top" :model="oferta" class="space-y-6">

        <el-form-item label="Nombre de la Oferta" :error="errors.nombre">
          <el-input
            v-model="oferta.nombre"
            placeholder="Ej: Promo Verano, 2x1 Especial"
            class="shadow-inner rounded-lg"
          />
        </el-form-item>

        <el-form-item label="Descripción" :error="errors.descripcion">
          <el-input
            type="textarea"
            v-model="oferta.descripcion"
            placeholder="Descripción breve de la oferta"
            rows="3"
            class="shadow-inner rounded-lg"
          />
        </el-form-item>

        <el-form-item label="Tipo de Oferta" :error="errors.tipo">
          <el-select v-model="oferta.tipo" placeholder="Selecciona tipo de oferta">
            <el-option label="Descuento %" value="descuento" />
            <el-option label="N x M (Ej: 3x2)" value="n_x_m" />
          </el-select>
        </el-form-item>

        <!-- Campos condicionales según tipo -->
        <el-form-item v-if="oferta.tipo === 'descuento'" label="Porcentaje de Descuento" :error="errors.descuento">
          <el-input
            v-model.number="oferta.descuento"
            type="number"
            min="0"
            max="100"
            step="0.01"
            placeholder="Ej: 50 para 50%"
            class="shadow-inner rounded-lg"
          />
        </el-form-item>

        <div v-if="oferta.tipo === 'n_x_m'" class="grid grid-cols-2 gap-4">
          <el-form-item label="Cantidad N (Compras)" :error="errors.n_cantidad">
            <el-input
              v-model.number="oferta.n_cantidad"
              type="number"
              min="1"
              placeholder="Ej: 3"
              class="shadow-inner rounded-lg"
            />
          </el-form-item>
          <el-form-item label="Cantidad M (Pagas)" :error="errors.m_paga">
            <el-input
              v-model.number="oferta.m_paga"
              type="number"
              min="1"
              placeholder="Ej: 2"
              class="shadow-inner rounded-lg"
            />
          </el-form-item>
        </div>

        <el-form-item label="Fecha Inicio" :error="errors.fecha_inicio">
          <el-date-picker
            v-model="oferta.fecha_inicio"
            type="date"
            placeholder="Selecciona fecha de inicio"
            class="w-full shadow-inner rounded-lg"
            :disabled-date="disablePastDates"
          />
        </el-form-item>

        <el-form-item label="Fecha Fin" :error="errors.fecha_fin">
          <el-date-picker
            v-model="oferta.fecha_fin"
            type="date"
            placeholder="Selecciona fecha de fin"
            class="w-full shadow-inner rounded-lg"
            :disabled-date="disableBeforeStart"
          />
        </el-form-item>

        <el-form-item label="Pizzas aplicables" :error="errors.pizzas">
          <el-select
            v-model="oferta.pizzas"
            multiple
            filterable
            placeholder="Selecciona pizzas para esta oferta"
            class="w-full shadow-inner rounded-lg"
            :loading="loadingPizzas"
            clearable
          >
            <el-option
              v-for="pizza in pizzas"
              :key="pizza.id_pizza"
              :label="pizza.nombre"
              :value="pizza.id_pizza"
            />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button
            type="success"
            native-type="submit"
            class="w-full pulse-button"
            style="background: linear-gradient(45deg, #e63946, #f1faee); color: #7f1d1d; font-weight: 700;"
          >
            Agregar Oferta
          </el-button>
        </el-form-item>

      </el-form>
    </el-card>

    <!-- Mensaje éxito -->
    <transition name="fade">
      <div v-if="success" class="text-center p-8 bg-green-100 rounded-lg">
        <h2 class="text-2xl font-bold text-green-700 mb-4">¡Oferta agregada exitosamente!</h2>
        <el-button
          type="primary"
          @click="goBack"
          class="pulse-button"
          style="background: linear-gradient(45deg, #e63946, #f1faee); color: #7f1d1d; font-weight: 700;"
        >
          Volver a Ofertas
        </el-button>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';

const router = useRouter();

const oferta = ref({
  nombre: '',
  descripcion: '',
  tipo: '',
  descuento: null,
  n_cantidad: null,
  m_paga: null,
  fecha_inicio: null,
  fecha_fin: null,
  pizzas: [],
});

const errors = ref({
  nombre: '',
  descripcion: '',
  tipo: '',
  descuento: '',
  n_cantidad: '',
  m_paga: '',
  fecha_inicio: '',
  fecha_fin: '',
  pizzas: '',
});

const success = ref(false);
const pizzas = ref([]);
const loadingPizzas = ref(true);

// Cargar pizzas para selección
const loadPizzas = async () => {
  try {
    const res = await fetch('/api/products/pizza');
    if (!res.ok) throw new Error('Error al cargar pizzas');
    pizzas.value = await res.json();
  } catch (error) {
    ElMessage.error(error.message);
  } finally {
    loadingPizzas.value = false;
  }
};

onMounted(loadPizzas);

// Validación formulario
const validateForm = () => {
  let valid = true;
  // Reset errores
  Object.keys(errors.value).forEach(key => (errors.value[key] = ''));

  // Nombre
  const nombreTrim = oferta.value.nombre.trim();
  if (!nombreTrim) {
    errors.value.nombre = 'El nombre es obligatorio.';
    valid = false;
  } else if (nombreTrim.length < 3) {
    errors.value.nombre = 'El nombre debe tener al menos 3 caracteres.';
    valid = false;
  } else if (nombreTrim.length > 100) {
    errors.value.nombre = 'El nombre no puede exceder los 100 caracteres.';
    valid = false;
  }

  // Tipo
  if (!oferta.value.tipo) {
    errors.value.tipo = 'Selecciona un tipo de oferta.';
    valid = false;
  }

  // Validar campos según tipo
  if (oferta.value.tipo === 'descuento') {
    const d = oferta.value.descuento;
    if (d === null || d === '') {
      errors.value.descuento = 'El porcentaje de descuento es obligatorio.';
      valid = false;
    } else if (isNaN(d) || d < 0 || d > 100) {
      errors.value.descuento = 'El descuento debe ser un número entre 0 y 100.';
      valid = false;
    }
  } else if (oferta.value.tipo === 'n_x_m') {
    const n = oferta.value.n_cantidad;
    const m = oferta.value.m_paga;
    if (n === null || n === '' || n < 1) {
      errors.value.n_cantidad = 'Cantidad N (compras) debe ser al menos 1.';
      valid = false;
    }
    if (m === null || m === '' || m < 1) {
      errors.value.m_paga = 'Cantidad M (pagas) debe ser al menos 1.';
      valid = false;
    }
    if (n !== null && m !== null && n < m) {
      errors.value.n_cantidad = 'N debe ser mayor o igual que M.';
      valid = false;
    }
  }

  // Fechas
  if (!oferta.value.fecha_inicio) {
    errors.value.fecha_inicio = 'La fecha de inicio es obligatoria.';
    valid = false;
  }
  if (!oferta.value.fecha_fin) {
    errors.value.fecha_fin = 'La fecha de fin es obligatoria.';
    valid = false;
  }
  if (oferta.value.fecha_inicio && oferta.value.fecha_fin) {
    if (new Date(oferta.value.fecha_fin) < new Date(oferta.value.fecha_inicio)) {
      errors.value.fecha_fin = 'La fecha de fin debe ser posterior a la fecha de inicio.';
      valid = false;
    }
  }

  // Pizzas asociadas
  if (!oferta.value.pizzas.length) {
    errors.value.pizzas = 'Selecciona al menos una pizza para la oferta.';
    valid = false;
  }

  return valid;
};

// Función para deshabilitar fechas pasadas en datepicker
const disablePastDates = (date) => {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  return date < hoy;
};

// Deshabilitar fechas antes de la fecha de inicio en fecha fin
const disableBeforeStart = (date) => {
  if (!oferta.value.fecha_inicio) return false;
  const start = new Date(oferta.value.fecha_inicio);
  start.setHours(0, 0, 0, 0);
  return date < start;
};

// Submit
const submitForm = async () => {
  if (!validateForm()) return;

  // Preparar datos para API
  const payload = {
    nombre: oferta.value.nombre.trim(),
    descripcion: oferta.value.descripcion.trim(),
    tipo: oferta.value.tipo,
    descuento: oferta.value.tipo === 'descuento' ? oferta.value.descuento / 100 : null,
    n_cantidad: oferta.value.tipo === 'n_x_m' ? oferta.value.n_cantidad : null,
    m_paga: oferta.value.tipo === 'n_x_m' ? oferta.value.m_paga : null,
    fecha_inicio: oferta.value.fecha_inicio,
    fecha_fin: oferta.value.fecha_fin,
    pizzas: oferta.value.pizzas,
  };

  try {
    const res = await fetch('/api/ofertas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Error al agregar oferta');

    await res.json();
    ElMessage.success('Oferta agregada correctamente');
    success.value = true;
  } catch (error) {
    ElMessage.error(error.message);
  }
};

// Volver con confirmación si hay cambios sin guardar
const goBack = async () => {
  const hasChanges =
    oferta.value.nombre.trim() !== '' ||
    oferta.value.descripcion.trim() !== '' ||
    oferta.value.tipo !== '' ||
    oferta.value.descuento !== null ||
    oferta.value.n_cantidad !== null ||
    oferta.value.m_paga !== null ||
    oferta.value.fecha_inicio !== null ||
    oferta.value.fecha_fin !== null ||
    oferta.value.pizzas.length > 0;

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
      router.push('/admin/oferta');
    } catch {
      // Cancelado
    }
  } else {
    router.push('/admin/oferta');
  }
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

/* Animación pulso para botones */
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

/* Inputs personalizados estilo pizza */
.el-input input,
.el-select .el-input__inner {
  border-radius: 10px !important;
  font-weight: 600;
  color: var(--pizza-brown);
}

/* Contenedor ya definido globalmente */

/* Transición fade para mensaje de éxito */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
