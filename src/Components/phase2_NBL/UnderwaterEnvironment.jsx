// src/Components/phase2_NBL/UnderwaterEnvironment.jsx
import React from 'react'
import { LunarFloor } from './LunarFloor'

export function UnderwaterEnvironment() {
  return (
    <group>
      {/* Paisaje lunar en el suelo */}
      <LunarFloor />

      {/* Paredes de la piscina */}
      {/* Pared frontal */}
      <mesh position={[0, 0, -25]} receiveShadow>
        <boxGeometry args={[50, 20, 1]} />
        <meshStandardMaterial 
          color="#1e3a8a" 
          transparent 
          opacity={0.6}
          roughness={0.3}
        />
      </mesh>

      {/* Pared trasera */}
      <mesh position={[0, 0, 25]} receiveShadow>
        <boxGeometry args={[50, 20, 1]} />
        <meshStandardMaterial 
          color="#1e3a8a" 
          transparent 
          opacity={0.6}
          roughness={0.3}
        />
      </mesh>

      {/* Pared izquierda */}
      <mesh position={[-25, 0, 0]} receiveShadow>
        <boxGeometry args={[1, 20, 50]} />
        <meshStandardMaterial 
          color="#1e3a8a" 
          transparent 
          opacity={0.6}
          roughness={0.3}
        />
      </mesh>

      {/* Pared derecha */}
      <mesh position={[25, 0, 0]} receiveShadow>
        <boxGeometry args={[1, 20, 50]} />
        <meshStandardMaterial 
          color="#1e3a8a" 
          transparent 
          opacity={0.6}
          roughness={0.3}
        />
      </mesh>

      {/* Superficie del agua (efecto visual) */}
      <mesh position={[0, 8, 0]} rotation={[-Math.PI/2, 0, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial 
          color="#1e40af" 
          transparent 
          opacity={0.25}
          emissive="#3b82f6"
          emissiveIntensity={0.08}
        />
      </mesh>

      {/* Estructura de módulo ISS simulado */}
      <group position={[0, 0, 0]}>
        {/* Módulo principal */}
        <mesh position={[0, -3, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[2, 2, 6, 32]} />
          <meshStandardMaterial 
            color="#e5e7eb" 
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        
        {/* Paneles solares */}
        <mesh position={[-4, -3, 0]} rotation={[0, 0, 0]} castShadow>
          <boxGeometry args={[0.1, 4, 8]} />
          <meshStandardMaterial 
            color="#1e3a8a"
            metalness={0.6}
            roughness={0.3}
          />
        </mesh>
        
        <mesh position={[4, -3, 0]} rotation={[0, 0, 0]} castShadow>
          <boxGeometry args={[0.1, 4, 8]} />
          <meshStandardMaterial 
            color="#1e3a8a"
            metalness={0.6}
            roughness={0.3}
          />
        </mesh>
      </group>

      {/* Plataformas de trabajo */}
      <mesh position={[-10, -5, -10]} castShadow receiveShadow>
        <boxGeometry args={[4, 0.3, 4]} />
        <meshStandardMaterial color="#f3f4f6" metalness={0.5} roughness={0.4} />
      </mesh>

      <mesh position={[10, -5, -10]} castShadow receiveShadow>
        <boxGeometry args={[4, 0.3, 4]} />
        <meshStandardMaterial color="#f3f4f6" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* Barras de agarre */}
      {[-12, -6, 0, 6, 12].map((x, index) => (
        <mesh key={`bar-${index}`} position={[x, 2, -20]} castShadow>
          <cylinderGeometry args={[0.15, 0.15, 8]} />
          <meshStandardMaterial color="#9ca3af" metalness={0.9} roughness={0.1} />
        </mesh>
      ))}

      {/* Luces subacuáticas simulando iluminación lunar */}
      <pointLight position={[-15, -5, -15]} intensity={0.6} color="#a0b0d0" distance={20} />
      <pointLight position={[15, -5, -15]} intensity={0.6} color="#a0b0d0" distance={20} />
      <pointLight position={[0, -5, 15]} intensity={0.6} color="#a0b0d0" distance={20} />
      
      {/* Luz cenital (simulando sol en la luna) */}
      <spotLight 
        position={[0, 15, 0]} 
        angle={0.6} 
        penumbra={0.3}
        intensity={1.2}
        color="#d0d8e0"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
    </group>
  )
}