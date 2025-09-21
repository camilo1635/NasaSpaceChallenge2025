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
  const [showGlobalIntro, setShowGlobalIntro] = useState(true)
  const [globalIntroEnded, setGlobalIntroEnded] = useState(false)
  
  // Estado para manejar transición global
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [transitionPhase, setTransitionPhase] = useState(0)
  const [pendingPhase, setPendingPhase] = useState(null)

  // Función para manejar el final del video global
  const handleGlobalIntroEnd = () => {
    setGlobalIntroEnded(true)
    setTimeout(() => {
      setShowGlobalIntro(false)
    }, 1000)
  }

  // Listener para saltar con tecla (ejemplo: "N")
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key.toLowerCase() === 'n') {
        console.log('Saltando museo, pasando a NBL...')
        startTransitionTo('nbl')
      }
      // Tecla I para ir directamente a ISS (para testing)
      if (e.key.toLowerCase() === 'i' && import.meta.env.DEV) {
        console.log('Saltando a ISS...')
        startTransitionTo('iss')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Función para iniciar transición global
  const startTransitionTo = (targetPhase) => {
    if (isTransitioning) return // Evitar múltiples transiciones
    
    console.log(`Iniciando transición global hacia: ${targetPhase}`)
    setIsTransitioning(true)
    setPendingPhase(targetPhase)
    setTransitionPhase(1)

    // TRANSICIÓN ESPECIAL: NBL -> ISS (Cohete)
    if (state.currentPhase === 'nbl' && targetPhase === 'iss') {
      // Transición de cohete (más larga y elaborada)
      setTimeout(() => {
        console.log('Fase 2: Preparando lanzamiento')
        setTransitionPhase(2)
      }, 1500)
      
      setTimeout(() => {
        console.log('Fase 3: Despegue')
        setTransitionPhase(3)
      }, 3500)
      
      setTimeout(() => {
        console.log('Fase 4: Viaje espacial')
        setTransitionPhase(4)
      }, 6000)
      
      setTimeout(() => {
        console.log('Fase 5: Aproximación a ISS')
        setTransitionPhase(5)
      }, 9000)
      
      setTimeout(() => {
        console.log(`Llegando a la ISS`)
        dispatch({ type: 'SET_PHASE', payload: targetPhase })
      }, 11000)
      
      setTimeout(() => {
        console.log('Transición completada')
        setIsTransitioning(false)
        setTransitionPhase(0)
        setPendingPhase(null)
      }, 13000)
      
    } else {
      // Transición estándar (museo -> NBL)
      setTimeout(() => {
        console.log('Fase 2: Texto de transporte')
        setTransitionPhase(2)
      }, 1500)
      
      setTimeout(() => {
        console.log('Fase 3: Efecto burbujas')
        setTransitionPhase(3)
      }, 3500)
      
      setTimeout(() => {
        console.log('Fase 4: Finalizando transición')
        setTransitionPhase(4)
      }, 6000)
      
      setTimeout(() => {
        console.log(`Cambiando a fase ${targetPhase}`)
        dispatch({ type: 'SET_PHASE', payload: targetPhase })
      }, 7000)
      
      setTimeout(() => {
        console.log('Transición completada')
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
    // PRIMERO: Mostrar video de introducción global si no se ha visto
    if (showGlobalIntro) {
      return (
        <GlobalIntroVideo 
          onVideoEnd={handleGlobalIntroEnd}
          videoEnded={globalIntroEnded}
        />
      )
    }

    // DESPUÉS: Flujo normal del juego
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
    }
  }

  return (
    <div className="game-container">
      {/* Título del juego - No mostrar durante el video inicial */}
      {!showGlobalIntro && state.currentPhase !== 'menu' && !isTransitioning && (
        <div className="game-title">
          <h1>ISS 25° Aniversario - Aventura Espacial</h1>
          <div className="phase-indicator">
            {state.currentPhase === 'museum' && 'Fase 1: Museo ISS'}
            {state.currentPhase === 'nbl' && 'Fase 2: Entrenamiento NBL'}
            {state.currentPhase === 'iss' && 'Fase 3: En la ISS'}
          </div>
        </div>
      )}

      {/* Render de la fase actual */}
      {renderCurrentPhase()}

      {/* Debug info simplificado - No mostrar durante el video inicial */}
      {import.meta.env.DEV && !isTransitioning && !showGlobalIntro && (
        <div className="debug-info">
          <p>Fase: {state.currentPhase}</p>
          <p>Jugador: {state.playerName}</p>
          <p>Presiona 'N' para saltar a NBL</p>
          <p>Presiona 'I' para saltar a ISS</p>
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
          
          {/* Fase 2: Preparación del lanzamiento */}
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
                PREPARANDO LANZAMIENTO
              </h1>
              <div style={{
                fontSize: '72px',
                fontFamily: 'monospace',
                color: '#ff3333',
                animation: 'countdown 1s ease-in-out',
                textShadow: '0 0 20px rgba(255,51,51,0.8)'
              }}>
                3
              </div>
            </div>
          )}

          {/* Fase 3: Despegue */}
          {transitionPhase === 3 && (
            <>
              {/* Tierra en la parte inferior */}
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
              
              {/* Cohete despegando */}
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
                
                {/* Llamas del cohete */}
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
                
                {/* Texto de despegue */}
                <h2 style={{
                  color: '#fff',
                  fontSize: '32px',
                  marginTop: '20px',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
                }}>
                  DESPEGUE!
                </h2>
              </div>
              
              {/* Nubes pasando */}
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

          {/* Fase 4: Viaje espacial */}
          {transitionPhase === 4 && (
            <>
              {/* Estrellas de fondo */}
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
              
              {/* Cohete en el espacio */}
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
                  VIAJANDO AL ESPACIO
                </h2>
                
                {/* Indicador de velocidad */}
                <div style={{
                  marginTop: '20px',
                  fontSize: '24px',
                  color: '#00ff00',
                  fontFamily: 'monospace'
                }}>
                  Velocidad: 28,000 km/h
                </div>
                
                {/* Barra de progreso */}
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
              
              {/* Tierra alejándose */}
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

          {/* Fase 5: Aproximación a la ISS */}
          {transitionPhase === 5 && (
            <>
              {/* Estrellas de fondo */}
              <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%'
              }}>
                {[...Array(50)].map((_, i) => (
                  <div
                    key={i}
                    style={{
                      position: 'absolute',
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      width: '1px',
                      height: '1px',
                      background: '#fff',
                      borderRadius: '50%'
                    }}
                  />
                ))}
              </div>
              
              {/* ISS acercándose */}
              <div style={{
                textAlign: 'center',
                animation: 'issApproach 2s ease-out forwards',
                zIndex: 1000001
              }}>
                <div style={{ 
                  fontSize: '20px',
                  animation: 'issGrow 2s ease-out forwards',
                  filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.8))'
                }}>
                  🛸
                </div>
                
                <h1 style={{
                  color: '#fff',
                  fontSize: '42px',
                  marginTop: '30px',
                  textShadow: '3px 3px 6px rgba(0,0,0,0.8)',
                  animation: 'fadeIn 1.5s ease-out'
                }}>
                  LLEGANDO A LA ISS
                </h1>
                
                <p style={{
                  color: '#00ffff',
                  fontSize: '24px',
                  marginTop: '20px',
                  animation: 'fadeIn 2s ease-out'
                }}>
                  Preparando acoplamiento...
                </p>
                
                {/* Indicadores de acoplamiento */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '20px',
                  marginTop: '30px',
                  animation: 'fadeIn 2.5s ease-out'
                }}>
                  {['Presión', 'Alineación', 'Velocidad'].map((item, i) => (
                    <div key={i} style={{
                      padding: '10px 20px',
                      background: 'rgba(0,255,0,0.2)',
                      border: '2px solid #00ff00',
                      borderRadius: '8px',
                      color: '#00ff00',
                      fontSize: '14px'
                    }}>
                      ✓ {item}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Cohete pequeño acercándose */}
              <div style={{
                position: 'absolute',
                bottom: '10%',
                left: '20%',
                fontSize: '40px',
                transform: 'rotate(45deg)',
                animation: 'rocketDock 2s ease-out forwards'
              }}>
                🚀
              </div>
            </>
          )}
        </div>
      )}

      {/* TRANSICIÓN ORIGINAL DE AGUA (para otras transiciones) */}
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
          
          {/* Contenido original de transición a NBL... */}
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
                AL LABORATORIO NBL...
              </p>
            </div>
          )}

          {/* Burbujas y efectos de agua para NBL... */}
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
              </div>
            </>
          )}
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          0% { 
            opacity: 0; 
            transform: translateY(50px);
          }
          100% { 
            opacity: 1; 
            transform: translateY(0);
          }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        
        @keyframes countdown {
          0% { transform: scale(0.5); opacity: 0; }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); opacity: 1; }
        }
        
        @keyframes earthShrink {
          0% { 
            transform: translateX(-50%) scale(1);
            bottom: -50%;
          }
          100% { 
            transform: translateX(-50%) scale(0.3);
            bottom: -90%;
          }
        }
        
        @keyframes rocketLaunch {
          0% { 
            transform: translateX(-50%) translateY(0);
            bottom: 10%;
          }
          100% { 
            transform: translateX(-50%) translateY(-200px);
            bottom: 50%;
          }
        }
        
        @keyframes rocketShake {
          0%, 100% { transform: translateX(-2px); }
          50% { transform: translateX(2px); }
        }
        
        @keyframes flames {
          0% { transform: translateX(-50%) scale(1); opacity: 0.8; }
          100% { transform: translateX(-50%) scale(1.2); opacity: 1; }
        }
        
        @keyframes cloudPass {
          0% { 
            transform: translateY(0);
            opacity: 0.7;
          }
          100% { 
            transform: translateY(200px);
            opacity: 0;
          }
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        
        @keyframes floatInSpace {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(0); }
        }
        
        @keyframes earthFadeOut {
          0% { 
            opacity: 1;
            transform: translateX(-50%) scale(1);
          }
          100% { 
            opacity: 0.3;
            transform: translateX(-50%) scale(0.5);
          }
        }
        
        @keyframes issApproach {
          0% { 
            transform: scale(0.5);
            opacity: 0;
          }
          100% { 
            transform: scale(1);
            opacity: 1;
          }
        }
        
        @keyframes issGrow {
          0% { font-size: 20px; }
          100% { font-size: 150px; }
        }
        
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        
        @keyframes rocketDock {
          0% { 
            bottom: 10%;
            left: 20%;
          }
          100% { 
            bottom: 45%;
            left: 45%;
          }
        }
        
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
      `}</style>
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