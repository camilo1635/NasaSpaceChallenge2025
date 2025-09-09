// src/Components/phase2_NBL/UI/TrainingHUD.jsx
import React, { useEffect, useState } from 'react'
import { useGameState } from '../../Utils/useGameState'

export function TrainingHUD() {
  const {  dispatch } = useGameState()
  const [modulesCompleted,] = useState(0)
  
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

  return (
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
        <div style={{ fontSize: '13px' }}>
          <span style={{ color: '#ffeb3b' }}>🖱️</span> <strong>Ratón</strong> - Mirar alrededor
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
          🎯 MISIÓN: CONECTAR MÓDULOS
        </h4>
        
        <p style={{ fontSize: '12px', margin: '4px 0', lineHeight: '1.4' }}>
          1. Acércate a los bloques flotantes dorado y azul
        </p>
        <p style={{ fontSize: '12px', margin: '4px 0', lineHeight: '1.4' }}>
          2. Presiona ESPACIO cuando estés cerca para conectarlos
        </p>
        <p style={{ fontSize: '12px', margin: '4px 0', lineHeight: '1.4' }}>
          3. Conecta ambos módulos para completar el entrenamiento
        </p>
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
          📊 PROGRESO: {modulesCompleted}/2 módulos
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
            width: `${(modulesCompleted / 2) * 100}%`,
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
  )
}