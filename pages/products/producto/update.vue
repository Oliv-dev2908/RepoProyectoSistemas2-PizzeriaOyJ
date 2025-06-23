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
            step="0.01"
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

function validarTexto(rule, value) {
  if (!value || !value.trim()) {
    return new Error('Este campo es obligatorio');
  }

  const lowerText = value.toLowerCase();

  for (const palabra of palabrasProhibidas) {
    if (lowerText.includes(palabra)) {
      return new Error(`Contiene palabra prohibida: "${palabra}"`);
    }
  }

  // Expresiones tipo burla, risa o spam exagerado
  const expresionesProhibidas= [
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


  for (const regex of expresionesProhibidas) {
    if (regex.test(lowerText)) {
      return new Error('Evita usar risas exageradas, burlas o emojis inapropiados');
    }
  }

  // SQL injection y código
  const patronesMaliciosos = /(SELECT|INSERT|DELETE|UPDATE|DROP|UNION|--|<script>|<\/script>|document\.cookie|base64|OR\s+1=1)/i;
  if (patronesMaliciosos.test(value)) {
    return new Error('Texto contiene patrones maliciosos o peligrosos');
  }

  const maliciosoRegex = /<[^>]*>|[\{\}\[\]\$<>;]/;
  if (maliciosoRegex.test(value)) {
    return new Error('No se permiten caracteres o código malicioso');
  }

  if (value.length > 1000) {
    return new Error('El texto no puede exceder los 1000 caracteres');
  }

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
