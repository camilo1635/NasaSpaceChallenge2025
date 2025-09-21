// src/Components/Utils/gameReducer.js

// Estado inicial simplificado
export const initialState = {
  currentPhase: 'menu', // 'menu', 'museum', 'nbl', 'iss'
  playerPosition: [0, 0, 0],
  playerName: '',
  gameStarted: false,
  // 👇 AGREGAR ESTADO NBL TRAINING
  nblTraining: {
    currentStep: 1,
    connectedBlocks: [],
    showCompletion: false
  }
}

// Reducer ultra simplificado
export function gameReducer(state, action) {
  switch (action.type) {
    case 'SET_PHASE':
      console.log(`🎮 Cambiando fase a: ${action.payload}`)
      return { ...state, currentPhase: action.payload }

    case 'SET_PLAYER_NAME':
      return { ...state, playerName: action.payload }

    case 'UPDATE_PLAYER_POSITION':
      return { ...state, playerPosition: action.payload }

    case 'START_GAME':
      return { 
        ...state, 
        gameStarted: true, 
        currentPhase: 'museum'
      }
    
    // 👇 AGREGAR ESTE CASO PARA NBL TRAINING
    case 'UPDATE_NBL_TRAINING':
      return {
        ...state,
        nblTraining: {
          ...state.nblTraining,
          ...action.payload
        }
      }

    default:
      return state
  }
}