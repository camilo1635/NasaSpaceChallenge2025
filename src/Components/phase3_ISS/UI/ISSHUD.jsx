// src/Components/phase3_ISS/UI/ISSHUD.jsx
import React, { useState, useEffect } from 'react'

export function ISSHUD() {
  const [isExternalView, setIsExternalView] = useState(false)

  // Detect if in external view
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

  // Don't show HUD in external view
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
      {/* Controls panel ALWAYS VISIBLE in top left corner */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        background: 'rgba(0,20,40,0.9)',
        color: '#fff',
        padding: '12px 16px',
        borderRadius: '10px',
        fontSize: '11px',
        border: '2px solid #00ffff',
        maxWidth: '320px',
        boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
        zIndex: 1001,
        pointerEvents: 'auto'
      }}>

        {/* Available educational content */}
        <div style={{ marginBottom: '25px' }}>
          <h4 style={{ margin: '0 0 8px', color: '#87ceeb', fontSize: '14px' }}>
            Available Content:
          </h4>
          
          <div style={{
            background: 'rgba(0,150,255,0.15)', 
            padding: '8px', 
            borderRadius: '6px',
            marginBottom: '6px',
            border: '1px solid rgba(0,150,255,0.3)'
          }}>
            <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#87ceeb' }}>
              🖼️ <span style={{ color: '#00ffff' }}>G</span> - Cupola Gallery
            </div>
            <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '2px' }}>
              Panoramic images of Earth
            </div>
          </div>

          <div style={{
            background: 'rgba(255,140,0,0.15)', 
            padding: '8px', 
            borderRadius: '6px',
            marginBottom: '6px',
            border: '1px solid rgba(255,140,0,0.3)'
          }}>
            <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#ffaa44' }}>
              🎬 <span style={{ color: '#ffaa44' }}>F</span> - Life on the ISS
            </div>
            <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '2px' }}>
              Videos about how astronauts live
            </div>
          </div>

          <div style={{
            background: 'rgba(0,255,100,0.15)', 
            padding: '8px', 
            borderRadius: '6px',
            border: '1px solid rgba(0,255,100,0.3)'
          }}>
            <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#44ff88' }}>
              🔬 <span style={{ color: '#44ff88' }}>J</span> - Scientific Research
            </div>
            <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '2px' }}>
              Microgravity research
            </div>
          </div>
        </div>

        {/* View controls */}
        <div style={{ marginBottom: '18px' }}>
          <h4 style={{ margin: '0 0 8px', color: '#ffff99', fontSize: '12px' }}>
            View Controls:
          </h4>
          <div style={{ fontSize: '16px', lineHeight: '1.4', opacity: 0.9 }}>
            <div><strong>P</strong> - External view | <strong>O</strong> - Internal view</div>
          </div>
        </div>
      </div>

      {/* ISS information in bottom right corner */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        background: 'rgba(20,40,60,0.85)',
        color: '#fff',
        padding: '8px 12px',
        borderRadius: '8px',
        fontSize: '11px',
        border: '1px solid #4da6ff',
        maxWidth: '220px',
        pointerEvents: 'auto'
      }}>
        
        <div style={{ fontSize: '14px', lineHeight: '1.3' }}>
          <div>Altitude: ~408 km</div>
          <div>Speed: 28,000 km/h</div>
          <div>Orbits/day: ~16</div>
        </div>
      </div>
    </div>
  )
}