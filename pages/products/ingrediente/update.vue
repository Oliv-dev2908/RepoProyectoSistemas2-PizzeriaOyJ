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
        <el-form-item label="Nombre del Ingrediente" :error="errors.nombre">
          <el-input v-model="ingrediente.nombre" placeholder="Ej. Queso Mozzarella" class="shadow-inner rounded-lg"
            @input="validateNombre" />
        </el-form-item>

        <el-form-item label="Costo Unitario ($)":error="errors.costo_unitario">
          <el-input v-model.number="ingrediente.costo_unitario" placeholder="Ej. 1.25" type="number" min="0" step="0.01"
            class="shadow-inner rounded-lg" />
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
          <el-button type="success" native-type="submit" class="w-full pulse-button" :disabled="!!errorNombre"
            style="background: linear-gradient(45deg, #e63946, #f1faee); color: #7f1d1d; font-weight: 700;">
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

const validateForm = () => {
  errors.value = { nombre: '', costo_unitario: '', tipo: '' };
  let valid = true;

  const nombre = ingrediente.value.nombre.trim();
  const costo = ingrediente.value.costo_unitario;
  const tipo = ingrediente.value.tipo;

  // Prohibidas y sospechosas
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

  const patronesMolestos = [
  // Risas exageradas o trolls clásicos: xd, xddd, jajaja, jejeje, jiji, jajsjd, etc.
  /\b[xj]{1,5}[djs]{1,10}\b/i, // xd, xddd, jajsjd
  /\b(?:ja|je|jo|ju|ji|lol|lmao|uwu|owo|nwn){2,}\b/i,

  // Palabras repetidas sospechosas: "hola hola hola", "así así así"
  /\b(\w{2,})\b(?:\s+\1\b){2,}/i,

  // Letras repetidas excesivamente: "holaaaa", "nooooo", "queeeeeeee"
  /([a-záéíóúüñ])\1{3,}/i,

  // Repetición exagerada de palabras con variaciones (e.g. "haaaa haaaa haaaa")
  /((\w)\2{2,}\s*){3,}/i,

  // Exceso de caracteres especiales: !!!, ???, ###, etc.
  /([!@#$%^&*()_+={}\[\]:;"'<>,.?\\/|`~°¬\-])\1{2,}/,

  // Mezcla absurda de caracteres (posible spam visual o relleno)
  /[a-z]{3,}[^a-z\s]{3,}[a-z]{3,}/i, // e.g. "h0l4#k0m0$ta$"
  /(?:[^\w\s]|_){5,}/,              // muchos símbolos no alfanuméricos

  // Texto con solo espacios o espacios excesivos
  /^[\s]+$/,    // solo espacios
  /\s{3,}/,     // más de 2 espacios seguidos

  // Inputs vacíos o solo con caracteres invisibles
  /^[\u200B-\u200D\uFEFF]*$/, // caracteres invisibles Unicode

  // Emojis (pueden ser molestos si no son relevantes en contexto serio)
  /[\uD83C-\uDBFF\uDC00-\uDFFF]+/, // rango de emojis UTF-16

  // Texto en sentido inverso (Right-to-left override, usado para trollear o ocultar contenido malicioso)
  /\u202e/, // RTL override

  // Palabras alargadas sin sentido real (ej: "holaaaaaaaaa" con mezcla)
  /\b[a-záéíóúüñ]{2,}\d+[a-z]{2,}\b/i,

  // Spam de caracteres aleatorios (fuzzing, testing o trolling)
  /\b[a-z]{1,3}\d{1,3}[a-z]{1,3}\b/i, // e.g. "asd123asd", "x9k3"

  // Palabras con alternancia excesiva de mayúsculas y minúsculas
  /(?:[a-z][A-Z]){3,}|(?:[A-Z][a-z]){3,}/,

  // Texto con codificación hexadecimal (suele ser usado para bypass)
  /%[0-9a-fA-F]{2,}/,

  // Inputs que son solo caracteres no alfabéticos
  /^[^a-zA-Z0-9áéíóúÁÉÍÓÚüÜñÑ]+$/
];


  // Validación nombre
  if (!nombre) {
    errors.value.nombre = 'El nombre es obligatorio.';
    valid = false;
  } else if (nombre.length < 2 || nombre.length > 50) {
    errors.value.nombre = 'Debe tener entre 2 y 50 caracteres.';
    valid = false;
  } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/.test(nombre)) {
    errors.value.nombre = 'Solo letras y espacios.';
    valid = false;
  } else if (palabrasProhibidas.some(p => nombre.toLowerCase().includes(p))) {
    errors.value.nombre = 'Contiene palabras no permitidas.';
    valid = false;
  } else if (patronesMolestos.some(r => r.test(nombre))) {
    errors.value.nombre = 'Contiene texto repetitivo o sospechoso.';
    valid = false;
  }

  // Validación costo
  if (costo === null || costo === '' || isNaN(costo)) {
    errors.value.costo_unitario = 'El costo es obligatorio.';
    valid = false;
  } else if (!/^\d{1,3}(\.\d{1,2})?$/.test(costo.toString())) {
    errors.value.costo_unitario = 'Máximo $500 y hasta 2 decimales.';
    valid = false;
  } else if (parseFloat(costo) > 500) {
    errors.value.costo_unitario = 'No puede ser mayor a $500.';
    valid = false;
  }else if (parseFloat(costo) < 1) {
    errors.value.costo_unitario = 'No puede ser menor a $1.';
    valid = false;
  }

  // Validación tipo
  if (!tipo) {
    errors.value.tipo = 'Debe seleccionar un tipo.';
    valid = false;
  }

  return valid;
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
