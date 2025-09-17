// src/Components/phase2_NBL/UI/TrainingHUD.jsx
import React, { useEffect } from 'react'
import { useGameState } from '../../Utils/useGameState'

export function TrainingHUD({ 
  currentStep = 1, 
  connectedBlocks = [], 
  showCompletion = false,
  getStepInstructions 
}) {
  const { dispatch } = useGameState()
  
  // Detectar tecla M para saltar fase
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key.toLowerCase() === 'm') {
        console.log('⏭ Saltando NBL, pasando a ISS...')
        dispatch({ type: 'SET_PHASE', payload: 'iss' })
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [dispatch])

  // Función por defecto para las instrucciones
  const defaultGetStepInstructions = () => {
    const instructions = {
      1: "Coloca el Cuerpo Principal del satélite en la base",
      2: "Conecta la Antena de Comunicación en la parte superior", 
      3: "Instala el Anillo de Acople en la parte frontal"
    }
    return instructions[currentStep] || "¡Entrenamiento completado!"
  }

  const stepInstructions = getStepInstructions || defaultGetStepInstructions

  return (
    <>
      {/* HUD de Controles (Fixed) - Solo DOM */}
      <div style={{
        position: 'fixed',
        top: '20px',
        left: '20px',
        background: 'linear-gradient(135deg, rgba(0,60,120,0.9), rgba(0,100,150,0.9))',
        padding: '15px 20px',
        borderRadius: '12px',
        color: 'white',
        fontSize: '14px',
        fontFamily: 'Arial, sans-serif',
        border: '2px solid #4da6ff',
        boxShadow: '0 8px 25px rgba(0,0,0,0.4)',
        zIndex: 1000,
        minWidth: '280px'
      }}>
        {/* Título */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '12px',
          borderBottom: '1px solid rgba(255,255,255,0.3)',
          paddingBottom: '8px'
        }}>
          <span style={{ fontSize: '20px', marginRight: '8px' }}>🏊‍♂️</span>
          <h3 style={{ margin: 0, fontSize: '16px', color: '#87ceeb' }}>
            ENTRENAMIENTO NBL
          </h3>
        </div>

        {/* Controles */}
        <div style={{ marginBottom: '15px' }}>
          <div style={{ fontSize: '13px', marginBottom: '6px' }}>
            <span style={{ color: '#ffeb3b' }}>🎮</span> <strong>WASD</strong> - Movimiento horizontal
          </div>
          <div style={{ fontSize: '13px', marginBottom: '6px' }}>
            <span style={{ color: '#ffeb3b' }}>⌨️</span> <strong>ESPACIO</strong> - Subir
          </div>
          <div style={{ fontSize: '13px', marginBottom: '6px' }}>
            <span style={{ color: '#ffeb3b' }}>⬇️</span> <strong>SHIFT</strong> - Bajar
          </div>
          <div style={{ fontSize: '13px', marginBottom: '6px' }}>
            <span style={{ color: '#ffeb3b' }}>🖱️</span> <strong>Ratón</strong> - Mirar alrededor
          </div>
          <div style={{ fontSize: '13px' }}>
            <span style={{ color: '#00ff88' }}>🔧</span> <strong>E</strong> - Agarrar | <strong>Q</strong> - Soltar
          </div>
        </div>

        {/* Misión actual */}
        <div style={{
          background: 'rgba(0,0,0,0.4)',
          padding: '12px',
          borderRadius: '8px',
          border: '1px solid rgba(255,255,255,0.2)',
          marginBottom: '12px'
        }}>
          <h4 style={{ 
            margin: '0 0 8px', 
            fontSize: '14px', 
            color: '#00ff88'
          }}>
            🎯 MISIÓN: ENSAMBLAJE DE SATÉLITE
          </h4>
          
          <p style={{ fontSize: '12px', margin: '4px 0', lineHeight: '1.4' }}>
            <strong>Paso {currentStep}/3:</strong> {stepInstructions()}
          </p>
          
          <div style={{ fontSize: '11px', marginTop: '8px', opacity: 0.8 }}>
            1. Acércate a los componentes flotando<br/>
            2. Presiona E cerca para agarrarlos<br/>
            3. Lleva cada pieza al punto verde correcto<br/>
            4. Presiona Q cerca del punto para conectar
          </div>
        </div>

        {/* Progreso */}
        <div style={{
          background: 'rgba(40,167,69,0.3)',
          padding: '10px',
          borderRadius: '8px',
          border: '1px solid #28a745',
          marginBottom: '10px'
        }}>
          <div style={{ 
            fontSize: '12px', 
            fontWeight: 'bold',
            marginBottom: '4px'
          }}>
            📊 PROGRESO: {connectedBlocks.length}/3 módulos
          </div>
          
          {/* Barra de progreso */}
          <div style={{
            background: 'rgba(255,255,255,0.2)',
            height: '6px',
            borderRadius: '3px',
            overflow: 'hidden'
          }}>
            <div style={{
              background: 'linear-gradient(90deg, #28a745, #00ff88)',
              height: '100%',
              width: `${(connectedBlocks.length / 3) * 100}%`,
              borderRadius: '3px',
              transition: 'width 0.5s ease'
            }} />
          </div>
        </div>

        {/* Shortcut para desarrollo */}
        <div style={{
          fontSize: '11px',
          opacity: 0.7,
          textAlign: 'center',
          borderTop: '1px solid rgba(255,255,255,0.2)',
          paddingTop: '8px'
        }}>
          Presiona <strong>M</strong> para saltar a la ISS
        </div>
      </div>

      {/* Mensaje de completación */}
      {showCompletion && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'linear-gradient(135deg, rgba(40,167,69,0.95), rgba(0,100,0,0.95))',
          color: '#fff',
          padding: '25px 35px',
          borderRadius: '20px',
          textAlign: 'center',
          border: '3px solid #28a745',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          zIndex: 1001
        }}>
          <h2 style={{ margin: '0 0 15px', fontSize: '24px' }}>🎉 ¡SATÉLITE ENSAMBLADO!</h2>
          <p style={{ margin: '10px 0', fontSize: '16px' }}>
            Estructura completa: ✅ Cuerpo + Antena + Anillo de Acople
          </p>
          <p style={{ margin: '10px 0', fontSize: '14px', opacity: 0.9 }}>
            Iniciando transferencia a la ISS...
          </p>
        </div>
      )}
    </>
  )
}