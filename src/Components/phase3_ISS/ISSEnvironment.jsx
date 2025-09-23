// src/Components/phase3_ISS/ISSEnvironment.jsx
import React, { useRef } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three'
import * as THREE from 'three'

export function ISSEnvironment() {
  const earthRef = useRef()
  const cloudsRef = useRef()
  
  // Cargar texturas de la Tierra
  const earthTexture = useLoader(TextureLoader, '/textures/earth_day.jpg', 
    undefined, 
    (error) => console.warn('Textura earth_day.jpg no encontrada, usando fallback', error)
  )
  const cloudsTexture = useLoader(TextureLoader, '/textures/earth_clouds.jpg',
    undefined,
    (error) => console.warn('Textura earth_clouds.jpg no encontrada, usando fallback', error)
  )
  const normalTexture = useLoader(TextureLoader, '/textures/earth_normal.jpg',
    undefined,
    (error) => console.warn('Textura earth_normal.jpg no encontrada, usando fallback', error)
  )

  // Animación de rotación de la Tierra
  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.002
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += 0.003
    }
  })

  return (
    <group>
      {/* Módulo principal - Cilindro principal de la ISS */}
      <mesh position={[0, 0, 0]} receiveShadow castShadow>
        <meshStandardMaterial 
          color="#f0f0f0" 
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>

      {/* Paredes interiores con paneles */}
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

      {/* SUELO CORREGIDO */}
      <group position={[0, -7.2, 0]}>
        <mesh>
          <cylinderGeometry args={[3.9, 3.9, 0.3]} />
          <meshStandardMaterial 
            color="#c8c8c8" 
            roughness={0.6}
            metalness={0.4}
          />
        </mesh>
        
        {Array.from({length: 6}, (_, i) => {
          const angle = (i / 6) * Math.PI * 2
          const x = Math.cos(angle) * 1.5
          const z = Math.sin(angle) * 1.5
          return (
            <mesh key={i} position={[x, 0.16, z]} rotation={[-Math.PI/2, 0, 0]}>
              <cylinderGeometry args={[0.6, 0.6, 0.02, 6]} />
              <meshStandardMaterial 
                color="#d8d8d8" 
                roughness={0.4}
                metalness={0.5}
              />
            </mesh>
          )
        })}
        
        <mesh position={[0, 0.16, 0]} rotation={[-Math.PI/2, 0, 0]}>
          <cylinderGeometry args={[0.8, 0.8, 0.02, 8]} />
          <meshStandardMaterial 
            color="#e0e0e0" 
            roughness={0.3}
            metalness={0.6}
          />
        </mesh>
        
        {Array.from({length: 4}, (_, i) => {
          const angle = (i / 4) * Math.PI * 2
          const x = Math.cos(angle) * 2.5
          const z = Math.sin(angle) * 2.5
          return (
            <mesh key={i} position={[x, 0.18, z]} rotation={[0, angle, 0]}>
              <boxGeometry args={[0.8, 0.05, 0.1]} />
              <meshStandardMaterial 
                color="#b8b8b8" 
                roughness={0.5}
                metalness={0.7}
              />
            </mesh>
          )
        })}
      </group>

      {/* TECHO CON APERTURA PARA LA CÚPULA - SIN SUPERPOSICIÓN */}
      <group position={[0, 7, 0]}>
        {/* Anillo del techo con apertura central */}
        <mesh rotation={[Math.PI/2, 0, 0]}>
          <ringGeometry args={[2.5, 3.9]} />
          <meshStandardMaterial 
            color="#c0c0c0" 
            roughness={0.5}
            metalness={0.5}
          />
        </mesh>
        
        {/* Vigas estructurales del techo */}
        {Array.from({length: 8}, (_, i) => {
          const angle = (i / 8) * Math.PI * 2
          const innerX = Math.cos(angle) * 2.5
          const innerZ = Math.sin(angle) * 2.5
          const outerX = Math.cos(angle) * 3.9
          const outerZ = Math.sin(angle) * 3.9
          
          return (
            <mesh 
              key={i} 
              position={[(innerX + outerX) / 2, 0.05, (innerZ + outerZ) / 2]} 
              rotation={[0, angle, 0]}
            >
              <boxGeometry args={[1.4, 0.1, 0.15]} />
              <meshStandardMaterial 
                color="#a8a8a8" 
                roughness={0.4}
                metalness={0.7}
              />
            </mesh>
          )
        })}
        
        {/* Marco circular interno para la apertura */}
        <mesh position={[0, 0.08, 0]} rotation={[Math.PI/2, 0, 0]}>
          <torusGeometry args={[2.5, 0.1]} />
          <meshStandardMaterial 
            color="#ffffff" 
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>
      </group>

    
      {/* Paneles de control */}
      {[
        { pos: [-2.7, 0, 0], rot: [0, Math.PI/2, 0] },
        { pos: [2.7, 0, 0], rot: [0, -Math.PI/2, 0] }
      ].map((panel, i) => (
        <group key={i} position={panel.pos} rotation={panel.rot}>
          <mesh position={[0, 2, 0]}>
            <boxGeometry args={[0.05, 1.5, 1.5]} />
            <meshStandardMaterial color="#2c2c2c" />
          </mesh>
          
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

      {/* Ventana de observación principal lateral */}
      <mesh position={[0, 1, -7.2]} rotation={[0, 0, 0]}>
        <ringGeometry args={[1.2, 2.0]} />
        <meshStandardMaterial 
          color="#ffffff" 
          metalness={0.8} 
          roughness={0.1}
        />
      </mesh>

      {/* Vista al espacio lateral */}
      <mesh position={[0, 1, -7.5]}>
        <circleGeometry args={[1.8]} />
        <meshBasicMaterial color="#000011" />
      </mesh>

      {/* Estrellas en ventana lateral */}
      {Array.from({length: 30}, (_, i) => (
        <mesh 
          key={i}
          position={[
            (Math.random() - 0.5) * 3.2,
            0.6 + (Math.random() - 0.5) * 2.0,
            -7.4
          ]}
        >
          <sphereGeometry args={[Math.random() * 0.01 + 0.005]} />
          <meshBasicMaterial 
            color="#ffffff"
            transparent
            opacity={Math.random() * 0.8 + 0.2}
          />
        </mesh>
      ))}

      {/* TIERRA PERFECTAMENTE VISIBLE - Posicionada para verse desde la cúpula */}
      <group position={[0, 22, -5]} rotation={[0.3, 0, 0.1]}>
        <mesh ref={earthRef}>
          <sphereGeometry args={[6, 64, 32]} />
          <meshStandardMaterial 
            map={earthTexture}
            normalMap={normalTexture}
            color={earthTexture ? "#ffffff" : "#4169e1"}
            roughness={0.8}
            metalness={0.1}
          />
        </mesh>

        <mesh ref={cloudsRef}>
          <sphereGeometry args={[6.05, 64, 32]} />
          <meshStandardMaterial 
            map={cloudsTexture}
            transparent
            opacity={cloudsTexture ? 0.2 : 0.6}
            color={cloudsTexture ? "#ffffff" : "#ffffff"}
            alphaTest={0.1}
          />
        </mesh>

        <mesh>
          <sphereGeometry args={[6.15, 32, 16]} />
          <meshStandardMaterial 
            color="#87ceeb"
            transparent
            opacity={0.1}
            side={THREE.BackSide}
          />
        </mesh>

        {!earthTexture && (
          <>
            <mesh position={[-1.5, 1, 5.2]}>
              <sphereGeometry args={[1.2]} />
              <meshStandardMaterial color="#156515ff" />
            </mesh>
            
            <mesh position={[0.6, 2, 5.5]}>
              <sphereGeometry args={[1]} />
              <meshStandardMaterial color="#8fbc8f" />
            </mesh>
            
            <mesh position={[1.8, 0.3, 5.3]}>
              <sphereGeometry args={[1.4]} />
              <meshStandardMaterial color="#1e921eff" />
            </mesh>
          </>
        )}
      </group>

      {/* Iluminación optimizada */}
      <ambientLight intensity={0.3} color="#4a90e2" />
      
      <directionalLight
        position={[15, 20, 8]}
        intensity={1.8}
        color="#fff8dc"
        castShadow
      />

      {/* Luz adicional para iluminar la Tierra */}
      <pointLight 
        position={[0, 18, 0]} 
        intensity={0.8} 
        color="#ffffff" 
        distance={25}
      />

      {Array.from({length: 3}, (_, i) => (
        <pointLight
          key={i}
          position={[
            (Math.random() - 0.5) * 6,
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 6
          ]}
          intensity={0.2}
          color="#ffffff"
        />
      ))}
    </group>
  )
}