// src/Components/phase3_ISS/UI/ISSHUD.jsx
import React, { useState, useEffect } from 'react'

export function ISSHUD() {
  const [isExternalView, setIsExternalView] = useState(false)

  // Detectar si está en vista externa
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'KeyP') {
        setIsExternalView(true)
      }
      if (e.code === 'KeyO' || e.code === 'KeyU') {
        setIsExternalView(false)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  // No mostrar HUD en vista externa
  if (isExternalView) {
    return null
  }

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100vw', 
      height: '100vh', 
      pointerEvents: 'none',
      zIndex: 1000
    }}>
      {/* Panel de controles SIEMPRE VISIBLE en esquina superior izquierda */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        background: 'rgba(0,20,40,0.9)',
        color: '#fff',
        padding: '20px',
        borderRadius: '12px',
        fontSize: '13px',
        border: '2px solid #00ffff',
        maxWidth: '450px',
        boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
        zIndex: 1001,
        pointerEvents: 'auto'
      }}>
        <h3 style={{ 
          margin: '0 0 15px', 
          color: '#00ffff', 
          fontSize: '16px',
          textAlign: 'center'
        }}>
          Estación Espacial Internacional
        </h3>

        {/* Contenido educativo disponible */}
        <div style={{ marginBottom: '15px' }}>
          <h4 style={{ margin: '0 0 10px', color: '#87ceeb', fontSize: '14px' }}>
            Contenido Disponible:
          </h4>
          
          <div style={{
            background: 'rgba(0,150,255,0.15)', 
            padding: '8px', 
            borderRadius: '6px',
            marginBottom: '6px',
            border: '1px solid rgba(0,150,255,0.3)'
          }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#87ceeb' }}>
              🖼️ <span style={{ color: '#00ffff' }}>G</span> - Galería de la Cúpula
            </div>
            <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '2px' }}>
              Imágenes panorámicas de la Tierra
            </div>
          </div>

          <div style={{
            background: 'rgba(255,140,0,0.15)', 
            padding: '8px', 
            borderRadius: '6px',
            marginBottom: '6px',
            border: '1px solid rgba(255,140,0,0.3)'
          }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#ffaa44' }}>
              🎬 <span style={{ color: '#ffaa44' }}>F</span> - Vida en la ISS
            </div>
            <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '2px' }}>
              Videos sobre cómo viven los astronautas
            </div>
          </div>

          <div style={{
            background: 'rgba(0,255,100,0.15)', 
            padding: '8px', 
            borderRadius: '6px',
            border: '1px solid rgba(0,255,100,0.3)'
          }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#44ff88' }}>
              🔬 <span style={{ color: '#44ff88' }}>D</span> - Experimentos Científicos
            </div>
            <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '2px' }}>
              Investigación en microgravedad
            </div>
          </div>
        </div>

        {/* Controles de vista */}
        <div style={{ marginBottom: '12px' }}>
          <h4 style={{ margin: '0 0 8px', color: '#ffff99', fontSize: '12px' }}>
            Controles de Vista:
          </h4>
          <div style={{ fontSize: '11px', lineHeight: '1.4', opacity: 0.9 }}>
            <div><strong>P</strong> - Vista externa | <strong>O</strong> - Vista interna</div>
            <div><strong>V</strong> - Vista cúpula | <strong>U</strong> - Reset</div>
          </div>
        </div>

        {/* Navegación */}
        <div style={{ 
          fontSize: '11px', 
          opacity: 0.8, 
          textAlign: 'center',
          borderTop: '1px solid rgba(255,255,255,0.2)',
          paddingTop: '8px'
        }}>
          En galerías: <strong>← →</strong> o <strong>A D</strong> navegar | <strong>ESC</strong> cerrar
        </div>
      </div>

      {/* Información de la ISS en esquina inferior derecha */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        background: 'rgba(20,40,60,0.85)',
        color: '#fff',
        padding: '12px 16px',
        borderRadius: '10px',
        fontSize: '12px',
        border: '1px solid #4da6ff',
        maxWidth: '200px',
        pointerEvents: 'auto'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '5px', color: '#87ceeb' }}>
          Datos de la ISS:
        </div>
        <div style={{ fontSize: '11px', lineHeight: '1.3' }}>
          <div>Altitud: ~408 km</div>
          <div>Velocidad: 28,000 km/h</div>
          <div>Órbitas/día: ~16</div>
        </div>
      </div>

      {/* Indicador de misión en esquina inferior izquierda */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        background: 'rgba(0,30,60,0.85)',
        color: '#fff',
        padding: '12px 16px',
        borderRadius: '10px',
        fontSize: '12px',
        border: '1px solid #00ffff',
        maxWidth: '280px',
        pointerEvents: 'auto'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '6px', color: '#00ffff' }}>
          Misión: Exploración Educativa
        </div>
        <div style={{ fontSize: '11px', opacity: 0.9 }}>
          Descubre la vida, trabajo e investigación en el espacio
        </div>
      </div>
    </div>
  )
}