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
      id: 'Hurricane_Franklin',
      position: [0, 9, 1.4],
      rotation: [0, 0, 0],
      src: '/images/Hurricane_Franklin.jpg',
      title: 'Hurricane Franklin in the Atlantic Ocean'
    },
    {
      id: 'Hurricane_Genevieve',
      src: '/images/Hurricane_Genevieve.jpg',
      title: 'Hurricane Genevieve off the Pacific coast of Mexico'
    },
    {
      id: 'Hurricane_Beryls',
      src: '/images/Hurricane_Beryl.jpg',
      title: 'Hurricane_Beryl_pictured_as_a_Cat_gory_5_storm'
    },
    {
      id: 'Wildfires_burn',
      src: '/images/Wildfires_burn.jpg',
      title: 'Wildfires burn throughout Canada´s central provinces'
    },
    {
      id: 'Wildfires_breakout',
      src: '/images/Wildfires_breakout.jpg',
      title: 'Wildfires breakout near the Greek village of Feneos'
    },
    {
      id: 'The_Moon',
      src: '/images/The_Moon.jpg',
      title: 'The Moon´s shadow covers portions of Canada and the U.S.'
    },
    {
      id: 'The_Nigth_New_york',
      src: '/images/The_Nigth_New_york.jpg',
      title: 'The night lights of the New York-New Jersey metropolitan area'
    },
    {
      id: 'The_Nigth_Tokyo',
      src: '/images/The_Nigth_Tokyo.jpg',
      title: 'Tokyo, Japan, the world’s most populous metropolitan area with about 39.1 million people'
    },
    {
      id: 'Baghdad',
      src: '/images/Baghdad.jpg',
      title: 'Baghdad, Iraq, split by the Tigris River and with a population of about 7.92 million'
  
    },
    {
      id: 'Hadfield',
      src: '/images/Hadfield.jpg',
      title: 'Hadfield uses still camera in the Cupola Module'
  
    },
    {
      id: 'Anne',
      src: '/images/Anne.jpg',
      title: 'NASA astronaut Anne McClain poses for a portrait inside the cupola'
  
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

  // Navegación de galería con flechas - NAVEGACIÓN CIRCULAR CORREGIDA
  useEffect(() => {
    if (!showImageGallery) return

    const handleArrowKeys = (e) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        e.preventDefault()
        setCurrentImageIndex((prev) => {
          const newIndex = prev > 0 ? prev - 1 : cupolaImages.length - 1
          console.log('Navigate left - current:', prev, 'new:', newIndex)
          return newIndex
        })
      }
      if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        e.preventDefault()
        setCurrentImageIndex((prev) => {
          const newIndex = prev < cupolaImages.length - 1 ? prev + 1 : 0
          console.log('Navigate right - current:', prev, 'new:', newIndex)
          return newIndex
        })
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

  // NAVEGACIÓN CIRCULAR MEJORADA CON DEBUG
  const nextImage = () => {
    setCurrentImageIndex((prev) => {
      const newIndex = prev < cupolaImages.length - 1 ? prev + 1 : 0
      console.log('Next button - current:', prev, 'new:', newIndex, 'total images:', cupolaImages.length)
      return newIndex
    })
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => {
      const newIndex = prev > 0 ? prev - 1 : cupolaImages.length - 1
      console.log('Prev button - current:', prev, 'new:', newIndex, 'total images:', cupolaImages.length)
      return newIndex
    })
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
          
          {/* Galería de imágenes de la cúpula - PASAMOS EL ESTADO */}
          <CupolaGallery 
            onImageGalleryRequest={handleImageGalleryRequest}
            isGalleryOpen={showImageGallery}
          />
          
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

      {/* GALERÍA DE IMÁGENES MODAL - TAMAÑO MEJORADO */}
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

          {/* Contenedor de imagen - MEJORADO PARA OCUPAR MÁS ESPACIO */}
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
            {/* Imagen actual - OBJECT-FIT MEJORADO CON MEJOR MANEJO DE ERRORES */}
            <img
              key={currentImageIndex} // Forzar re-render cuando cambia el índice
              src={cupolaImages[currentImageIndex].src}
              alt={cupolaImages[currentImageIndex].title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover', // Cambiado a 'cover' para ocupar todo el espacio
                objectPosition: 'center', // Centra la imagen
                borderRadius: '10px',
                display: 'block' // Asegura que se muestre por defecto
              }}
              onLoad={(e) => {
                // Asegura que la imagen se muestre cuando carga correctamente
                e.target.style.display = 'block'
                if (e.target.nextSibling) {
                  e.target.nextSibling.style.display = 'none'
                }
                console.log('Image loaded successfully:', cupolaImages[currentImageIndex].src)
              }}
              onError={(e) => {
                // Fallback si la imagen no carga - mostrar placeholder
                console.error('Image failed to load:', cupolaImages[currentImageIndex].src)
                e.target.style.display = 'none'
                if (e.target.nextSibling) {
                  e.target.nextSibling.style.display = 'flex'
                }
              }}
            />

            {/* Placeholder mejorado cuando la imagen no carga */}
            <div style={{
              display: 'none',
              width: '100%',
              height: '100%',
              backgroundColor: '#1a1a2e',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              color: '#ffffff',
              fontSize: '18px'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>🖼️</div>
              <div>Imagen no disponible</div>
              <div style={{ fontSize: '14px', marginTop: '10px', opacity: 0.7 }}>
                {cupolaImages[currentImageIndex].title}
              </div>
            </div>

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
                boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.background = 'rgba(0,150,255,0.9)'}
              onMouseOut={(e) => e.target.style.background = 'rgba(0,100,200,0.8)'}
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
                boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.background = 'rgba(0,150,255,0.9)'}
              onMouseOut={(e) => e.target.style.background = 'rgba(0,100,200,0.8)'}
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