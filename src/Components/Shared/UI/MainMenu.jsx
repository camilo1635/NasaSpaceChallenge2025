import React, { useState, useEffect } from 'react'
import { useGameState } from '../../Utils/useGameState'

function MainMenu() {
  const { dispatch } = useGameState()
  const [fadeIn, setFadeIn] = useState(false)
  
  useEffect(() => {
    // Smooth fade-in animation
    setTimeout(() => setFadeIn(true), 500)
  }, [])
  
  const handleStartGame = () => {
  // Start directly without asking for name
  dispatch({ type: 'SET_PLAYER_NAME', payload: 'Astronaut' })
  dispatch({ type: 'START_GAME' })
  dispatch({ type: 'ADD_ACHIEVEMENT', payload: 'first_visit' })
  
  // CAMBIO: Ir a character selection en lugar de ir directo al museo
  dispatch({ type: 'SET_PHASE', payload: 'characterSelection' })
}
  
  return (
    <div className="main-menu">
      {/* Animated stars background */}
      <div className="stars-background">
        {Array.from({ length: 100 }, (_, i) => (
          <div 
            key={i} 
            className="star" 
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
              width: `${Math.random() * 3}px`,
              height: `${Math.random() * 3}px`,
            }}
          />
        ))}
      </div>
      
      {/* Centered main content */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90%',
        maxWidth: '900px',
        opacity: fadeIn ? 1 : 0,
        transition: 'opacity 2s ease-in-out'
      }}>
        {/* Game information panel */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.85)',
          borderRadius: '20px',
          padding: '40px',
          backdropFilter: 'blur(10px)',
          border: '2px solid rgba(77, 166, 255, 0.3)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)'
        }}>
          {/* Game title */}
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{ fontSize: '60px', marginBottom: '15px' }}>🛰️</div>
            <h1 style={{
              fontSize: '32px',
              color: '#4da6ff',
              textShadow: '0 0 20px rgba(77, 166, 255, 0.5)',
              marginBottom: '10px'
            }}>
              ISS 25TH ANNIVERSARY
            </h1>
            <p style={{
              fontSize: '18px',
              color: '#ffcc00',
              fontStyle: 'italic'
            }}>
              An Interactive Educational Adventure
            </p>
          </div>

          {/* Game information */}
          <div style={{
            color: '#ffffff',
            fontSize: '16px',
            lineHeight: '1.6',
            marginBottom: '30px',
            textAlign: 'center',
            opacity: 0.9
          }}>
            <p style={{ marginBottom: '20px' }}>
              Celebrate 25 years of international cooperation in space by exploring the history,
              training, and life aboard the International Space Station.
            </p>
          </div>

          {/* Game phases */}
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{
              textAlign: 'center',
              color: '#4da6ff',
              marginBottom: '20px',
              fontSize: '20px'
            }}>
              Your Space Journey
            </h3>
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-around',
              flexWrap: 'wrap',
              gap: '20px'
            }}>
              <div style={{
                flex: '1',
                minWidth: '200px',
                textAlign: 'center',
                padding: '20px',
                background: 'rgba(77, 166, 255, 0.1)',
                borderRadius: '15px',
                border: '1px solid rgba(77, 166, 255, 0.3)'
              }}>
                <div style={{ fontSize: '40px', marginBottom: '10px' }}>🏛️</div>
                <h4 style={{ color: '#4da6ff', marginBottom: '5px' }}>EXHIBITION HALL</h4>
                <p style={{ fontSize: '14px', color: '#ccc' }}>
                  Multimedia hall of space exploration
                </p>
              </div>

              <div style={{
                flex: '1',
                minWidth: '200px',
                textAlign: 'center',
                padding: '20px',
                background: 'rgba(77, 166, 255, 0.1)',
                borderRadius: '15px',
                border: '1px solid rgba(77, 166, 255, 0.3)'
              }}>
                <div style={{ fontSize: '40px', marginBottom: '10px' }}>🏊‍♂️</div>
                <h4 style={{ color: '#4da6ff', marginBottom: '5px' }}>NBL TRAINING</h4>
                <p style={{ fontSize: '14px', color: '#ccc' }}>
                  Train underwater like a real astronaut
                </p>
              </div>

              <div style={{
                flex: '1',
                minWidth: '200px',
                textAlign: 'center',
                padding: '20px',
                background: 'rgba(77, 166, 255, 0.1)',
                borderRadius: '15px',
                border: '1px solid rgba(77, 166, 255, 0.3)'
              }}>
                <div style={{ fontSize: '40px', marginBottom: '10px' }}>🚀</div>
                <h4 style={{ color: '#4da6ff', marginBottom: '5px' }}>LIFE ON ISS</h4>
                <p style={{ fontSize: '14px', color: '#ccc' }}>
                  Life, views, and science on the ISS
                </p>
              </div>
            </div>
          </div>

          {/* Start button */}
          <div style={{ textAlign: 'center' }}>
            <button 
              onClick={handleStartGame}
              style={{
                background: 'linear-gradient(45deg, #4da6ff, #0066cc)',
                border: 'none',
                color: 'white',
                padding: '18px 40px',
                fontSize: '18px',
                borderRadius: '30px',
                cursor: 'pointer',
                fontWeight: 'bold',
                boxShadow: '0 4px 15px rgba(77, 166, 255, 0.4)',
                transition: 'all 0.3s ease',
                letterSpacing: '1px'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)'
                e.target.style.boxShadow = '0 6px 20px rgba(77, 166, 255, 0.6)'
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)'
                e.target.style.boxShadow = '0 4px 15px rgba(77, 166, 255, 0.4)'
              }}
            >
              🚀 START ADVENTURE
            </button>

            {/* Instructions */}
            <p style={{
              marginTop: '20px',
              fontSize: '12px',
              color: '#888',
              fontStyle: 'italic'
            }}>
              Press the button to begin your space journey
            </p>
          </div>
        </div>

        {/* Credits or additional info */}
        <div style={{
          textAlign: 'center',
          marginTop: '20px',
          fontSize: '12px',
          color: '#666'
        }}>
          NASA Space Apps Challenge 2025
        </div>
      </div>
    </div>
  )
}

export default MainMenu