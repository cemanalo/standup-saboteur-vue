import api from '@/api'
import { type Game } from '@/types'
import { useRouter, useRoute } from 'vue-router'

export type ValidateSessionUseCaseInput = {
  roomCode: string
  playerId: string
}

export type ValidateSessionUseCaseOutput =
  | true
  | {
      error: 'invalid_session' | 'invalid_pin'
    }

export class ValidateSessionUseCase {
  constructor() {}

  async execute(input: ValidateSessionUseCaseInput): Promise<ValidateSessionUseCaseOutput> {
    const { roomCode, playerId } = input
    if (!roomCode || !playerId) {
      return { error: 'invalid_session' }
    }

    const router = useRouter()
    const route = useRoute()
    // step 1: check game status
    try {
      const response = await api.get<Game>(`/games/${roomCode}`)
      if (response.status > 300 || response.status < 200) {
        console.log('Invalid response status:', response.status)
        return { error: 'invalid_session' }
      }

      // if status is completed, redirect to results page
      const { status } = response.data
      if (status === 'completed' && route.name !== 'results') {
        router.push(`/game/${roomCode}/results`)
        return true
      }

      if (status === 'in_progress' && route.name !== 'game') {
        router.push(`/game/${roomCode}`)
        return true
      } else {
        return true
      }
    } catch (error) {
      console.error('Error fetching game:', error)
      return { error: 'invalid_session' }
    }
  }
}
