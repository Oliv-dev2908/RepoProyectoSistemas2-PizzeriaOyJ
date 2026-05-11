<template>
  <div
    v-if="userRole === 'comun'"
    class="p-4 sm:p-6 rounded-2xl shadow-xl border border-theme bg-theme-card text-theme-text transition-all duration-300"
  >
    <h2 class="text-2xl font-bold mb-6 font-pizza-title flex items-center gap-2">
      <span class="text-3xl">🎁</span> Ofertas Activas
    </h2>

    <div v-if="ofertasFiltradas.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="oferta in ofertasFiltradas"
        :key="oferta.id_oferta"
        class="p-5 rounded-xl border border-theme bg-theme-surface hover:shadow-md transition-shadow group"
      >
        <div class="flex justify-between items-start mb-2">
          <h3 class="text-lg font-bold text-ctp-mauve group-hover:text-ctp-pink transition-colors">
            {{ obtenerTitulo(oferta) }}
          </h3>
          <el-tag size="small" type="success" effect="dark" round>Activo</el-tag>
        </div>
        
        <p class="text-xs font-bold text-theme-secondary uppercase tracking-wider mb-4">
          📅 {{ formatearFecha(oferta.fecha_inicio) }} al {{ formatearFecha(oferta.fecha_fin) }}
        </p>

        <div class="space-y-2">
          <span class="text-xs font-bold text-theme-secondary uppercase">Aplica a:</span>
          <ul class="space-y-1">
            <li v-for="id in oferta.pizzas" :key="id" class="flex items-center gap-2 text-sm">
              <span class="text-ctp-peach">🍕</span> {{ obtenerNombrePizza(id) }}
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-10">
      <el-empty description="No hay ofertas activas en este momento" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useUserRole } from './../client/compossables/useUserRole'

const { userRole } = useUserRole()
const ofertas = ref([])
const pizzas = ref([])

onMounted(async () => {
  await fetchPizzas()
  await fetchOfertas()
})

const fetchOfertas = async () => {
  try {
    const res = await fetch('/api/ofertas')
    ofertas.value = await res.json()
  } catch (e) {
    console.error('Error fetching offers:', e)
  }
}

const fetchPizzas = async () => {
  try {
    const res = await fetch('/api/products/pizza')
    pizzas.value = await res.json()
  } catch (e) {
    console.error('Error fetching pizzas:', e)
  }
}

const obtenerNombrePizza = (id) => {
  const pizza = pizzas.value.find(p => p.id_pizza === id)
  return pizza ? pizza.nombre : 'Pizza desconocida'
}

const formatearFecha = (fechaStr) => {
  const fecha = new Date(fechaStr)
  return fecha.toLocaleDateString('es-BO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const obtenerTitulo = (oferta) => {
  if (oferta.tipo === 'descuento') {
    return `${(oferta.descuento * 100).toFixed(0)}% de Descuento`
  } else if (oferta.tipo === 'n_x_m') {
    return `${oferta.n_cantidad}x${oferta.m_paga} en Pizzas`
  }
  return 'Oferta Especial'
}

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
