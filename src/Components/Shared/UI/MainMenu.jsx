import React, { useState, useEffect } from 'react'
import { useGameState } from '../../Utils/useGameState'
import { welcomeMessage } from '../../../Data/issData'

function MainMenu() {
  const { dispatch } = useGameState()
  const [fadeIn, setFadeIn] = useState(false)
  
  useEffect(() => {
    // Animación de entrada suave
    setTimeout(() => setFadeIn(true), 500)
  }, [])
  
  const handleStartGame = () => {
    // Iniciar directamente sin pedir nombre
    dispatch({ type: 'SET_PLAYER_NAME', payload: 'Astronauta' })
    dispatch({ type: 'START_GAME' })
    dispatch({ type: 'ADD_ACHIEVEMENT', payload: 'first_visit' })
  }
  
  return (
    <div className="main-menu">
      {/* Background con estrellas animadas */}
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
      
      {/* Contenido principal centrado */}
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
        {/* Panel de información del juego */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.85)',
          borderRadius: '20px',
          padding: '40px',
          backdropFilter: 'blur(10px)',
          border: '2px solid rgba(77, 166, 255, 0.3)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)'
        }}>
          {/* Título del juego */}
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{ fontSize: '60px', marginBottom: '15px' }}>🛰️</div>
            <h1 style={{
              fontSize: '32px',
              color: '#4da6ff',
              textShadow: '0 0 20px rgba(77, 166, 255, 0.5)',
              marginBottom: '10px'
            }}>
              ISS 25° ANIVERSARIO
            </h1>
            <p style={{
              fontSize: '18px',
              color: '#ffcc00',
              fontStyle: 'italic'
            }}>
              Una Aventura Educativa Interactiva
            </p>
          </div>

          {/* Información del juego */}
          <div style={{
            color: '#ffffff',
            fontSize: '16px',
            lineHeight: '1.6',
            marginBottom: '30px',
            textAlign: 'center',
            opacity: 0.9
          }}>
            <p style={{ marginBottom: '20px' }}>
              Celebra 25 años de cooperación internacional en el espacio explorando la historia,
              el entrenamiento y la vida a bordo de la Estación Espacial Internacional.
            </p>
          </div>

          {/* Fases del juego */}
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{
              textAlign: 'center',
              color: '#4da6ff',
              marginBottom: '20px',
              fontSize: '20px'
            }}>
              Tu Viaje Espacial
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
                <h4 style={{ color: '#4da6ff', marginBottom: '5px' }}>MUSEO ISS</h4>
                <p style={{ fontSize: '14px', color: '#ccc' }}>
                  Explora 25 años de historia espacial
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
                <h4 style={{ color: '#4da6ff', marginBottom: '5px' }}>ENTRENAMIENTO NBL</h4>
                <p style={{ fontSize: '14px', color: '#ccc' }}>
                  Entrena bajo el agua como un astronauta real
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
                <h4 style={{ color: '#4da6ff', marginBottom: '5px' }}>VIDA EN LA ISS</h4>
                <p style={{ fontSize: '14px', color: '#ccc' }}>
                  Experimenta la vida en microgravedad
                </p>
              </div>
            </div>
          </div>

          {/* Botón de inicio */}
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
              🚀 COMENZAR AVENTURA
            </button>

            {/* Instrucciones */}
            <p style={{
              marginTop: '20px',
              fontSize: '12px',
              color: '#888',
              fontStyle: 'italic'
            }}>
              Presiona el botón para iniciar tu viaje espacial
            </p>
          </div>
        </div>

        {/* Créditos o información adicional */}
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