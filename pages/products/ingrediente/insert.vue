<template>
  <h1 class="text-4xl font-pizza-title mb-8 text-pizza-red text-center drop-shadow-lg">
    Agregar Ingrediente
  </h1>

  <el-button type="info" class="absolute top-4 left-4 pizza-button-back" size="small" @click="goBack">
    ←Volver
  </el-button>

  <el-card class="pizza-card p-6 max-w-lg mx-auto" v-if="!success">
    <el-form @submit.prevent="submitForm" label-position="top" :model="ingrediente" class="space-y-6">
      <el-form-item label="Nombre del Ingrediente" :error="errors.nombre">
        <el-input
          v-model="ingrediente.nombre"
          placeholder="Ej: Tomate, Queso, Pepperoni"
          class="shadow-inner rounded-lg"
        />
      </el-form-item>

      <el-form-item label="Costo Unitario ($)" :error="errors.costo_unitario">
        <el-input
          v-model.number="ingrediente.costo_unitario"
          type="number"
          min="0"
          step="0.01"
          placeholder="Ej: 2.50"
          class="shadow-inner rounded-lg"
        />
      </el-form-item>

      <el-form-item label="Tipo de Ingrediente" :error="errors.tipo">
        <el-select
          v-model="ingrediente.tipo"
          placeholder="Seleccione un tipo"
          class="w-full"
        >
          <el-option v-for="tipo in tiposIngrediente" :key="tipo" :label="tipo" :value="tipo" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button
          type="success"
          native-type="submit"
          class="w-full pulse-button"
          style="background: linear-gradient(45deg, #e63946, #f1faee); color: #7f1d1d; font-weight: 700;"
        >
          Agregar Ingrediente
        </el-button>
      </el-form-item>
    </el-form>
  </el-card>

  <transition name="fade">
    <div v-if="success" class="text-center p-8 bg-green-100 rounded-lg max-w-lg mx-auto">
      <h2 class="text-2xl font-bold text-green-700 mb-4">¡Ingrediente agregado exitosamente!</h2>
      <el-button
        type="primary"
        @click="goBack"
        class="pulse-button"
        style="background: linear-gradient(45deg, #e63946, #f1faee); color: #7f1d1d; font-weight: 700;"
      >
        Volver a Ingredientes
      </el-button>
    </div>
  </transition>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';

const router = useRouter();
const ingrediente = ref({
  nombre: '',
  costo_unitario: 0.0,
  tipo: '',
});

const errors = ref({
  nombre: '',
  costo_unitario: '',
  tipo: '',
});

const success = ref(false);

const tiposIngrediente = [
  'Vegetal',
  'Cárnico',
  'Lácteo',
  'Mariscos',
  'Frutas',
  'Salsas',
  'Otro',
];

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


const validateForm = () => {
  let valid = true;
  errors.value = { nombre: '', costo_unitario: '', tipo: '' };

  const nombre = ingrediente.value.nombre.trim();

  const contienePalabraProhibida = palabrasProhibidas.some(p =>
    nombre.toLowerCase().includes(p)
  );

  const patronesInvalidos = [
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


  const tienePatronesMolestos = patronesInvalidos.some(r => r.test(nombre));

  if (!nombre) {
    errors.value.nombre = 'El nombre es obligatorio.';
    valid = false;
  } else if (nombre.length < 3 || nombre.length > 50) {
    errors.value.nombre = 'Debe tener entre 3 y 50 caracteres.';
    valid = false;
  } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/.test(nombre)) {
    errors.value.nombre = 'Solo letras y espacios permitidos.';
    valid = false;
  } else if (contienePalabraProhibida) {
    errors.value.nombre = 'El nombre contiene palabras no permitidas.';
    valid = false;
  } else if (tienePatronesMolestos) {
    errors.value.nombre = 'Texto repetitivo o no válido.';
    valid = false;
  }

  const costo = ingrediente.value.costo_unitario;

  if (costo === null || costo === '') {
    errors.value.costo_unitario = 'El costo es obligatorio.';
    valid = false;
  } else if (isNaN(costo)) {
    errors.value.costo_unitario = 'Debe ser un número.';
    valid = false;
  } else if (costo < 1) {
    errors.value.costo_unitario = 'Debe ser mayor o igual a 1.';
    valid = false;
  } else if (costo > 500) {
    errors.value.costo_unitario = 'El costo no debe superar los $500.';
    valid = false;
  } else if (!/^\d{1,3}(\.\d{1,2})?$/.test(costo.toString())) {
    errors.value.costo_unitario = 'Máximo 2 decimales permitidos.';
    valid = false;
  }

  if (!ingrediente.value.tipo || !['Vegetal', 'Cárnico', 'Lácteo', 'Mariscos', 'Frutas', 'Salsas', 'Otro'].includes(ingrediente.value.tipo)) {
    errors.value.tipo = 'Debe seleccionar un tipo válido.';
    valid = false;
  }

  return valid;
};



const submitForm = async () => {
  if (!validateForm()) return;

  try {
    const response = await fetch('/api/products/ingrediente', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ingrediente.value),
    });

    if (!response.ok) throw new Error('Error al agregar ingrediente');

    await response.json();
    ElMessage.success('Ingrediente agregado correctamente');
    success.value = true;
  } catch (error) {
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
</script>
