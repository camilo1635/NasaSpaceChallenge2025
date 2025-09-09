// src/Components/phase2_NBL/ParticleSystem.jsx
import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function ParticleSystem() {
  const particlesRef = useRef()
  
  // Crear las burbujas
  const bubbles = useMemo(() => {
    const bubbleArray = []
    const count = 50 // Número de burbujas
    
    for (let i = 0; i < count; i++) {
      bubbleArray.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 30,  // X: -15 a 15
          Math.random() * -10,         // Y: -10 a 0 (fondo)
          (Math.random() - 0.5) * 30   // Z: -15 a 15
        ),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.01, // Movimiento lateral suave
          0.02 + Math.random() * 0.03,  // Velocidad ascendente
          (Math.random() - 0.5) * 0.01  // Movimiento lateral suave
        ),
        size: 0.1 + Math.random() * 0.2, // Tamaño variable
        life: Math.random() * 100,        // Vida de la burbuja
        originalY: Math.random() * -10    // Posición Y inicial para reset
      })
    }
    return bubbleArray
  }, [])

  // Animación de las burbujas
  useFrame(() => {
    if (!particlesRef.current) return

    bubbles.forEach((bubble, index) => {
      // Mover burbuja hacia arriba
      bubble.position.add(bubble.velocity)
      
      // Movimiento ondulante
      bubble.position.x += Math.sin(Date.now() * 0.001 + index) * 0.001
      bubble.position.z += Math.cos(Date.now() * 0.001 + index) * 0.001
      
      // Si la burbuja llega a la superficie, reiniciarla
      if (bubble.position.y > 8) {
        bubble.position.y = bubble.originalY
        bubble.position.x = (Math.random() - 0.5) * 30
        bubble.position.z = (Math.random() - 0.5) * 30
        bubble.velocity.y = 0.02 + Math.random() * 0.03
      }
      
      // Actualizar la posición en el mesh
      const mesh = particlesRef.current.children[index]
      if (mesh) {
        mesh.position.copy(bubble.position)
        
        // Hacer que las burbujas se vuelvan más transparentes cerca de la superficie
        const alpha = Math.max(0.3, 1 - (bubble.position.y + 10) / 18)
        mesh.material.opacity = alpha
      }
    })
  })

  return (
    <group ref={particlesRef}>
      {bubbles.map((bubble, index) => (
        <mesh key={index} position={bubble.position}>
          <sphereGeometry args={[bubble.size, 8, 6]} />
          <meshStandardMaterial 
            color="#ffffff"
            transparent
            opacity={0.6}
            emissive="#87ceeb"
            emissiveIntensity={0.2}
          />
        </mesh>
      ))}
    </group>
  )
}