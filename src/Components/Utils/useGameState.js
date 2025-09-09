import { useContext } from 'react'
import GameContext from './Gamecontext'

export function useGameState() {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error('useGameState must be used within GameProvider')
  }
  return context
}
