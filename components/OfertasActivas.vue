<template>
  <div
    v-if="userRole === 'comun'"
    :class="[
      'p-6 rounded-lg shadow-md',
      isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
    ]"
  >
    <h2 class="text-2xl font-bold mb-4">🎁 Ofertas Activas</h2>

    <div v-if="ofertasFiltradas.length > 0" class="space-y-4">
      <div
        v-for="oferta in ofertasFiltradas"
        :key="oferta.id_oferta"
        :class="[
          'p-4 rounded-md border',
          isDark
            ? 'border-gray-700 bg-gray-700 text-white'
            : 'border-gray-200 bg-gray-50 text-gray-800'
        ]"
      >
        <h3 class="text-lg font-semibold">
          {{ obtenerTitulo(oferta) }}
        </h3>
        <p class="text-sm">
          Vigencia: {{ formatearFecha(oferta.fecha_inicio) }} al {{ formatearFecha(oferta.fecha_fin) }}
        </p>

        <div class="mt-2">
          <span class="text-sm font-medium">Aplica a:</span>
          <ul class="list-disc list-inside">
            <li v-for="id in oferta.pizzas" :key="id">
              {{ obtenerNombrePizza(id) }}
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div v-else :class="isDark ? 'text-gray-400' : 'text-gray-500'">
      No hay ofertas activas en este momento.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserRole } from './../client/compossables/useUserRole'

const { userRole } = useUserRole()
const ofertas = ref([])
const pizzas = ref([])

const isDark = ref(false)

const checkDarkMode = () => {
  isDark.value = document.documentElement.classList.contains('dark')
}

let observer = null
onMounted(async () => {
  await fetchPizzas()
  await fetchOfertas()

  checkDarkMode()
  observer = new MutationObserver(() => checkDarkMode())
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
})

const fetchOfertas = async () => {
  const res = await fetch('/api/ofertas')
  ofertas.value = await res.json()
}

const fetchPizzas = async () => {
  const res = await fetch('/api/products/pizza')
  pizzas.value = await res.json()
}

const obtenerNombrePizza = (id) => {
  const pizza = pizzas.value.find(p => p.id_pizza === id)
  return pizza ? pizza.nombre : 'Pizza desconocida'
}

const formatearFecha = (fechaStr) => {
  const fecha = new Date(fechaStr)
  return fecha.toLocaleDateString('es-BO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const obtenerTitulo = (oferta) => {
  if (oferta.tipo === 'descuento') {
    return `${oferta.descuento * 100}% de descuento`
  } else if (oferta.tipo === 'n_x_m') {
    return `${oferta.n_cantidad}x${oferta.m_paga} en pizzas`
  }
  return 'Oferta Especial'
}

import { computed } from 'vue'
const ofertasFiltradas = computed(() => {
  const hoy = new Date()
  return ofertas.value.filter((oferta) => {
    if (!oferta.activo) return false
    const inicio = new Date(oferta.fecha_inicio)
    const fin = new Date(oferta.fecha_fin)
    return hoy >= inicio && hoy <= fin
  })
})
</script>

<style scoped>
/* Puedes agregar estilos extra si quieres */
</style>
