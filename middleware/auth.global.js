import { useUserRole } from './../client/compossables/useUserRole'
import { useAppRoutes } from './../client/compossables/useAppRoutes'
import { navigateTo } from '#app'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const user = useSupabaseUser()
  const { setRole } = useUserRole()

  const excludedRoutes = ['login', 'signup']

  if (!user.value?.id) return
  if(to.name == 'confirm') return
  try {
    // Redirigir si usuario autenticado intenta acceder a login o signup
    if (excludedRoutes.includes(to.name)) {
      return navigateTo('/')
    }

    // Obtener rol desde API
    const roleData = await $fetch(`/api/user/role?id=${user.value.id}`)
    const userRole = roleData
    setRole(userRole)

    // Obtener todas las rutas disponibles
    const { allRoutes } = useAppRoutes()

    // Normaliza el path: une padre e hijo
    const normalizePath = (base, child) => {
      if (!child) return `/${base.replace(/^\//, '')}`
      return `/${base.replace(/^\//, '')}/${child.replace(/^\//, '')}`
    }

    // Aplana todas las rutas con sus roles
    const getFlattenedRoutes = (routes) => {
      const result = []

      routes.forEach(route => {
        // Ruta principal
        const mainPath = route.path.startsWith('/') ? route.path : `/${route.path}`
        result.push({ path: mainPath, roles: route.roles })

        // Hijos
        if (route.children && route.children.length) {
          route.children.forEach(child => {
            const fullPath = normalizePath(route.path, child.path)
            result.push({ path: fullPath, roles: child.roles })
          })
        }
      })

      return result
    }

    const flattenedRoutes = getFlattenedRoutes(allRoutes)

    // Verifica si la ruta actual comienza con alguna ruta válida para el rol
    const isAuthorized = flattenedRoutes.some(route => {
      return to.path.startsWith(route.path) && route.roles.includes(userRole)
    })
    console.log(isAuthorized);
    if (!isAuthorized && to.path != '/') {
      return navigateTo('/')
    }

  } catch (error) {
    console.error('Error fetching user role:', error)
    return navigateTo('/login')
  }
})
