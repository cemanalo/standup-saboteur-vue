<template>
  <div class="p-6">
    <header class="p-4 shadow bg-white flex justify-between items-center">
      <!-- Title -->
      <h1 class="text-3xl font-bold text-indigo-600">
        <router-link to="/" class="hover:underline">Standup Saboteur</router-link>
      </h1>

      <!-- Back Button -->
      <button
        @click="$router.back()"
        class="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg shadow"
      >
        ⬅ Back
      </button>
    </header>

    <!-- Main Content -->
    <main class="flex-1 p-6 space-y-6">
      <h1 class="text-2xl font-bold mb-4">🏆 Final Scores</h1>

      <div v-if="loading">Loading...</div>
      <div v-else-if="noResults" class="text-gray-500">No final scores yet.</div>

      <ul v-else class="space-y-4">
        <li
          v-for="(score, index) in scores"
          :key="score.player.id"
          class="flex items-center bg-white shadow rounded-lg p-4"
        >
          <span class="text-xl font-bold w-8">{{ index + 1 }}</span>
          <img
            class="w-12 h-12 rounded-full border mr-4"
            :src="`https://api.dicebear.com/9.x/croodles/svg?seed=${score.player.avatarSeed}`"
            alt="avatar"
          />
          <div class="flex-1">
            <p class="font-semibold">{{ score.player.name }} ({{ score.player.funnyName }})</p>
          </div>
          <p class="text-lg font-bold">{{ score.totalScore }}</p>
        </li>
      </ul>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/api'
import { type FinalScore, type Game } from '@/types'
import { useRoute } from 'vue-router'

const route = useRoute()
const roomCode = route.params.roomCode // Get room code from path

const scores = ref<FinalScore[]>([])
const loading = ref(true)
const noResults = ref(false)
const gameData = ref<Game | null>(null)

onMounted(async () => {
  try {
    await loadGameData()
    if (!gameData.value) {
      throw new Error('Game data not found')
    }
    const gameId = gameData.value.id
    const res = await api.get(`/final-scores/get-by-game/${gameId}`) // pass actual gameId
    if (res.data.message) {
      noResults.value = true
    } else {
      scores.value = res.data
    }
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
})

async function loadGameData() {
  try {
    const response = await api.get(`/games/${roomCode}`)
    console.log('Game data fetched:', response.data)
    gameData.value = response.data
    console.log('Fetched game data:', gameData.value)
  } catch (error) {
    console.error('Failed to fetch game data:', error)
  }
}
</script>
