// src/Components/phase1_museum/UI/SimpleHUD.jsx
import React from 'react'
import { Html } from '@react-three/drei'

export function SimpleHUD() {
  return (
    <Html fullscreen>
      {/* HUD Principal - Posición Fija Derecha */}
      <div style={{
        position: 'fixed',
        top: -406,
        righ: 26,
        background: 'linear-gradient(135deg, rgba(0,0,0,0.8), rgba(0,30,60,0.8))',
        color: '#fff',
        padding: '16px 20px',
        borderRadius: '15px',
        fontFamily: 'Arial, sans-serif',
        lineHeight: 1.4,
        maxWidth: '280px',
        border: '2px solid #4da6ff',
        boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
        zIndex: 1000
      }}>
        {/* Título */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '12px',
          borderBottom: '1px solid #444',
          paddingBottom: '8px'
        }}>
          <span style={{ fontSize: '15px', marginRight: '8px' }}>🏛️</span>
          <h3 style={{ margin: 0, fontSize: '25px', color: '#4da6ff' }}>
            Travel ISS
          </h3>
        </div>

        {/* Instrucciones */}
        <div style={{ marginBottom: '15px' }}>
        <div style={{ fontSize: '20px', marginBottom: '6px' }}>
          <span style={{ color: '#ffeb3b' }}>🎮</span> <strong>WASD</strong> - Move
        </div>
        <div style={{ fontSize: '20px', marginBottom: '6px' }}>
          <span style={{ color: '#ffeb3b' }}>🖱️</span> <strong>Mouse</strong> - Look around
        </div>
        <div style={{ fontSize: '20px' }}>
          <span style={{ color: '#ffeb3b' }}>👀</span> <strong>Observe</strong> - The information signs
        </div>
      </div>


        

        {/* Estado */}
        <div style={{
          marginTop: '12px',
          padding: '8px 12px',
          borderRadius: '8px',
          textAlign: 'center',
          background: 'linear-gradient(135deg, #28a745, #20c997)',
          color: '#fff',
          fontSize: '13px',
          fontWeight: 'bold'
        }}>
        </div>
      </div>
    </Html>
  )
}