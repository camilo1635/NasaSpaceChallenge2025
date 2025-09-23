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
    const offset = Math.sin(time) * 0.03
    galleryRef.current.position.y = cupolaPosition[1] + offset

    // Detectar proximidad a la cúpula (cuando el jugador sube)
    const distance = camera.position.distanceTo(new THREE.Vector3(...cupolaPosition))
    setIsNearCupola(distance < 6)
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
      {/* CÚPULA PROFESIONAL MEJORADA */}
      <group ref={galleryRef} position={cupolaPosition}>
        
        {/* Base estructural con detalles */}
        <mesh position={[0, -0.3, 0]}>
          <cylinderGeometry args={[2.8, 3.0, 0.4]} />
          <meshStandardMaterial 
            color="#e8e8e8"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Anillos de refuerzo */}
        {Array.from({length: 3}, (_, i) => (
          <mesh key={i} position={[0, -0.1 + i * 0.1, 0]}>
            <torusGeometry args={[2.6 + i * 0.1, 0.02]} />
            <meshStandardMaterial 
              color="#cccccc"
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
        ))}

        {/* Domo principal con mejor geometría */}
        <mesh position={[0, 0.5, 0]}>
          <sphereGeometry args={[2.8, 32, 16, 0, Math.PI * 2, 0, Math.PI/2]} />
          <meshStandardMaterial 
            color="#ffffff" 
            transparent 
            opacity={0.12}
            roughness={0.05}
            metalness={0.95}
            envMapIntensity={1.5}
          />
        </mesh>

        {/* Marco estructural profesional */}
        {Array.from({length: 8}, (_, i) => {
          const angle = (i / 8) * Math.PI * 2
          return (
            <mesh key={i} position={[0, 1.2, 0]} rotation={[0, angle, 0]}>
              <boxGeometry args={[0.08, 2.4, 0.12]} />
              <meshStandardMaterial 
                color="#d0d0d0" 
                metalness={0.9} 
                roughness={0.1}
              />
            </mesh>
          )
        })}

        {/* Ventanas hexagonales profesionales */}
        {Array.from({length: 6}, (_, i) => {
          const angle = (i / 6) * Math.PI * 2
          const x = Math.cos(angle) * 2.0
          const z = Math.sin(angle) * 2.0
          return (
            <group key={i} position={[x, 1.0, z]} rotation={[0, -angle, 0]}>
              {/* Marco hexagonal principal */}
              <mesh>
                <cylinderGeometry args={[0.75, 0.75, 0.12, 6]} />
                <meshStandardMaterial 
                  color="#ffffff" 
                  metalness={0.9} 
                  roughness={0.1}
                />
              </mesh>
              
              {/* Marco interno */}
              <mesh position={[0, 0, 0.02]}>
                <cylinderGeometry args={[0.65, 0.65, 0.08, 6]} />
                <meshStandardMaterial 
                  color="#f0f0f0" 
                  metalness={0.8} 
                  roughness={0.2}
                />
              </mesh>
              
              {/* Cristal con efectos mejorados */}
              <mesh position={[0, 0, 0.07]}>
                <cylinderGeometry args={[0.62, 0.62, 0.02, 6]} />
                <meshStandardMaterial 
                  color={isNearCupola ? "#00ffff" : "#87ceeb"}
                  transparent
                  opacity={0.25}
                  metalness={0.05}
                  roughness={0.0}
                  emissive={isNearCupola ? "#001122" : "#000000"}
                  emissiveIntensity={0.1}
                />
              </mesh>

              {/* Reflejos dinámicos */}
              <mesh position={[0, 0, 0.08]}>
                <cylinderGeometry args={[0.4, 0.4, 0.01, 6]} />
                <meshStandardMaterial 
                  color="#ffffff"
                  transparent
                  opacity={isNearCupola ? 0.3 : 0.1}
                  metalness={0.0}
                  roughness={0.0}
                />
              </mesh>
            </group>
          )
        })}

        {/* VENTANA CENTRAL SUPERIOR MEJORADA */}
        <group position={[0, 2.2, 0]}>
          {/* Marco principal octagonal */}
          <mesh rotation={[-Math.PI/2, 0, 0]}>
            <cylinderGeometry args={[1.3, 1.3, 0.18, 8]} />
            <meshStandardMaterial 
              color="#ffffff" 
              metalness={0.95} 
              roughness={0.05}
            />
          </mesh>

          {/* Marco interno decorativo */}
          <mesh position={[0, -0.02, 0]} rotation={[-Math.PI/2, 0, 0]}>
            <cylinderGeometry args={[1.15, 1.15, 0.14, 8]} />
            <meshStandardMaterial 
              color="#f8f8f8" 
              metalness={0.9} 
              roughness={0.1}
            />
          </mesh>
          
          {/* Cristal central premium con efectos */}
          <mesh position={[0, -0.05, 0]} rotation={[-Math.PI/2, 0, 0]}>
            <cylinderGeometry args={[1.1, 1.1, 0.03, 8]} />
            <meshStandardMaterial 
              color={isNearCupola ? "#00ddff" : "#e6f3ff"}
              transparent
              opacity={0.2}
              metalness={0.05}
              roughness={0.0}
              emissive={isNearCupola ? "#002244" : "#000011"}
              emissiveIntensity={isNearCupola ? 0.3 : 0.05}
            />
          </mesh>

          {/* Elemento central luminoso */}
          <mesh position={[0, -0.06, 0]} rotation={[-Math.PI/2, 0, 0]}>
            <cylinderGeometry args={[0.6, 0.6, 0.01, 8]} />
            <meshStandardMaterial 
              color="#ffffff"
              transparent
              opacity={isNearCupola ? 0.4 : 0.15}
              emissive="#ffffff"
              emissiveIntensity={isNearCupola ? 0.2 : 0.05}
            />
          </mesh>
        </group>

        {/* INDICADOR VISUAL DE GALERÍA MEJORADO */}
        {isNearCupola && (
          <group position={[0, 1.2, 0]}>
            {/* Anillo pulsante principal */}
            <mesh>
              <torusGeometry args={[1.8, 0.08]} />
              <meshStandardMaterial 
                color="#00ffff"
                emissive="#00ffff"
                emissiveIntensity={0.6}
                transparent
                opacity={0.9}
              />
            </mesh>

            {/* Anillo interno */}
            <mesh>
              <torusGeometry args={[1.5, 0.04]} />
              <meshStandardMaterial 
                color="#ffffff"
                emissive="#ffffff"
                emissiveIntensity={0.4}
                transparent
                opacity={0.7}
              />
            </mesh>
            
            {/* Partículas flotantes */}
            {Array.from({length: 12}, (_, i) => {
              const angle = (i / 12) * Math.PI * 2
              const x = Math.cos(angle) * 2.0
              const z = Math.sin(angle) * 2.0
              return (
                <mesh key={i} position={[x, Math.sin(Date.now() * 0.003 + i) * 0.1, z]}>
                  <sphereGeometry args={[0.02]} />
                  <meshStandardMaterial 
                    color="#00ffff"
                    emissive="#00ffff"
                    emissiveIntensity={0.8}
                    transparent
                    opacity={0.8}
                  />
                </mesh>
              )
            })}
            
            {/* Texto flotante 3D mejorado */}
            <Html center>
              <div style={{
                color: '#00ffff',
                fontSize: '20px',
                fontWeight: 'bold',
                textAlign: 'center',
                textShadow: '0 0 10px #00ffff, 2px 2px 4px rgba(0,0,0,0.8)',
                animation: 'pulseGlow 1.5s infinite',
                background: 'rgba(0,20,40,0.9)',
                padding: '15px 20px',
                borderRadius: '15px',
                border: '3px solid #00ffff',
                boxShadow: '0 0 20px rgba(0,255,255,0.4), inset 0 0 20px rgba(0,255,255,0.1)'
              }}>
                🖼️ GALERÍA DE IMÁGENES<br/>
                <span style={{fontSize: '16px', color: '#ffffff'}}>
                  Presiona G para explorar
                </span>
                <div style={{fontSize: '12px', marginTop: '5px', opacity: 0.8}}>
                  Vista panorámica de la Tierra
                </div>
              </div>
            </Html>
          </group>
        )}

        {/* LUCES DE NAVEGACIÓN MEJORADAS */}
        {Array.from({length: 6}, (_, i) => {
          const angle = (i / 6) * Math.PI * 2
          const x = Math.cos(angle) * 1.4
          const z = Math.sin(angle) * 1.4
          return (
            <mesh key={i} position={[x, 0.4, z]}>
              <sphereGeometry args={[0.05]} />
              <meshStandardMaterial 
                color={isNearCupola ? "#00ff88" : "#ffffff"}
                emissive={isNearCupola ? "#00ff88" : "#ffffff"}
                emissiveIntensity={isNearCupola ? 0.9 : 0.4}
              />
            </mesh>
          )
        })}

        {/* Detalles adicionales de conectores */}
        {Array.from({length: 4}, (_, i) => {
          const angle = (i / 4) * Math.PI * 2
          const x = Math.cos(angle) * 2.5
          const z = Math.sin(angle) * 2.5
          return (
            <mesh key={i} position={[x, 0.2, z]} rotation={[0, -angle, 0]}>
              <boxGeometry args={[0.1, 0.3, 0.05]} />
              <meshStandardMaterial 
                color="#b0b0b0"
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>
          )
        })}
      </group>

      {/* INFORMACIÓN FLOTANTE MEJORADA */}
      {isNearCupola && (
        <Html position={[cupolaPosition[0], cupolaPosition[1] + 3.5, cupolaPosition[2]]} center>
          <div style={{
            background: 'linear-gradient(135deg, rgba(0,30,60,0.98) 0%, rgba(0,50,100,0.95) 100%)',
            color: '#fff',
            padding: '25px 30px',
            borderRadius: '20px',
            fontSize: '16px',
            textAlign: 'center',
            border: '3px solid #00ffff',
            animation: 'pulseGlow 2s infinite',
            maxWidth: '400px',
            boxShadow: '0 15px 35px rgba(0,255,255,0.3), inset 0 2px 10px rgba(255,255,255,0.1)'
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: '15px', color: '#00ffff', fontSize: '22px' }}>
              🌍 CÚPULA DE OBSERVACIÓN ISS
            </div>
            <div style={{ fontSize: '15px', opacity: 0.95, marginBottom: '15px', lineHeight: '1.4' }}>
              El mirador más espectacular de la humanidad.<br/>
              Vista privilegiada de nuestro planeta Tierra.
            </div>
            <div style={{ fontSize: '18px', color: '#ffff00', fontWeight: 'bold', marginBottom: '10px' }}>
              Presiona <span style={{color: '#00ffff', fontSize: '20px', textShadow: '0 0 5px #00ffff'}}>G</span> para abrir galería
            </div>
            <div style={{ fontSize: '13px', marginTop: '10px', opacity: 0.8, color: '#87ceeb' }}>
              6 imágenes épicas capturadas desde 408 km de altura
            </div>
          </div>
          <style>{`
            @keyframes pulseGlow {
              0%, 100% { 
                transform: scale(1); 
                box-shadow: 0 15px 35px rgba(0,255,255,0.3), inset 0 2px 10px rgba(255,255,255,0.1);
              }
              50% { 
                transform: scale(1.03); 
                box-shadow: 0 20px 45px rgba(0,255,255,0.5), inset 0 2px 15px rgba(255,255,255,0.2);
              }
            }
          `}</style>
        </Html>
      )}

      {/* FLECHA INDICADORA MEJORADA */}
      {!isNearCupola && camera.position.y < 6 && (
        <Html position={[0, 6.5, 0]} center>
          <div style={{
            color: '#00ffff',
            fontSize: '28px',
            textAlign: 'center',
            animation: 'bounceGlow 2s infinite',
            textShadow: '0 0 10px #00ffff, 2px 2px 4px rgba(0,0,0,0.8)',
            background: 'rgba(0,20,40,0.8)',
            padding: '10px 15px',
            borderRadius: '10px',
            border: '2px solid #00ffff'
          }}>
            ⬆️<br/>
            <span style={{fontSize: '16px', color: '#ffffff'}}>
              Sube a la cúpula<br/>para acceder a la galería
            </span>
          </div>
          <style>{`
            @keyframes bounceGlow {
              0%, 20%, 50%, 80%, 100% { 
                transform: translateY(0);
                text-shadow: 0 0 10px #00ffff;
              }
              40% { 
                transform: translateY(-15px);
                text-shadow: 0 0 20px #00ffff;
              }
              60% { 
                transform: translateY(-8px);
                text-shadow: 0 0 15px #00ffff;
              }
            }
          `}</style>
        </Html>
      )}
    </group>
  )
}