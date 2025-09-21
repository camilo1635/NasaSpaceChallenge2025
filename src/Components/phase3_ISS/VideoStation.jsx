// src/Components/phase3_ISS/VideoStation.jsx
import React, { useRef, useState, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

export function VideoStation({ position, title, description, videoSrc, onVideoRequest }) {
  const stationRef = useRef()
  const { camera } = useThree()
  const [isNearby, setIsNearby] = useState(false)

  useFrame(() => {
    if (!stationRef.current) return

    // Animación flotante de la estación
    const time = Date.now() * 0.001
    stationRef.current.position.y = position[1] + Math.sin(time + position[0]) * 0.1
    stationRef.current.rotation.y += 0.005

    // Detectar proximidad del jugador
    const distance = camera.position.distanceTo(stationRef.current.position)
    setIsNearby(distance < 3)
  })

  // Manejo de tecla F para reproducir video
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'KeyF' && isNearby) {
        e.preventDefault()
        // Llamar al callback del componente padre para mostrar el video
        onVideoRequest({
          title,
          description,
          videoSrc
        })
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isNearby, title, description, videoSrc, onVideoRequest])

  return (
    <group>
      {/* Estación de video flotante */}
      <group ref={stationRef} position={position}>
        {/* Pantalla principal */}
        <mesh castShadow>
          <boxGeometry args={[1.5, 1, 0.1]} />
          <meshStandardMaterial 
            color={isNearby ? "#00ffff" : "#404040"}
            emissive={isNearby ? "#003333" : "#000000"}
            emissiveIntensity={0.3}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Marco de la pantalla */}
        <mesh position={[0, 0, 0.06]}>
          <boxGeometry args={[1.6, 1.1, 0.05]} />
          <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Indicador LED */}
        <mesh position={[0.6, 0.4, 0.1]}>
          <sphereGeometry args={[0.03]} />
          <meshStandardMaterial 
            color={isNearby ? "#00ff00" : "#ff0000"}
            emissive={isNearby ? "#00ff00" : "#ff0000"}
            emissiveIntensity={0.8}
          />
        </mesh>

        {/* Soporte de la estación */}
        <mesh position={[0, -0.7, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.4]} />
          <meshStandardMaterial color="#808080" metalness={0.8} />
        </mesh>
      </group>

      {/* Información flotante cuando está cerca */}
      {isNearby && (
        <Html position={[position[0], position[1] + 1.2, position[2]]} center>
          <div style={{
            background: 'rgba(0,50,100,0.95)',
            color: '#fff',
            padding: '15px 20px',
            borderRadius: '12px',
            fontSize: '14px',
            textAlign: 'center',
            border: '2px solid #00ffff',
            animation: 'pulse 2s infinite',
            maxWidth: '300px',
            boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#00ffff' }}>
              📹 {title}
            </div>
            <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '10px' }}>
              {description}
            </div>
            <div style={{ fontSize: '11px', color: '#ffff00' }}>
              Presiona <span style={{color: '#00ffff', fontWeight: 'bold'}}>F</span> para reproducir
            </div>
          </div>
          <style>{`
            @keyframes pulse {
              0%, 100% { transform: scale(1); opacity: 1; }
              50% { transform: scale(1.05); opacity: 0.8; }
            }
          `}</style>
        </Html>
      )}
    </group>
  )
}