<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '@/api'
import { setToken } from '@/libs/utils/auth'
import { sessionCheck } from '@/libs/join-game/session.check'

sessionCheck()

const route = useRoute()
const router = useRouter()
const roomCode = ref('')
const name = ref('')
const pin = ref('')
const selectedAvatar = ref('')
const isSubmitting = ref(false)

if (route.params.roomCode) {
  roomCode.value = route.params.roomCode as string
}

const emotions = ['Happy', 'Angry', 'Cool', 'Nerdy', 'Sleepy', 'Surprised']

// Generate avatar options based on name input
const avatarOptions = computed(() => {
  if (!name.value) return []
  return emotions.map((emotion) => ({
    seed: `${name.value}${emotion}`,
    url: `https://api.dicebear.com/9.x/croodles/svg?seed=${name.value}${emotion}`,
  }))
})

const joinGame = async () => {
  if (!roomCode.value || !name.value || !pin.value || !selectedAvatar.value) {
    alert('Please fill all fields and choose an avatar')
    return
  }

  try {
    isSubmitting.value = true

    // Call backend API
    const response = await api.post(`/games/${roomCode.value}/join`, {
      name: name.value,
      pin: pin.value,
      avatarSeed: selectedAvatar.value,
    })

    console.log('Joined game:', response.data)

    const { gameId } = response.data

    // Save to localStorage
    localStorage.setItem('playerName', name.value)
    localStorage.setItem('playerId', response.data.id)
    localStorage.setItem('avatarSeed', selectedAvatar.value)
    localStorage.setItem('roomCode', roomCode.value)

    // login the user
    const loginResponse = await api.post('/auth/login', {
      name: name.value,
      pin: pin.value,
      gameId,
    })
    const { token } = loginResponse.data
    setToken(token)

    // Redirect to lobby
    router.push(`/lobby/${roomCode.value}`)
  } catch (error) {
    console.error('Failed to join game:', error)
    alert('Something went wrong while joining the game.')
  } finally {
    isSubmitting.value = false
  }
}

const normalizeInput = () => {
  watch(roomCode, (newVal) => {
    roomCode.value = newVal.toUpperCase().slice(0, 6)
  })

  watch(name, (val) => {
    name.value = val.trim().slice(0, 20)
  })

  watch(pin, (newVal) => {
    pin.value = newVal.slice(0, 4).replace(/\D/g, '') // Keep only digits
  })
}

const isFormValid = computed(() => {
  const isRoomCodeValid = roomCode.value.length === 6
  const isNameValid = name.value.length > 0 && name.value.length <= 20
  const isPinValid = /^\d{4}$/.test(pin.value)
  const isAvatarSelected = selectedAvatar.value !== ''

  return isRoomCodeValid && isNameValid && isPinValid && isAvatarSelected
})

normalizeInput()
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="w-full max-w-md bg-white rounded-xl shadow-md p-6 space-y-6">
      <h1 class="text-2xl font-bold text-center">Join Game</h1>

      <!-- Room Code -->
      <div>
        <label class="block text-sm font-medium text-gray-700">Room Code</label>
        <input
          v-model="roomCode"
          type="text"
          maxlength="6"
          :disabled="isSubmitting"
          class="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-100"
          placeholder="Enter Room Code"
        />
      </div>

      <!-- Name -->
      <div>
        <label class="block text-sm font-medium text-gray-700">Name</label>
        <input
          v-model="name"
          type="text"
          :disabled="isSubmitting"
          class="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-100"
          placeholder="Enter your name"
        />
      </div>

      <!-- PIN -->
      <div>
        <label class="block text-sm font-medium text-gray-700">PIN (4-digit)</label>
        <input
          v-model="pin"
          type="text"
          maxlength="4"
          :disabled="isSubmitting"
          class="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-100"
          placeholder="1234"
        />
      </div>

      <!-- Avatar Options -->
      <div v-if="avatarOptions.length > 0">
        <label class="block text-sm font-medium text-gray-700 mb-2">Choose an Avatar</label>
        <div class="grid grid-cols-2 gap-4">
          <div
            v-for="avatar in avatarOptions"
            :key="avatar.seed"
            class="p-2 border rounded-lg cursor-pointer hover:shadow-lg"
            :class="{
              'ring-2 ring-indigo-500': selectedAvatar === avatar.seed,
              'opacity-50 cursor-not-allowed': isSubmitting,
            }"
            @click="!isSubmitting && (selectedAvatar = avatar.seed)"
          >
            <img :src="avatar.url" class="w-20 h-20 mx-auto" />
          </div>
        </div>
      </div>

      <!-- Buttons -->
      <div class="flex justify-between">
        <button
          @click="router.push('/')"
          :disabled="isSubmitting"
          class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 disabled:opacity-50"
        >
          Back
        </button>
        <button
          @click="joinGame"
          :disabled="isSubmitting || !isFormValid"
          class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          <span v-if="isSubmitting">Joining...</span>
          <span v-else>Join Game</span>
        </button>
      </div>
    </div>
  </div>
</template>
