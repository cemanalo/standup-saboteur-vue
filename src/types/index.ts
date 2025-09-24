export type Player = {
  id: string
  name: string
  pin: string
  avatarSeed: string
  gameId?: string
  role: 'contributor' | 'blocker'
  isReady: boolean
  socketId: string
  score: number
  funnyName?: string
  createdAt: Date
}

export type Game = {
  id: string
  ownerId: string
  roomCode: string
  status: 'waiting' | 'in_progress' | 'completed'
  createdAt: Date
}

export type PairingRequest = {
  id: string
  gameId: string
  fromPlayerId: string
  toPlayerId: string
  status: 'pending' | 'accepted' | 'rejected'
  createdAt: Date
}

export type FinalScore = {
  totalScore: number
  weekEnding: string // YYYY-MM-DD (end of the week)
  player: Player
}
