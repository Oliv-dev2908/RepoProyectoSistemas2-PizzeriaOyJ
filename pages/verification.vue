<template>
    <div v-if="loading">
      Cargando...
    </div>
    <div v-else-if="confirmed">
      <h1>Correo electrónico confirmado</h1>
      <p>Tu dirección de correo electrónico ha sido verificada correctamente.</p>
      <button @click="volverInicio">Volver al inicio</button>
    </div>
    <div v-else-if="error">
      <h1>Error al confirmar el correo electrónico</h1>
      <p>{{ errorMessage }}</p>
      <button @click="volverInicio">Volver al inicio</button>
    </div>
  </template>
  
  <script>
  import { supabase } from '@/supabase'; // Asegúrate de tener tu instancia de Supabase configurada
  
  export default {
    data() {
      return {
        loading: true,
        confirmed: false,
        error: false,
        errorMessage: '',
      };
    },
    async mounted() {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      const type = urlParams.get('type');
  
      if (token && type === 'signup') {
        try {
          const { error } = await supabase.auth.verifyOtp({ token, type });
  
          if (error) {
            this.error = true;
            this.errorMessage = error.message;
          } else {
            this.confirmed = true;
          }
        } catch (e) {
          this.error = true;
          this.errorMessage = 'Ocurrió un error inesperado.';
        }
      } else {
        this.error = true;
        this.errorMessage = 'Enlace de confirmación inválido.';
      }
      this.loading = false;
    },
    methods: {
      volverInicio() {
        this.$router.push('/'); // Redirige a tu página de inicio (ajusta la ruta)
      },
    },
  };
  </script>