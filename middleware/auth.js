import { defineNuxtRouteMiddleware, navigateTo } from "nuxt/app";

export default defineNuxtRouteMiddleware( () => {
    const user = useSupabaseUser();
    if(!user._value){
        return navigateTo("/login");
    }
})