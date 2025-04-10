<script setup>
const user = useSupabaseUser()
 
// Get redirect path from cookies
const cookieName = useRuntimeConfig().public.supabase.cookieName
const redirectPath = useCookie(`${cookieName}-redirect-path`).value
 
/*watch(user, () => {
  if (user.value) {
    // Clear cookie
    useCookie(`${cookieName}-redirect-path`).value = null
    console.log(user.value);
    await fetch('/api/loginsignup?uuid=', user.value.id);
    // Redirect to path
    console.log(user.value.id);
    //return navigateTo(redirectPath || '/products/tamano'); 
  }
}, { immediate: true })*/

watch(user, async (newUser) => { // Make the callback async
  if (newUser) {
    // Clear cookie
    useCookie(`${cookieName}-redirect-path`).value = null;
    console.log(newUser);
    try {
      console.log(newUser.user_metadata.display_name);
      await fetch(`/api/user/loginsignup?uuid=${newUser.id}&name=${newUser.user_metadata.display_name}`);
      // Redirect to path
      return navigateTo('/products/tamano');
    } catch (error) {
      console.error("Error during fetch:", error);
      // Handle the error appropriately (e.g., display an error message)
    }
  }
}, { immediate: true });
</script>
<template>
  <div>Waiting for login...</div>
</template>