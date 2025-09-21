// src/Components/phase3_ISS/ISSScene.jsx
import React, { Suspense, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { ISSEnvironment } from './ISSEnvironment'
import { ISSPlayerControls } from './ISSPlayerControls'
import { VideoStation } from './VideoStation'
import { CupolaGallery } from './CupolaGallery'
import { IntroVideo } from './IntroVideo'
import { ISSHUD } from './UI/ISSHUD'
import { Player } from '../phase1_museum/Character/Player'

export function ISSScene() {
  const [showIntroVideo, setShowIntroVideo] = useState(true)
  const [introVideoEnded, setIntroVideoEnded] = useState(false)
  const [currentVideo, setCurrentVideo] = useState(null) // Estado para video actual
  const [showImageGallery, setShowImageGallery] = useState(false) // Estado para galería de imágenes
  const [currentImageIndex, setCurrentImageIndex] = useState(0) // Índice de imagen actual

  // Lista de imágenes para la galería de la cúpula
  const cupolaImages = [
    {
      id: 'earth_view',
      src: '/images/earth_from_iss.jpg',
      title: 'Vista de la Tierra desde la ISS',
      description: 'Imagen capturada desde la Estación Espacial Internacional mostrando nuestro planeta azul con sus características nubes y océanos.'
    },
    {
      id: 'aurora',
      src: '/images/aurora_from_space.jpg',
      title: 'Aurora Boreal desde el Espacio',
      description: 'Las auroras vistas desde la ISS muestran el campo magnético terrestre en acción, creando estas cortinas luminosas espectaculares.'
    },
    {
      id: 'city_lights',
      src: '/images/city_lights_night.jpg',
      title: 'Luces Nocturnas de las Ciudades',
      description: 'Las ciudades iluminadas por la noche revelan patrones de actividad humana y el impacto de la civilización en el planeta.'
    },
    {
      id: 'hurricane',
      src: '/images/hurricane_from_space.jpg',
      title: 'Huracán visto desde el Espacio',
      description: 'Los astronautas pueden observar y documentar fenómenos meteorológicos extremos, ayudando en la predicción del clima.'
    },
    {
      id: 'solar_panels',
      src: '/images/iss_solar_panels.jpg',
      title: 'Paneles Solares de la ISS',
      description: 'Los paneles solares de la ISS generan la energía necesaria para todas las operaciones de la estación espacial.'
    },
    {
      id: 'spacewalk',
      src: '/images/spacewalk_iss.jpg',
      title: 'Caminata Espacial',
      description: 'Los astronautas realizan actividades extravehiculares para mantener y actualizar los sistemas de la ISS.'
    }
  ]

  // Habilitar audio desde el primer clic en cualquier lugar
  useEffect(() => {
    const enableAudio = () => {
      if (typeof window !== 'undefined') {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext
        if (AudioContextClass) {
          const audioContext = new AudioContextClass()
          if (audioContext.state === 'suspended') {
            audioContext.resume()
          }
        }
      }
    }

    document.addEventListener('click', enableAudio, { once: true })
    document.addEventListener('keydown', enableAudio, { once: true })

    return () => {
      document.removeEventListener('click', enableAudio)
      document.removeEventListener('keydown', enableAudio)
    }
  }, [])

  // Cerrar video con ESC
  useEffect(() => {
    if (!currentVideo && !showImageGallery) return

    const handleEscape = (e) => {
      if (e.code === 'Escape') {
        if (currentVideo) {
          closeVideo()
        }
        if (showImageGallery) {
          closeImageGallery()
        }
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [currentVideo, showImageGallery])

  // Navegación de galería con flechas
  useEffect(() => {
    if (!showImageGallery) return

    const handleArrowKeys = (e) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        e.preventDefault()
        setCurrentImageIndex((prev) => 
          prev > 0 ? prev - 1 : cupolaImages.length - 1
        )
      }
      if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        e.preventDefault()
        setCurrentImageIndex((prev) => 
          prev < cupolaImages.length - 1 ? prev + 1 : 0
        )
      }
    }

    window.addEventListener('keydown', handleArrowKeys)
    return () => window.removeEventListener('keydown', handleArrowKeys)
  }, [showImageGallery, cupolaImages.length])

  // Posiciones de las estaciones de video fijas en las paredes del cilindro
  const videoStations = [
    {
      id: 'coffee',
      position: [0, 1, -3.6],
      title: 'Cómo toman café en el espacio',
      description: 'Descubre las técnicas especiales para beber líquidos sin gravedad',
      videoSrc: '/videos/coffee_space.mp4'
    },
    {
      id: 'bathroom',
      position: [3.6, 1, 0],
      title: 'El baño espacial',
      description: 'Aprende cómo funciona el sistema de higiene en microgravedad',
      videoSrc: '/videos/space_bathroom.mp4'
    },
    {
      id: 'hair_wash',
      position: [-3.6, 1, 0],
      title: 'Lavado de cabello femenino',
      description: 'Técnicas para el cuidado capilar en el espacio',
      videoSrc: '/videos/hair_wash_space.mp4'
    }
  ]

  const handleIntroVideoEnd = () => {
    setIntroVideoEnded(true)
    setTimeout(() => {
      setShowIntroVideo(false)
    }, 1000)
  }

  const handleVideoRequest = (videoData) => {
    setCurrentVideo(videoData)
  }

  const closeVideo = () => {
    setCurrentVideo(null)
  }

  const handleImageGalleryRequest = () => {
    setShowImageGallery(true)
    setCurrentImageIndex(0)
  }

  const closeImageGallery = () => {
    setShowImageGallery(false)
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev < cupolaImages.length - 1 ? prev + 1 : 0
    )
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev > 0 ? prev - 1 : cupolaImages.length - 1
    )
  }

  // Si el video intro no ha terminado, mostrarlo
  if (showIntroVideo) {
    return (
      <IntroVideo 
        onVideoEnd={handleIntroVideoEnd}
        videoEnded={introVideoEnded}
      />
    )
  }

  // Una vez terminado el intro, mostrar la ISS
  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      <Canvas 
        camera={{ position: [0, 2, 8], fov: 60 }}
        gl={{ antialias: true, shadowMap: true }}
        shadows
      >
        <Suspense fallback={null}>
          {/* Iluminación espacial */}
          <ambientLight intensity={0.4} color="#ffffff" />
          
          {/* Luz solar principal */}
          <directionalLight
            position={[10, 10, 5]}
            intensity={1.8}
            color="#ffff99"
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          
          {/* Luces interiores de la ISS */}
          <pointLight position={[0, 3, 0]} intensity={1.2} color="#ffffff" />
          <pointLight position={[-5, 2, -3]} intensity={0.8} color="#f0f0f0" />
          <pointLight position={[5, 2, 3]} intensity={0.8} color="#f0f0f0" />
          
          {/* Ambiente de la ISS - SIMPLIFICADO */}
          <ISSEnvironment />
          
          {/* Estaciones de video interactivas */}
          {videoStations.map((station) => (
            <VideoStation
              key={station.id}
              position={station.position}
              title={station.title}
              description={station.description}
              videoSrc={station.videoSrc}
              onVideoRequest={handleVideoRequest}
            />
          ))}
          
          {/* Galería de imágenes de la cúpula */}
          <CupolaGallery onImageGalleryRequest={handleImageGalleryRequest} />
          
          {/* Jugador con controles de microgravedad */}
          <ISSPlayerControls>
            <Player />
          </ISSPlayerControls>
        </Suspense>
      </Canvas>
      
      {/* HUD de la ISS */}
      <ISSHUD />

      {/* VIDEO MODAL FUERA DEL CANVAS */}
      {currentVideo && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: '#000000',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999999,
          pointerEvents: 'all'
        }}>
          {/* Título del video */}
          <div style={{
            color: '#ffffff',
            fontSize: '28px',
            fontWeight: 'bold',
            marginBottom: '20px',
            textAlign: 'center',
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
            maxWidth: '90%'
          }}>
            {currentVideo.title}
          </div>

          {/* Video a pantalla completa */}
          <video
            controls
            autoPlay
            style={{
              width: '95vw',
              height: '80vh',
              maxWidth: '95vw',
              maxHeight: '80vh',
              objectFit: 'contain',
              borderRadius: '10px'
            }}
            onEnded={closeVideo}
          >
            <source src={currentVideo.videoSrc} type="video/mp4" />
            Tu navegador no soporta el elemento video.
          </video>

          {/* Botón de cerrar */}
          <div style={{
            marginTop: '20px',
            display: 'flex',
            gap: '20px',
            alignItems: 'center'
          }}>
            <button
              onClick={closeVideo}
              style={{
                background: '#ff4444',
                border: 'none',
                color: '#fff',
                padding: '15px 25px',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
                boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
              }}
            >
              Cerrar y volver al juego
            </button>
            
            <div style={{
              color: '#ffffff',
              fontSize: '14px',
              opacity: 0.8
            }}>
              Presiona ESC o espera a que termine el video
            </div>
          </div>

          {/* Descripción */}
          <div style={{
            color: '#ffffff',
            fontSize: '16px',
            marginTop: '15px',
            textAlign: 'center',
            maxWidth: '80%',
            opacity: 0.9,
            lineHeight: '1.4'
          }}>
            {currentVideo.description}
          </div>
        </div>
      )}

      {/* GALERÍA DE IMÁGENES MODAL */}
      {showImageGallery && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.95)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999999,
          pointerEvents: 'all'
        }}>
          {/* Título de la galería */}
          <div style={{
            color: '#ffffff',
            fontSize: '32px',
            fontWeight: 'bold',
            marginBottom: '10px',
            textAlign: 'center',
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
          }}>
            Galería de la Cúpula ISS
          </div>

          {/* Contador de imágenes */}
          <div style={{
            color: '#00ffff',
            fontSize: '16px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            Imagen {currentImageIndex + 1} de {cupolaImages.length}
          </div>

          {/* Contenedor de imagen */}
          <div style={{
            position: 'relative',
            width: '90vw',
            height: '70vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid #00ffff',
            borderRadius: '15px',
            overflow: 'hidden',
            background: '#111111'
          }}>
            {/* Imagen actual */}
            <img
              src={cupolaImages[currentImageIndex].src}
              alt={cupolaImages[currentImageIndex].title}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                borderRadius: '10px'
              }}
              onError={(e) => {
                // Fallback si la imagen no carga
                e.target.style.display = 'none'
              }}
            />

            {/* Botones de navegación */}
            <button
              onClick={prevImage}
              style={{
                position: 'absolute',
                left: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(0,100,200,0.8)',
                border: 'none',
                color: '#fff',
                padding: '15px 20px',
                borderRadius: '50%',
                cursor: 'pointer',
                fontSize: '24px',
                fontWeight: 'bold',
                boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
              }}
            >
              ←
            </button>

            <button
              onClick={nextImage}
              style={{
                position: 'absolute',
                right: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(0,100,200,0.8)',
                border: 'none',
                color: '#fff',
                padding: '15px 20px',
                borderRadius: '50%',
                cursor: 'pointer',
                fontSize: '24px',
                fontWeight: 'bold',
                boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
              }}
            >
              →
            </button>
          </div>

          {/* Información de la imagen */}
          <div style={{
            marginTop: '20px',
            textAlign: 'center',
            maxWidth: '80%'
          }}>
            <div style={{
              color: '#ffffff',
              fontSize: '24px',
              fontWeight: 'bold',
              marginBottom: '10px'
            }}>
              {cupolaImages[currentImageIndex].title}
            </div>
            <div style={{
              color: '#ffffff',
              fontSize: '16px',
              opacity: 0.9,
              lineHeight: '1.4'
            }}>
              {cupolaImages[currentImageIndex].description}
            </div>
          </div>

          {/* Controles */}
          <div style={{
            marginTop: '20px',
            display: 'flex',
            gap: '15px',
            alignItems: 'center',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            <button
              onClick={closeImageGallery}
              style={{
                background: '#ff4444',
                border: 'none',
                color: '#fff',
                padding: '12px 20px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
              }}
            >
              Cerrar Galería
            </button>
            
            <div style={{
              color: '#ffffff',
              fontSize: '12px',
              opacity: 0.7,
              textAlign: 'center'
            }}>
              ESC: Cerrar | ← →: Navegar | A D: Navegar
            </div>
          </div>
        </div>
      )}
    </div>
  )
}