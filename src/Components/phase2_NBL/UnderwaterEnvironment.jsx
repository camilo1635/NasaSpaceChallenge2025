// src/Components/phase2_NBL/UnderwaterEnvironment.jsx
import React from 'react'

export function UnderwaterEnvironment() {
  return (
    <group>
      {/* Fondo de la piscina */}
      <mesh receiveShadow position={[0, -10, 0]}>
        <boxGeometry args={[30, 1, 30]} />
        <meshStandardMaterial 
          color="#1e3a8a" 
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Paredes de la piscina */}
      {/* Pared frontal */}
      <mesh position={[0, 0, -15]}>
        <boxGeometry args={[30, 20, 1]} />
        <meshStandardMaterial 
          color="#2563eb" 
          transparent 
          opacity={0.7}
        />
      </mesh>

      {/* Pared trasera */}
      <mesh position={[0, 0, 15]}>
        <boxGeometry args={[30, 20, 1]} />
        <meshStandardMaterial 
          color="#2563eb" 
          transparent 
          opacity={0.7}
        />
      </mesh>

      {/* Pared izquierda */}
      <mesh position={[-15, 0, 0]}>
        <boxGeometry args={[1, 20, 30]} />
        <meshStandardMaterial 
          color="#2563eb" 
          transparent 
          opacity={0.7}
        />
      </mesh>

      {/* Pared derecha */}
      <mesh position={[15, 0, 0]}>
        <boxGeometry args={[1, 20, 30]} />
        <meshStandardMaterial 
          color="#2563eb" 
          transparent 
          opacity={0.7}
        />
      </mesh>

      {/* Superficie del agua (efecto visual) */}
      <mesh position={[0, 8, 0]} rotation={[-Math.PI/2, 0, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial 
          color="#87ceeb" 
          transparent 
          opacity={0.3}
          emissive="#4da6ff"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Estructuras de entrenamiento - Plataformas */}
      <mesh position={[-8, -2, -8]} castShadow>
        <boxGeometry args={[3, 0.5, 3]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      <mesh position={[8, -2, -8]} castShadow>
        <boxGeometry args={[3, 0.5, 3]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      <mesh position={[0, -2, 8]} castShadow>
        <boxGeometry args={[3, 0.5, 3]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Barras de entrenamiento */}
      {[-10, -5, 0, 5, 10].map((x, index) => (
        <mesh key={index} position={[x, 2, -12]} castShadow>
          <cylinderGeometry args={[0.1, 0.1, 6]} />
          <meshStandardMaterial color="#c0c0c0" metalness={0.8} />
        </mesh>
      ))}

      {/* Elementos decorativos del fondo */}
      {Array.from({length: 8}, (_, i) => (
        <mesh 
          key={i}
          position={[
            (Math.random() - 0.5) * 25, 
            -8 + Math.random() * 2, 
            (Math.random() - 0.5) * 25
          ]}
          castShadow
        >
          <sphereGeometry args={[0.3 + Math.random() * 0.5]} />
          <meshStandardMaterial 
            color="#4682b4" 
            transparent 
            opacity={0.6}
          />
        </mesh>
      ))}

      {/* Luces subacuáticas en el fondo */}
      <pointLight position={[-10, -8, -10]} intensity={0.8} color="#00ffff" />
      <pointLight position={[10, -8, -10]} intensity={0.8} color="#00bfff" />
      <pointLight position={[0, -8, 10]} intensity={0.8} color="#87ceeb" />

      {/* Marcadores de profundidad */}
      {[1, 2, 3, 4, 5].map((depth, index) => (
        <mesh key={index} position={[12, 8 - depth * 3, 12]} rotation={[0, -Math.PI/4, 0]}>
          <planeGeometry args={[1, 0.5]} />
          <meshStandardMaterial 
            color="#ffffff" 
            transparent 
            opacity={0.8}
          />
        </mesh>
      ))}
    </group>
  )
}