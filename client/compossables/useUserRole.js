// composables/useUserRole.js
import { ref } from 'vue';

const userRole = ref(null);

export function useUserRole() {
  const setRole = (role) => {
    userRole.value = role;
  };

  return {
    userRole: readonly(userRole),
    setRole,
  };
}