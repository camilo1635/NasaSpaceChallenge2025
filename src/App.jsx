import React, { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { GameProvider } from './Components/Utils/Gamecontext'   // Provider global
import { useGameState } from './Components/Utils/useGameState'  // Hook personalizado
import MainMenu from './Components/Shared/UI/MainMenu'
import MuseumScene from './Components/phase1_museum/MuseumScene'
import {NBLScene} from './Components/phase2_NBL/NBLScene' // Importamos la nueva escena
import LoadingScreen from './Components/Shared/UI/LoadingScreen'
import { ISSScene } from './Components/phase3_ISS/ISSScene'
import { GlobalIntroVideo } from './Components/Shared/UI/GlobalIntroVideo' // Nuevo video inicial
import './App.css'

// ========================== 
// Componente GameRenderer
// ==========================
function GameRenderer() {
  const { state, dispatch } = useGameState()
  
  // Estado para el video de introducción global
  const [showGlobalIntro, setShowGlobalIntro] = useState(false) // Cambiado a false
  const [globalIntroEnded, setGlobalIntroEnded] = useState(false)
  const [gameStarted, setGameStarted] = useState(false) // Nuevo estado
  
  // Estado para manejar transición global
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [transitionPhase, setTransitionPhase] = useState(0)
  const [pendingPhase, setPendingPhase] = useState(null)

  // Detectar cuando el juego inicia desde el menú
  useEffect(() => {
    if (state.gameStarted && !gameStarted) {
      setGameStarted(true)
      setShowGlobalIntro(true) // Mostrar video intro cuando se inicia el juego
    }
  }, [state.gameStarted, gameStarted])

  // Función para manejar el final del video global
  const handleGlobalIntroEnd = () => {
    setGlobalIntroEnded(true)
    setTimeout(() => {
      setShowGlobalIntro(false)
      // Ir directamente al museo después del video
      dispatch({ type: 'SET_PHASE', payload: 'museum' })
    }, 1000)
  }

  // Listener para saltar con tecla (ejemplo: "N")
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Skip desde museum a NBL
      if (e.key.toLowerCase() === 'n' && state.currentPhase === 'museum') {
        console.log('Skipping to NBL...')
        startTransitionTo('nbl')
      }
      // Skip desde NBL a ISS
      if (e.key.toLowerCase() === 'i' && import.meta.env.DEV) {
        console.log('Skipping to ISS...')
        if (window.startGlobalTransition) {
        window.startGlobalTransition('iss') 
        }
      }
      // Para desarrollo: teclas de debug
      if (import.meta.env.DEV) {
        // M para volver al menú desde cualquier fase
        if (e.key.toLowerCase() === 'm') {
          console.log('Returning to menu...')
          dispatch({ type: 'SET_PHASE', payload: 'menu' })
          setIsTransitioning(false)
        }
        // Saltos directos con números
        if (e.key === '1') {
          console.log('Jump to Museum')
          dispatch({ type: 'SET_PHASE', payload: 'museum' })
        }
        if (e.key === '2') {
          console.log('Jump to NBL')
          dispatch({ type: 'SET_PHASE', payload: 'nbl' })
        }
        if (e.key === '3') {
          console.log('Jump to ISS')
          dispatch({ type: 'SET_PHASE', payload: 'iss' })
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [state.currentPhase, dispatch])

  // Función para iniciar transición global
  const startTransitionTo = (targetPhase) => {
    if (isTransitioning) return // Evitar múltiples transiciones
    
    console.log(`Starting global transition to: ${targetPhase}`)
    setIsTransitioning(true)
    setPendingPhase(targetPhase)
    setTransitionPhase(1)

    // TRANSICIÓN ESPECIAL: NBL -> ISS (Cohete)
    if (state.currentPhase === 'nbl' && targetPhase === 'iss') {
      // Transición de cohete (más larga y elaborada)
      setTimeout(() => {
        console.log('Phase 2: Preparing launch')
        setTransitionPhase(2)
      }, 1500)
      
      setTimeout(() => {
        console.log('Phase 3: Liftoff')
        setTransitionPhase(3)
      }, 3500)
      
      setTimeout(() => {
        console.log('Phase 4: Space travel')
        setTransitionPhase(4)
      }, 6000)
      
      setTimeout(() => {
        console.log(`Arriving at ISS`)
        window.isTransitioningToISS = true // Flag para no mostrar intro de ISS
        dispatch({ type: 'SET_PHASE', payload: targetPhase })
      }, 14000) // Tiempo extendido para completar animación
      
      setTimeout(() => {
        console.log('Transition completed')
        window.isTransitioningToISS = false
        setIsTransitioning(false)
        setTransitionPhase(0)
        setPendingPhase(null)
        setCountdownNumber(3) // Reset para próxima vez
      }, 15000)
      
    } else {
      // Transición estándar (museo -> NBL)
      setTimeout(() => {
        console.log('Phase 2: Transport text')
        setTransitionPhase(2)
      }, 1500)
      
      setTimeout(() => {
        console.log('Phase 3: Bubble effect')
        setTransitionPhase(3)
      }, 3500)
      
      setTimeout(() => {
        console.log('Phase 4: Finalizing transition')
        setTransitionPhase(4)
      }, 6000)
      
      setTimeout(() => {
        console.log(`Changing to phase ${targetPhase}`)
        dispatch({ type: 'SET_PHASE', payload: targetPhase })
      }, 7000)
      
      setTimeout(() => {
        console.log('Transition completed')
        setIsTransitioning(false)
        setTransitionPhase(0)
        setPendingPhase(null)
      }, 9000)
    }
  }

  // Exponer función de transición globalmente para SimpleDoor
  useEffect(() => {
    window.startGlobalTransition = startTransitionTo
    return () => {
      delete window.startGlobalTransition
    }
  }, [])

  // ==========================
  // Render según la fase
  // ==========================
  const renderCurrentPhase = () => {
    // Si se está mostrando el video intro después del menú
    if (showGlobalIntro) {
      return (
        <GlobalIntroVideo 
          onVideoEnd={handleGlobalIntroEnd}
          videoEnded={globalIntroEnded}
        />
      )
    }

    // Flujo normal del juego
    switch (state.currentPhase) {
      case 'menu':
        return <MainMenu />

      case 'museum':
        return (
          <Canvas 
            camera={{ position: [0, 2, 8], fov: 60 }}
            gl={{ antialias: true, shadowMap: true }}
            shadows
          >
            <MuseumScene />
          </Canvas>
        )

      case 'nbl':
        return <NBLScene />   
      
      case 'iss':
        return <ISSScene /> 
        
      default:
        return <LoadingScreen />
    }
  }

  return (
    <div className="game-container">
      {/* Título del juego - No mostrar durante el menú o video inicial */}
      {!showGlobalIntro && state.currentPhase !== 'menu' && !isTransitioning && (
        <div className="game-title">
          <h1>ISS 25th Anniversary - Space Adventure</h1>
          <div className="phase-indicator">
            {state.currentPhase === 'museum' && 'Phase 1: ISS Museum'}
            {state.currentPhase === 'nbl' && 'Phase 2: NBL Training'}
            {state.currentPhase === 'iss' && 'Phase 3: On the ISS'}
          </div>
        </div>
      )}

      {/* Render de la fase actual */}
      {renderCurrentPhase()}

      {/* Debug info simplificado - No mostrar durante el menú o video inicial */}
      {import.meta.env.DEV && !isTransitioning && !showGlobalIntro && state.currentPhase !== 'menu' && (
        <div className="debug-info">
          <p>Phase: {state.currentPhase}</p>
          <p>Player: {state.playerName}</p>
          {state.currentPhase === 'museum' && <p>Press 'N' to skip to NBL</p>}
          {state.currentPhase === 'nbl' && <p>Press 'I' to skip to ISS</p>}
          <p>Dev Keys: M=Menu | 1=Museum | 2=NBL | 3=ISS</p>
        </div>
      )}

      {/* TRANSICIÓN DE COHETE (NBL -> ISS) */}
      {isTransitioning && pendingPhase === 'iss' && state.currentPhase === 'nbl' && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: transitionPhase === 1 ? 'rgba(0,0,0,0.5)' :
                       transitionPhase === 2 ? 'linear-gradient(to top, #87CEEB, #4A90E2)' :
                       transitionPhase === 3 ? 'linear-gradient(to top, #4A90E2, #1e3c72)' :
                       transitionPhase === 4 ? 'linear-gradient(to top, #000033, #000000)' :
                       transitionPhase === 5 ? 'radial-gradient(circle, #000033, #000000)' :
                       '#000000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999999,
            transition: 'all 1.5s ease-in-out',
            overflow: 'hidden',
            pointerEvents: 'all'
          }}>
          
          {/* Phase 2: Launch preparation WITH COUNTDOWN */}
          {transitionPhase === 2 && (
            <div style={{
              textAlign: 'center',
              color: '#fff',
              animation: 'fadeInUp 1.5s ease-out',
              zIndex: 1000001
            }}>
              <div style={{ 
                fontSize: '120px',
                marginBottom: '30px',
                animation: 'pulse 1s ease-in-out infinite'
              }}>
                🚀
              </div>
              <h1 style={{ 
                fontSize: '48px',
                margin: '0 0 20px',
                textShadow: '3px 3px 6px rgba(0,0,0,0.5)',
                letterSpacing: '3px'
              }}>
                PREPARING LAUNCH
              </h1>
            </div>
          )}

          {/* Phase 3: Liftoff */}
          {transitionPhase === 3 && (
            <>
              {/* Earth at the bottom */}
              <div style={{
                position: 'absolute',
                bottom: '-50%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '200%',
                height: '100%',
                background: 'radial-gradient(ellipse at center, #228B22, #006400)',
                borderRadius: '50%',
                animation: 'earthShrink 2.5s ease-in forwards'
              }} />
              
              {/* Rocket lifting off */}
              <div style={{
                position: 'absolute',
                bottom: '10%',
                left: '50%',
                transform: 'translateX(-50%)',
                textAlign: 'center',
                animation: 'rocketLaunch 2.5s ease-in forwards',
                zIndex: 1000002
              }}>
                <div style={{
                  fontSize: '150px',
                  animation: 'rocketShake 0.1s infinite',
                  filter: 'drop-shadow(0 50px 50px rgba(255,100,0,0.8))'
                }}>
                  🚀
                </div>
                
                {/* Rocket flames */}
                <div style={{
                  position: 'absolute',
                  bottom: '-30px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  fontSize: '80px',
                  animation: 'flames 0.2s infinite alternate'
                }}>
                  🔥
                </div>
                
                {/* Liftoff text */}
                <h2 style={{
                  color: '#fff',
                  fontSize: '32px',
                  marginTop: '20px',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
                }}>
                  LIFTOFF!
                </h2>
              </div>
              
              {/* Passing clouds */}
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    left: `${Math.random() * 100}%`,
                    top: `${20 + Math.random() * 60}%`,
                    fontSize: '60px',
                    opacity: 0.7,
                    animation: `cloudPass 1.5s ease-out forwards`,
                    animationDelay: `${i * 0.2}s`
                  }}
                >
                  ☁️
                </div>
              ))}
            </>
          )}

          {/* Phase 4: Space travel */}
          {transitionPhase === 4 && (
            <>
              {/* Background stars */}
              <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                background: 'transparent'
              }}>
                {[...Array(100)].map((_, i) => (
                  <div
                    key={i}
                    style={{
                      position: 'absolute',
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      width: '2px',
                      height: '2px',
                      background: '#fff',
                      borderRadius: '50%',
                      animation: `twinkle ${2 + Math.random() * 3}s infinite`,
                      animationDelay: `${Math.random() * 2}s`
                    }}
                  />
                ))}
              </div>
              
              {/* Rocket in space */}
              <div style={{
                textAlign: 'center',
                animation: 'floatInSpace 3s ease-in-out infinite',
                zIndex: 1000001
              }}>
                <div style={{ 
                  fontSize: '100px',
                  transform: 'rotate(-45deg)',
                  filter: 'drop-shadow(0 0 30px rgba(255,255,255,0.5))'
                }}>
                  🚀
                </div>
                <h2 style={{
                  color: '#fff',
                  fontSize: '36px',
                  marginTop: '30px',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
                }}>
                  TRAVELING TO SPACE
                </h2>
                
                {/* Speed indicator */}
                <div style={{
                  marginTop: '20px',
                  fontSize: '24px',
                  color: '#00ff00',
                  fontFamily: 'monospace'
                }}>
                  Speed: 28,000 km/h
                </div>
                
                {/* Progress bar */}
                <div style={{
                  width: '300px',
                  height: '8px',
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: '4px',
                  margin: '20px auto',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, #00ff00, #00ffff)',
                    animation: 'progress 3s ease-out'
                  }} />
                </div>
              </div>
              
              {/* Earth moving away */}
              <div style={{
                position: 'absolute',
                bottom: '-80%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '600px',
                height: '600px',
                background: 'radial-gradient(circle, #4169E1, #000080)',
                borderRadius: '50%',
                boxShadow: '0 0 100px rgba(65,105,225,0.5)',
                animation: 'earthFadeOut 3s ease-out forwards'
              }} />
            </>
          )}
        </div>
      )}

      {/* ORIGINAL WATER TRANSITION (for other transitions) */}
      {isTransitioning && pendingPhase === 'nbl' && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: transitionPhase >= 1 ? 
              `linear-gradient(45deg, 
                rgba(0, 40, 80, ${Math.min(transitionPhase * 0.2, 0.85)}), 
                rgba(0, 60, 120, ${Math.min(transitionPhase * 0.25, 0.9)}))` 
              : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999999,
            transition: 'all 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
            fontFamily: 'Arial, sans-serif',
            overflow: 'hidden',
            pointerEvents: 'all'
          }}>
          
          {/* Original NBL transition content... */}
          {transitionPhase === 2 && (
            <div style={{
              textAlign: 'center',
              color: '#fff',
              animation: 'smoothFadeIn 2s ease-out',
              transform: 'translateY(-20px)',
              zIndex: 1000000
            }}>
              <div style={{ 
                fontSize: '64px', 
                marginBottom: '30px',
                textShadow: '0 0 30px rgba(40,167,69,0.8), 0 0 60px rgba(40,167,69,0.4)',
                animation: 'glow 2s ease-in-out infinite alternate'
              }}>
                🌊
              </div>
              <h1 style={{ 
                fontSize: '42px', 
                margin: '0 0 15px',
                textShadow: '3px 3px 6px rgba(0,0,0,0.7)',
                letterSpacing: '2px',
                fontWeight: 'bold'
              }}>
                TRANSPORTING YOU
              </h1>
              <p style={{ 
                fontSize: '28px', 
                margin: 0,
                opacity: 0.95,
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
              }}>
                TO THE NBL LABORATORY...
              </p>
            </div>
          )}

          {/* Bubbles and water effects for NBL... */}
          {transitionPhase >= 3 && (
            <>
              <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                pointerEvents: 'none',
                zIndex: 1000000
              }}>
                {Array.from({length: 25}, (_, i) => (
                  <div
                    key={i}
                    style={{
                      position: 'absolute',
                      left: `${Math.random() * 100}%`,
                      bottom: '-80px',
                      width: `${8 + Math.random() * 25}px`,
                      height: `${8 + Math.random() * 25}px`,
                      background: `radial-gradient(circle, rgba(255,255,255,${0.4 + Math.random() * 0.4}), rgba(255,255,255,0.1))`,
                      borderRadius: '50%',
                      border: '1px solid rgba(255,255,255,0.2)',
                      animation: `enhancedBubble ${4 + Math.random() * 3}s ease-out infinite`,
                      animationDelay: `${Math.random() * 3}s`,
                      boxShadow: '0 0 10px rgba(255,255,255,0.3)'
                    }}
                  />
                ))}
              </div>
              
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                color: '#fff',
                animation: 'floatIn 2.5s ease-out',
                zIndex: 1000001
              }}>
                <div style={{ 
                  fontSize: '72px', 
                  marginBottom: '25px',
                  animation: 'swimFloat 3s ease-in-out infinite',
                  textShadow: '0 0 20px rgba(40,167,69,0.8)',
                  filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.3))'
                }}>
                  🏊‍♂️
                </div>
                <h1 style={{ 
                  fontSize: '38px', 
                  margin: '0 0 15px',
                  textShadow: '3px 3px 8px rgba(0,0,0,0.8)',
                  letterSpacing: '1.5px',
                  fontWeight: 'bold'
                }}>
                  DIVING INTO THE NBL
                </h1>
                <p style={{ 
                  fontSize: '22px', 
                  margin: 0,
                  opacity: 0.95,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.6)'
                }}>
                  Get ready to train like an astronaut
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

// ==========================
// App principal
// ==========================
function App() {
  return (
    <GameProvider>
      <div className="App">
        <GameRenderer />
      </div>
    </GameProvider>
  )
}

export default App