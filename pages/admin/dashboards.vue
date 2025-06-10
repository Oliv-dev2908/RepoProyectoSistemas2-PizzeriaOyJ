<template>
  <div class="dashboard-container">
    <h1>Dashboard</h1>

    <el-row :gutter="20">
      <el-col :span="12">
        <section class="charts">
          <h2>Costos y Uso de Ingredientes</h2>
          <canvas id="costosIngredientesChart"></canvas>
        </section>
      </el-col>

      <el-col :span="12">
        <section class="charts">
          <h2>Evolución Mensual Ventas por Producto</h2>
          <canvas id="evolucionVentasChart"></canvas>
        </section>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="12">
        <section class="charts">
          <h2>Productos Más Vendidos</h2>
          <canvas id="productosMasVendidosChart"></canvas>
        </section>
      </el-col>

      <el-col :span="12">
        <section class="charts">
          <h2>Ventas Totales por Categoría</h2>
          <canvas id="ventasPorCategoriaChart"></canvas>
        </section>
      </el-col>
    </el-row>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
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

// 1. Costos y Uso de Ingredientes (ejemplo: barras dobles, cantidad y costo)
const drawCostosIngredientesChart = () => {
  const ctx = document.getElementById('costosIngredientesChart').getContext('2d')
  if (costosChart) costosChart.destroy()

  if (!costosIngredientesData.value.length) return

  costosChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: costosIngredientesData.value.map(i => i.ingrediente),
      datasets: [
        {
          label: 'Cantidad Usada',
          data: costosIngredientesData.value.map(i => Number(i.cantidad_usada)),
          backgroundColor: 'rgba(75, 192, 192, 0.7)'
        },
        {
          label: 'Costo Total',
          data: costosIngredientesData.value.map(i => Number(i.costo_total)),
          backgroundColor: 'rgba(153, 102, 255, 0.7)'
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      }
    }
  })
}

// 2. Evolución Mensual Ventas por Producto (líneas múltiples, cada producto una línea)
const drawEvolucionVentasChart = () => {
  const ctx = document.getElementById('evolucionVentasChart').getContext('2d')
  if (evolucionChart) evolucionChart.destroy()
  if (!evolucionVentasData.value.length) return

  // Obtener meses únicos ordenados
  const meses = [...new Set(evolucionVentasData.value.map(v => v.mes))].sort()
  // Obtener productos únicos
  const productos = [...new Set(evolucionVentasData.value.map(v => v.producto))]

  // Construir datasets por producto
  const datasets = productos.map((prod, idx) => {
    const color = `hsl(${(idx * 60) % 360}, 70%, 50%)`
    return {
      label: prod,
      data: meses.map(mes => {
        const record = evolucionVentasData.value.find(v => v.producto === prod && v.mes === mes)
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
      scales: {
        y: { beginAtZero: true }
      }
    }
  })
}

// 3. Productos Más Vendidos (barras)
const drawProductosMasVendidosChart = () => {
  const ctx = document.getElementById('productosMasVendidosChart').getContext('2d')
  if (productosChart) productosChart.destroy()
  if (!productosMasVendidosData.value.length) return

  productosChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: productosMasVendidosData.value.map(p => p.producto),
      datasets: [{
        label: 'Total Vendido',
        data: productosMasVendidosData.value.map(p => Number(p.total_vendido)),
        backgroundColor: 'rgba(255, 159, 64, 0.7)'
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      }
    }
  })
}

// 4. Ventas Totales por Categoría (barras)
const drawVentasPorCategoriaChart = () => {
  const ctx = document.getElementById('ventasPorCategoriaChart').getContext('2d')
  if (categoriasChart) categoriasChart.destroy()
  if (!ventasPorCategoriaData.value.length) return

  categoriasChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ventasPorCategoriaData.value.map(c => c.categoria),
      datasets: [{
        label: 'Ventas Totales',
        data: ventasPorCategoriaData.value.map(c => Number(c.total_ventas)),
        backgroundColor: 'rgba(54, 162, 235, 0.7)'
      }]
    },
    options: {
      responsive: true,
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

/* estilos de cada gráfico */
.charts {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgb(0 0 0 / 0.1);
  height: 350px;
  display: flex;
  flex-direction: column;
}

.charts h2 {
  margin-bottom: 12px;
  font-weight: 600;
}

/* canvas que ocupe el espacio disponible */
.charts canvas {
  flex-grow: 1;
  max-width: 100%;
  /* para que sea responsivo y ocupe todo el ancho y altura restante */
}
</style>
