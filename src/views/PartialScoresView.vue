<template>
  <div class="min-h-screen flex flex-col bg-gray-50 text-gray-800">
    <!-- Header -->
    <header class="p-4 shadow bg-white">
      <h1 class="text-3xl font-bold text-indigo-600">
        <router-link :to="`/game/${roomCode}`" class="hover:underline">
          Standup Saboteur
        </router-link>
      </h1>
    </header>

    <main class="flex-1 p-6">
      <h2 class="text-xl font-bold mb-4">Partial Results</h2>

      <!-- No results yet -->
      <div
        v-if="!groupedResults || Object.keys(groupedResults).length === 0"
        class="text-center text-gray-500"
      >
        No results yet
      </div>

      <!-- Chart -->
      <!-- Chart set canvas width -->
      <div v-else class="bg-white shadow rounded-lg p-4" style="max-width: 70%">
        <canvas ref="chartCanvas"></canvas>
      </div>
    </main>

    <!-- Footer Nav -->
    <footer class="bg-white shadow-inner p-3">
      <nav class="flex justify-around text-sm font-medium">
        <template v-for="tab in tabs" :key="tab.name">
          <!-- Render router-link if it's a navigation tab -->
          <router-link
            v-if="tab.path"
            :to="tab.path"
            class="p-2 hover:text-indigo-600"
            active-class="text-indigo-600 font-bold"
          >
            {{ tab.label }}
          </router-link>

          <!-- Render button if it's an action tab (e.g., logout) -->
          <button v-else-if="tab.act" @click="tab.act" class="p-2 hover:text-red-600 text-gray-700">
            {{ tab.label }}
          </button>
        </template>
      </nav>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/api'
import Chart from 'chart.js/auto'
import type { Game } from '@/types'
import { sessionCheck } from '@/libs/game/session.check'
import { tabs as footerTabs } from '@/libs/footer.nav.tabs'

sessionCheck()

const route = useRoute()
const roomCode = route.params.roomCode as string

const results = ref<any[]>([])
const groupedResults = ref<{ [date: string]: any[] }>({})
const chartCanvas = ref<HTMLCanvasElement | null>(null)
const gameData = ref<Game | null>(null)
let chart: Chart | null = null

onMounted(async () => {
  await loadGameData()
  await loadResults()
  buildChart()
})

async function loadResults() {
  try {
    if (!gameData.value) return

    const res = await api.get(`/daily-results/${gameData.value?.id}`)
    results.value = res.data

    console.log('Fetched daily results:', results.value)
    // Group by date
    groupedResults.value = results.value.reduce((acc, r) => {
      if (!acc[r.date]) acc[r.date] = []
      acc[r.date].push(r)
      return acc
    }, {})
  } catch (err) {
    console.error('Failed to fetch daily results:', err)
  }
}

function buildChart() {
  if (!chartCanvas.value || !results.value.length) return

  const dates = [...new Set(results.value.map((r) => r.date))].sort()

  const players = [...new Set(results.value.map((r) => r.funnyName))]

  const datasets = players.map((player, index) => {
    return {
      label: player,
      data: dates.map((d) => {
        const entry = results.value.find((r) => r.date === d && r.funnyName === player)
        return entry ? entry.score : 0
      }),
      // borderColor: randomColor(),
      backgroundColor: randomColor(index),
      tension: 0.3,
    }
  })

  chart = new Chart(chartCanvas.value, {
    type: 'bar',
    data: { labels: dates, datasets },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' },
      },
    },
  })
}

function randomColor(index: number) {
  const colors = ['#6366F1', '#F59E0B', '#10B981', '#EF4444', '#3B82F6']
  return colors[index]
}

async function loadGameData() {
  try {
    const response = await api.get(`/games/${roomCode}`)
    console.log('Game data fetched:', response.data)
    gameData.value = response.data
  } catch (error) {
    console.error('Failed to fetch game data:', error)
  }
}

const tabs = footerTabs(roomCode as string)
</script>
