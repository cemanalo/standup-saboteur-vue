<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center py-8 px-4">
    <!-- Loading state -->
    <div v-if="loading" class="text-gray-500">Validating session...</div>
    <div v-else>
      <!-- Title -->
      <h1 class="text-3xl font-bold text-indigo-600 mb-6 max">
        <router-link to="/" class="hover:underline">Standup Saboteur</router-link>
      </h1>
      <div class="absolute top-4 right-6">
        <button
          @click="logout"
          class="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <!-- Room info card -->
      <div class="bg-white shadow-md rounded-xl p-6 w-full max-w-2xl mb-6">
        <p class="text-lg">
          <strong class="text-gray-700">Room Code:</strong>
          <span class="ml-2 text-indigo-600 font-semibold">{{ roomCode }}</span>
        </p>
        <p class="mt-2 text-gray-600"><strong>Status:</strong> {{ roomStatus }}</p>
        <!-- Rules link -->
        <p class="mt-2 text-right">
          <router-link
            to="/how-to-play"
            class="text-sm text-gray-600 hover:text-indigo-600 hover:underline"
          >
            How to play?
          </router-link>
        </p>
      </div>

      <!-- Players list -->
      <div class="bg-white shadow-md rounded-xl p-6 w-full max-w-2xl mb-6">
        <h2 class="text-2xl font-semibold text-gray-700 mb-4">Players</h2>
        <ul class="space-y-3">
          <li
            v-for="player in players"
            :key="player.id"
            class="grid grid-cols-[1fr_auto] items-center p-3 rounded-lg border hover:shadow"
          >
            <div class="flex items-center space-x-3">
              <img
                :src="`https://api.dicebear.com/9.x/croodles/svg?seed=${player.avatarSeed}`"
                alt="avatar"
                class="w-14 h-14 rounded-full border"
              />
              <span class="font-medium text-gray-800 text-lg">{{ player.name }}</span>
            </div>
            <span
              :class="player.isReady ? 'text-green-600' : 'text-red-500'"
              class="font-semibold text-md text-right pl-12"
            >
              {{ player.isReady ? '✅ Ready' : '❌ Not Ready' }}
            </span>
          </li>
        </ul>
      </div>

      <!-- Action buttons center this class-->
      <div class="flex gap-4 mb-6 justify-center">
        <button
          v-if="ownerId === playerId"
          @click="startGame"
          :disabled="!isEveryoneReady"
          class="px-6 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 disabled:opacity-50"
        >
          Start Game
        </button>
        <button
          @click="toggleReady"
          class="px-6 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600"
        >
          {{ isReady ? 'Unready' : 'Ready' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { io } from 'socket.io-client'
import { type Player } from '../types/index'
import api from '@/api'
import { sessionCheck } from '@/libs/lobby/session.check'
import { logout } from '@/libs/utils/auth'

const route = useRoute()
const router = useRouter()
const roomCode = route.params.roomCode as string
const playerId = localStorage.getItem('playerId') ?? ''

const loading = ref(true)

const socket = io(import.meta.env.VITE_API_BASE_URL) // defined in .env

sessionCheck()

// Reactive state
const roomStatus = ref('Waiting for players...')
const players = ref<Player[]>([])
const isReady = ref(false)
const ownerId = ref('')
const isEveryoneReady = ref(false)

onMounted(async () => {
  if (!playerId) {
    alert('No player ID found. Please join a game first.')
    router.push('/')
    return
  }

  loading.value = false

  socket.emit('joinRoom', { roomCode, playerId })

  socket.on('updatePlayers', (data: Player[]) => {
    console.log('Received player update:', data)
    players.value = data
    const currentPlayer = data.find((p) => p.id === playerId)
    isReady.value = currentPlayer ? currentPlayer.isReady : false

    isEveryoneReady.value = data.length > 3 && data.every((p) => p.isReady)
    console.log('Is everyone ready?', isEveryoneReady.value)
  })

  socket.on('gameStarted', () => {
    console.log('Game has started:')
    // Redirect to game dashboard or game view
    router.push(`/game/${roomCode}`)
  })

  getGame()
})

// Methods
function toggleReady() {
  isReady.value = !isReady.value
  console.log('Toggling ready state to:', isReady.value, { playerId })
  socket.emit('toggleReady', { roomCode, playerId, isReady: isReady.value })
}

async function startGame() {
  try {
    await api.post(`/games/${roomCode}/start`, { ownerId: playerId })
    console.log('Game started successfully')
  } catch (error) {
    console.error('Failed to start game:', error)
    alert('Only the game owner can start the game.')
  }
}

async function getGame() {
  try {
    const response = await api.get(`/games/${roomCode}`)
    const gameData = response.data

    if (!gameData) {
      alert('Game not found. Please check the room code and try again.')
      router.push('/')
      return
    }
    ownerId.value = gameData.ownerId
    roomStatus.value = gameData.status
    console.log('Fetched game data:', gameData)
    if (roomStatus.value === 'in_progress') {
      router.push(`/game/${roomCode}`)
      return
    } else if (roomStatus.value === 'completed') {
      router.push(`/results/${roomCode}`)
      return
    }
    // Initial players fetch
  } catch (error) {
    console.error('Failed to fetch game data:', error)
    alert('Failed to load game data. Please try again later.')
    router.push('/')
  }
}
</script>
