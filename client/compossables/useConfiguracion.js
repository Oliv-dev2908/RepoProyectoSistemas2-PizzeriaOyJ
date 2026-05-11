import { ref, computed } from 'vue';

const configuracion = ref({
  nombre_pizzeria: 'Pizzería OyJ',
  logo_url: 'https://via.placeholder.com/96',
  theme_flavor: 'pizza_dark',
  custom_colors: {}
});

export const useConfiguracion = () => {
  const loading = ref(false);
  const error = ref(null);

  const fetchConfig = async () => {
    loading.value = true;
    try {
      const data = await $fetch('/api/configuracion');
      if (data) {
        configuracion.value = {
          ...data,
          custom_colors: data.custom_colors || {}
        };
      }
    } catch (err) {
      error.value = err;
      console.error('Error fetching config:', err);
    } finally {
      loading.value = false;
    }
  };

  const updateConfig = async (newConfig) => {
    loading.value = true;
    try {
      const data = await $fetch('/api/admin/configuracion', {
        method: 'PUT',
        body: newConfig
      });
      if (data.success) {
        configuracion.value = {
          ...data.result,
          custom_colors: data.result.custom_colors || {}
        };
      }
      return data;
    } catch (err) {
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const themePalettes = {
    pizza_clasica: {
      base: '#eff1f5', text: '#4c4f69', mauve: '#d20f39', red: '#d20f39',
      peach: '#fe640b', yellow: '#df8e1d', green: '#40a02b', blue: '#1e66f5',
      rosewater: '#dc8a78', mantle: '#e6e9ef', surface0: '#ccd0da', surface1: '#bcc0cc'
    },
    pizza_dark: {
      base: '#11111b', text: '#cdd6f4', mauve: '#f38ba8', red: '#f38ba8',
      peach: '#fab387', yellow: '#f9e2af', green: '#a6e3a1', blue: '#89b4fa',
      rosewater: '#f5e0dc', mantle: '#181825', surface0: '#313244', surface1: '#45475a'
    },
    neon: {
      base: '#000000', text: '#ffffff', mauve: '#ff00ff', red: '#ff0055',
      peach: '#ffaa00', yellow: '#ffff00', green: '#00ff00', blue: '#00ffff',
      rosewater: '#ff8888', mantle: '#111111', surface0: '#222222', surface1: '#333333'
    },
    mocha: {
      base: '#1e1e2e', text: '#cdd6f4', mauve: '#cba6f7', red: '#f38ba8',
      peach: '#fab387', yellow: '#f9e2af', green: '#a6e3a1', blue: '#89b4fa',
      rosewater: '#f5e0dc', mantle: '#181825', surface0: '#313244', surface1: '#45475a'
    },
    latte: {
      base: '#eff1f5', text: '#4c4f69', mauve: '#8839ef', red: '#d20f39',
      peach: '#fe640b', yellow: '#df8e1d', green: '#40a02b', blue: '#1e66f5',
      rosewater: '#dc8a78', mantle: '#e6e9ef', surface0: '#ccd0da', surface1: '#bcc0cc'
    }
  };

  const currentThemePalette = computed(() => {
    return themePalettes[configuracion.value.theme_flavor] || themePalettes.pizza_dark;
  });

  return {
    configuracion,
    loading,
    error,
    fetchConfig,
    updateConfig,
    currentThemePalette,
    themePalettes
  };
};
