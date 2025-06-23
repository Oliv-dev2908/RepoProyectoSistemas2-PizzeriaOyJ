<template>
  <!-- Botón Volver en la esquina superior izquierda -->

  <h1 class="text-4xl font-pizza-title mb-8 text-pizza-red text-center drop-shadow-lg">
    Agregar Categoría
  </h1>

  <el-button type="info" class="absolute top-4 left-4 pizza-button-back" size="small" @click="goBack">
    ←Volver
  </el-button>


  <el-card class="pizza-card p-6 max-w-lg mx-auto" v-if="!success">
    <el-form @submit.prevent="submitForm" label-position="top" :model="categoria" class="space-y-6">

      <el-form-item label="Nombre de la Categoría" :error="errors.nombre">
        <el-input v-model="categoria.nombre" placeholder="Ej: Bebidas, Postres, Entradas"
          class="shadow-inner rounded-lg" />
      </el-form-item>

      <el-form-item label="Precio Extra ($)" :error="errors.precio_extra">
        <el-input v-model.number="categoria.precio_extra" placeholder="Ej: 10" type="decimal" min="0"
          class="shadow-inner rounded-lg" />
      </el-form-item>

      <el-form-item>
        <el-button type="success" native-type="submit" class="w-full pulse-button"
          style="background: linear-gradient(45deg, #e63946, #f1faee); color: #7f1d1d; font-weight: 700;">
          Agregar Categoría
        </el-button>
      </el-form-item>

    </el-form>
  </el-card>

  <!-- Animación de éxito -->
  <transition name="fade">
    <div v-if="success" class="text-center p-8 bg-green-100 rounded-lg max-w-lg mx-auto">
      <h2 class="text-2xl font-bold text-green-700 mb-4">¡Categoría agregada exitosamente!</h2>
      <el-button type="primary" @click="goBack" class="pulse-button"
        style="background: linear-gradient(45deg, #e63946, #f1faee); color: #7f1d1d; font-weight: 700;">
        Volver a Categorías
      </el-button>
    </div>
  </transition>

</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';

const router = useRouter();
const categoria = ref({
  nombre: '',
  precio_extra: 0,
});

const errors = ref({
  nombre: '',
  precio_extra: '',
});

const success = ref(false);

// Validar formulario de categoría con reglas estrictas
const validateForm = () => {
  let valid = true;
  errors.value.nombre = '';
  errors.value.precio_extra = '';

  const nombreTrim = categoria.value.nombre.trim();

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
  'prueba', 'sin sentido', 'whatever', 'lo que sea', 'ñañaña', 'trolazo', '123', '1234', '12345',

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


  const contienePalabraProhibida = palabrasProhibidas.some(p =>
    nombreTrim.toLowerCase().includes(p)
  );

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



  const tienePatronesMolestos = patronesMolestos.some(regex =>
    regex.test(nombreTrim)
  );

  if (!nombreTrim) {
    errors.value.nombre = 'El nombre es obligatorio.';
    valid = false;
  } else if (nombreTrim.length < 3) {
    errors.value.nombre = 'El nombre debe tener al menos 3 caracteres.';
    valid = false;
  } else if (nombreTrim.length > 100) {
    errors.value.nombre = 'El nombre no puede exceder los 100 caracteres.';
    valid = false;
  } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/.test(nombreTrim)) {
    errors.value.nombre = 'Solo letras y espacios permitidos.';
    valid = false;
  } else if (tienePatronesMolestos) {
    errors.value.nombre = 'El nombre contiene texto repetitivo o no permitido.';
    valid = false;
  } else if (contienePalabraProhibida) {
    errors.value.nombre = 'El nombre contiene términos no seguros o maliciosos.';
    valid = false;
  }

  const precio = categoria.value.precio_extra;

  if (precio === null || precio === '') {
    errors.value.precio_extra = 'El precio es obligatorio.';
    valid = false;
  } else if (isNaN(precio)) {
    errors.value.precio_extra = 'Debe ser un número.';
    valid = false;
  } else if (precio < 0) {
    errors.value.precio_extra = 'Debe ser 0 o mayor.';
    valid = false;
  } else if (precio > 1000) {
    errors.value.precio_extra = 'El precio no puede superar los $1000.';
    valid = false;
  } else if (!/^\d+(\.\d{1,2})?$/.test(precio.toString())) {
    errors.value.precio_extra = 'Solo hasta 2 decimales.';
    valid = false;
  }

  return valid;
};



const submitForm = async () => {
  if (!validateForm()) return;

  try {
    const response = await fetch('/api/products/categoria', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(categoria.value),
    });

    if (!response.ok) throw new Error('Error al agregar categoría');

    await response.json();
    ElMessage.success('Categoría agregada correctamente');
    success.value = true;
  } catch (error) {
    ElMessage.error(error.message);
  }
};

const goBack = async () => {
  const hasChanges =
    categoria.value.nombre.trim() !== '' ||
    categoria.value.precio_extra !== 0;

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
      router.push('/products/categoria');
    } catch {
      // No hacemos nada si cancela
    }
  } else {
    router.push('/products/categoria');
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

/* Animación de pulso para botón agregar y volver */
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

/* Inputs personalizados para que mantengan el estilo pizza */
.el-input input {
  border-radius: 10px !important;
  font-weight: 600;
  color: var(--pizza-brown);
}

/* Container ya definido en global o index */

/* Transición fade para el mensaje de éxito */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
