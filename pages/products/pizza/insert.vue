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
        <el-input type="textarea" v-model="pizza.descripcion" :rows="3"
          placeholder="Ej: Pizza con salsa de tomate, mozzarella y albahaca" class="shadow-inner rounded-lg" />
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

  // Permitir letras, espacios y guiones, acentos y eñes
  const caracteresNombreValidos = /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s\-]+$/;

  // Palabras o patrones sospechosos o maliciosos comunes
  const patronesMaliciosos = /(SELECT|INSERT|DELETE|UPDATE|DROP|UNION|--|<script>|<\/script>|document\.cookie|base64|OR\s+1=1)/i;

  // Palabras prohibidas (puedes ampliar según contexto)
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


  // Detectar patrones repetitivos o abusivos específicos como xdxd, jsjsjs, xDXD, etc.
  // - Repetición de 2 caracteres al menos 3 veces seguidas, case insensitive.
  // - Combinaciones comunes de "x" y "d" repetidas (xd, xdxd, xdxdd...)
  // - Repeticiones largas de cualquier letra
  // - Más de 3 caracteres especiales seguidos
  const patronesRepetitivos = [
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

  const contienePalabraProhibida = (texto) => {
    const textoLower = texto.toLowerCase();
    return palabrasProhibidas.some(palabra => textoLower.includes(palabra));
  };

  const tienePatronesRepetitivos = patronesRepetitivos.some((patron) => patron.test(nombreTrim));

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
  } else if (tienePatronesRepetitivos) {
    errors.value.nombre = 'El nombre contiene texto repetitivo o inválido.';
    valid = false;
  } else if (patronesMaliciosos.test(nombreTrim)) {
    errors.value.nombre = 'El nombre contiene posibles patrones maliciosos.';
    valid = false;
  } else if (contienePalabraProhibida(nombreTrim)) {
    errors.value.nombre = 'El nombre contiene palabras inapropiadas.';
    valid = false;
  }

  // Validación descripción (menos restrictiva en caracteres permitidos)
  if (!descripcionTrim) {
    errors.value.descripcion = 'La descripción es obligatoria.';
    valid = false;
  } else if (descripcionTrim.length > 1000) {
    errors.value.descripcion = 'La descripción no puede exceder los 1000 caracteres.';
    valid = false;
  } else if (patronesRepetitivos.some(p => p.test(descripcionTrim))) {
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
