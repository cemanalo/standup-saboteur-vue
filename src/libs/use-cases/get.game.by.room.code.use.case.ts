import api from '@/api'
import type { Game } from '@/types'

export type GetGameUseCaseInput = {
  roomCode: string
}

export class GetGameByRoomCodeUseCase {
  constructor() {}
  async execute(input: GetGameUseCaseInput) {
    const { roomCode } = input
    const response = await api.get<Game>(`/games/${roomCode}`)
    if (response.status === 200) {
      return response.data
    }

    return null
  }
}
