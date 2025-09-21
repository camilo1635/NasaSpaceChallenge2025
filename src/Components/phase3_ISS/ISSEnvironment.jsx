// src/Components/phase3_ISS/ISSEnvironment.jsx
import React from 'react'

export function ISSEnvironment() {
  return (
    <group>
      {/* Módulo principal - Cilindro principal de la ISS */}
      <mesh position={[0, 0, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[4, 4, 15]} />
        <meshStandardMaterial 
          color="#f0f0f0" 
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>

      {/* Paredes interiores con paneles (simplificadas) */}
      {Array.from({length: 8}, (_, i) => {
        const angle = (i / 8) * Math.PI * 2
        const x = Math.cos(angle) * 3.8
        const z = Math.sin(angle) * 3.8
        return (
          <mesh 
            key={i} 
            position={[x, 0, z]} 
            rotation={[0, -angle, 0]}
            receiveShadow
          >
            <boxGeometry args={[0.1, 14, 2]} />
            <meshStandardMaterial 
              color="#e8e8e8" 
              roughness={0.4}
              metalness={0.6}
            />
          </mesh>
        )
      })}

      {/* Suelo */}
      <mesh position={[0, -7, 0]} rotation={[-Math.PI/2, 0, 0]} receiveShadow>
        <cylinderGeometry args={[3.9, 3.9, 0.2]} />
        <meshStandardMaterial 
          color="#d0d0d0" 
          roughness={0.6}
          metalness={0.4}
        />
      </mesh>

      {/* Techo */}
      <mesh position={[0, 7, 0]} rotation={[Math.PI/2, 0, 0]} receiveShadow>
        <cylinderGeometry args={[3.9, 3.9, 0.2]} />
        <meshStandardMaterial 
          color="#c0c0c0" 
          roughness={0.5}
          metalness={0.5}
        />
      </mesh>

      {/* Cúpula de observación - MÁS PROMINENTE */}
      <group position={[0, 7.5, 0]}>
        <mesh>
          <sphereGeometry args={[2.5, 16, 8, 0, Math.PI * 2, 0, Math.PI/2]} />
          <meshStandardMaterial 
            color="#87ceeb" 
            transparent 
            opacity={0.4}
            roughness={0.1}
            metalness={0.9}
          />
        </mesh>
        
        {/* Ventanas de la cúpula - más grandes y visibles */}
        {Array.from({length: 6}, (_, i) => {
          const angle = (i / 6) * Math.PI * 2
          const x = Math.cos(angle) * 1.8
          const z = Math.sin(angle) * 1.8
          return (
            <mesh 
              key={i} 
              position={[x, 0.8, z]} 
              rotation={[0, -angle, 0]}
            >
              <ringGeometry args={[0.5, 1.0]} />
              <meshStandardMaterial 
                color="#ffffff" 
                metalness={0.8} 
                roughness={0.2}
              />
            </mesh>
          )
        })}

        {/* Ventana central superior - la más importante */}
        <mesh position={[0, 1.5, 0]} rotation={[-Math.PI/2, 0, 0]}>
          <ringGeometry args={[0.8, 1.3]} />
          <meshStandardMaterial 
            color="#ffffff" 
            metalness={0.9} 
            roughness={0.1}
          />
        </mesh>
      </group>

      {/* Solo 2 paneles de control básicos */}
      {[
        { pos: [-2.7, 0, 0], rot: [0, Math.PI/2, 0] },
        { pos: [2.7, 0, 0], rot: [0, -Math.PI/2, 0] }
      ].map((panel, i) => (
        <group key={i} position={panel.pos} rotation={panel.rot}>
          <mesh position={[0, 2, 0]}>
            <boxGeometry args={[0.05, 1.5, 1.5]} />
            <meshStandardMaterial color="#2c2c2c" />
          </mesh>
          
          {/* Algunas luces básicas */}
          {Array.from({length: 3}, (_, j) => (
            <mesh 
              key={j} 
              position={[0.03, 1.5 + (j-1)*0.4, (j%2-0.5)*0.4]}
            >
              <sphereGeometry args={[0.02]} />
              <meshStandardMaterial 
                color={j % 3 === 0 ? "#00ff00" : "#0066ff"}
                emissive={j % 3 === 0 ? "#00ff00" : "#0066ff"}
                emissiveIntensity={0.3}
              />
            </mesh>
          ))}
        </group>
      ))}

      {/* Ventana de observación principal más grande */}
      <mesh position={[0, 1, -7.2]} rotation={[0, 0, 0]}>
        <ringGeometry args={[1.2, 2.0]} />
        <meshStandardMaterial 
          color="#ffffff" 
          metalness={0.8} 
          roughness={0.1}
        />
      </mesh>

      {/* Vista al espacio a través de la ventana */}
      <mesh position={[0, 1, -7.5]}>
        <circleGeometry args={[1.8]} />
        <meshBasicMaterial color="#000011" />
      </mesh>

      {/* Estrellas visibles por la ventana */}
      {Array.from({length: 30}, (_, i) => (
        <mesh 
          key={i}
          position={[
            (Math.random() - 0.5) * 3.2,
            0.6 + (Math.random() - 0.5) * 2.0,
            -7.4
          ]}
        >
          <sphereGeometry args={[0.008]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      ))}

      {/* Tierra visible desde la cúpula */}
      <mesh position={[0, 12, 0]}>
        <sphereGeometry args={[8]} />
        <meshBasicMaterial color="#4169e1" />
      </mesh>

      <mesh position={[2, 12, -2]}>
        <sphereGeometry args={[2]} />
        <meshBasicMaterial color="#228b22" />
      </mesh>

      {/* Algunas luces LED distribuidas - menos cantidad */}
      {Array.from({length: 6}, (_, i) => (
        <pointLight
          key={i}
          position={[
            (Math.random() - 0.5) * 4,
            (Math.random() - 0.5) * 8,
            (Math.random() - 0.5) * 4
          ]}
          intensity={0.2}
          color="#ffffff"
        />
      ))}
    </group>
  )
}