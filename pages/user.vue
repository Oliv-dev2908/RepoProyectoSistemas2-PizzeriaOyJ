<script setup>
definePageMeta({
  middleware: ["auth"],
})
const user = useSupabaseUser();
const client = useSupabaseClient();
</script>

<template>
  <div>
    <p>Usuario autenticado: {{ user }}</p>
  </div>
</template>
