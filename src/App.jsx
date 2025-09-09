import React, { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { GameProvider } from './Components/Utils/Gamecontext'   // Provider global
import { useGameState } from './Components/Utils/useGameState'  // Hook personalizado
import MainMenu from './Components/Shared/UI/MainMenu'
import MuseumScene from './Components/phase1_museum/MuseumScene'
import {NBLScene} from './Components/phase2_NBL/NBLScene' // 👈 Importamos la nueva escena
import LoadingScreen from './Components/Shared/UI/LoadingScreen'
import './App.css'

// ==========================
// 🎮 Componente GameRenderer
// ==========================
function GameRenderer() {
  const { state, dispatch } = useGameState()
  
  // Estado para manejar transición global
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [transitionPhase, setTransitionPhase] = useState(0)
  const [pendingPhase, setPendingPhase] = useState(null)

  // 👉 Listener para saltar con tecla (ejemplo: "N")
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key.toLowerCase() === 'n') {
        console.log('⏭ Saltando museo, pasando a NBL...')
        startTransitionTo('nbl')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Función para iniciar transición global
  const startTransitionTo = (targetPhase) => {
    if (isTransitioning) return // Evitar múltiples transiciones
    
    console.log(`🌊 Iniciando transición global hacia: ${targetPhase}`)
    setIsTransitioning(true)
    setPendingPhase(targetPhase)
    setTransitionPhase(1)

    // Fase 1: Oscurecimiento gradual (1.5 segundos)
    setTimeout(() => {
      console.log('🌊 Fase 2: Texto de transporte')
      setTransitionPhase(2)
    }, 1500)
    
    // Fase 2: Texto de transporte (2 segundos)
    setTimeout(() => {
      console.log('🌊 Fase 3: Efecto burbujas')
      setTransitionPhase(3)
    }, 3500)
    
    // Fase 3: Efecto burbujas con texto de inmersión (2.5 segundos)
    setTimeout(() => {
      console.log('🌊 Fase 4: Finalizando transición')
      setTransitionPhase(4)
    }, 6000)
    
    // Fase 4: Cambio real de fase (en el punto medio de la transición)
    setTimeout(() => {
      console.log(`🌊 Cambiando a fase ${targetPhase}`)
      dispatch({ type: 'SET_PHASE', payload: targetPhase })
    }, 7000)
    
    // Fase 5: Finalizar transición
    setTimeout(() => {
      console.log('🌊 Transición completada')
      setIsTransitioning(false)
      setTransitionPhase(0)
      setPendingPhase(null)
    }, 9000)
  }

  // Exponer función de transición globalmente para SimpleDoor
  useEffect(() => {
    window.startGlobalTransition = startTransitionTo
    return () => {
      delete window.startGlobalTransition
    }
  }, [])

  // ==========================
  // 🔀 Render según la fase
  // ==========================
  const renderCurrentPhase = () => {
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
        return (
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(to bottom, #000011, #000033)',
            color: 'white',
            fontSize: '24px'
          }}>
            🚀 Fase ISS - En desarrollo...
          </div>
        )

      default:
        return <LoadingScreen />
    }
  }

  return (
    <div className="game-container">
      {/* 🛰️ Título del juego */}
      {state.currentPhase !== 'menu' && !isTransitioning && (
        <div className="game-title">
          <h1>🛰️ ISS 25° Aniversario - Aventura Espacial</h1>
          <div className="phase-indicator">
            {state.currentPhase === 'museum' && '🏛️ Fase 1: Museo ISS'}
            {state.currentPhase === 'nbl' && '🏊‍♂️ Fase 2: Entrenamiento NBL'}
            {state.currentPhase === 'iss' && '🚀 Fase 3: En la ISS'}
          </div>
        </div>
      )}

      {/* Render de la fase actual */}
      {renderCurrentPhase()}

      {/* 🛠 Debug info simplificado */}
      {import.meta.env.DEV && !isTransitioning && (
        <div className="debug-info">
          <p>Fase: {state.currentPhase}</p>
          <p>Jugador: {state.playerName}</p>
          <p>Presiona 'N' para saltar a NBL</p>
        </div>
      )}

      {/* 🌊 OVERLAY DE TRANSICIÓN GLOBAL */}
      {isTransitioning && (
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
          
          {/* Fase 2: Texto de Transporte */}
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
                TRANSPORTÁNDOTE
              </h1>
              <p style={{ 
                fontSize: '28px', 
                margin: 0,
                opacity: 0.95,
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
              }}>
                {pendingPhase === 'nbl' ? 'AL LABORATORIO NBL...' : 'A LA SIGUIENTE FASE...'}
              </p>
              
              {/* Barra de progreso */}
              <div style={{
                width: '300px',
                height: '4px',
                background: 'rgba(255,255,255,0.3)',
                borderRadius: '2px',
                margin: '30px auto',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, #28a745, #20c997)',
                  animation: 'progressBar 2s ease-out'
                }} />
              </div>
            </div>
          )}

          {/* Fase 3: Efecto Burbujas */}
          {transitionPhase >= 3 && pendingPhase === 'nbl' && (
            <>
              {/* Fondo acuático animado */}
              <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                background: `
                  radial-gradient(circle at 20% 50%, rgba(0,150,200,0.3) 0%, transparent 50%),
                  radial-gradient(circle at 80% 20%, rgba(40,167,69,0.2) 0%, transparent 50%),
                  radial-gradient(circle at 40% 80%, rgba(0,100,150,0.25) 0%, transparent 50%)
                `,
                animation: 'underwaterFlow 8s ease-in-out infinite',
                zIndex: 999999
              }} />
              
              {/* Burbujas mejoradas */}
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
              
              {/* Texto de inmersión */}
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
                  SUMERGIÉNDOTE EN EL NBL
                </h1>
                <p style={{ 
                  fontSize: '22px', 
                  margin: 0,
                  opacity: 0.95,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.6)'
                }}>
                  Prepárate para entrenar como un astronauta
                </p>
                
                {/* Ondas de agua */}
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '200px',
                  height: '20px',
                  marginTop: '20px'
                }}>
                  {[0, 1, 2].map(i => (
                    <div
                      key={i}
                      style={{
                        position: 'absolute',
                        width: '100%',
                        height: '2px',
                        background: 'rgba(255,255,255,0.4)',
                        borderRadius: '2px',
                        animation: `wave 2s ease-in-out infinite`,
                        animationDelay: `${i * 0.3}s`
                      }}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* CSS Animations */}
      <style>{`
        @keyframes smoothFadeIn {
          0% { 
            opacity: 0; 
            transform: translateY(30px) scale(0.9);
          }
          100% { 
            opacity: 1; 
            transform: translateY(-20px) scale(1);
          }
        }
        
        @keyframes glow {
          0% { 
            text-shadow: 0 0 30px rgba(40,167,69,0.8), 0 0 60px rgba(40,167,69,0.4);
          }
          100% { 
            text-shadow: 0 0 40px rgba(40,167,69,1), 0 0 80px rgba(40,167,69,0.6);
          }
        }
        
        @keyframes progressBar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(0%); }
        }
        
        @keyframes enhancedBubble {
          0% {
            transform: translateY(0) scale(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
          50% {
            transform: translateY(-50vh) scale(1.2) rotate(180deg);
          }
          90% {
            opacity: 1;
            transform: translateY(-90vh) scale(0.8) rotate(300deg);
          }
          100% {
            transform: translateY(-100vh) scale(0) rotate(360deg);
            opacity: 0;
          }
        }
        
        @keyframes swimFloat {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
          }
          25% { 
            transform: translateY(-8px) rotate(-2deg); 
          }
          50% { 
            transform: translateY(-15px) rotate(0deg); 
          }
          75% { 
            transform: translateY(-8px) rotate(2deg); 
          }
        }
        
        @keyframes floatIn {
          0% { 
            opacity: 0; 
            transform: translate(-50%, -30%) scale(0.8);
          }
          100% { 
            opacity: 1; 
            transform: translate(-50%, -50%) scale(1);
          }
        }
        
        @keyframes underwaterFlow {
          0%, 100% { transform: translateX(0px) translateY(0px); }
          25% { transform: translateX(10px) translateY(-5px); }
          50% { transform: translateX(-5px) translateY(-10px); }
          75% { transform: translateX(-8px) translateY(-3px); }
        }
        
        @keyframes wave {
          0%, 100% { 
            transform: translateY(0px);
            opacity: 0.4;
          }
          50% { 
            transform: translateY(-5px);
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  )
}

// ==========================
// 🚀 App principal
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