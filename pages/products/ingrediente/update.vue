<template>
  <div v-if="loading">Cargando . . .</div>
  <div v-else class="container mx-auto p-6 relative">
    <!-- Botón Volver -->
    <el-button type="info" class="absolute top-4 left-4 pizza-button-back" size="small" @click="goBack">
      ←Volver
    </el-button>

    <h1 class="text-4xl font-pizza-title mb-8 text-pizza-red text-center drop-shadow-lg">
      Editar Ingrediente
    </h1>

    <el-card class="pizza-card p-6 max-w-lg mx-auto" v-if="!success">
      <el-form @submit.prevent="submitForm" label-position="top" :model="ingrediente" class="space-y-6">
        <el-form-item label="Nombre del Ingrediente" :error="errorNombre">
          <el-input
            v-model="ingrediente.nombre"
            placeholder="Ej. Queso Mozzarella"
            class="shadow-inner rounded-lg"
            @input="validateNombre"
          />
        </el-form-item>

        <el-form-item label="Costo Unitario ($)">
          <el-input
            v-model.number="ingrediente.costo_unitario"
            placeholder="Ej. 1.25"
            type="number"
            min="0"
            step="0.01"
            class="shadow-inner rounded-lg"
          />
        </el-form-item>

        <el-form-item label="Tipo de Ingrediente">
          <el-select v-model="ingrediente.tipo" placeholder="Seleccione un tipo" class="w-full">
            <el-option label="Vegetal" value="vegetal" />
            <el-option label="Cárnico" value="cárnico" />
            <el-option label="Lácteo" value="lácteo" />
            <el-option label="Mariscos" value="Mariscos" />
            <el-option label="Frutas" value="Frutas" />
            <el-option label="Salsas" value="Salsas" />
            <el-option label="Otro" value="Otro" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button
            type="success"
            native-type="submit"
            class="w-full pulse-button"
            :disabled="!!errorNombre"
            style="background: linear-gradient(45deg, #e63946, #f1faee); color: #7f1d1d; font-weight: 700;"
          >
            Actualizar Ingrediente
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- Mensaje de éxito -->
    <transition name="fade">
      <div v-if="success" class="text-center p-8 bg-green-100 rounded-lg max-w-lg mx-auto">
        <h2 class="text-2xl font-bold text-green-700 mb-4">¡Ingrediente actualizado exitosamente!</h2>
        <el-button type="primary" @click="goBack" class="pulse-button"
          style="background: linear-gradient(45deg, #e63946, #f1faee); color: #7f1d1d; font-weight: 700;">
          Volver a Ingredientes
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

const ingrediente = ref({
  id_ingrediente: null,
  nombre: '',
  costo_unitario: null,
  tipo: '',
});

const errors = ref({
  nombre: '',
  costo_unitario: '',
  tipo: '',
});

// Palabras prohibidas unificadas
const palabrasProhibidas = ['mierda', 'prueba', 'xd', 'tonto', 'puto', 'falso', 'xxx', 'basura', 'test'];

// Validación nombre (2-50 caracteres, solo letras y espacios, sin palabras prohibidas)
const validarNombre = (nombre) => {
  const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{2,50}$/;
  if (!nombre) return 'El nombre es obligatorio.';
  if (!regex.test(nombre)) return 'Solo letras y espacios (2-50 caracteres).';
  if (palabrasProhibidas.some(p => nombre.toLowerCase().includes(p))) return 'Nombre no permitido.';
  return '';
};

// Validar costo unitario (máximo 500, hasta 2 decimales)
const validarCosto = (costo) => {
  if (costo === null || costo === '' || isNaN(costo)) return 'El costo es obligatorio.';
  if (!/^\d{1,3}(\.\d{1,2})?$/.test(costo.toString())) return 'Máximo $500 y hasta 2 decimales.';
  if (parseFloat(costo) > 500) return 'El costo no puede ser mayor a $500.';
  return '';
};

// Validar tipo (no vacío)
const validarTipo = (tipo) => {
  if (!tipo) return 'Debe seleccionar un tipo.';
  return '';
};

const validateForm = () => {
  errors.value.nombre = validarNombre(ingrediente.value.nombre.trim());
  errors.value.costo_unitario = validarCosto(ingrediente.value.costo_unitario);
  errors.value.tipo = validarTipo(ingrediente.value.tipo);

  return !errors.value.nombre && !errors.value.costo_unitario && !errors.value.tipo;
};

const loadIngrediente = async (id) => {
  try {
    const response = await fetch(`/api/products/ingrediente?id=${id}`);
    if (!response.ok) throw new Error('Error al obtener ingrediente');
    const data = await response.json();
    ingrediente.value = data[0];
  } catch (error) {
    console.error(error.message);
    ElMessage.error('No se pudo cargar el ingrediente.');
  } finally {
    loading.value = false;
  }
};

const submitForm = async () => {
  if (!validateForm()) return;

  try {
    const response = await fetch(`/api/products/ingrediente`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify([ingrediente.value]),
    });

    if (!response.ok) throw new Error('Error al actualizar ingrediente');

    ElMessage.success('Ingrediente actualizado correctamente');
    success.value = true;
  } catch (error) {
    console.error(error.message);
    ElMessage.error(error.message);
  }
};

const goBack = async () => {
  const hasChanges =
    ingrediente.value.nombre.trim() !== '' ||
    ingrediente.value.costo_unitario !== null ||
    ingrediente.value.tipo !== '';

  if (hasChanges && !success.value) {
    try {
      await ElMessageBox.confirm(
        'Tienes cambios sin guardar. ¿Seguro que quieres salir?',
        'Confirmar salida',
        {
          confirmButtonText: 'Sí, salir',
          cancelButtonText: 'Cancelar',
          type: 'warning',
        }
      );
      router.push('/products/ingrediente');
    } catch {
      // Cancelado
    }
  } else {
    router.push('/products/ingrediente');
  }
};

onMounted(() => {
  const id = new URLSearchParams(window.location.search).get('id');
  if (id) loadIngrediente(id);
});
</script>


<style scoped>
/* Usa el mismo estilo que en Editar Categoría */
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
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
