<template>
  <div class="container mx-auto p-4 sm:p-6 text-theme-text min-h-screen">
    <h1 class="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 font-pizza-title flex items-center gap-3">
      <el-icon><ElementPlusIcons.Setting /></el-icon>
      Personalización de Marca
    </h1>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <!-- Columna Izquierda: Formulario (Ocupa 2/3 en pantallas grandes) -->
      <div class="xl:col-span-2 space-y-6">
        <el-card class="shadow-lg border-theme">
          <template #header>
            <div class="flex items-center justify-between">
              <span class="text-lg font-bold">Identidad Básica</span>
              <el-tag type="info" size="small">Requerido</el-tag>
            </div>
          </template>

          <el-form label-position="top">
            <el-form-item label="Nombre de la Pizzería">
              <el-input v-model="form.nombre_pizzeria" placeholder="Ej. Pizzería La Increíble" />
            </el-form-item>

            <el-form-item label="URL del Logo">
              <el-input v-model="form.logo_url" placeholder="https://ejemplo.com/mi-logo.png" />
              <p class="text-xs text-theme-secondary mt-1">Se recomienda fondo transparente y forma circular/cuadrada.</p>
            </el-form-item>

            <el-form-item label="Paleta Base (Catppuccin)">
              <el-select v-model="form.theme_flavor" class="w-full">
                <el-option label="Latte (Claro)" value="latte" />
                <el-option label="Frappé (Grisáceo)" value="frappe" />
                <el-option label="Macchiato (Suave)" value="macchiato" />
                <el-option label="Mocha (Oscuro Profundo)" value="mocha" />
              </el-select>
            </el-form-item>
          </el-form>
        </el-card>

        <!-- Personalización de Colores -->
        <el-card class="shadow-lg border-theme">
          <template #header>
            <span class="text-lg font-bold">Colores Personalizados (Sobrescritura)</span>
          </template>
          
          <el-tabs type="border-card" class="!bg-theme-bg !border-theme rounded-lg">
            <el-tab-pane label="☀️ Modo Claro">
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 p-2">
                <div v-for="color in configurableColors" :key="color" class="flex flex-col gap-2">
                  <span class="text-xs font-bold uppercase text-theme-secondary">{{ color }}</span>
                  <el-color-picker v-model="form.custom_colors_light[color]" />
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="🌙 Modo Oscuro">
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 p-2">
                <div v-for="color in configurableColors" :key="color" class="flex flex-col gap-2">
                  <span class="text-xs font-bold uppercase text-theme-secondary">{{ color }}</span>
                  <el-color-picker v-model="form.custom_colors_dark[color]" />
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
          <div class="mt-4 p-3 bg-theme-surface rounded-lg border border-theme">
            <p class="text-xs italic text-theme-secondary">
              * Deja el color en blanco para usar el valor por defecto de la paleta elegida.
            </p>
          </div>
        </el-card>

        <div class="flex justify-end">
          <el-button type="primary" size="large" class="pulse-button w-full sm:w-auto px-12 h-12 text-lg" 
            :loading="loading" @click="handleSave">
            Aplicar y Guardar Cambios
          </el-button>
        </div>
      </div>

      <!-- Columna Derecha: Previsualización -->
      <div class="space-y-6">
        <el-card class="shadow-lg border-theme bg-theme-surface sticky top-6">
          <template #header>
            <span class="font-bold">Previsualización Real</span>
          </template>
          <div class="flex flex-col items-center justify-center p-8 bg-theme-bg rounded-2xl border-2 border-theme shadow-inner">
            <img :src="form.logo_url || 'https://via.placeholder.com/128'" alt="Logo preview" 
              class="w-32 h-32 object-contain rounded-full shadow-lg border-4 border-ctp-red mb-6" />
            <h2 class="text-2xl font-bold text-ctp-red font-pizza-title text-center">{{ form.nombre_pizzeria || 'Tu Pizzería' }}</h2>
            <div class="mt-6 flex flex-wrap gap-2 justify-center">
              <el-button type="primary" size="small" round>Botón Primario</el-button>
              <el-button type="danger" size="small" round>Acción</el-button>
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useConfiguracion } from '@/client/compossables/useConfiguracion';
import * as ElementPlusIcons from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

const { configuracion, updateConfig, loading } = useConfiguracion();

const configurableColors = [
  'mauve', 'red', 'blue', 'green', 'yellow', 'peach', 'teal', 'sapphire'
];

const form = reactive({
  nombre_pizzeria: '',
  logo_url: '',
  theme_flavor: '',
  custom_colors_light: {},
  custom_colors_dark: {}
});

onMounted(() => {
  form.nombre_pizzeria = configuracion.value.nombre_pizzeria;
  form.logo_url = configuracion.value.logo_url;
  form.theme_flavor = configuracion.value.theme_flavor;
  
  // Clonar para evitar mutación directa reactiva antes de guardar
  form.custom_colors_light = { ...configuracion.value.custom_colors_light };
  form.custom_colors_dark = { ...configuracion.value.custom_colors_dark };
  
  // Asegurar que todos los campos existan para el color picker
  configurableColors.forEach(c => {
    if (!form.custom_colors_light[c]) form.custom_colors_light[c] = '';
    if (!form.custom_colors_dark[c]) form.custom_colors_dark[c] = '';
  });
});

const handleSave = async () => {
  try {
    // Limpiar colores vacíos antes de enviar
    const cleanLight = {};
    const cleanDark = {};
    Object.entries(form.custom_colors_light).forEach(([k, v]) => { if(v) cleanLight[k] = v; });
    Object.entries(form.custom_colors_dark).forEach(([k, v]) => { if(v) cleanDark[k] = v; });

    await updateConfig({ 
      ...form,
      custom_colors_light: cleanLight,
      custom_colors_dark: cleanDark
    });
    ElMessage.success('¡Configuración de marca actualizada con éxito!');
  } catch (error) {
    ElMessage.error('Error al guardar la configuración');
    console.error(error);
  }
};
</script>

<style scoped>
:deep(.el-tabs__content) {
  background-color: var(--theme-bg);
}
</style>
