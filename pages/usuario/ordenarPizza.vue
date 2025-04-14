<template>
  <div class="min-h-screen bg-white p-6 max-w-xl mx-auto">
    <h2 class="text-2xl font-bold mb-4">Ordenar Pizza 🍕</h2>

    <div class="mb-4">
      <label class="block font-medium">Tipo de Pizza</label>
      <select v-model="selectedPizza" class="border p-2 w-full rounded">
        <option disabled value="">Selecciona una pizza</option>
        <option v-for="pizza in pizzas" :key="pizza.id" :value="pizza.id">
          {{ pizza.nombre }}
        </option>
      </select>
    </div>

    <div class="mb-4">
      <label class="block font-medium">Tamaño</label>
      <select v-model="selectedTamano" class="border p-2 w-full rounded">
        <option disabled value="">Selecciona un tamaño</option>
        <option v-for="tam in tamanos" :key="tam.id" :value="tam.id">
          {{ tam.nombre }}
        </option>
      </select>
    </div>

    <div class="mb-4">
      <label class="block font-medium">Cantidad</label>
      <input type="number" v-model="cantidad" min="1" class="border p-2 w-full rounded" />
    </div>

    <button @click="realizarPedido" class="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">
      Confirmar Pedido
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useSupabaseUser, useSupabaseClient } from '#imports'
import { useRouter } from 'vue-router'

const user = useSupabaseUser()
const supabase = useSupabaseClient()
const router = useRouter()

// Datos cargados de la base
const pizzas = ref([])
const tamanos = ref([])

// Selecciones del usuario
const selectedPizza = ref(null)
const selectedTamano = ref(null)
const cantidad = ref(1)

// Cargar datos al montar
onMounted(async () => {
  try {
    const res = await fetch('/api/usuario/getDatosPizza')
    const json = await res.json()
    console.log('Respuesta JSON:', json) // 👈 Agrega esto

    if (json.statusCode === 200) {
      pizzas.value = json.body.pizzas || []
      tamanos.value = json.body.tamanos || []
    } else {
      console.error(json.body?.error || 'Error al cargar pizzas y tamaños')
    }
  } catch (error) {
    console.error('Error llamando a la API:', error)
  }
})

// Función para ordenar
async function realizarPedido() {
  if (!selectedPizza.value || !selectedTamano.value || cantidad.value < 1) {
    alert('Selecciona todos los campos correctamente')
    return
  }

  const precio_unitario = 100 // puedes cambiar esto luego según lógica real

  const body = {
    id_cliente: user.value?.id,
    id_pizza: selectedPizza.value,
    id_tamano: selectedTamano.value,
    cantidad: cantidad.value,
    precio_unitario
  }

  try {
    const res = await fetch('/api/pedidos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })

    const json = await res.json()

    if (!res.ok || json.error) {
      console.error(json)
      alert('Error al realizar el pedido')
      return
    }

    alert('Pedido realizado con éxito 🎉')
    router.push('/')
  } catch (err) {
    console.error(err)
    alert('Hubo un problema al enviar el pedido')
  }
}
</script>

