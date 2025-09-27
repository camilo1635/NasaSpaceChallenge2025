// src/Components/phase3_ISS/CupolaGallery.jsx
import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export function CupolaGallery() {
  const galleryRef = useRef()

  // Posición de la cúpula (parte SUPERIOR de la ISS)
  const cupolaPosition = [0, 8.5, 0]

  useFrame(() => {
    if (!galleryRef.current) return
    
    // Animación sutil de flotación
    const time = Date.now() * 0.001
    const offset = Math.sin(time) * 0.03
    galleryRef.current.position.y = cupolaPosition[1] + offset
  })

  return (
    <group>
      {/* CÚPULA PROFESIONAL MEJORADA */}
      <group ref={galleryRef} position={cupolaPosition}>
        
        {/* Partículas flotantes decorativas */}
        <group position={[0, 1.2, 0]}>
          {Array.from({length: 12}, (_, i) => {
            const angle = (i / 12) * Math.PI * 2
            const x = Math.cos(angle) * 2.0
            const z = Math.sin(angle) * 2.0
            return (
              <mesh key={i} position={[x, Math.sin(Date.now() * 0.003 + i) * 0.1, z]}>
                <sphereGeometry args={[0.02]} />
                <meshStandardMaterial 
                  color="#00ffff"
                  emissive="#00ffff"
                  emissiveIntensity={0.8}
                  transparent
                  opacity={0.8}
                />
              </mesh>
            )
          })}
        </group>
      </group>
    </group>
  )
}