<template>
  <div class="dashboard-container">
    <h1>Dashboard</h1>

    <!-- FILA 1 -->
    <el-row :gutter="20" class="dashboard-row">
      <el-col :xs="24" :sm="24" :md="12">
        <el-form :inline="true" style="margin-bottom: 10px;">
          <el-form-item label="Top Ingredientes por:">
            <el-select v-model="filtroIngredientes" @change="drawCostosIngredientesChart">
              <el-option label="Costo Total" value="costo" />
              <el-option label="Cantidad Usada" value="cantidad" />
            </el-select>
          </el-form-item>
          <el-form-item label="Mostrar">
            <el-select v-model="topIngredientes" @change="drawCostosIngredientesChart">
              <el-option v-for="n in [5, 10, 15]" :key="n" :label="`Top ${n}`" :value="n" />
            </el-select>
          </el-form-item>
        </el-form>
        <section class="charts">
          <h2>Costos y Uso de Ingredientes</h2>
          <canvas id="costosIngredientesChart" class="responsive-canvas"></canvas>
        </section>
      </el-col>

      <el-col :xs="24" :sm="24" :md="12">
        <el-form :inline="true" class="filtros-form">
          <el-form-item label="Productos">
            <el-select
              v-model="productosSeleccionados"
              multiple
              filterable
              clearable
              collapse-tags
              @change="drawEvolucionVentasChart"
            >
              <el-option
                v-for="prod in productosDisponibles"
                :key="prod"
                :label="prod"
                :value="prod"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="Estado">
            <el-select
              v-model="estadoSeleccionado"
              placeholder="Filtrar por estado"
              clearable
              @change="drawEvolucionVentasChart"
            >
              <el-option label="Aprobado" value="Aprobado" />
              <el-option label="Pendiente" value="Pendiente" />
              <el-option label="Cancelado por el Cliente" value="Cancelado por el Cliente" />
              <el-option label="Cancelado por el Administrador" value="Cancelado por el Administrador" />
            </el-select>
          </el-form-item>
        </el-form>
        <section class="charts">
          <h2>Evolución Mensual Ventas por Producto</h2>
          <canvas id="evolucionVentasChart" class="responsive-canvas"></canvas>
        </section>
      </el-col>
    </el-row>

    <!-- FILA 2 -->
    <el-row :gutter="20" class="dashboard-row">
      <el-col :xs="24" :sm="24" :md="12">
        <el-form :inline="true" class="filtros-form">
          <el-form-item label="Top Productos">
            <el-select v-model="topProductos" @change="drawProductosMasVendidosChart">
              <el-option v-for="n in [5, 10, 15]" :key="n" :label="`Top ${n}`" :value="n" />
            </el-select>
          </el-form-item>
        </el-form>
        <section class="charts">
          <h2>Productos Más Vendidos</h2>
          <canvas id="productosMasVendidosChart" class="responsive-canvas"></canvas>
        </section>
      </el-col>

      <el-col :xs="24" :sm="24" :md="12">
        <el-form :inline="true" class="filtros-form">
          <el-form-item label="Orden">
            <el-select v-model="ordenCategoria" @change="drawVentasPorCategoriaChart">
              <el-option label="Mayor a menor" value="desc" />
              <el-option label="Menor a mayor" value="asc" />
            </el-select>
          </el-form-item>
        </el-form>
        <section class="charts">
          <h2>Ventas Totales por Categoría</h2>
          <canvas id="ventasPorCategoriaChart" class="responsive-canvas"></canvas>
        </section>
      </el-col>
    </el-row>

    <!-- FILA 3 -->
    <el-row :gutter="20" class="dashboard-row">
      <el-col :xs="24" :sm="24" :md="12">
        <h2>Análisis K-Means</h2>
        <img src="https://k-means-hdsk.onrender.com/kmeans-image" class="dashboard-img" alt="Análisis K-Means" />
      </el-col>

      <el-col :xs="24" :sm="24" :md="12">
        <h2>Primer Cluster</h2>
        <img
          src="https://k-means-hdsk.onrender.com/kmeans-image/cluster?num=0"
          class="dashboard-img"
          alt="Primer Cluster"
        />
      </el-col>
    </el-row>

    <!-- FILA 4 -->
    <el-row :gutter="20" class="dashboard-row">
      <el-col :xs="24" :sm="24" :md="12">
        <h2>Segundo Cluster</h2>
        <img
          src="https://k-means-hdsk.onrender.com/kmeans-image/cluster?num=1"
          class="dashboard-img"
          alt="Segundo Cluster"
        />
      </el-col>

      <el-col :xs="24" :sm="24" :md="12">
        <h2>Tercer Cluster</h2>
        <img
          src="https://k-means-hdsk.onrender.com/kmeans-image/cluster?num=2"
          class="dashboard-img"
          alt="Tercer Cluster"
        />
      </el-col>
    </el-row>

    <!-- FILA 5: columna que ocupa dos columnas y dos filas -->
    <el-row :gutter="20" class="dashboard-row">
      <el-col
        :xs="24"
        :sm="24"
        :md="24"
        class="doble-alto-col"
      >
        <h2>Árboles de Decisión</h2>
        <img
          src="https://k-means-hdsk.onrender.com/decision-tree-image"
          class="dashboard-img"
          alt="Árboles de Decisión"
        />
      </el-col>
    </el-row>
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

      drawCostosIngredientesChart()
      drawEvolucionVentasChart()
      drawProductosMasVendidosChart()
      drawVentasPorCategoriaChart()
    } else {
      console.error('Error API:', res.message)
    }
  } catch (error) {
    console.error('Error al cargar datos del dashboard:', error)
  }
}

// Costos y Uso de Ingredientes
const filtroIngredientes = ref('costo')
const topIngredientes = ref(10)

const drawCostosIngredientesChart = () => {
  const ctx = document.getElementById('costosIngredientesChart').getContext('2d')
  if (costosChart) costosChart.destroy()

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
        {
          label: 'Cantidad Usada',
          data: datos.map(i => Number(i.cantidad_usada)),
          backgroundColor: 'rgba(75, 192, 192, 0.7)'
        },
        {
          label: 'Costo Total',
          data: datos.map(i => Number(i.costo_total)),
          backgroundColor: 'rgba(153, 102, 255, 0.7)'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { beginAtZero: true }
      }
    }
  })
}

// Evolución Mensual Ventas por Producto
const productosSeleccionados = ref([])
const estadoSeleccionado = ref('')
const productosDisponibles = computed(() => {
  return [...new Set(evolucionVentasData.value.map(v => v.producto))]
})

const drawEvolucionVentasChart = () => {
  const ctx = document.getElementById('evolucionVentasChart').getContext('2d')
  if (evolucionChart) evolucionChart.destroy()
  if (!evolucionVentasData.value.length) return

  // Filtrar por estado
  let dataFiltrada = [...evolucionVentasData.value]
  if (estadoSeleccionado.value) {
    dataFiltrada = dataFiltrada.filter(item => item.estado === estadoSeleccionado.value)
  }

  const meses = [...new Set(dataFiltrada.map(v => v.mes))].sort()

  const productos = productosSeleccionados.value.length
    ? productosSeleccionados.value
    : [...new Set(dataFiltrada.map(v => v.producto))]

  const datasets = productos.map((prod, idx) => {
    const color = `hsl(${(idx * 60) % 360}, 70%, 50%)`
    return {
      label: prod,
      data: meses.map(mes => {
        const record = dataFiltrada.find(v => v.producto === prod && v.mes === mes)
        return record ? Number(record.cantidad_vendida) : 0
      }),
      borderColor: color,
      backgroundColor: color,
      fill: false,
      tension: 0.1
    }
  })

  evolucionChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: meses.map(m => new Date(m).toLocaleDateString('es-ES', { year: 'numeric', month: 'short' })),
      datasets,
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { beginAtZero: true }
      }
    }
  })
}

// Productos Más Vendidos
const topProductos = ref(10)

const drawProductosMasVendidosChart = () => {
  const ctx = document.getElementById('productosMasVendidosChart').getContext('2d')
  if (productosChart) productosChart.destroy()

  let datos = [...productosMasVendidosData.value]
  datos.sort((a, b) => b.total_vendido - a.total_vendido)
  datos = datos.slice(0, topProductos.value)

  productosChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: datos.map(p => p.producto),
      datasets: [
        {
          label: 'Total Vendido',
          data: datos.map(p => Number(p.total_vendido)),
          backgroundColor: 'rgba(255, 159, 64, 0.7)'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { beginAtZero: true }
      }
    }
  })
}

// Ventas Totales por Categoría
const ordenCategoria = ref('desc')

const drawVentasPorCategoriaChart = () => {
  const ctx = document.getElementById('ventasPorCategoriaChart').getContext('2d')
  if (categoriasChart) categoriasChart.destroy()

  let datos = [...ventasPorCategoriaData.value]
  datos.sort((a, b) => {
    return ordenCategoria.value === 'desc'
      ? b.total_ventas - a.total_ventas
      : a.total_ventas - b.total_ventas
  })

  categoriasChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: datos.map(c => c.categoria),
      datasets: [
        {
          label: 'Ventas Totales',
          data: datos.map(c => Number(c.total_ventas)),
          backgroundColor: 'rgba(54, 162, 235, 0.7)'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { beginAtZero: true }
      }
    }
  })
}

onMounted(() => {
  fetchDashboardData()
})
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
  font-family: Arial, sans-serif;
}

/* Cada fila del dashboard */
.dashboard-row {
  margin-bottom: 20px;
}

/* Estilos para los charts */
.charts {
  background-color: #fff;
  padding: 4vh;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgb(0 0 0 / 0.1);
  height: 50vh;
  display: flex;
  flex-direction: column;
}

.charts h2 {
  margin-bottom: 12px;
  font-weight: 600;
}

.charts canvas {
  flex-grow: 1;
  max-width: 100%;
}

/* Canvas responsivo: ocupa todo ancho, con altura dinámica */
.responsive-canvas {
  width: 100% !important;
  height: 100% !important;
}

/* Imágenes */
.dashboard-img {
  width: 100%;
  height: auto;
  object-fit: contain;
  border: 1px solid #ddd;
  border-radius: 8px;
}

/* Columna doble altura y ancho para fila 5 */
.doble-alto-col {
  grid-column: span 2;
  grid-row: span 2;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: start;
  gap: 10px;
}

/* Para que la imagen dentro se adapte */
.doble-alto-col img.dashboard-img {
  max-height: 85vh;
  width: auto;
  object-fit: contain;
  align-self: center;
}

/* Responsive para móviles */
@media screen and (max-width: 768px) {
  .dashboard-img {
    max-height: 250px;
  }

  .doble-alto-col {
    min-height: auto;
  }

  .charts {
    height: 300px;
  }
}
</style>
