<template>
  <div v-if="loading">
    Cargando . . .
  </div>
  <div v-else class="container mx-auto p-6 relative">
    <!-- Botón Volver -->
    <el-button
      type="info"
      class="absolute top-4 left-4 pizza-button-back"
      size="small"
      @click="goBack"
    >
      ←Volver
    </el-button>

    <h1
      class="text-4xl font-pizza-title mb-8 text-pizza-red text-center drop-shadow-lg"
    >
      Editar Producto
    </h1>

    <el-card class="pizza-card p-6 max-w-lg mx-auto" v-if="!success">
      <el-form
        @submit.prevent="submitForm"
        label-position="top"
        :model="producto"
        class="space-y-6"
      >
        <el-form-item label="Nombre del Producto" :error="errors.nombre">
          <el-input
            v-model="producto.nombre"
            placeholder="Ej: Coca Cola, Pizza Margarita"
            class="shadow-inner rounded-lg"
          />
        </el-form-item>

        <el-form-item label="Descripción" :error="errors.descripcion">
          <el-input
            type="textarea"
            v-model="producto.descripcion"
            placeholder="Descripción del producto"
            rows="4"
            class="shadow-inner rounded-lg"
          />
        </el-form-item>

        <el-form-item label="Precio ($)" :error="errors.precio">
          <el-input
            v-model.number="producto.precio"
            type="number"
            min="0"
            placeholder="Ej: 150"
            class="shadow-inner rounded-lg"
          />
        </el-form-item>

        <el-form-item label="Categoría" :error="errors.id_categoria">
          <el-select v-model="producto.id_categoria" placeholder="Seleccione categoría" class="rounded-lg">
            <el-option
              v-for="categoria in categorias"
              :key="categoria.id_categoria"
              :label="categoria.nombre"
              :value="categoria.id_categoria"
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
            Actualizar Producto
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- Animación de éxito -->
    <transition name="fade">
      <div
        v-if="success"
        class="text-center p-8 bg-green-100 rounded-lg max-w-lg mx-auto"
      >
        <h2 class="text-2xl font-bold text-green-700 mb-4">
          ¡Producto actualizado exitosamente!
        </h2>
        <el-button
          type="primary"
          @click="goBack"
          class="pulse-button"
          style="background: linear-gradient(45deg, #e63946, #f1faee); color: #7f1d1d; font-weight: 700;"
        >
          Volver a Productos
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

const producto = ref({
  id_producto: null,
  nombre: '',
  descripcion: '',
  precio: null,
  id_categoria: null,
});

const categorias = ref([]);

const errors = ref({
  nombre: '',
  descripcion: '',
  precio: '',
  id_categoria: '',
});

// Validación del formulario
const palabrasProhibidas = [
  'malo', 'feo', 'idiota', 'tonto', 'spam', 'hack', 'malware', 'virus', 'script', 'drop', 'delete',
  'mierda', 'puta', 'estúpido', 'imbécil', 'pendejo', 'maldito', 'cabron', 'chingada', 'joder', 'pedo',
  'cabrón', 'coño', 'verga', 'fuck', 'shit', 'bitch', 'asshole', 'retardado', 'sexo', 'pornografía', 
  'droga', 'terrorismo', 'asesinato'
];

const patronesMaliciosos = /(SELECT|INSERT|DELETE|UPDATE|DROP|UNION|--|<script>|<\/script>|document\.cookie|base64|OR\s+1=1)/i;

function validarTexto(rule, value) {
  if (!value || !value.trim()) return new Error('Este campo es obligatorio');

  const lowerText = value.toLowerCase();

  for (const palabra of palabrasProhibidas) {
    if (lowerText.includes(palabra)) {
      return new Error(`Contiene palabra prohibida: "${palabra}"`);
    }
  }

  if (patronesMaliciosos.test(value)) return new Error('Texto contiene patrones maliciosos o peligrosos');

  const maliciosoRegex = /<[^>]*>|[\{\}\[\]\$<>;]/;
  if (maliciosoRegex.test(value)) return new Error('No se permiten caracteres o código malicioso');

  const repetidosRegex = /(.)\1{3,}/;
  if (repetidosRegex.test(value)) return new Error('Texto contiene repeticiones ilegales de caracteres');

  if (value.length > 1000) return new Error('El texto no puede exceder los 1000 caracteres');

  return true;
}

function validarNombre(rule, value) {
  if (!value || !value.trim()) return new Error('El nombre es obligatorio');

  if (value.length > 100) return new Error('El nombre no puede exceder los 100 caracteres');

  const caracteresNombreValidos = /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s-]+$/;
  if (!caracteresNombreValidos.test(value)) {
    return new Error('El nombre solo puede contener letras, espacios y guiones');
  }

  return validarTexto(rule, value);
}

function validarPrecio(rule, value) {
  if (value === null || value === undefined || value === '') return new Error('El precio es obligatorio');

  if (typeof value !== 'number' || isNaN(value)) return new Error('El precio debe ser numérico');

  if (value < 0) return new Error('El precio no puede ser negativo');

  if (!/^\d+(\.\d{1,2})?$/.test(value.toString())) return new Error('El precio puede tener máximo 2 decimales');

  if (value.toString().replace('.', '').length > 4) return new Error('El precio es demasiado grande');

  return true;
}

const validateForm = () => {
  let valid = true;

  errors.value.nombre = '';
  errors.value.descripcion = '';
  errors.value.precio = '';
  errors.value.id_categoria = '';

  const nombreResult = validarNombre(null, producto.value.nombre);
  if (nombreResult instanceof Error) {
    errors.value.nombre = nombreResult.message;
    valid = false;
  }

  const descripcionResult = validarTexto(null, producto.value.descripcion);
  if (descripcionResult instanceof Error) {
    errors.value.descripcion = descripcionResult.message;
    valid = false;
  }

  const precioResult = validarPrecio(null, producto.value.precio);
  if (precioResult instanceof Error) {
    errors.value.precio = precioResult.message;
    valid = false;
  }

  if (!producto.value.id_categoria) {
    errors.value.id_categoria = 'Debe seleccionar una categoría.';
    valid = false;
  }

  return valid;
};


// Cargar categorías
const loadCategorias = async () => {
  try {
    const response = await fetch('/api/products/categoria');
    if (!response.ok) throw new Error('Error al cargar categorías');
    categorias.value = await response.json();
  } catch (error) {
    console.error(error);
    ElMessage.error('No se pudieron cargar las categorías');
  }
};

// Cargar producto
const loadProducto = async (id) => {
  try {
    const response = await fetch(`/api/products/producto?id=${id}`);
    if (!response.ok) throw new Error('Error al obtener el producto');
    const data = await response.json();

    if (Array.isArray(data)) producto.value = data[0];
    else producto.value = data;
  } catch (error) {
    console.error(error);
    ElMessage.error('No se pudo cargar el producto');
  } finally {
    loading.value = false;
  }
};

// Actualizar producto
const submitForm = async () => {
  if (!validateForm()) return;

  try {
    const response = await fetch(`/api/products/producto`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(producto.value),
    });

    if (!response.ok) throw new Error('Error al actualizar el producto');

    await response.json();
    ElMessage.success('Producto actualizado correctamente');
    success.value = true;
  } catch (error) {
    console.error(error);
    ElMessage.error(error.message);
  }
};

// Confirmar salida si hay cambios sin guardar
const goBack = async () => {
  const hasChanges =
    producto.value.nombre.trim() !== '' ||
    producto.value.descripcion.trim() !== '' ||
    producto.value.precio !== null ||
    producto.value.id_categoria !== null;

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
      router.push('/products/producto');
    } catch {
      // Canceló la salida
    }
  } else {
    router.push('/products/producto');
  }
};

onMounted(() => {
  const id = new URLSearchParams(window.location.search).get('id');
  if (id) loadProducto(id);
  loadCategorias();
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
.el-input input,
.el-input textarea {
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
