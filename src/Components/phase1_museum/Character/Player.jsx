// src/Components/phase1_museum/Character/Player.jsx
import { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { useCharacter } from '../../Utils/useCharacter'

export function Player() {
  const ref = useRef()
  const { selectedCharacter } = useCharacter()

  // Cargar el modelo seleccionado dinámicamente
  const modelPath = `/models/${selectedCharacter.model}`
  const { scene } = useGLTF(modelPath)

  return (
    <primitive 
      ref={ref} 
      object={scene} 
      position={[0, 0, 0]} 
      scale={selectedCharacter.scale}
      castShadow 
    />
  )
}