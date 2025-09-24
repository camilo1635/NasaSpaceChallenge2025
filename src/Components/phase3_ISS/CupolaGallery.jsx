// src/Components/phase3_ISS/CupolaGallery.jsx
import React, { useRef, useState, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

export function CupolaGallery({ onImageGalleryRequest, isGalleryOpen = false }) {
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

  // Manejo de tecla G para abrir galería - SOLO cuando NO esté abierta
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'KeyG' && isNearCupola && !isGalleryOpen) {
        e.preventDefault()
        onImageGalleryRequest()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isNearCupola, onImageGalleryRequest, isGalleryOpen])

  // DEBUG: Console log para verificar estados
  console.log('CupolaGallery - isNearCupola:', isNearCupola, 'isGalleryOpen:', isGalleryOpen)

  return (
    <group>
      {/* CÚPULA PROFESIONAL MEJORADA */}
      <group ref={galleryRef} position={cupolaPosition}>
        
        {/* INDICADOR VISUAL SOLO CUANDO ESTÁ CERCA Y LA GALERÍA NO ESTÁ ABIERTA */}
        {(isNearCupola && !isGalleryOpen) && (
          <group position={[0, 1.2, 0]}>
            
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
            
            {/* Texto flotante 3D mejorado CON Z-INDEX BAJO */}
            <Html position= {[0,-2,0]} center style={{ pointerEvents: 'none' }} zIndexRange={[1, 1]}>
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
                boxShadow: '0 0 20px rgba(0,255,255,0.4), inset 0 0 20px rgba(0,255,255,0.1)',
                position: 'relative',
                zIndex: 1
              }}>
                🖼️ GALERÍA DE IMÁGENES<br/>
                <span style={{fontSize: '16px', color: '#ffffff'}}>
                  Press G to explore
                </span>
                <div style={{fontSize: '12px', marginTop: '5px', opacity: 0.8}}>
                  Panoramic view of Earth
                </div>
              </div>
            </Html>
          </group>
        )}
      </group>

      {/* FLECHA INDICADORA MEJORADA - Solo cuando NO está cerca y NO está abierta la galería */}
      {!isNearCupola && !isGalleryOpen && camera.position.y < 6 && (
        <Html position={[4, 6.5, 0]} center>
          <div style={{
      width: '300px',
      height: '300px',           // cuadrado
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#00ffff',
      fontSize: '18px',
      textAlign: 'center',
      animation: 'bounceGlow 2s infinite',
      textShadow: '0 0 10px #00ffff, 2px 2px 4px rgba(0,0,0,0.8)',
      background: 'rgba(0,20,40,0.92)',
      padding: '14px',
      borderRadius: '12px',
      border: '2px solid #00ffff',
      boxSizing: 'border-box',
      lineHeight: '1.35'
    }}>
      <div style={{fontSize: '30px', marginBottom: '8px'}}>🔭</div>
      <div style={{fontWeight: 700, fontSize: '18px', marginBottom: '8px'}}>Vista: Cúpula</div>

      <ol style={{
        listStyle: 'none',
        padding: 0,
        margin: 0,
        width: '100%',
        textAlign: 'left',
        fontSize: '15px',
        color: '#fff'
      }}>
        <li style={{display:'flex', gap:8, alignItems:'center', marginBottom:10}}>
          <span style={{
            minWidth:26, height:26, borderRadius:13, background:'#00ffff', color:'#002', display:'inline-flex',
            alignItems:'center', justifyContent:'center', fontWeight:700
          }}>1</span>
          <div>
            Press <b>U</b> to <b>exit</b> the view (return to movement mode).
          </div>
        </li>

        <li style={{display:'flex', gap:8, alignItems:'center', marginBottom:10}}>
          <span style={{
            minWidth:26, height:26, borderRadius:13, background:'#66e0ff55', color:'#fff', display:'inline-flex',
            alignItems:'center', justifyContent:'center', fontWeight:700
          }}>2</span>
          <div>
            Use <b>ESPACE</b> to <b>climb</b> to the cupola (once you've left).
          </div>
        </li>

        <li style={{display:'flex', gap:8, alignItems:'center'}}>
          <span style={{
            minWidth:26, height:26, borderRadius:13, background:'#66e0ff55', color:'#fff', display:'inline-flex',
            alignItems:'center', justifyContent:'center', fontWeight:700
          }}>3</span>
          <div>
           When you're near the cupola, press <b>G</b> to view images. 
          </div>
        </li>
      </ol>
    </div>

    <style>{`
      @keyframes bounceGlow {
        0%, 20%, 50%, 80%, 100% { 
          transform: translateY(0);
          text-shadow: 0 0 10px #00ffff;
        }
        40% { 
          transform: translateY(-10px);
          text-shadow: 0 0 20px #00ffff;
        }
        60% { 
          transform: translateY(-6px);
          text-shadow: 0 0 15px #00ffff;
        }
      }
      @keyframes pulseGlow {
        0%, 100% { 
          transform: scale(1); 
          box-shadow: 0 0 20px rgba(0,255,255,0.4), inset 0 0 20px rgba(0,255,255,0.1);
        }
        50% { 
          transform: scale(1.02); 
          box-shadow: 0 0 30px rgba(0,255,255,0.6), inset 0 0 30px rgba(0,255,255,0.2);
        }
      }
    `}</style>
  </Html>


      )}
    </group>
  )
}