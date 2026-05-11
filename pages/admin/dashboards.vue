<template>
  <div class="container mx-auto p-4 sm:p-6 text-theme-text min-h-screen">
    <h1 class="text-3xl sm:text-4xl font-bold mb-8 text-ctp-red font-pizza-title drop-shadow-sm text-center sm:text-left">
      Dashboard de Gestión
    </h1>

    <!-- FILA 1 -->
    <el-row :gutter="20" class="mb-8">
      <el-col :xs="24" :lg="12" class="mb-6 lg:mb-0">
        <el-card class="shadow-lg border-theme h-full">
          <template #header>
            <div class="flex flex-wrap items-center justify-between gap-4">
              <span class="font-bold">Costos y Uso de Ingredientes</span>
              <div class="flex gap-2">
                <el-select v-model="filtroIngredientes" size="small" @change="drawCostosIngredientesChart" class="!w-32">
                  <el-option label="Costo" value="costo" />
                  <el-option label="Cantidad" value="cantidad" />
                </el-select>
                <el-select v-model="topIngredientes" size="small" @change="drawCostosIngredientesChart" class="!w-24">
                  <el-option v-for="n in [5, 10, 15]" :key="n" :label="`Top ${n}`" :value="n" />
                </el-select>
              </div>
            </div>
          </template>
          <div class="h-[350px]">
            <canvas id="costosIngredientesChart"></canvas>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="12">
        <el-card class="shadow-lg border-theme h-full">
          <template #header>
            <div class="flex flex-wrap items-center justify-between gap-4">
              <span class="font-bold">Evolución de Ventas</span>
              <div class="flex gap-2 flex-wrap">
                <el-select v-model="productosSeleccionados" multiple collapse-tags size="small" @change="drawEvolucionVentasChart" class="!w-40" placeholder="Productos">
                  <el-option v-for="prod in productosDisponibles" :key="prod" :label="prod" :value="prod" />
                </el-select>
                <el-select v-model="estadoSeleccionado" size="small" clearable @change="drawEvolucionVentasChart" class="!w-32" placeholder="Estado">
                  <el-option label="Aprobado" value="Aprobado" />
                  <el-option label="Pendiente" value="Pendiente" />
                  <el-option label="Cancelado" value="Cancelado por el Cliente" />
                </el-select>
              </div>
            </div>
          </template>
          <div class="h-[350px]">
            <canvas id="evolucionVentasChart"></canvas>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- FILA 2 -->
    <el-row :gutter="20" class="mb-8">
      <el-col :xs="24" :lg="12" class="mb-6 lg:mb-0">
        <el-card class="shadow-lg border-theme h-full">
          <template #header>
            <div class="flex items-center justify-between">
              <span class="font-bold">Productos Más Vendidos</span>
              <el-select v-model="topProductos" size="small" @change="drawProductosMasVendidosChart" class="!w-24">
                <el-option v-for="n in [5, 10, 15]" :key="n" :label="`Top ${n}`" :value="n" />
              </el-select>
            </div>
          </template>
          <div class="h-[350px]">
            <canvas id="productosMasVendidosChart"></canvas>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="12">
        <el-card class="shadow-lg border-theme h-full">
          <template #header>
            <div class="flex items-center justify-between">
              <span class="font-bold">Ventas por Categoría</span>
              <el-select v-model="ordenCategoria" size="small" @change="drawVentasPorCategoriaChart" class="!w-32">
                <el-option label="Mayor a menor" value="desc" />
                <el-option label="Menor a mayor" value="asc" />
              </el-select>
            </div>
          </template>
          <div class="h-[350px]">
            <canvas id="ventasPorCategoriaChart"></canvas>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- ANÁLISIS IA -->
    <h2 class="text-2xl font-bold mb-6 flex items-center gap-2 border-b border-theme pb-2">
      <span class="text-3xl">🤖</span> Análisis Predictivo e IA
    </h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <el-card class="shadow-md border-theme">
        <h3 class="font-bold mb-4 text-ctp-blue">Segmentación K-Means</h3>
        <img src="https://repoproyectosistemas2-pizzeriaoyj.onrender.com/kmeans-image" class="w-full h-auto rounded-lg border border-theme" alt="K-Means" />
      </el-card>

      <el-card class="shadow-md border-theme">
        <h3 class="font-bold mb-4 text-ctp-green">Cluster Principal</h3>
        <img src="https://repoproyectosistemas2-pizzeriaoyj.onrender.com/kmeans-image/cluster?num=0" class="w-full h-auto rounded-lg border border-theme" alt="Cluster 0" />
      </el-card>
    </div>

    <el-card class="shadow-lg border-theme mb-8">
      <h3 class="font-bold mb-4 text-ctp-mauve">Árboles de Decisión (Predicción)</h3>
      <img src="https://repoproyectosistemas2-pizzeriaoyj.onrender.com/decision-tree-image" class="w-full h-auto rounded-xl border-2 border-theme" alt="Decision Tree" />
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Chart from 'chart.js/auto'

const costosIngredientesData = ref([])
const evolucionVentasData = ref([])
const productosMasVendidosData = ref([])
const ventasPorCategoriaData = ref([])

let costosChart = null
let evolucionChart = null
let productosChart = null
let categoriasChart = null

const fetchDashboardData = async () => {
  try {
    const res = await $fetch('/api/admin/dashboard')
    if (res.success) {
      costosIngredientesData.value = res.resumen.costosIngredientes
      evolucionVentasData.value = res.resumen.evolucionVentas
      productosMasVendidosData.value = res.resumen.productosMasVendidos
      ventasPorCategoriaData.value = res.resumen.ventasPorCategoria

      setTimeout(() => {
        drawCostosIngredientesChart()
        drawEvolucionVentasChart()
        drawProductosMasVendidosChart()
        drawVentasPorCategoriaChart()
      }, 100)
    }
  } catch (error) {
    console.error('Error dashboard data:', error)
  }
}

// Charts
const filtroIngredientes = ref('costo')
const topIngredientes = ref(10)
const drawCostosIngredientesChart = () => {
  const ctx = document.getElementById('costosIngredientesChart')
  if (!ctx || costosChart) costosChart?.destroy()

  let datos = [...costosIngredientesData.value]
  datos.sort((a, b) => {
    const campo = filtroIngredientes.value === 'costo' ? 'costo_total' : 'cantidad_usada'
    return Number(b[campo]) - Number(a[campo])
  })
  datos = datos.slice(0, topIngredientes.value)

  costosChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: datos.map(i => i.ingrediente),
      datasets: [
        { label: 'Costo Total', data: datos.map(i => Number(i.costo_total)), backgroundColor: '#f38ba8' },
        { label: 'Cantidad', data: datos.map(i => Number(i.cantidad_usada)), backgroundColor: '#89b4fa' }
      ]
    },
    options: { responsive: true, maintainAspectRatio: false }
  })
}

const productosSeleccionados = ref([])
const estadoSeleccionado = ref('')
const productosDisponibles = computed(() => [...new Set(evolucionVentasData.value.map(v => v.producto))])
const drawEvolucionVentasChart = () => {
  const ctx = document.getElementById('evolucionVentasChart')
  if (!ctx || evolucionChart) evolucionChart?.destroy()
  
  let dataFiltrada = [...evolucionVentasData.value]
  if (estadoSeleccionado.value) dataFiltrada = dataFiltrada.filter(item => item.estado === estadoSeleccionado.value)

  const meses = [...new Set(dataFiltrada.map(v => v.mes))].sort()
  const productos = productosSeleccionados.value.length ? productosSeleccionados.value : productosDisponibles.value.slice(0, 5)

  const datasets = productos.map((prod, idx) => ({
    label: prod,
    data: meses.map(mes => {
      const record = dataFiltrada.find(v => v.producto === prod && v.mes === mes)
      return record ? Number(record.cantidad_vendida) : 0
    }),
    borderColor: `hsl(${(idx * 60) % 360}, 70%, 60%)`,
    tension: 0.3
  }))

  evolucionChart = new Chart(ctx, {
    type: 'line',
    data: { labels: meses.map(m => new Date(m).toLocaleDateString('es-ES', { month: 'short' })), datasets },
    options: { responsive: true, maintainAspectRatio: false }
  })
}

const topProductos = ref(10)
const drawProductosMasVendidosChart = () => {
  const ctx = document.getElementById('productosMasVendidosChart')
  if (!ctx || productosChart) productosChart?.destroy()
  let datos = [...productosMasVendidosData.value].sort((a, b) => b.total_vendido - a.total_vendido).slice(0, topProductos.value)
  productosChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: datos.map(p => p.producto),
      datasets: [{ data: datos.map(p => Number(p.total_vendido)), backgroundColor: ['#fab387', '#a6e3a1', '#89dceb', '#cba6f7', '#f9e2af'] }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  })
}

const ordenCategoria = ref('desc')
const drawVentasPorCategoriaChart = () => {
  const ctx = document.getElementById('ventasPorCategoriaChart')
  if (!ctx || categoriasChart) categoriasChart?.destroy()
  let datos = [...ventasPorCategoriaData.value].sort((a, b) => ordenCategoria.value === 'desc' ? b.total_ventas - a.total_ventas : a.total_ventas - b.total_ventas)
  categoriasChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: datos.map(c => c.categoria),
      datasets: [{ label: 'Ventas', data: datos.map(c => Number(c.total_ventas)), backgroundColor: '#b4befe' }]
    },
    options: { responsive: true, maintainAspectRatio: false, indexAxis: 'y' }
  })
}

onMounted(() => {
  fetchDashboardData()
})
</script>
