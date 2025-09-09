// src/Components/Utils/Gamecontext.jsx
import React, { createContext, useReducer } from 'react'
import { gameReducer, initialState } from './gameReducer'

const GameContext = createContext()

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState)

  // Debug simple solo en desarrollo
  if (import.meta.env.DEV) {
    console.log('🎮 GameProvider - Fase actual:', state.currentPhase)
  }

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  )
}

export default GameContext