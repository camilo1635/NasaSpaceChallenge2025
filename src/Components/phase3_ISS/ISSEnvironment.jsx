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
        <cylinderGeometry args={[4, 4, 15]} />
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

      {/* SUELO CORREGIDO - Sin disco extraño */}
      <group position={[0, -7.2, 0]}>
        {/* Base estructural del suelo */}
        <mesh>
          <cylinderGeometry args={[3.9, 3.9, 0.3]} />
          <meshStandardMaterial 
            color="#c8c8c8" 
            roughness={0.6}
            metalness={0.4}
          />
        </mesh>
        
        {/* Paneles del suelo en grid hexagonal */}
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
        
        {/* Panel central del suelo */}
        <mesh position={[0, 0.16, 0]} rotation={[-Math.PI/2, 0, 0]}>
          <cylinderGeometry args={[0.8, 0.8, 0.02, 8]} />
          <meshStandardMaterial 
            color="#e0e0e0" 
            roughness={0.3}
            metalness={0.6}
          />
        </mesh>
        
        {/* Detalles estructurales del suelo */}
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

      {/* TECHO - Simplificado porque tenemos la cúpula */}
      <mesh position={[0, 7, 0]} rotation={[Math.PI/2, 0, 0]} receiveShadow>
        <cylinderGeometry args={[3.9, 3.9, 0.15]} />
        <meshStandardMaterial 
          color="#c0c0c0" 
          roughness={0.5}
          metalness={0.5}
        />
      </mesh>

      {/* CÚPULA MEJORADA - MÁS PEQUEÑA Y PROPORCIONADA */}
      <group position={[0, 7.8, 0]}>
        {/* Base metálica de la cúpula */}
        <mesh position={[0, -0.2, 0]}>
          <cylinderGeometry args={[2.2, 2.4, 0.3]} />
          <meshStandardMaterial 
            color="#e8e8e8"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Domo principal más pequeño */}
        <mesh>
          <sphereGeometry args={[2.2, 32, 16, 0, Math.PI * 2, 0, Math.PI/2]} />
          <meshStandardMaterial 
            color="#ffffff" 
            transparent 
            opacity={0.12}
            roughness={0.05}
            metalness={0.95}
            envMapIntensity={1.0}
          />
        </mesh>
        
        {/* Marco estructural ajustado */}
        {Array.from({length: 8}, (_, i) => {
          const angle = (i / 8) * Math.PI * 2
          return (
            <mesh key={i} position={[0, 0.9, 0]} rotation={[0, angle, 0]}>
              <boxGeometry args={[0.06, 1.8, 0.08]} />
              <meshStandardMaterial 
                color="#d0d0d0" 
                metalness={0.9} 
                roughness={0.1}
              />
            </mesh>
          )
        })}

        {/* Ventanas hexagonales más pequeñas */}
        {Array.from({length: 6}, (_, i) => {
          const angle = (i / 6) * Math.PI * 2
          const x = Math.cos(angle) * 1.6
          const z = Math.sin(angle) * 1.6
          return (
            <group key={i} position={[x, 0.7, z]} rotation={[0, -angle, 0]}>
              <mesh>
                <cylinderGeometry args={[0.55, 0.55, 0.08, 6]} />
                <meshStandardMaterial 
                  color="#ffffff" 
                  metalness={0.9} 
                  roughness={0.1}
                />
              </mesh>
              
              <mesh position={[0, 0, 0.05]}>
                <cylinderGeometry args={[0.5, 0.5, 0.015, 6]} />
                <meshStandardMaterial 
                  color="#87ceeb"
                  transparent
                  opacity={0.3}
                  metalness={0.1}
                  roughness={0.0}
                  envMapIntensity={2.0}
                />
              </mesh>
            </group>
          )
        })}

        {/* Ventana central superior ajustada */}
        <group position={[0, 1.6, 0]}>
          <mesh rotation={[-Math.PI/2, 0, 0]}>
            <cylinderGeometry args={[0.9, 0.9, 0.12, 8]} />
            <meshStandardMaterial 
              color="#ffffff" 
              metalness={0.95} 
              roughness={0.05}
            />
          </mesh>
          
          <mesh position={[0, -0.03, 0]} rotation={[-Math.PI/2, 0, 0]}>
            <cylinderGeometry args={[0.8, 0.8, 0.02, 8]} />
            <meshStandardMaterial 
              color="#e6f3ff"
              transparent
              opacity={0.2}
              metalness={0.05}
              roughness={0.0}
              envMapIntensity={3.0}
            />
          </mesh>
        </group>
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

      {/* Ventana de observación principal */}
      <mesh position={[0, 1, -7.2]} rotation={[0, 0, 0]}>
        <ringGeometry args={[1.2, 2.0]} />
        <meshStandardMaterial 
          color="#ffffff" 
          metalness={0.8} 
          roughness={0.1}
        />
      </mesh>

      {/* Vista al espacio */}
      <mesh position={[0, 1, -7.5]}>
        <circleGeometry args={[1.8]} />
        <meshBasicMaterial color="#000011" />
      </mesh>

      {/* Estrellas */}
      {Array.from({length: 50}, (_, i) => (
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

      {/* TIERRA CORREGIDA - Dimensiones ajustadas */}
      <group position={[-3, 25, 2]} rotation={[0.2, 0, 0.1]}>
        <mesh ref={earthRef}>
          <sphereGeometry args={[8, 64, 32]} />
          <meshStandardMaterial 
            map={earthTexture}
            normalMap={normalTexture}
            color={earthTexture ? "#ffffff" : "#4169e1"}
            roughness={0.8}
            metalness={0.1}
          />
        </mesh>

        <mesh ref={cloudsRef}>
          <sphereGeometry args={[8.1, 64, 32]} />
          <meshStandardMaterial 
            map={cloudsTexture}
            transparent
            opacity={cloudsTexture ? 0.4 : 0.2}
            color={cloudsTexture ? "#ffffff" : "#ffffff"}
            alphaTest={0.1}
          />
        </mesh>

        <mesh>
          <sphereGeometry args={[8.3, 32, 16]} />
          <meshStandardMaterial 
            color="#87ceeb"
            transparent
            opacity={0.15}
            side={THREE.BackSide}
          />
        </mesh>

        {!earthTexture && (
          <>
            <mesh position={[-2, 1.5, 7]}>
              <sphereGeometry args={[1.8]} />
              <meshStandardMaterial color="#228b22" />
            </mesh>
            
            <mesh position={[0.8, 3, 7.5]}>
              <sphereGeometry args={[1.5]} />
              <meshStandardMaterial color="#8fbc8f" />
            </mesh>
            
            <mesh position={[2.5, 0.5, 7.2]}>
              <sphereGeometry args={[2]} />
              <meshStandardMaterial color="#32cd32" />
            </mesh>
          </>
        )}
      </group>

      {/* Iluminación */}
      <ambientLight intensity={0.2} color="#4a90e2" />
      
      <directionalLight
        position={[20, 10, 15]}
        intensity={2.0}
        color="#fff8dc"
        castShadow
      />

      {Array.from({length: 4}, (_, i) => (
        <pointLight
          key={i}
          position={[
            (Math.random() - 0.5) * 4,
            (Math.random() - 0.5) * 8,
            (Math.random() - 0.5) * 4
          ]}
          intensity={0.3}
          color="#ffffff"
        />
      ))}
    </group>
  )
}