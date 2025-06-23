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
      Editar Tamaño
    </h1>

    <el-card class="pizza-card p-6 max-w-lg mx-auto" v-if="!success">
      <el-form @submit.prevent="submitForm" label-position="top" :model="tamano" class="space-y-6">

        <el-form-item label="Nombre del Tamaño" :error="errors.nombre">
          <el-input v-model="tamano.nombre" placeholder="Ej: Grande, Mediano, Personal" class="shadow-inner rounded-lg" />
        </el-form-item>

        <el-form-item label="Descripción" :error="errors.descripcion">
          <el-input v-model="tamano.descripcion" placeholder="Ej: Ideal para compartir, porción individual" class="shadow-inner rounded-lg" />
        </el-form-item>

        <el-form-item label="Precio Base ($)" :error="errors.precio_base">
          <el-input v-model.number="tamano.precio_base" type="number" min="0" placeholder="Ej: 79.99" step="0.01" class="shadow-inner rounded-lg" />
        </el-form-item>

        <el-form-item>
          <el-button type="success" native-type="submit" class="w-full pulse-button"
            style="background: linear-gradient(45deg, #e63946, #f1faee); color: #7f1d1d; font-weight: 700;">
            Actualizar Tamaño
          </el-button>
        </el-form-item>

      </el-form>
    </el-card>

    <!-- Animación de éxito -->
    <transition name="fade">
      <div v-if="success" class="text-center p-8 bg-green-100 rounded-lg max-w-lg mx-auto">
        <h2 class="text-2xl font-bold text-green-700 mb-4">¡Tamaño actualizado exitosamente!</h2>
        <el-button type="primary" @click="goBack" class="pulse-button"
          style="background: linear-gradient(45deg, #e63946, #f1faee); color: #7f1d1d; font-weight: 700;">
          Volver a Tamaños
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

const tamano = ref({
  id: null,
  nombre: '',
  descripcion: '',
  precio_base: 0,
});

const errors = ref({
  nombre: '',
  descripcion: '',
  precio_base: '',
});

//VALIDAR
const palabrasProhibidas = [
  // Inyecciones SQL y comandos peligrosos
  'select', 'insert', 'update', 'delete', 'drop', 'truncate', 'exec', 'execute',
  'union', 'sleep', 'benchmark', 'or 1=1', 'and 1=1', 'or true', 'is null',
  '--', ';--', ';', '/*', '*/', '@@', '@', 'char', 'nchar', 'varchar', 'nvarchar',
  'alter', 'begin', 'cast', 'create', 'cursor', 'declare', 'end', 'fetch',
  'kill', 'open', 'sys', 'sysobjects', 'syscolumns', 'information_schema',

  // JavaScript malicioso y XSS
  '<', '>', 'script', '/script', 'alert', 'onerror', 'onload', 'onmouseover',
  'onfocus', 'onmouseenter', 'onmouseleave', 'onchange', 'onclick', 'confirm',
  'prompt', 'eval', 'document', 'window', 'parent', 'console.log', 'Function',
  'setTimeout', 'setInterval', 'iframe', 'href', 'src=', 'javascript:',
  'data:', 'base64', 'encodeURI', 'decodeURI',

  // HTML/atributos potencialmente peligrosos
  'formaction', 'srcdoc', 'xmlns', 'xlink:href', 'style=', 'svg', 'math', 'object',
  'embed', 'applet', 'meta', 'link', 'frame', 'frameset',

  // Palabras ofensivas o burlas comunes (evita el uso en formularios serios)
  'tonto', 'burro', 'idiota', 'estúpido', 'imbécil', 'pendejo', 'bobo', 'menso',
  'inútil', 'feo', 'puto', 'puta', 'mierda', 'cabron', 'maldito', 'diablo', 'jaja',
  'jeje', 'lol', 'xd', 'lmao', 'noob', 'wtf', 'asqueroso', 'perra', 'cerdo',

  // Frases irrelevantes o respuestas troll
  'asdf', 'qwerty', '123456', 'abcdef', 'a1b2c3', 'lorem', 'ipsum', 'test',
  'prueba', 'sin sentido', 'whatever', 'lo que sea', 'ñañaña', 'trolazo',

  // Caracteres especiales y patrones sospechosos
  '"', "'", '`', '\\', '--', '%', '^', '*', '(', ')', '{', '}', '[', ']', '=', '+',
  '$', '|', '~', '#', '\\u202e', '\\u0000',

  // Palabras clave usadas en hacking o fuzzing
  'root', 'admin', 'password', 'passwd', 'token', 'apikey', 'api_key', 'jwt',
  'localhost', '127.0.0.1', 'shell', 'nmap', 'netcat', 'burpsuite', 'fuzzer',
  'dirbuster', 'sqlmap', 'hydra', 'john', 'hashcat',

  // Intentos de bypass y encoded inputs
  '%3C', '%3E', '%22', '%27', '%3B', '%28', '%29', '%2F', '%5C', '%00',

  // Otros elementos que podrían usarse para spam, phishing o manipulación
  'click here', 'ganaste', 'felicitaciones', 'hack', 'gratis', 'regalo', 'oro',
  'dinero', 'millones', 'crédito', 'tarjeta', 'contraseña', 'ingresa aquí',
  'haz clic', 'no te lo pierdas',

  // Combinaciones o keywords sospechosas
  'content-type', 'multipart/form-data', 'application/x-www-form-urlencoded',
  'admin\'--', '1\' or \'1\'=\'1', '1=1', '1=0', 'null', 'not null'
];


const contienePatronesMaliciosos = (texto) => {
  const patrones = [/script/i, /insert\s+into/i, /drop\s+table/i, /delete\s+from/i];
  return patrones.some(p => p.test(texto));
};

const contieneRepeticiones = (texto) => {
  return /(.)\1{2,}/.test(texto); // 5 o más repeticiones consecutivas
};

const contienePalabrasProhibidas = (texto) => {
  const lower = texto.toLowerCase();
  return palabrasProhibidas.some(palabra => lower.includes(palabra));
};

const validateForm = () => {
  let valid = true;
  errors.value = { nombre: '', descripcion: '', precio_base: '' };

  const nombreTrim = tamano.value.nombre.trim();
  const descTrim = tamano.value.descripcion.trim();
  const precio = tamano.value.precio_base;

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

const loadTamaño = async (id) => {
  try {
    const response = await fetch(`/api/products/tamano?id=${id}`);
    if (!response.ok) throw new Error('Error al cargar el tamaño');
    const data = await response.json();
    tamano.value = Array.isArray(data) ? data[0] : data;
  } catch (error) {
    console.error(error.message);
    ElMessage.error('No se pudo cargar el tamaño.');
  } finally {
    loading.value = false;
  }
};

const submitForm = async () => {
  if (!validateForm()) return;

  try {
    const response = await fetch(`/api/products/tamano`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify([tamano.value]), // Enviamos como array
    });

    if (!response.ok) throw new Error('Error al actualizar tamaño');
    await response.json();
    ElMessage.success('Tamaño actualizado correctamente');
    success.value = true;
  } catch (error) {
    console.error(error.message);
    ElMessage.error(error.message);
  }
};

const goBack = async () => {
  const hasChanges =
    tamano.value.nombre.trim() !== '' ||
    tamano.value.descripcion.trim() !== '' ||
    tamano.value.precio_base !== 0;

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
      router.push('/products/tamano');
    } catch {
      // Cancelado
    }
  } else {
    router.push('/products/tamano');
  }
};

onMounted(() => {
  const id = new URLSearchParams(window.location.search).get('id');
  if (id) loadTamaño(id);
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

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
