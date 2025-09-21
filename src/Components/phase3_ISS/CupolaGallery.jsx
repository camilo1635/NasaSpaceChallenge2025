// src/Components/phase3_ISS/CupolaGallery.jsx
import React, { useRef, useState, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

export function CupolaGallery({ onImageGalleryRequest }) {
  const galleryRef = useRef()
  const { camera } = useThree()
  const [isNearCupola, setIsNearCupola] = useState(false)

  // Posición de la cúpula (parte SUPERIOR de la ISS)
  const cupolaPosition = [0, 8.5, 0]

  useFrame(() => {
    if (!galleryRef.current) return
    
    // Animación sutil de flotación
    const time = Date.now() * 0.001
    const offset = Math.sin(time) * 0.05
    galleryRef.current.position.y = cupolaPosition[1] + offset

    // Detectar proximidad a la cúpula (cuando el jugador sube)
    const distance = camera.position.distanceTo(new THREE.Vector3(...cupolaPosition))
    setIsNearCupola(distance < 5)
  })

  // Manejo de tecla G para abrir galería
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'KeyG' && isNearCupola) {
        e.preventDefault()
        onImageGalleryRequest()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isNearCupola, onImageGalleryRequest])

  return (
    <group>
      {/* CÚPULA MEJORADA CON VENTANAS MÁS VISIBLES */}
      <group ref={galleryRef} position={cupolaPosition}>
        
        {/* Base de la cúpula con mejor diseño */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[2.2, 2.5, 0.3]} />
          <meshStandardMaterial 
            color="#e0e0e0"
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>

        {/* Domo principal de la cúpula */}
        <mesh position={[0, 0.5, 0]}>
          <sphereGeometry args={[2.2, 16, 8, 0, Math.PI * 2, 0, Math.PI/2]} />
          <meshStandardMaterial 
            color="#87ceeb" 
            transparent 
            opacity={0.4}
            roughness={0.1}
            metalness={0.9}
          />
        </mesh>

        {/* VENTANAS DE LA CÚPULA - MÁS GRANDES Y VISIBLES */}
        {Array.from({length: 6}, (_, i) => {
          const angle = (i / 6) * Math.PI * 2
          const x = Math.cos(angle) * 1.8
          const z = Math.sin(angle) * 1.8
          return (
            <group key={i} position={[x, 0.8, z]} rotation={[0, -angle, 0]}>
              {/* Marco de la ventana */}
              <mesh>
                <ringGeometry args={[0.6, 0.8]} />
                <meshStandardMaterial 
                  color="#ffffff" 
                  metalness={0.8} 
                  roughness={0.2}
                />
              </mesh>
              
              {/* Cristal de la ventana con efecto */}
              <mesh position={[0, 0, 0.05]}>
                <circleGeometry args={[0.6]} />
                <meshStandardMaterial 
                  color={isNearCupola ? "#00ffff" : "#87ceeb"}
                  transparent
                  opacity={0.3}
                  emissive={isNearCupola ? "#001133" : "#000000"}
                  emissiveIntensity={0.2}
                />
              </mesh>
            </group>
          )
        })}

        {/* VENTANA CENTRAL SUPERIOR - LA MÁS IMPORTANTE */}
        <group position={[0, 1.8, 0]}>
          {/* Marco principal */}
          <mesh rotation={[-Math.PI/2, 0, 0]}>
            <ringGeometry args={[0.8, 1.2]} />
            <meshStandardMaterial 
              color="#ffffff" 
              metalness={0.9} 
              roughness={0.1}
            />
          </mesh>
          
          {/* Cristal central con indicador especial */}
          <mesh position={[0, 0, 0]} rotation={[-Math.PI/2, 0, 0]}>
            <circleGeometry args={[0.8]} />
            <meshStandardMaterial 
              color={isNearCupola ? "#00ffff" : "#4169e1"}
              transparent
              opacity={0.4}
              emissive={isNearCupola ? "#003366" : "#000011"}
              emissiveIntensity={isNearCupola ? 0.4 : 0.1}
            />
          </mesh>
        </group>

        {/* INDICADOR VISUAL DE GALERÍA - MUY VISIBLE */}
        {isNearCupola && (
          <group position={[0, 1, 0]}>
            {/* Anillo pulsante */}
            <mesh>
              <torusGeometry args={[1.5, 0.1]} />
              <meshStandardMaterial 
                color="#00ffff"
                emissive="#00ffff"
                emissiveIntensity={0.5}
                transparent
                opacity={0.8}
              />
            </mesh>
            
            {/* Texto flotante 3D */}
            <Html center>
              <div style={{
                color: '#00ffff',
                fontSize: '18px',
                fontWeight: 'bold',
                textAlign: 'center',
                textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                animation: 'pulse 1.5s infinite',
                background: 'rgba(0,0,0,0.7)',
                padding: '10px 15px',
                borderRadius: '10px',
                border: '2px solid #00ffff'
              }}>
                🖼️ GALERÍA DE IMÁGENES<br/>
                <span style={{fontSize: '14px', color: '#ffffff'}}>
                  Presiona G para ver
                </span>
              </div>
            </Html>
          </group>
        )}

        {/* LUCES DE NAVEGACIÓN EN LA CÚPULA */}
        {Array.from({length: 4}, (_, i) => {
          const angle = (i / 4) * Math.PI * 2
          const x = Math.cos(angle) * 1.2
          const z = Math.sin(angle) * 1.2
          return (
            <mesh key={i} position={[x, 0.3, z]}>
              <sphereGeometry args={[0.04]} />
              <meshStandardMaterial 
                color={isNearCupola ? "#00ff00" : "#ffffff"}
                emissive={isNearCupola ? "#00ff00" : "#ffffff"}
                emissiveIntensity={isNearCupola ? 0.8 : 0.3}
              />
            </mesh>
          )
        })}
      </group>

      {/* INFORMACIÓN FLOTANTE MÁS PROMINENTE */}
      {isNearCupola && (
        <Html position={[cupolaPosition[0], cupolaPosition[1] + 3, cupolaPosition[2]]} center>
          <div style={{
            background: 'rgba(0,50,100,0.95)',
            color: '#fff',
            padding: '20px 25px',
            borderRadius: '15px',
            fontSize: '16px',
            textAlign: 'center',
            border: '3px solid #00ffff',
            animation: 'pulseGlow 2s infinite',
            maxWidth: '350px',
            boxShadow: '0 10px 25px rgba(0,255,255,0.3)'
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: '12px', color: '#00ffff', fontSize: '20px' }}>
              🌍 CÚPULA DE OBSERVACIÓN
            </div>
            <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '12px' }}>
              Vista privilegiada de la Tierra y fenómenos espaciales
            </div>
            <div style={{ fontSize: '16px', color: '#ffff00', fontWeight: 'bold' }}>
              Presiona <span style={{color: '#00ffff', fontSize: '18px'}}>G</span> para abrir galería
            </div>
            <div style={{ fontSize: '12px', marginTop: '8px', opacity: 0.7 }}>
              6 imágenes espectaculares desde la ISS
            </div>
          </div>
          <style>{`
            @keyframes pulseGlow {
              0%, 100% { 
                transform: scale(1); 
                box-shadow: 0 10px 25px rgba(0,255,255,0.3);
              }
              50% { 
                transform: scale(1.05); 
                box-shadow: 0 15px 35px rgba(0,255,255,0.6);
              }
            }
          `}</style>
        </Html>
      )}

      {/* FLECHA INDICADORA DESDE ABAJO */}
      {!isNearCupola && camera.position.y < 6 && (
        <Html position={[0, 6, 0]} center>
          <div style={{
            color: '#00ffff',
            fontSize: '24px',
            textAlign: 'center',
            animation: 'bounce 2s infinite',
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
          }}>
            ⬆️<br/>
            <span style={{fontSize: '14px', color: '#ffffff'}}>
              Sube a la cúpula<br/>para ver la galería
            </span>
          </div>
          <style>{`
            @keyframes bounce {
              0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
              40% { transform: translateY(-10px); }
              60% { transform: translateY(-5px); }
            }
          `}</style>
        </Html>
      )}
    </group>
  )
}