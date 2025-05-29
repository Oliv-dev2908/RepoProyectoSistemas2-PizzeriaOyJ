<script setup>
import Forms from './../components/forms/index.vue';
import { useUserRole } from './../client/compossables/useUserRole'
const user = useSupabaseUser()
const openForm = ref(false);
const { userRole } = useUserRole();
const loadForm = async () => {
  if(userRole.value == 'admin'){
    openForm.value = false;
    return;
  }
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