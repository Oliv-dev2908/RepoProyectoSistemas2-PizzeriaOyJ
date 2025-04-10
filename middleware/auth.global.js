import { useUserRole } from './../client/compossables/useUserRole';
import { navigateTo, useRoute } from '#app';

export default defineNuxtRouteMiddleware(async (to, from) => {
  const route = useRoute();
  const { setRole } = useUserRole();
  const user = useSupabaseUser();

  // Array of route names or paths where the middleware should NOT run
  const excludedRoutes = ['login', 'signup']; // Use route names

  // Check if the current route name is in the excludedRoutes array
  if (excludedRoutes.includes(route.name)) {
    return; // If it's an excluded route, just return and don't execute the rest of the middleware
  }

  // If the user is not logged in, redirect to login (you might have separate auth middleware for this)
  if (!user.value?.id) {
    return
  }

  console.log("Middleware Ejecutandose");
  try {
    const roleData = await $fetch(`/api/user/role?id=${user.value.id}`);
    console.log(roleData);
    const userRole = roleData;
    setRole(userRole); // Store the role in the composable
  } catch (error) {
    console.error('Error fetching user role:', error);
    return navigateTo('/login');
  }
});