import api from '@/api'
import router from '@/router'
import type { Game } from '@/types'
import { jwtDecode } from 'jwt-decode'
import { getToken, isTokenValid } from '../utils/auth'

export const sessionCheck = async () => {
  // step 1: get token from local storage
  const token = getToken()

  // step 2: if token exists, check room status then redirect
  if (token && isTokenValid(token)) {
    const { gameId } = jwtDecode<{ playerId: string; gameId: string }>(token)

    const game = await api.get<Game>(`/games/${gameId}`)
    const { data: gameData } = game

    console.log('Game data:', gameData)

    if (gameData.status === 'waiting') {
      // redirect to lobby
      router.push(`/lobby/${gameData.roomCode}`)
      return
    }

    if (gameData.status === 'completed') {
      router.push(`/game/${gameData.roomCode}/results`)
      return
    }
  } else {
    router.push('/')
  }
}
