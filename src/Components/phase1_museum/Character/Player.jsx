// src/Components/phase1_museum/Character/Player.jsx
import { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export function Player() {
  const ref = useRef()

  // Cargar modelo GLB
  const { scene } = useGLTF('/models/astronauta9.glb')

  return (
    <primitive 
      ref={ref} 
      object={scene} 
      position={[0, 0, 0]} 
      scale={2.0}   // Ajusta tamaño según el modelo
      castShadow 
    />
  )
}