export type PlayerId = string

export interface PlayerConfig {
  id: PlayerId
  name: string
  color: string
}

export interface MoveRecord {
  id: string
  playerId: PlayerId
  from: number
  to: number
  dice: number
  timestamp: string
}

export type GameStatus = 'idle' | 'rolling' | 'animating' | 'complete'

export interface GameSettings {
  playerCount: number
  playerConfigs: PlayerConfig[]
  startingPlayer: number
  animationsEnabled: boolean
  soundEnabled: boolean
  jumps: Record<number, number>
}

export interface PersistedGameState {
  positions: Record<PlayerId, number>
  currentPlayerIndex: number
  history: MoveRecord[]
  diceValue: number | null
  status: GameStatus
  winnerId?: PlayerId
  updatedAt: string
  players: PlayerConfig[]
  settingsSnapshot: GameSettings
}

export interface GameState {
  players: PlayerConfig[]
  positions: Record<PlayerId, number>
  currentPlayerIndex: number
  diceValue: number | null
  status: GameStatus
  winnerId?: PlayerId
  history: MoveRecord[]
  error?: string
  lastSavedAt?: string
}
