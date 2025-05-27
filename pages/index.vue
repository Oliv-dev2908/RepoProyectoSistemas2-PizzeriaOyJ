<script setup>
import Forms from './../components/forms/index.vue';
const user = useSupabaseUser()
const openForm = ref(false);
const loadForm = async () => {
  try {
    const response = await fetch('/api/forms/general?id_cliente='+user.value.id+'&titulo_encuesta=EncuestaGeneral')
    if(!response.ok){
      throw new Error('Error al cargar categorías');
    }
    const meses = await response.json()
    if(meses >= 3){
      openForm.value = true;
    }
    console.log(meses);
  } catch (error) {
    ElMessage.error(error.message);
  }
}
onMounted(loadForm);
</script>
<template>
  <Forms v-if="openForm">
  </Forms>
</template>