<template>
  <div class="min-h-screen flex flex-col bg-gray-50 text-gray-800">
    <!-- Header -->
    <header class="p-4 shadow bg-white">
      <h1 class="text-3xl font-bold text-indigo-600">
        <router-link to="/" class="hover:underline">Standup Saboteur</router-link>
      </h1>
    </header>

    <!-- Main Content -->
    <main class="flex-1 p-6 space-y-6">
      <!-- Room Code -->
      <div class="text-center">
        <p class="text-lg font-semibold">
          Room Code: <span class="text-indigo-500">{{ roomCode }}</span>
        </p>
      </div>

      <!-- Current Player Info -->
      <div v-if="currentPlayer" class="bg-white shadow rounded-xl p-4 flex items-center space-x-4">
        <img
          :src="`https://api.dicebear.com/9.x/croodles/svg?seed=${currentPlayer.avatarSeed}`"
          class="w-12 h-12 rounded-full border-2 border-indigo-500"
          alt="avatar"
        />
        <div>
          <p class="font-bold">{{ currentPlayer.name }}</p>
          <p class="text-sm text-gray-500">Score: {{ currentPlayer.score }}</p>
        </div>
      </div>

      <!-- Pairing History -->
      <div class="bg-white shadow rounded-xl p-4">
        <h2 class="text-xl font-bold mb-4">Pairing History</h2>
        <ul class="divide-y divide-gray-200">
          <li
            v-for="history in pairingHistory"
            :key="history.id"
            class="py-3 flex items-center justify-between"
          >
            <div class="flex items-center space-x-3">
              <img
                :src="`https://api.dicebear.com/9.x/croodles/svg?seed=${history.partnerAvatarSeed}`"
                class="w-10 h-10 rounded-full border"
                alt="partner avatar"
              />
              <div>
                <p class="font-medium">{{ history.partnerName }}</p>
                <p class="text-xs text-gray-500">
                  {{ formatDate(history.createdAt) }}
                </p>
              </div>
            </div>
          </li>
        </ul>
        <p v-if="!pairingHistory.length" class="text-center text-gray-400 italic">
          No pairing history yet.
        </p>
      </div>
    </main>

    <!-- Footer Nav -->
    <footer class="bg-white shadow-inner p-3">
      <nav class="flex justify-around text-sm font-medium">
        <router-link
          v-for="tab in tabs"
          :key="tab.name"
          :to="tab.path"
          class="p-2 hover:text-indigo-600"
          active-class="text-indigo-600 font-bold"
        >
          {{ tab.label }}
        </router-link>
      </nav>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/api'
import { type Game, type Player } from '@/types/index'
import { tabs as footerTabs } from '@/libs/footer.nav.tabs'
import { sessionCheck } from '@/libs/game/session.check'

await sessionCheck()

const route = useRoute()
const roomCode = route.params.roomCode as string
const currentPlayerId = localStorage.getItem('playerId')
const gameData = ref<Game | null>(null)

const currentPlayer = ref<Player | null>(null)

const pairingHistory = ref<
  {
    id: string
    gameId: string
    player1Id: string
    player2Id: string
    result: string
    createdAt: string
    partnerName: string
    partnerAvatarSeed: string
  }[]
>([])

onMounted(async () => {
  await loadGameData()
  await loadPlayerInfo()
  await loadPairingHistory()
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

async function loadPlayerInfo() {
  try {
    const response = await api.get(`/games/${roomCode}`)
    const players: Player[] = response.data.players || []
    currentPlayer.value = players.find((p) => p.id === currentPlayerId) || null
  } catch (error) {
    console.error('Failed to fetch player info:', error)
  }
}

async function loadPairingHistory() {
  if (!currentPlayerId) return
  try {
    const response = await api.get(
      `/pairings?playerId=${currentPlayerId}&gameId=${gameData.value?.id}`,
    )
    pairingHistory.value = response.data // should map partner, date, scoreDelta
  } catch (error) {
    console.error('Failed to fetch pairing history:', error)
  }
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const tabs = footerTabs(roomCode as string)
</script>
