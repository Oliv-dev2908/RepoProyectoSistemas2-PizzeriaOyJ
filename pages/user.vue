<script setup lang="js">
import { useUserRole } from '../client/compossables/useUserRole';
const user = useSupabaseUser();
const { userRole } = useUserRole();
</script>

<template>
  <div>
    <p>Usuario autenticado: {{ user }}</p>
    <p>Usuario autenticado: {{ userRole }}</p>
  </div>
</template>
