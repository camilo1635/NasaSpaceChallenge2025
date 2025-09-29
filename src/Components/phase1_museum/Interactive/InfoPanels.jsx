// src/Components/phase1_museum/Interactive/InfoPanels.jsx
import React from 'react'
import { Html } from '@react-three/drei'

export function InfoPanels() {
  return (
    <group>      
      {/* Panel central más ancho y menos alto */}
      <mesh position={[0, 3, 15]}>
        <planeGeometry args={[8, 1]} /> {/* ancho mayor, altura menor */}
        <meshStandardMaterial 
          color="#ffffff" 
          transparent 
          opacity={0.8}
        />
      </mesh>
      
      {/* Texto de bienvenida con título arriba y frases debajo */}
      <Html position={[0, 1, 15.1]} center>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start', // alinear al inicio vertical
          alignItems: 'center',
          background: 'rgba(0,0,0,0.8)',
          color: '#fff',
          padding: '15px 25px', // un poco más ancho horizontalmente
          borderRadius: '10px',
          fontFamily: 'Arial, sans-serif',
          maxWidth: '900px',       // ancho máximo mayor
          minWidth: '400px',       // para que no se encoja demasiado
          border: '2px solid #00ffff',
          lineHeight: '1.4'
        }}>
          {/* Título */}
          <h2 style={{margin: '0 0 10px', color: '#00ffff', fontSize: '22px'}}>
            🛰️ CURRENT MISSION
          </h2>
          
          {/* Descripción apilada debajo */}
          <p style={{margin: '2px 0', fontSize: '20px'}}>Explore posters</p>
          <p style={{margin: '2px 0', fontSize: '20px', opacity: 0.8}}>
           Go to the end of the hall (NBL training)
          </p>
        </div>
      </Html>
      
      {/* Luces decorativas */}
      <pointLight position={[-2.5, 2.5, -8]} intensity={0.5} color="#00ffff" />
      <pointLight position={[2.5, 2.5, 2]} intensity={0.5} color="#ff00ff" />
      <pointLight position={[0, 3.5, 15]} intensity={0.7} color="#ffffff" />
    </group>
  )
}
