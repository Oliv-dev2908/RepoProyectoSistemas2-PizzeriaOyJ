<template>
  <div class="container mx-auto p-6 text-theme-text">
    <h1 class="text-3xl font-bold mb-8 font-pizza-title flex items-center gap-3">
      <el-icon><ElementPlusIcons.Setting /></el-icon>
      Personalización de Marca
    </h1>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Columna Izquierda: Formulario -->
      <el-card class="shadow-lg border-theme">
        <template #header>
          <div class="flex items-center justify-between">
            <span class="text-xl font-bold">Configuración General</span>
            <el-tag type="info" size="small">Administrador</el-tag>
          </div>
        </template>

        <el-form label-position="top">
          <el-form-item label="Nombre de la Pizzería">
            <el-input v-model="form.nombre_pizzeria" placeholder="Ej. Pizzería La Increíble" />
          </el-form-item>

          <el-form-item label="URL del Logo">
            <el-input v-model="form.logo_url" placeholder="https://ejemplo.com/mi-logo.png" />
            <p class="text-xs text-theme-secondary mt-1">Recomendado: Imagen cuadrada con fondo transparente.</p>
          </el-form-item>

          <el-form-item label="Paleta de Colores (Tema)">
            <el-select v-model="form.theme_flavor" class="w-full">
              <el-option label="Catppuccin Latte (Claro)" value="latte" />
              <el-option label="Catppuccin Frappé (Grisáceo)" value="frappe" />
              <el-option label="Catppuccin Macchiato (Suave)" value="macchiato" />
              <el-option label="Catppuccin Mocha (Oscuro Profundo)" value="mocha" />
            </el-select>
          </el-form-item>

          <div class="mt-8 flex justify-end">
            <el-button type="primary" size="large" class="pulse-button px-10" :loading="loading" @click="handleSave">
              Guardar Cambios
            </el-button>
          </div>
        </el-form>
      </el-card>

      <!-- Columna Derecha: Previsualización -->
      <div class="flex flex-col gap-6">
        <el-card class="shadow-lg border-theme bg-theme-surface">
          <template #header>
            <span class="font-bold">Previsualización de Marca</span>
          </template>
          <div class="flex flex-col items-center justify-center p-8 bg-theme-bg rounded-xl border border-theme">
            <img :src="form.logo_url" alt="Logo preview" class="w-32 h-32 object-contain rounded-full shadow-lg border-4 border-ctp-red mb-4" />
            <h2 class="text-3xl font-bold text-ctp-red font-pizza-title">{{ form.nombre_pizzeria }}</h2>
          </div>
        </el-card>

        <el-card class="shadow-lg border-theme">
          <template #header>
            <span class="font-bold">Muestra de la Paleta Elegida</span>
          </template>
          <div class="grid grid-cols-4 gap-3">
            <div v-for="(color, name) in currentPaletteSample" :key="name" class="flex flex-col items-center gap-1">
              <div class="w-full h-12 rounded-lg shadow-sm border border-theme" :style="{ backgroundColor: color }"></div>
              <span class="text-[10px] capitalize">{{ name }}</span>
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

const form = reactive({
  nombre_pizzeria: '',
  logo_url: '',
  theme_flavor: ''
});

onMounted(() => {
  form.nombre_pizzeria = configuracion.value.nombre_pizzeria;
  form.logo_url = configuracion.value.logo_url;
  form.theme_flavor = configuracion.value.theme_flavor;
});

const themePalettes = {
  latte: { red: '#d20f39', peach: '#fe640b', green: '#40a02b', blue: '#1e66f5' },
  frappe: { red: '#e78284', peach: '#ef9f76', green: '#a6d189', blue: '#8caaee' },
  macchiato: { red: '#ed8796', peach: '#f5a97f', green: '#a6da95', blue: '#8aadf4' },
  mocha: { red: '#f38ba8', peach: '#fab387', green: '#a6e3a1', blue: '#89b4fa' }
};

const currentPaletteSample = computed(() => {
  return themePalettes[form.theme_flavor] || themePalettes.mocha;
});

const handleSave = async () => {
  try {
    await updateConfig({ ...form });
    ElMessage.success('¡Marca y tema actualizados con éxito!');
  } catch (error) {
    ElMessage.error('Error al guardar la configuración');
    console.error(error);
  }
};
</script>
