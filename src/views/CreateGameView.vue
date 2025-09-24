<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api'
import { setToken } from '@/libs/utils/auth'

const router = useRouter()
const name = ref('')
const pin = ref('')
const selectedAvatar = ref('')
const isSubmitting = ref(false) // new: to disable UI while creating game

const emotions = ['Happy', 'Angry', 'Cool', 'Nerdy', 'Sleepy', 'Surprised']

// Generate avatar options based on name input
const avatarOptions = computed(() => {
  if (!name.value) return []
  return emotions.map((emotion) => ({
    seed: `${name.value}${emotion}`,
    url: `https://api.dicebear.com/9.x/croodles/svg?seed=${name.value}${emotion}`,
  }))
})

const createGame = async () => {
  if (!name.value || !pin.value || !selectedAvatar.value) {
    alert('Please fill all fields and choose an avatar')
    return
  }

  try {
    isSubmitting.value = true

    // Call backend API
    const response = await api.post('/games', {
      ownerName: name.value,
      ownerPin: pin.value,
      avatarSeed: selectedAvatar.value,
    })

    const { roomCode, id } = response.data

    console.log('Game created:', response.data)
    localStorage.setItem('playerName', name.value)
    localStorage.setItem('playerId', response.data.ownerId)
    localStorage.setItem('avatarSeed', selectedAvatar.value)
    localStorage.setItem('roomCode', roomCode)

    // login the user
    const loginResponse = await api.post('/auth/login', {
      name: name.value,
      pin: pin.value,
      gameId: id,
    })
    const { data: token } = loginResponse
    console.log('token:', loginResponse)
    setToken(token)

    // Redirect to lobby with roomCode
    router.push(`/lobby/${roomCode}`)
  } catch (error) {
    console.error('Failed to create game:', error)
    alert('Something went wrong while creating the game.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="w-full max-w-md bg-white rounded-xl shadow-md p-6 space-y-6">
      <h1 class="text-2xl font-bold text-center">Create New Game</h1>

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

      <div class="flex justify-between">
        <button
          @click="router.push('/')"
          :disabled="isSubmitting"
          class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 disabled:opacity-50"
        >
          Back
        </button>
        <button
          @click="createGame"
          :disabled="isSubmitting"
          class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          <span v-if="isSubmitting">Creating...</span>
          <span v-else>Create Game</span>
        </button>
      </div>
    </div>
  </div>
</template>
