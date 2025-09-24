// src/Components/phase3_ISS/CupolaImages.jsx
import React, { useRef, useState } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

export function CupolaImages() {
  // Lista de imágenes educativas para las ventanas
  const images = [
    {
      id: 'earth_view',
      position: [0, 9, 1.4],
      rotation: [0, 0, 0],
      src: '/images/Hurricane_Franklin.jpg',
      title: 'Hurricane Franklin in the Atlantic Ocean',
      description: 'Imagenn capturada desde la Estación Espacial Internacional mostrando nuestro planeta azul.'
    },
    {
      id: 'aurora',
      position: [-1.2, 9, 0.8],
      rotation: [0, 0.5, 0],
      src: '/images/aurora_from_space.jpg',
      title: 'Aurora Boreal desde el Espacio',
      description: 'Las auroras vistas desde la ISS muestran el campo magnético terrestre en acción.'
    },
    {
      id: 'city_lights',
      position: [1.2, 9, 0.8],
      rotation: [0, -0.5, 0],
      src: '/images/city_lights_night.jpg',
      title: 'Luces Nocturnas de las Ciudades',
      description: 'Las ciudades iluminadas por la noche revelan patrones de actividad humana.'
    },
    {
      id: 'hurricane',
      position: [-0.8, 9, -0.8],
      rotation: [0, 2.5, 0],
      src: '/images/hurricane_from_space.jpg',
      title: 'Huracán visto desde el Espacio',
      description: 'Los astronautas pueden observar y documentar fenómenos meteorológicos extremos.'
    },
    {
      id: 'solar_panels',
      position: [0.8, 9, -0.8],
      rotation: [0, -2.5, 0],
      src: '/images/iss_solar_panels.jpg',
      title: 'Paneles Solares de la ISS',
      description: 'Los paneles solares de la ISS generan la energía necesaria para las operaciones.'
    }
  ]

  return (
    <group>
      {images.map((image, index) => (
        <ImageWindow 
          key={image.id}
          {...image}
          index={index}
        />
      ))}
    </group>
  )
}

function ImageWindow({ position, rotation, src, title, description, index }) {
  const imageRef = useRef()
  const [isHovered, setIsHovered] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  
  // Intentar cargar la textura, usar fallback si falla
  const texture = useLoader(TextureLoader, src, (loader) => {
  loader.manager.onError = (url) => {
    console.warn(`No se pudo cargar la imagen: ${url}`)
  }
})


  useFrame(() => {
    if (!imageRef.current) return
    
    // Animación sutil de flotación
    const time = Date.now() * 0.001
    const offset = Math.sin(time + index) * 0.02
    imageRef.current.position.y = position[1] + offset
  })

  const handleClick = () => {
    setShowDetails(!showDetails)
  }

  return (
    <group>
      {/* Marco de la ventana */}
      <mesh position={position} rotation={rotation}>
        <ringGeometry args={[0.35, 0.45]} />
        <meshStandardMaterial 
          color="#ffffff" 
          metalness={0.8} 
          roughness={0.2}
        />
      </mesh>

      {/* Imagen o placeholder */}
      <mesh 
        ref={imageRef}
        position={position} 
        rotation={rotation}
        onClick={handleClick}
        onPointerOver={() => setIsHovered(true)}
        onPointerOut={() => setIsHovered(false)}
      >
        <circleGeometry args={[0.35]} />
        {texture ? (
          <meshStandardMaterial 
            map={texture} 
            transparent
            opacity={isHovered ? 0.9 : 0.8}
          />
        ) : (
          // Placeholder cuando la imagen no carga
          <meshStandardMaterial 
            color="#1a1a2e"
            emissive="#0066cc"
            emissiveIntensity={0.2}
          />
        )}
      </mesh>

      {/* Indicador de interactividad cuando está cerca */}
      {isHovered && (
        <Html position={[position[0], position[1] - 0.8, position[2]]} center>
          <div style={{
            background: 'rgba(0,30,60,0.9)',
            color: '#fff',
            padding: '8px 12px',
            borderRadius: '8px',
            fontSize: '12px',
            textAlign: 'center',
            border: '1px solid #00ffff',
            animation: 'fadeIn 0.3s ease',
            whiteSpace: 'nowrap'
          }}>
            🖼️ Clic para ver detalles
          </div>
        </Html>
      )}

      {/* Panel de información detallada */}
      {showDetails && (
        <Html position={[position[0], position[1] - 1.5, position[2]]} center>
          <div style={{
            background: 'rgba(0,20,40,0.95)',
            color: '#fff',
            padding: '15px 20px',
            borderRadius: '12px',
            fontSize: '14px',
            textAlign: 'center',
            border: '2px solid #00ffff',
            maxWidth: '300px',
            boxShadow: '0 5px 15px rgba(0,0,0,0.5)',
            animation: 'slideUp 0.3s ease'
          }}>
            <div style={{ 
              fontWeight: 'bold', 
              marginBottom: '10px', 
              color: '#00ffff',
              fontSize: '16px'
            }}>
              📸 {title}
            </div>
            <div style={{ 
              fontSize: '13px', 
              lineHeight: '1.4',
              opacity: 0.9,
              marginBottom: '12px'
            }}>
              {description}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowDetails(false)
              }}
              style={{
                background: '#0066cc',
                border: 'none',
                color: '#fff',
                padding: '6px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '12px',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.background = '#0088ff'}
              onMouseOut={(e) => e.target.style.background = '#0066cc'}
            >
              Cerrar
            </button>
          </div>
          <style>{`
            @keyframes fadeIn {
              0% { opacity: 0; }
              100% { opacity: 1; }
            }
            @keyframes slideUp {
              0% { opacity: 0; transform: translateY(20px); }
              100% { opacity: 1; transform: translateY(0); }
            }
          `}</style>
        </Html>
      )}

      {/* Texto flotante con el título si no hay imagen */}
      {!texture && (
        <Html position={position} center>
          <div style={{
            color: '#fff',
            fontSize: '10px',
            textAlign: 'center',
            background: 'rgba(0,0,0,0.5)',
            padding: '4px 8px',
            borderRadius: '4px',
            pointerEvents: 'none'
          }}>
            {title}
          </div>
        </Html>
      )}
    </group>
  )
}