<template>
  <div v-if="loading">
    Cargando . . .
  </div>
  <div v-else class="container mx-auto p-6 relative">
    <el-button type="info" class="absolute top-4 left-4 pizza-button-back" size="small" @click="goBack">
      ←Volver
    </el-button>

    <h1 class="text-4xl font-pizza-title mb-8 text-pizza-red text-center drop-shadow-lg">
      Editar Oferta
    </h1>

    <el-card class="pizza-card p-6 max-w-lg mx-auto" v-if="!success">
      <el-form @submit.prevent="submitForm" label-position="top" :model="oferta" class="space-y-6">

        <el-form-item label="Nombre de la Oferta" :error="errors.nombre">
          <el-input v-model="oferta.nombre" placeholder="Ej: 2x1 Carnívoras" maxlength="100" />
        </el-form-item>

        <el-form-item label="Descripción" :error="errors.descripcion">
          <el-input type="textarea" rows="3" v-model="oferta.descripcion" placeholder="Detalles de la oferta" />
        </el-form-item>

        <el-form-item label="Tipo" :error="errors.tipo">
          <el-select v-model="oferta.tipo" placeholder="Selecciona tipo">
            <el-option label="Descuento" value="descuento" />
            <el-option label="N por M" value="n_x_m" />
          </el-select>
        </el-form-item>

        <el-form-item label="Descuento" v-if="oferta.tipo === 'descuento'" :error="errors.descuento">
          <el-input-number
            v-model="oferta.descuento"
            :min="0"
            :max="1"
            :step="0.01"
            placeholder="Ej: 0.5 para 50% de descuento"
          />
        </el-form-item>

        <el-form-item label="Cantidad N" v-if="oferta.tipo === 'n_x_m'" :error="errors.n_cantidad">
          <el-input-number v-model="oferta.n_cantidad" :min="1" placeholder="Ej: 2" />
        </el-form-item>

        <el-form-item label="Cantidad M a pagar" v-if="oferta.tipo === 'n_x_m'" :error="errors.m_paga">
          <el-input-number v-model="oferta.m_paga" :min="1" placeholder="Ej: 1" />
        </el-form-item>

        <el-form-item label="Fecha Inicio" :error="errors.fecha_inicio">
          <el-date-picker
            v-model="oferta.fecha_inicio"
            type="datetime"
            placeholder="Selecciona fecha y hora inicio"
            format="YYYY-MM-DD"
          />
        </el-form-item>

        <el-form-item label="Fecha Fin" :error="errors.fecha_fin">
          <el-date-picker
            v-model="oferta.fecha_fin"
            type="datetime"
            placeholder="Selecciona fecha y hora fin"
            format="YYYY-MM-DD"
          />
        </el-form-item>

        <el-form-item label="Activo">
          <el-switch v-model="oferta.activo" />
        </el-form-item>

        <el-form-item label="Pizzas relacionadas" :error="errors.pizzas">
          <el-select
            v-model="oferta.pizzas"
            multiple
            filterable
            placeholder="Selecciona las pizzas"
          >
            <el-option
              v-for="pizza in pizzasDisponibles"
              :key="pizza.id_pizza"
              :label="pizza.nombre"
              :value="pizza.id_pizza"
            />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="success" native-type="submit" class="w-full pulse-button">
            Actualizar Oferta
          </el-button>
        </el-form-item>

      </el-form>
    </el-card>

    <transition name="fade">
      <div v-if="success" class="text-center p-8 bg-green-100 rounded-lg max-w-lg mx-auto">
        <h2 class="text-2xl font-bold text-green-700 mb-4">¡Oferta actualizada exitosamente!</h2>
        <el-button type="primary" @click="goBack" class="pulse-button">
          Volver a Ofertas
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

const oferta = ref({
  id_oferta: null,
  nombre: '',
  descripcion: '',
  tipo: '',
  descuento: null,
  n_cantidad: null,
  m_paga: null,
  fecha_inicio: null,
  fecha_fin: null,
  activo: true,
  pizzas: [],
});

const errors = ref({});

const pizzasDisponibles = ref([]);

// Carga de pizzas para el selector
const loadPizzas = async () => {
  try {
    const res = await fetch('/api/products/pizza');
    const data = await res.json();
    pizzasDisponibles.value = data;
  } catch {
    ElMessage.error('No se pudieron cargar las pizzas.');
  }
};

// Cargar oferta por id y convertir fechas a Date
const loadOferta = async (id) => {
  try {
    const res = await fetch(`/api/ofertas?id=${id}`);
    if (!res.ok) throw new Error('Error al cargar la oferta');
    const data = await res.json();

    // Si la API devuelve un array con un objeto, usar el primero
    const ofertaData = Array.isArray(data) ? data[0] : data;

    // Convertir fechas string a objetos Date
    console.log(ofertaData.fecha_fin);
    console.log(ofertaData.fecha_inicio);
    ofertaData.fecha_inicio = ofertaData.fecha_inicio ? new Date(ofertaData.fecha_inicio) : null;
    ofertaData.fecha_fin = ofertaData.fecha_fin ? new Date(ofertaData.fecha_fin) : null;
    console.log(ofertaData.fecha_fin);
    console.log(ofertaData.fecha_inicio);

    Object.assign(oferta.value, ofertaData);
  } catch (error) {
    ElMessage.error(error.message);
  } finally {
    loading.value = false;
  }
};

const validateForm = () => {
  errors.value = {};
  let valid = true;

  if (!oferta.value.nombre || oferta.value.nombre.trim().length < 3) {
    errors.value.nombre = 'El nombre es obligatorio y debe tener al menos 3 caracteres.';
    valid = false;
  }

  if (oferta.value.tipo !== 'descuento' && oferta.value.tipo !== 'n_x_m') {
    errors.value.tipo = 'El tipo debe ser "descuento" o "n_x_m".';
    valid = false;
  }

  if (oferta.value.tipo === 'descuento') {
    if (oferta.value.descuento === null || oferta.value.descuento < 0 || oferta.value.descuento > 1) {
      errors.value.descuento = 'El descuento debe ser entre 0 y 1.';
      valid = false;
    }
  }

  if (oferta.value.tipo === 'n_x_m') {
    if (!oferta.value.n_cantidad || oferta.value.n_cantidad < 1) {
      errors.value.n_cantidad = 'La cantidad N debe ser al menos 1.';
      valid = false;
    }
    if (!oferta.value.m_paga || oferta.value.m_paga < 1) {
      errors.value.m_paga = 'La cantidad M a pagar debe ser al menos 1.';
      valid = false;
    }
  }

  if (!oferta.value.fecha_inicio) {
    errors.value.fecha_inicio = 'La fecha de inicio es obligatoria.';
    valid = false;
  }
  if (!oferta.value.fecha_fin) {
    errors.value.fecha_fin = 'La fecha de fin es obligatoria.';
    valid = false;
  }
  if (new Date(oferta.value.fecha_fin) <= new Date(oferta.value.fecha_inicio)) {
    errors.value.fecha_fin = 'La fecha de fin debe ser posterior a la fecha de inicio.';
    valid = false;
  }

  if (!oferta.value.pizzas || !Array.isArray(oferta.value.pizzas) || oferta.value.pizzas.length === 0) {
    errors.value.pizzas = 'Debe seleccionar al menos una pizza.';
    valid = false;
  }

  return valid;
};

const submitForm = async () => {
  if (!validateForm()) return;

  try {
    const res = await fetch('/api/ofertas', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(oferta.value),
    });
    if (!res.ok) throw new Error('Error al actualizar la oferta');
    await res.json();
    ElMessage.success('Oferta actualizada correctamente');
    success.value = true;
  } catch (error) {
    ElMessage.error(error.message);
  }
};

const goBack = async () => {
  const hasChanges =
    oferta.value.nombre.trim() !== '' ||
    oferta.value.descripcion.trim() !== '' ||
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
      router.push('/ofertas');
    } catch {
      // Cancelar no hace nada
    }
  } else {
    router.push('/ofertas');
  }
};

onMounted(() => {
  const id = new URLSearchParams(window.location.search).get('id');
  loadPizzas();
  if (id) loadOferta(id);
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
