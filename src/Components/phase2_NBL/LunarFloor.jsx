// src/Components/phase2_NBL/LunarFloor.jsx
import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Componente de paisaje lunar para el suelo del NBL
export function LunarFloor() {
  const floorRef = useRef()
  
  // Generar geometría de terreno lunar con cráteres
  const lunarGeometry = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(50, 50, 100, 100)
    const positions = geometry.attributes.position
    
    // Crear cráteres y elevaciones aleatorias
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i)
      const y = positions.getY(i)
      
      let z = 0
      
      // Generar múltiples cráteres
      const craters = [
        { x: 5, y: 5, radius: 4, depth: 1.5 },
        { x: -8, y: -6, radius: 3, depth: 1.2 },
        { x: 10, y: -10, radius: 5, depth: 2 },
        { x: -15, y: 10, radius: 3.5, depth: 1.3 },
        { x: 0, y: -15, radius: 4.5, depth: 1.8 },
        { x: -12, y: 3, radius: 2.5, depth: 0.8 },
        { x: 15, y: 8, radius: 3, depth: 1.1 },
      ]
      
      craters.forEach(crater => {
        const dist = Math.sqrt((x - crater.x) ** 2 + (y - crater.y) ** 2)
        if (dist < crater.radius) {
          const craterEffect = Math.cos((dist / crater.radius) * Math.PI * 0.5)
          z -= craterEffect * crater.depth
          
          // Borde elevado del cráter
          if (dist > crater.radius * 0.7 && dist < crater.radius * 0.95) {
            z += 0.3
          }
        }
      })
      
      // Textura base irregular (regolito lunar)
      z += (Math.sin(x * 0.5) * Math.cos(y * 0.5) * 0.2)
      z += (Math.random() - 0.5) * 0.15
      
      positions.setZ(i, z)
    }
    
    geometry.computeVertexNormals()
    return geometry
  }, [])

  return (
    <group position={[0, -10, 0]}>
      {/* Suelo lunar principal */}
      <mesh 
        ref={floorRef}
        geometry={lunarGeometry}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <meshStandardMaterial 
          color="#6b7280"
          roughness={0.95}
          metalness={0.05}
          flatShading={false}
        />
      </mesh>
      
      {/* Rocas lunares dispersas */}
      <LunarRocks />
      
      {/* Polvo lunar (partículas finas) */}
      <LunarDust />
    </group>
  )
}

// Rocas lunares realistas
function LunarRocks() {
  const rocks = useMemo(() => {
    const rockData = []
    
    // Rocas grandes
    for (let i = 0; i < 15; i++) {
      rockData.push({
        position: [
          (Math.random() - 0.5) * 45,
          0.2 + Math.random() * 0.5,
          (Math.random() - 0.5) * 45
        ],
        scale: [
          0.5 + Math.random() * 1.2,
          0.3 + Math.random() * 0.8,
          0.5 + Math.random() * 1.2
        ],
        rotation: [
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        ]
      })
    }
    
    // Rocas medianas
    for (let i = 0; i < 30; i++) {
      rockData.push({
        position: [
          (Math.random() - 0.5) * 45,
          0.1 + Math.random() * 0.2,
          (Math.random() - 0.5) * 45
        ],
        scale: [
          0.2 + Math.random() * 0.5,
          0.15 + Math.random() * 0.3,
          0.2 + Math.random() * 0.5
        ],
        rotation: [
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        ]
      })
    }
    
    return rockData
  }, [])

  return (
    <group>
      {rocks.map((rock, index) => (
        <mesh
          key={index}
          position={rock.position}
          scale={rock.scale}
          rotation={rock.rotation}
          castShadow
          receiveShadow
        >
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial 
            color={index % 3 === 0 ? "#5a5a5a" : index % 3 === 1 ? "#787878" : "#6b6b6b"}
            roughness={0.9}
            metalness={0.1}
          />
        </mesh>
      ))}
    </group>
  )
}

// Polvo lunar suspendido (efecto visual)
function LunarDust() {
  const dustRef = useRef()
  
  const dustParticles = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    const positions = []
    
    for (let i = 0; i < 200; i++) {
      positions.push(
        (Math.random() - 0.5) * 50,
        Math.random() * 2,
        (Math.random() - 0.5) * 50
      )
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    return geometry
  }, [])
  
  useFrame((state) => {
    if (dustRef.current) {
      dustRef.current.rotation.y = state.clock.getElapsedTime() * 0.01
    }
  })

  return (
    <points ref={dustRef} geometry={dustParticles}>
      <pointsMaterial
        size={0.05}
        color="#9ca3af"
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  )
}