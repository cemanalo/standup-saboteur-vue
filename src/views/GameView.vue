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
        <!-- <div v-if="gameData && gameData.mode === 'timed'">
          ⏳ Time Left: {{ formattedTimeLeft }}
        </div> -->
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

      <!-- Other Players -->
      <div class="bg-white shadow rounded-xl p-4">
        <h2 class="text-xl font-bold mb-4">Other Players</h2>
        <ul class="space-y-3">
          <li
            v-for="player in otherPlayers"
            :key="player.id"
            class="flex items-center justify-between p-3 border rounded-lg"
          >
            <div class="flex items-center space-x-3">
              <img
                :src="`https://api.dicebear.com/9.x/croodles/svg?seed=${player.avatarSeed}`"
                class="w-10 h-10 rounded-full border"
                alt="avatar"
              />
              <div>
                <p class="font-medium">{{ player.name }}</p>
              </div>
            </div>
            <div>
              <!-- ✅ If this player sent a request to the current player -->
              <template v-if="incomingRequest(player.id)">
                <template v-if="incomingRequest(player.id)?.status === 'pending'">
                  <button
                    @click="respondToRequest(player.id, 'accepted')"
                    class="px-3 py-1 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 mr-2"
                  >
                    Accept
                  </button>
                  <button
                    @click="respondToRequest(player.id, 'rejected')"
                    class="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600"
                  >
                    Reject
                  </button>
                </template>
                <template v-else-if="incomingRequest(player.id)?.status === 'accepted'">
                  <span class="text-xs font-semibold text-green-600">✅ Accepted</span>
                </template>
                <template v-else-if="incomingRequest(player.id)?.status === 'rejected'">
                  <span class="text-xs font-semibold text-red-600">❌ Rejected</span>
                </template>
              </template>
              <!-- ✅ If current player sent a request to this player -->
              <template v-else-if="outgoingRequest(player.id)">
                <template v-if="outgoingRequest(player.id)?.status === 'pending'">
                  <span class="text-xs text-gray-400 italic">Request Sent...</span>
                </template>
                <template v-else-if="outgoingRequest(player.id)?.status === 'accepted'">
                  <span class="text-xs font-semibold text-green-600">✅ Accepted</span>
                </template>
                <template v-else-if="outgoingRequest(player.id)?.status === 'rejected'">
                  <span class="text-xs font-semibold text-red-600">❌ Rejected</span>
                </template>
              </template>

              <!-- ✅ Otherwise show normal request/disabled state -->
              <template v-else>
                <button
                  v-if="canSendRequest(player.id)"
                  @click="sendPairRequest(player.id)"
                  class="px-3 py-1 bg-indigo-500 text-white text-sm rounded-lg hover:bg-indigo-600"
                >
                  Pair Request
                </button>
                <span v-else class="text-xs text-gray-400 italic">Request Sent/Unavailable</span>
              </template>
            </div>
          </li>
        </ul>
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
import { io } from 'socket.io-client'
import { type Game, type Player, type PairingRequest } from '@/types/index'
import api from '@/api' // Placeholder for actual API/socket integration
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import soundFile from '@/assets/sounds/notification.ogg'
import { tabs as footerTabs } from '@/libs/footer.nav.tabs'
import { sessionCheck } from '@/libs/game/session.check'

const route = useRoute()
const roomCode = route.params.roomCode // Get room code from path
const currentPlayerId = localStorage.getItem('playerId')
const gameData = ref<Game | null>(null)
const currentPlayer = ref<Player | null>(null)
const otherPlayers = ref<Player[]>([])
const pairingRequests = ref<PairingRequest[]>([])
const tabs = footerTabs(roomCode as string)
// const timeLeft = ref(0);
// const formattedTimeLeft = ref('00:00');

sessionCheck()

const socket = io(import.meta.env.VITE_API_BASE_URL)

onMounted(async () => {
  if (!roomCode || !currentPlayerId) {
    console.error('Missing room code or player ID')
    return
  }

  socket.emit('joinRoom', { roomCode, playerId: currentPlayerId })

  await loadGameData()
  await loadPairingRequestsToday()

  // ✅ Listen for incoming pairing requests
  socket.on('pairingRequest', (data: PairingRequest) => {
    handleIncomingRequest(data)
  })

  // ✅ Listen for pairing request responses
  socket.on('pairingResponse', (data: { requestId: string; response: 'accepted' | 'rejected' }) => {
    handlePairingRequestResponse(data)
  })
})

async function loadGameData() {
  try {
    const response = await api.get(`/games/${roomCode}`)
    console.log('Game data fetched:', response.data)
    gameData.value = response.data
    const players: Player[] = response.data.players || []

    currentPlayer.value = players.find((p) => p.id === currentPlayerId) || null
    otherPlayers.value = players.filter((p) => p.id !== currentPlayerId)
    console.log('Fetched game data:', gameData.value)
  } catch (error) {
    console.error('Failed to fetch game data:', error)
  }
}

async function loadPairingRequestsToday() {
  if (!currentPlayerId) return []
  try {
    const response = await api.get(`/pairing-requests/today/${currentPlayerId}`)
    console.log('Pairing requests today:', response.data)
    pairingRequests.value = response.data
  } catch (error) {
    console.error('Failed to fetch pairing requests:', error)
  }
}

/**
 * Can send if the current player has not already sent a request to the target player today.
 * Or if they have not reached their limit of 3 pairings today.
 * Or if they are not already paired.
 *
 * if game mode is 'timed', always return true.
 * @param playerId ID of the player to check if a pair request can be sent
 */
function canSendRequest(playerId: string) {
  /**
   * 1. Check if current player has reached limit of 3 pairings today
   * 2. Check if current player is already paired with the target player today
   * 3. Check if there is already a pending request to the target player today
   */

  // if (gameData.value?.mode === 'timed') {
  //   return true
  // }

  console.log('pairingRequests', pairingRequests.value)

  const pairingRequest = pairingRequests.value.find((req) => req.toPlayerId === playerId)

  return !pairingRequest // later: add logic if already paired today
}

async function sendPairRequest(playerId: string) {
  if (!gameData.value || !currentPlayerId) {
    alert('Game data or current player ID is missing')
    return
  }

  try {
    console.log('Sending pair request to', playerId)
    const response = await api.post(`/pairing-requests`, {
      gameId: gameData.value?.id,
      fromPlayerId: currentPlayerId,
      toPlayerId: playerId,
    })
    console.log('Pair request response:', response)

    console.log('Before adding request:', pairingRequests.value)
    const playerIdIndex = pairingRequests.value.findIndex((req) => req.toPlayerId === playerId)

    if (playerIdIndex === -1) {
      pairingRequests.value.push({
        id: '',
        status: 'pending',
        gameId: gameData.value?.id,
        fromPlayerId: currentPlayerId,
        toPlayerId: playerId,
        createdAt: new Date(),
      })
    } else {
      pairingRequests.value[playerIdIndex].status = 'pending'
    }

    alert('Pair request sent successfully!')
  } catch (error) {
    console.error('Failed to send pair request:', error)
    alert('Failed to send pair request. Please try again later.')
  }
}

async function handleIncomingRequest(pairingRequest: PairingRequest) {
  const audio = new Audio(soundFile)
  audio.play().catch((error) => console.error('Failed to play notification sound:', error))

  // update pairing requests
  pairingRequests.value.push(pairingRequest)

  const playerFrom = otherPlayers.value.find((p) => p.id === pairingRequest.fromPlayerId)

  if (!playerFrom) {
    console.error('Player who sent the request not found:', pairingRequest.fromPlayerId)
    return
  }
  // show toast notification
  toast.info(`New pairing request from ${playerFrom.name}`, {
    position: 'bottom-right',
    closeOnClick: true,
    pauseOnHover: true,
    autoClose: false,
  })

  pairingRequests.value.push(pairingRequest)
}

function incomingRequest(playerId: string) {
  return pairingRequests.value.find(
    (req) => req.fromPlayerId === playerId && req.toPlayerId === currentPlayerId,
  )
}

function outgoingRequest(playerId: string) {
  return pairingRequests.value.find(
    (req) => req.fromPlayerId === currentPlayerId && req.toPlayerId === playerId,
  )
}

async function respondToRequest(playerId: string, decision: 'accepted' | 'rejected') {
  if (!gameData.value || !currentPlayerId) {
    alert('Game data or current player ID is missing')
    return
  }

  const request = pairingRequests.value.find(
    (req) =>
      req.fromPlayerId === playerId &&
      req.toPlayerId === currentPlayerId &&
      req.status === 'pending',
  )

  try {
    const response = await api.post(`/pairing-requests/respond`, {
      requestId: request?.id,
      gameId: gameData.value?.id,
      fromPlayerId: playerId,
      toPlayerId: currentPlayerId,
      response: decision,
    })

    console.log('Respond result:', response.data)
  } catch (error) {
    console.error('Failed to respond to pairing request:', error)
    alert('Failed to respond to pairing request. Please try again later.')
  }
}

function handlePairingRequestResponse(data: {
  requestId: string
  response: 'accepted' | 'rejected'
}) {
  console.log('Handling pairing request response:', data)
  const requestIndex = pairingRequests.value.findIndex((req) => req.id === data.requestId)
  if (requestIndex !== -1) {
    pairingRequests.value[requestIndex].status = data.response
    const audio = new Audio(soundFile)
    audio.play().catch((error) => console.error('Failed to play notification sound:', error))

    // generic message
    const message = `A pairing request has been ${data.response}`
    toast.info(message, {
      position: 'bottom-right',
      closeOnClick: true,
      pauseOnHover: true,
      autoClose: false,
    })
  }
}

// function updateTimer() {
//   if (gameData.value && gameData.value.endTime) {
//     const diff = new Date(gameData.value.endTime).getTime() - Date.now()
//     timeLeft.value = Math.max(0, diff)
//     formattedTimeLeft.value = new Date(timeLeft.value).toISOString().slice(14, 19)
//   }
// }

// setInterval(updateTimer, 1000)
</script>
