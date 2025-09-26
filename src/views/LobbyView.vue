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
        <p class="text-sm flex items-center">
          <strong class="text-gray-700">Room Code:</strong>
          <span
            class="ml-2 text-indigo-600 font-semibold cursor-pointer hover:underline inline-flex items-center gap-1"
            @click="copyRoomLink"
          >
            {{ roomCode }}
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              class="icon-sm"
            >
              <path
                d="M12.668 10.667C12.668 9.95614 12.668 9.46258 12.6367 9.0791C12.6137 8.79732 12.5758 8.60761 12.5244 8.46387L12.4688 8.33399C12.3148 8.03193 12.0803 7.77885 11.793 7.60254L11.666 7.53125C11.508 7.45087 11.2963 7.39395 10.9209 7.36328C10.5374 7.33197 10.0439 7.33203 9.33301 7.33203H6.5C5.78896 7.33203 5.29563 7.33195 4.91211 7.36328C4.63016 7.38632 4.44065 7.42413 4.29688 7.47559L4.16699 7.53125C3.86488 7.68518 3.61186 7.9196 3.43555 8.20703L3.36524 8.33399C3.28478 8.49198 3.22795 8.70352 3.19727 9.0791C3.16595 9.46259 3.16504 9.95611 3.16504 10.667V13.5C3.16504 14.211 3.16593 14.7044 3.19727 15.0879C3.22797 15.4636 3.28473 15.675 3.36524 15.833L3.43555 15.959C3.61186 16.2466 3.86474 16.4807 4.16699 16.6348L4.29688 16.6914C4.44063 16.7428 4.63025 16.7797 4.91211 16.8027C5.29563 16.8341 5.78896 16.835 6.5 16.835H9.33301C10.0439 16.835 10.5374 16.8341 10.9209 16.8027C11.2965 16.772 11.508 16.7152 11.666 16.6348L11.793 16.5645C12.0804 16.3881 12.3148 16.1351 12.4688 15.833L12.5244 15.7031C12.5759 15.5594 12.6137 15.3698 12.6367 15.0879C12.6681 14.7044 12.668 14.211 12.668 13.5V10.667ZM13.998 12.665C14.4528 12.6634 14.8011 12.6602 15.0879 12.6367C15.4635 12.606 15.675 12.5492 15.833 12.4688L15.959 12.3975C16.2466 12.2211 16.4808 11.9682 16.6348 11.666L16.6914 11.5361C16.7428 11.3924 16.7797 11.2026 16.8027 10.9209C16.8341 10.5374 16.835 10.0439 16.835 9.33301V6.5C16.835 5.78896 16.8341 5.29563 16.8027 4.91211C16.7797 4.63025 16.7428 4.44063 16.6914 4.29688L16.6348 4.16699C16.4807 3.86474 16.2466 3.61186 15.959 3.43555L15.833 3.36524C15.675 3.28473 15.4636 3.22797 15.0879 3.19727C14.7044 3.16593 14.211 3.16504 13.5 3.16504H10.667C9.9561 3.16504 9.46259 3.16595 9.0791 3.19727C8.79739 3.22028 8.6076 3.2572 8.46387 3.30859L8.33399 3.36524C8.03176 3.51923 7.77886 3.75343 7.60254 4.04102L7.53125 4.16699C7.4508 4.32498 7.39397 4.53655 7.36328 4.91211C7.33985 5.19893 7.33562 5.54719 7.33399 6.00195H9.33301C10.022 6.00195 10.5791 6.00131 11.0293 6.03809C11.4873 6.07551 11.8937 6.15471 12.2705 6.34668L12.4883 6.46875C12.984 6.7728 13.3878 7.20854 13.6533 7.72949L13.7197 7.87207C13.8642 8.20859 13.9292 8.56974 13.9619 8.9707C13.9987 9.42092 13.998 9.97799 13.998 10.667V12.665ZM18.165 9.33301C18.165 10.022 18.1657 10.5791 18.1289 11.0293C18.0961 11.4302 18.0311 11.7914 17.8867 12.1279L17.8203 12.2705C17.5549 12.7914 17.1509 13.2272 16.6553 13.5313L16.4365 13.6533C16.0599 13.8452 15.6541 13.9245 15.1963 13.9619C14.8593 13.9895 14.4624 13.9935 13.9951 13.9951C13.9935 14.4624 13.9895 14.8593 13.9619 15.1963C13.9292 15.597 13.864 15.9576 13.7197 16.2939L13.6533 16.4365C13.3878 16.9576 12.9841 17.3941 12.4883 17.6982L12.2705 17.8203C11.8937 18.0123 11.4873 18.0915 11.0293 18.1289C10.5791 18.1657 10.022 18.165 9.33301 18.165H6.5C5.81091 18.165 5.25395 18.1657 4.80371 18.1289C4.40306 18.0962 4.04235 18.031 3.70606 17.8867L3.56348 17.8203C3.04244 17.5548 2.60585 17.151 2.30176 16.6553L2.17969 16.4365C1.98788 16.0599 1.90851 15.6541 1.87109 15.1963C1.83431 14.746 1.83496 14.1891 1.83496 13.5V10.667C1.83496 9.978 1.83432 9.42091 1.87109 8.9707C1.90851 8.5127 1.98772 8.10625 2.17969 7.72949L2.30176 7.51172C2.60586 7.0159 3.04236 6.6122 3.56348 6.34668L3.70606 6.28027C4.04237 6.136 4.40303 6.07083 4.80371 6.03809C5.14051 6.01057 5.53708 6.00551 6.00391 6.00391C6.00551 5.53708 6.01057 5.14051 6.03809 4.80371C6.0755 4.34588 6.15483 3.94012 6.34668 3.56348L6.46875 3.34473C6.77282 2.84912 7.20856 2.44514 7.72949 2.17969L7.87207 2.11328C8.20855 1.96886 8.56979 1.90385 8.9707 1.87109C9.42091 1.83432 9.978 1.83496 10.667 1.83496H13.5C14.1891 1.83496 14.746 1.83431 15.1963 1.87109C15.6541 1.90851 16.0599 1.98788 16.4365 2.17969L16.6553 2.30176C17.151 2.60585 17.5548 3.04244 17.8203 3.56348L17.8867 3.70606C18.031 4.04235 18.0962 4.40306 18.1289 4.80371C18.1657 5.25395 18.165 5.81091 18.165 6.5V9.33301Z"
              ></path>
            </svg>
          </span>
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
            class="grid grid-cols-[1fr_auto] items-center p-3 rounded-lg border hover:shadow gap-x-4"
          >
            <div class="flex items-center space-x-3">
              <img
                :src="`https://api.dicebear.com/9.x/croodles/svg?seed=${player.avatarSeed}`"
                alt="avatar"
                class="w-14 h-14 rounded-full border"
              />
              <span class="font-medium text-gray-800 text-lg">{{ player.name }}</span>
            </div>
            <div class="flex items-center gap-3">
              <span
                :class="player.isReady ? 'text-green-600' : 'text-red-500'"
                class="font-semibold text-md text-right"
              >
                {{ player.isReady ? '✅ Ready' : '❌ Not Ready' }}
              </span>

              <!-- Kick button (only for owner and not yourself) -->
              <button
                v-if="ownerId === playerId && player.id !== playerId"
                @click="kickPlayer(player.id)"
                class="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
              >
                Kick
              </button>
            </div>
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
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

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

    isEveryoneReady.value = data.length >= 3 && data.every((p) => p.isReady)
    console.log('Is everyone ready?', isEveryoneReady.value)
  })

  socket.on('gameStarted', () => {
    console.log('Game has started:')
    // Redirect to game dashboard or game view
    router.push(`/game/${roomCode}`)
  })

  socket.on('playerKicked', ({ playerId }) => {
    players.value = players.value.filter((p) => p.id !== playerId)
    if (playerId === localStorage.getItem('playerId')) {
      toast.error('You were kicked from the game')
      router.push('/') // redirect kicked player
    }
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

async function copyRoomLink() {
  const link = `${import.meta.env.VITE_BASE_URL}/join/${roomCode}`
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(link)
    } else {
      // fallback
      const textArea = document.createElement('textarea')
      textArea.value = link
      textArea.style.position = 'fixed' // avoid scrolling to bottom
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
    }
    toast.success('Room link copied to clipboard!', {
      autoClose: 2000,
      position: toast.POSITION.TOP_CENTER,
    })
  } catch (err) {
    toast.error('Failed to copy room link', {
      autoClose: 2000,
      position: toast.POSITION.TOP_CENTER,
    })
    console.error('Clipboard error:', err)
  }
}

async function kickPlayer(targetPlayerId: string) {
  try {
    await api.post(`/games/${roomCode}/kick`, {
      ownerId: playerId,
      targetPlayerId,
    })
    toast.success('Player has been kicked', {
      autoClose: 2000,
      position: toast.POSITION.TOP_CENTER,
    })
  } catch (err) {
    toast.error('Failed to kick player', {
      autoClose: 2000,
      position: toast.POSITION.TOP_CENTER,
    })
    console.error('Kick player error:', err)
  }
}
</script>
