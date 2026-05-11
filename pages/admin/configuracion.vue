<template>
  <div class="container mx-auto p-4 sm:p-6 text-theme-text min-h-screen">
    <h1 class="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 font-pizza-title flex items-center gap-3">
      <el-icon><ElementPlusIcons.Setting /></el-icon>
      Configuración de Marca
    </h1>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <!-- Formulario Principal -->
      <div class="xl:col-span-2 space-y-6">
        <el-card class="shadow-lg border-theme">
          <template #header>
            <span class="text-lg font-bold">Identidad Visual</span>
          </template>

          <el-form label-position="top">
            <el-form-item label="Nombre de la Pizzería">
              <el-input v-model="form.nombre_pizzeria" placeholder="Ej. Pizzería La Increíble" />
            </el-form-item>

            <el-form-item label="URL del Logo">
              <el-input v-model="form.logo_url" placeholder="https://ejemplo.com/mi-logo.png" />
            </el-form-item>

            <el-form-item label="Elegir Paleta de Colores">
              <el-select v-model="form.theme_flavor" class="w-full">
                <el-option label="🍕 Pizzería Clásica (Blanco/Rojo)" value="pizza_clasica" />
                <el-option label="🌙 Pizzería Dark (Negro/Naranja)" value="pizza_dark" />
                <el-option label="✨ Estilo Neón (Cyber)" value="neon" />
                <el-option label="🎀 Catppuccin Latte" value="latte" />
                <el-option label="🌌 Catppuccin Mocha" value="mocha" />
              </el-select>
            </el-form-item>
          </el-form>
        </el-card>

        <!-- Personalización Manual -->
        <el-card class="shadow-lg border-theme">
          <template #header>
            <span class="text-lg font-bold">Personalizar Colores Manualmente</span>
          </template>
          
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-6 p-2">
            <div v-for="color in configurableColors" :key="color" class="flex flex-col items-center gap-2">
              <span class="text-[10px] font-bold uppercase text-theme-secondary text-center">{{ color }}</span>
              <el-color-picker v-model="form.custom_colors[color]" />
            </div>
          </div>
          
          <div class="mt-6 p-4 bg-theme-surface rounded-xl border border-theme">
            <p class="text-xs text-theme-secondary text-center">
              Los colores manuales tienen prioridad sobre la paleta elegida arriba. 
              Borra un color para volver al valor por defecto.
            </p>
          </div>
        </el-card>

        <div class="flex justify-end">
          <el-button type="primary" size="large" class="pulse-button w-full sm:w-auto px-12 h-14 text-lg font-bold" 
            :loading="loading" @click="handleSave">
            Guardar Configuración Global
          </el-button>
        </div>
      </div>

      <!-- Previsualización Real -->
      <div class="space-y-6">
        <el-card class="shadow-xl border-theme bg-theme-surface sticky top-6">
          <template #header>
            <span class="font-bold">Vista Previa Real</span>
          </template>
          
          <div class="flex flex-col items-center justify-center p-8 bg-theme-bg rounded-2xl border-2 border-theme">
            <img :src="form.logo_url || 'https://via.placeholder.com/128'" alt="Preview" 
              class="w-32 h-32 object-contain rounded-full shadow-lg border-4 border-ctp-red mb-6" />
            <h2 class="text-2xl font-bold text-ctp-red font-pizza-title text-center mb-8">{{ form.nombre_pizzeria || 'Tu Pizzería' }}</h2>
            
            <div class="w-full space-y-3">
               <el-button type="primary" class="w-full">Botón Principal</el-button>
               <el-button type="success" class="w-full">Confirmar Pedido</el-button>
               <el-button type="danger" class="w-full" plain>Cancelar</el-button>
               <div class="mt-4 pt-4 border-t border-theme">
                 <p class="text-xs text-theme-secondary mb-2">Campos de Texto:</p>
                 <el-input placeholder="Ejemplo de input" size="small" />
               </div>
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue';
import { useConfiguracion } from '@/client/compossables/useConfiguracion';
import * as ElementPlusIcons from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

const { configuracion, updateConfig, loading } = useConfiguracion();

const configurableColors = [
  'base', 'text', 'mauve', 'red', 'blue', 'green', 'yellow', 'peach'
];

const form = reactive({
  nombre_pizzeria: '',
  logo_url: '',
  theme_flavor: '',
  custom_colors: {}
});

onMounted(() => {
  form.nombre_pizzeria = configuracion.value.nombre_pizzeria;
  form.logo_url = configuracion.value.logo_url;
  form.theme_flavor = configuracion.value.theme_flavor;
  form.custom_colors = { ...configuracion.value.custom_colors };
  
  // Inicializar colores vacíos
  configurableColors.forEach(c => {
    if (!form.custom_colors[c]) form.custom_colors[c] = '';
  });
});

const handleSave = async () => {
  try {
    const cleanColors = {};
    Object.entries(form.custom_colors).forEach(([k, v]) => { if(v) cleanColors[k] = v; });

    await updateConfig({ 
      ...form,
      custom_colors: cleanColors
    });
    ElMessage.success('¡Configuración guardada correctamente!');
  } catch (error) {
    ElMessage.error('Error al guardar');
    console.error(error);
  }
};
</script>
