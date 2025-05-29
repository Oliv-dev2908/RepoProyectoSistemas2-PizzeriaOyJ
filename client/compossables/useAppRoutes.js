import { ref, computed, markRaw } from 'vue'
import * as ElementPlusIcons from '@element-plus/icons-vue'
import { useUserRole } from './useUserRole'
export function useAppRoutes() {
  const { userRole } = useUserRole()

  const allRoutes = [
    {
      path: '/admin/asignar',
      name: 'Asignar Admins',
      icon: markRaw(ElementPlusIcons.UserFilled),
      roles: ['admin']
    },
    {
      path: '/user',
      name: 'User',
      icon: markRaw(ElementPlusIcons.UserFilled),
      roles: ['aaa'],
    },
    {
      path: 'products',
      name: 'UserPaths',
      icon: markRaw(ElementPlusIcons.KnifeFork),
      roles: ['admin'],
      children: [
        { path: 'categoria', name: 'Categoria', roles: ['admin'] },
        { path: 'ingrediente', name: 'Ingrediente', roles: ['admin'] },
        { path: 'pizza', name: 'Pizza', roles: ['admin'] },
        { path: 'producto', name: 'Producto', roles: ['admin'] },
        { path: 'tamano', name: 'Tamaño', roles: ['admin'] }
      ]
    },
    {
      path: 'usuario',
      name: 'User',
      icon: markRaw(ElementPlusIcons.UserFilled),
      roles: ['comun'],
      children: [
        { path: '', name: 'Usuario', roles: ['comun'] },
        { path: 'ordenarPizza', name: 'Ordenar Pizza', roles: ['comun'] },
        { path: 'perfil', name: 'Perfil', roles: ['comun'] },
      ]
    }
  ]


  const filteredRoutes = computed(() =>
    allRoutes.filter(route => (!route.roles || route.roles.includes(userRole.value)) && !route.children)
  )

  const filteredRoutesChildren = computed(() =>
    allRoutes.filter(route => (!route.roles || route.roles.includes(userRole.value)) && route.children)
  )

  return {
    allRoutes,
    filteredRoutes,
    filteredRoutesChildren
  }
}
