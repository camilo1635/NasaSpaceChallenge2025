// src/Components/phase3_ISS/UI/ISSHUD.jsx
import React, { useState, useEffect } from 'react'

export function ISSHUD() {
  const [showControls, setShowControls] = useState(true)
  const [discoveredVideos] = useState(0)
  const [discoveredImages] = useState(0)

  // Ocultar controles después de unos segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowControls(false)
    }, 10000) // Más tiempo para leer las nuevas instrucciones

    return () => clearTimeout(timer)
  }, [])

  const toggleControls = () => {
    setShowControls(!showControls)
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Botón para mostrar/ocultar controles */}
      <button
        onClick={toggleControls}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          background: 'rgba(0,50,100,0.8)',
          border: '2px solid #00ffff',
          color: '#fff',
          padding: '8px 12px',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '14px',
          zIndex: 1000,
          transition: 'all 0.3s ease'
        }}
        onMouseOver={(e) => {
          e.target.style.background = 'rgba(0,100,150,0.9)'
          e.target.style.transform = 'scale(1.05)'
        }}
        onMouseOut={(e) => {
          e.target.style.background = 'rgba(0,50,100,0.8)'
          e.target.style.transform = 'scale(1)'
        }}
      >
        {showControls ? 'Ocultar' : 'Controles'}
      </button>

      {/* Panel de controles */}
      {showControls && (
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          background: 'rgba(0,20,40,0.95)',
          color: '#fff',
          padding: '20px',
          borderRadius: '15px',
          fontSize: '14px',
          border: '2px solid #00ffff',
          maxWidth: '350px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
          zIndex: 999,
          animation: 'slideIn 0.5s ease'
        }}>
          <h3 style={{ 
            margin: '0 0 15px', 
            color: '#00ffff', 
            fontSize: '18px',
            textAlign: 'center'
          }}>
            Estación Espacial Internacional
          </h3>
          
          <div style={{ marginBottom: '15px' }}>
            <h4 style={{ margin: '0 0 8px', color: '#ffff99', fontSize: '14px' }}>
              Controles de Microgravedad:
            </h4>
            <div style={{ fontSize: '12px', lineHeight: '1.4' }}>
              <div><strong>WASD</strong> - Propulsores de movimiento</div>
              <div><strong>ESPACIO</strong> - Propulsor hacia arriba</div>
              <div><strong>SHIFT</strong> - Propulsor hacia abajo</div>
              <div><strong>Mouse</strong> - Orientación (clic para capturar)</div>
            </div>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <h4 style={{ margin: '0 0 8px', color: '#ffff99', fontSize: '14px' }}>
              Estaciones de Video:
            </h4>
            <div style={{ fontSize: '12px', lineHeight: '1.4' }}>
              <div><strong>F</strong> - Ver video en pantalla completa</div>
              <div><strong>ESC</strong> - Cerrar video</div>
              <div style={{ marginTop: '5px', opacity: 0.8 }}>
                Busca las pantallas grandes con títulos flotantes
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <h4 style={{ margin: '0 0 8px', color: '#ffff99', fontSize: '14px' }}>
              Galería de la Cúpula:
            </h4>
            <div style={{ fontSize: '12px', lineHeight: '1.4' }}>
              <div><strong>G</strong> - Abrir galería de imágenes</div>
              <div><strong>← →</strong> o <strong>A D</strong> - Navegar imágenes</div>
              <div><strong>ESC</strong> - Cerrar galería</div>
              <div style={{ marginTop: '5px', opacity: 0.8 }}>
                Ve a la cúpula superior para acceder a las imágenes
              </div>
            </div>
          </div>

          <div style={{ 
            padding: '10px', 
            background: 'rgba(0,100,0,0.2)', 
            borderRadius: '8px',
            border: '1px solid rgba(0,255,0,0.3)'
          }}>
            <div style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>
              Progreso de Exploración:
            </div>
            <div style={{ fontSize: '12px' }}>
              Videos descubiertos: {discoveredVideos}/3
            </div>
            <div style={{ fontSize: '12px' }}>
              Imágenes vistas: {discoveredImages}/6
            </div>
          </div>
        </div>
      )}

      {/* Indicador de misión */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        background: 'rgba(0,30,60,0.9)',
        color: '#fff',
        padding: '12px 20px',
        borderRadius: '10px',
        fontSize: '14px',
        border: '2px solid #00ffff',
        maxWidth: '400px'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '5px', color: '#00ffff' }}>
          Misión: Exploración Educativa
        </div>
        <div style={{ fontSize: '13px', opacity: 0.9 }}>
          Descubre cómo viven y trabajan los astronautas en la ISS
        </div>
        <div style={{ fontSize: '12px', marginTop: '8px', opacity: 0.7 }}>
          Explora las estaciones de video y la galería de la cúpula
        </div>
      </div>

      {/* Información de la ISS */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        background: 'rgba(20,40,60,0.9)',
        color: '#fff',
        padding: '12px 16px',
        borderRadius: '10px',
        fontSize: '12px',
        border: '1px solid #4da6ff',
        maxWidth: '250px'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '5px', color: '#87ceeb' }}>
          Datos de la ISS:
        </div>
        <div>Altitud: ~408 km</div>
        <div>Velocidad: 28,000 km/h</div>
        <div>Órbitas por día: ~16</div>
        <div style={{ marginTop: '5px', opacity: 0.8 }}>
          Operativa desde el año 2000
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          0% {
            opacity: 0;
            transform: translateX(-50px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  )
}