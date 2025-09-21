import React, { useState } from 'react'
import { useGameState } from '../../Utils/useGameState'
import { welcomeMessage } from '../../../Data/issData'

function MainMenu() {
  const { dispatch } = useGameState()
  const [playerName, setPlayerName] = useState('')
  const [showWelcome, setShowWelcome] = useState(false)
  
  const handleStartGame = () => {
    if (playerName.trim()) {
      dispatch({ type: 'SET_PLAYER_NAME', payload: playerName.trim() })
      dispatch({ type: 'START_GAME' })
      dispatch({ type: 'ADD_ACHIEVEMENT', payload: 'first_visit' })
    }
  }
   
  const handleShowWelcome = () => {
    setShowWelcome(!showWelcome)
  }
  
  return (
    <div className="main-menu">
      {/* Background con estrellas animadas */}
      <div className="stars-background">
        {Array.from({ length: 50 }, (_, i) => (
          <div 
            key={i} 
            className="star" 
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>
      
      <div className="menu-content">
        <div className="iss-logo">
          <div className="iss-icon">🛰️</div>
          <h1>ESTACIÓN ESPACIAL INTERNACIONAL</h1>
          <h2>25° Aniversario</h2>
          <p className="subtitle">Una Aventura Educativa Interactiva</p>
        </div>
        
        <div className="menu-form">
          <div className="input-group">
            <label htmlFor="playerName">Ingresa tu nombre de astronauta:</label>
            <input
              id="playerName"
              type="text"
              placeholder="Ej: Commander Smith"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleStartGame()}
              maxLength={20}
            />
          </div>
          
          <div className="menu-buttons">
            <button 
              className="start-button"
              onClick={handleStartGame}
              disabled={!playerName.trim()}
            >
              🚀 Comenzar Aventura
            </button>
            
            <button 
              className="info-button"
              onClick={handleShowWelcome}
            >
              ℹ️ Información del Juego
            </button>
          </div>
        </div>
        
        {/* Panel de información */}
        {showWelcome && (
          <div className="welcome-panel">
            <div className="welcome-content">
              <button 
                className="close-button"
                onClick={() => setShowWelcome(false)}
              >
                ✕
              </button>
              <h3>Acerca de esta Aventura</h3>
              <div className="welcome-text">
                {welcomeMessage.split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
              
              <div className="phases-preview">
                <h4>Fases del Juego:</h4>
                <div className="phase-cards">
                  <div className="phase-card">
                    <div className="phase-icon">📚</div>
                    <h5>Museo ISS</h5>
                    <p>Explora la historia de 25 años</p>
                  </div>
                  <div className="phase-card">
                    <div className="phase-icon">🏊‍♂️</div>
                    <h5>Entrenamiento NBL</h5>
                    <p>Entrena como un astronauta</p>
                  </div>
                  <div className="phase-card">
                    <div className="phase-icon">🚀</div>
                    <h5>En la ISS</h5>
                    <p>Experimenta la vida en el espacio</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MainMenu