// src/Components/phase3_ISS/ISSScene.jsx
import React, { Suspense, useState, useEffect, useRef} from 'react'
import { Canvas } from '@react-three/fiber'
import { ISSEnvironment } from './ISSEnvironment'
import { ISSPlayerControls } from './ISSPlayerControls'
import { IntroVideo } from './IntroVideo'
import { ISSHUD } from './UI/ISSHUD'
import { Player } from '../phase1_museum/Character/Player'

export function ISSScene() {
  const issModelRef = useRef()
  const [showIntroVideo, setShowIntroVideo] = useState(true)
  const [introVideoEnded, setIntroVideoEnded] = useState(false)
  
  // Estados para los 3 carruseles
  const [showImageGallery, setShowImageGallery] = useState(false) // G - Imágenes de la cúpula
  const [showVideoGallery, setShowVideoGallery] = useState(false) // F - Videos de vida en ISS
  const [showExperimentGallery, setShowExperimentGallery] = useState(false) // D - Experimentos
  
  // Índices actuales para cada carrusel
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [currentExperimentIndex, setCurrentExperimentIndex] = useState(0)

  // Lista de imágenes para la galería de la cúpula (G)
  const cupolaImages = [
    {
      id: 'Hurricane_Franklin',
      src: '/images/Hurricane_Franklin.jpg',
      title: 'Hurricane Franklin in the Atlantic Ocean',
      description: 'Imagen capturada desde la Estación Espacial Internacional mostrando la potencia de este huracán.'
    },
    {
      id: 'Hurricane_Genevieve',
      src: '/images/Hurricane_Genevieve.jpg',
      title: 'Hurricane Genevieve off the Pacific coast of Mexico',
      description: 'Vista panorámica del huracán Genevieve desde la ISS sobre el Pacífico.'
    },
    {
      id: 'Hurricane_Beryl',
      src: '/images/Hurricane_Beryl.jpg',
      title: 'Hurricane Beryl pictured as a Category 5 storm',
      description: 'Huracán Beryl en su máxima intensidad, captado desde el espacio.'
    },
    {
      id: 'Wildfires_burn',
      src: '/images/Wildfires_burn.jpg',
      title: 'Wildfires burn throughout Canada´s central provinces',
      description: 'Incendios forestales masivos visibles desde la órbita en Canadá.'
    },
    {
      id: 'Wildfires_breakout',
      src: '/images/Wildfires_breakout.jpg',
      title: 'Wildfires breakout near the Greek village of Feneos',
      description: 'Incendios forestales cerca del pueblo griego de Feneos.'
    },
    {
      id: 'The_Moon',
      src: '/images/The_Moon.jpg',
      title: 'The Moon´s shadow covers portions of Canada and the U.S.',
      description: 'Eclipse solar visible desde la ISS cubriendo partes de Norteamérica.'
    },
    {
      id: 'The_Night_New_york',
      src: '/images/The_Nigth_New_york.jpg',
      title: 'The night lights of the New York-New Jersey metropolitan area',
      description: 'Las luces nocturnas del área metropolitana de Nueva York-Nueva Jersey.'
    },
    {
      id: 'The_Night_Tokyo',
      src: '/images/The_Nigth_Tokyo.jpg',
      title: 'Tokyo, Japan, the world´s most populous metropolitan area',
      description: 'Tokio, Japón, el área metropolitana más poblada del mundo con 39.1 millones.'
    },
    {
      id: 'Baghdad',
      src: '/images/Baghdad.jpg',
      title: 'Baghdad, Iraq, split by the Tigris River',
      description: 'Bagdad, Irak, dividida por el río Tigris con una población de 7.92 millones.'
    },
    {
      id: 'Hadfield',
      src: '/images/Hadfield.jpg',
      title: 'Hadfield uses still camera in the Cupola Module',
      description: 'El astronauta Hadfield utiliza una cámara fija en el módulo de la cúpula.'
    },
    {
      id: 'Anne',
      src: '/images/Anne.jpg',
      title: 'NASA astronaut Anne McClain poses for a portrait inside the cupola',
      description: 'La astronauta Anne McClain posa para un retrato dentro de la cúpula.'
    }
  ]

  // Lista de videos sobre vida en la ISS (F)
  const lifeVideos = [
    {
      id: 'coffee',
      title: 'Cómo toman café en el espacio',
      description: 'Descubre las técnicas especiales para beber líquidos sin gravedad y cómo los astronautas disfrutan de su café matutino.',
      videoSrc: '/videos/coffee_space.mp4'
    },
    {
      id: 'bathroom',
      title: 'El baño espacial',
      description: 'Aprende cómo funciona el sistema de higiene en microgravedad y los desafíos únicos de las necesidades básicas en el espacio.',
      videoSrc: '/videos/space_bathroom.mp4'
    },
    {
      id: 'hair_wash',
      title: 'Lavado de cabello femenino en el espacio',
      description: 'Técnicas para el cuidado capilar en el espacio y cómo las astronautas mantienen su higiene personal.',
      videoSrc: '/videos/hair_wash_space.mp4'
    }
  ]

  // Lista de experimentos científicos (D)
  const experiments = [
    {
      id: 'protein_crystals',
      title: 'Cristalización de Proteínas',
      image: '/images/experiments/protein_crystals.jpg',
      description: 'En microgravedad, las proteínas pueden formar cristales más grandes y perfectos que en la Tierra. Estos cristales ayudan a los científicos a entender mejor la estructura de las proteínas, lo que es crucial para el desarrollo de nuevos medicamentos. Los experimentos de cristalización en la ISS han contribuido al desarrollo de tratamientos para el cáncer, la diabetes y otras enfermedades.'
    },
    {
      id: 'plant_growth',
      title: 'Crecimiento de Plantas en Microgravedad',
      image: '/images/experiments/plant_growth.jpg',
      description: 'Los astronautas cultivan diferentes tipos de plantas para entender cómo crecen sin gravedad. Estos experimentos son fundamentales para futuras misiones a Marte, donde los astronautas necesitarán producir su propia comida. Las plantas también ayudan a purificar el aire y proporcionan beneficios psicológicos a la tripulación.'
    },
    {
      id: 'flame_studies',
      title: 'Comportamiento del Fuego en el Espacio',
      image: '/images/experiments/flame_studies.jpg',
      description: 'En microgravedad, las llamas se comportan de manera muy diferente que en la Tierra. Son más esféricas y arden a temperaturas más bajas. Estos estudios ayudan a desarrollar motores más eficientes y sistemas de combustión más limpios, además de mejorar la seguridad contra incendios tanto en el espacio como en la Tierra.'
    },
    {
      id: 'fluid_physics',
      title: 'Física de Fluidos sin Gravedad',
      image: '/images/experiments/fluid_physics.jpg',
      description: 'Los fluidos se comportan de manera fascinante en microgravedad, formando esferas perfectas y mezclándose de formas imposibles en la Tierra. Estos experimentos ayudan a mejorar procesos industriales, desde la fundición de metales hasta la producción de medicamentos, y nos enseñan sobre fenómenos físicos fundamentales.'
    },
    {
      id: 'tissue_engineering',
      title: 'Ingeniería de Tejidos',
      image: '/images/experiments/tissue_engineering.jpg',
      description: 'En el espacio, las células pueden crecer en estructuras tridimensionales más naturales sin la influencia de la gravedad. Los científicos están desarrollando técnicos para cultivar órganos humanos que podrían revolucionar los trasplantes. También estudian cómo la microgravedad afecta el envejecimiento celular y la regeneración de tejidos.'
    }
  ]

  // Habilitar audio desde el primer clic
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

  // Control de teclas para los 3 carruseles
  useEffect(() => {
    const handleKeyPress = (e) => {
      // G - Galería de imágenes de la cúpula
      if (e.code === 'KeyG') {
        e.preventDefault()
        setShowImageGallery(true)
        setCurrentImageIndex(0)
        // Cerrar otros carruseles
        setShowVideoGallery(false)
        setShowExperimentGallery(false)
      }
      
      // F - Videos de vida en la ISS
      if (e.code === 'KeyF') {
        e.preventDefault()
        setShowVideoGallery(true)
        setCurrentVideoIndex(0)
        // Cerrar otros carruseles
        setShowImageGallery(false)
        setShowExperimentGallery(false)
      }
      
      // D - Experimentos científicos
      if (e.code === 'KeyD') {
        e.preventDefault()
        setShowExperimentGallery(true)
        setCurrentExperimentIndex(0)
        // Cerrar otros carruseles
        setShowImageGallery(false)
        setShowVideoGallery(false)
      }
      
      // ESC - Cerrar cualquier carrusel abierto
      if (e.code === 'Escape') {
        setShowImageGallery(false)
        setShowVideoGallery(false)
        setShowExperimentGallery(false)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  // Navegación con flechas para todos los carruseles
  useEffect(() => {
    const handleArrowKeys = (e) => {
      if (!showImageGallery && !showVideoGallery && !showExperimentGallery) return

      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        e.preventDefault()
        
        if (showImageGallery) {
          setCurrentImageIndex(prev => prev > 0 ? prev - 1 : cupolaImages.length - 1)
        } else if (showVideoGallery) {
          setCurrentVideoIndex(prev => prev > 0 ? prev - 1 : lifeVideos.length - 1)
        } else if (showExperimentGallery) {
          setCurrentExperimentIndex(prev => prev > 0 ? prev - 1 : experiments.length - 1)
        }
      }
      
      if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        e.preventDefault()
        
        if (showImageGallery) {
          setCurrentImageIndex(prev => prev < cupolaImages.length - 1 ? prev + 1 : 0)
        } else if (showVideoGallery) {
          setCurrentVideoIndex(prev => prev < lifeVideos.length - 1 ? prev + 1 : 0)
        } else if (showExperimentGallery) {
          setCurrentExperimentIndex(prev => prev < experiments.length - 1 ? prev + 1 : 0)
        }
      }
    }

    window.addEventListener('keydown', handleArrowKeys)
    return () => window.removeEventListener('keydown', handleArrowKeys)
  }, [showImageGallery, showVideoGallery, showExperimentGallery, cupolaImages.length, lifeVideos.length, experiments.length])

  const handleIntroVideoEnd = () => {
    setIntroVideoEnded(true)
    setTimeout(() => {
      setShowIntroVideo(false)
    }, 1000)
  }

  // Funciones de navegación
  const navigateCarousel = (direction, carouselType) => {
    if (carouselType === 'images') {
      setCurrentImageIndex(prev => {
        if (direction === 'next') {
          return prev < cupolaImages.length - 1 ? prev + 1 : 0
        } else {
          return prev > 0 ? prev - 1 : cupolaImages.length - 1
        }
      })
    } else if (carouselType === 'videos') {
      setCurrentVideoIndex(prev => {
        if (direction === 'next') {
          return prev < lifeVideos.length - 1 ? prev + 1 : 0
        } else {
          return prev > 0 ? prev - 1 : lifeVideos.length - 1
        }
      })
    } else if (carouselType === 'experiments') {
      setCurrentExperimentIndex(prev => {
        if (direction === 'next') {
          return prev < experiments.length - 1 ? prev + 1 : 0
        } else {
          return prev > 0 ? prev - 1 : experiments.length - 1
        }
      })
    }
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

  // Renderizar la ISS
  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      <Canvas 
        camera={{ position: [0, 2, 8], fov: 60 }}
        gl={{ antialias: true, shadowMap: true }}
        shadows
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} color="#ffffff" />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1.8}
            color="#ffff99"
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <pointLight position={[0, 3, 0]} intensity={1.2} color="#ffffff" />
          <pointLight position={[-5, 2, -3]} intensity={0.8} color="#f0f0f0" />
          <pointLight position={[5, 2, 3]} intensity={0.8} color="#f0f0f0" />
          
          <ISSEnvironment ref={issModelRef} />
          
          <ISSPlayerControls>
            <Player />
          </ISSPlayerControls>
        </Suspense>
      </Canvas>
      
      {/* HUD siempre visible FUERA del Canvas */}
      <ISSHUD />

      {/* GALERÍA DE IMÁGENES DE LA CÚPULA (G) */}
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
          zIndex: 999999
        }}>
          <div style={{
            color: '#ffffff',
            fontSize: '32px',
            fontWeight: 'bold',
            marginBottom: '10px',
            textAlign: 'center'
          }}>
            🖼️ Galería de la Cúpula ISS
          </div>

          <div style={{
            color: '#00ffff',
            fontSize: '16px',
            marginBottom: '20px'
          }}>
            Imagen {currentImageIndex + 1} de {cupolaImages.length}
          </div>

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
            <img
              src={cupolaImages[currentImageIndex].src}
              alt={cupolaImages[currentImageIndex].title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center'
              }}
            />

            <button
              onClick={() => navigateCarousel('prev', 'images')}
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
                fontSize: '24px'
              }}
            >
              ←
            </button>

            <button
              onClick={() => navigateCarousel('next', 'images')}
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
                fontSize: '24px'
              }}
            >
              →
            </button>
          </div>

          <div style={{ marginTop: '20px', textAlign: 'center', maxWidth: '80%' }}>
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

          <div style={{
            marginTop: '20px',
            display: 'flex',
            gap: '15px',
            alignItems: 'center'
          }}>
            <button
              onClick={() => setShowImageGallery(false)}
              style={{
                background: '#ff4444',
                border: 'none',
                color: '#fff',
                padding: '12px 20px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
            >
              Cerrar Galería
            </button>
            
            <div style={{
              color: '#ffffff',
              fontSize: '12px',
              opacity: 0.7
            }}>
              ESC: Cerrar | ← →: Navegar | A D: Navegar
            </div>
          </div>
        </div>
      )}

      {/* GALERÍA DE VIDEOS - VIDA EN LA ISS (F) */}
      {showVideoGallery && (
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
          zIndex: 999999
        }}>
          <div style={{
            color: '#ffffff',
            fontSize: '32px',
            fontWeight: 'bold',
            marginBottom: '10px',
            textAlign: 'center'
          }}>
            🎬 Vida en la ISS
          </div>

          <div style={{
            color: '#ffaa44',
            fontSize: '16px',
            marginBottom: '20px'
          }}>
            Video {currentVideoIndex + 1} de {lifeVideos.length}
          </div>

          <div style={{
            position: 'relative',
            width: '90vw',
            height: '70vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid #ffaa44',
            borderRadius: '15px',
            overflow: 'hidden',
            background: '#111111'
          }}>
            <video
              controls
              autoPlay
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain'
              }}
            >
              <source src={lifeVideos[currentVideoIndex].videoSrc} type="video/mp4" />
              Tu navegador no soporta el elemento video.
            </video>

            <button
              onClick={() => navigateCarousel('prev', 'videos')}
              style={{
                position: 'absolute',
                left: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(255,170,68,0.8)',
                border: 'none',
                color: '#fff',
                padding: '15px 20px',
                borderRadius: '50%',
                cursor: 'pointer',
                fontSize: '24px'
              }}
            >
              ←
            </button>

            <button
              onClick={() => navigateCarousel('next', 'videos')}
              style={{
                position: 'absolute',
                right: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(255,170,68,0.8)',
                border: 'none',
                color: '#fff',
                padding: '15px 20px',
                borderRadius: '50%',
                cursor: 'pointer',
                fontSize: '24px'
              }}
            >
              →
            </button>
          </div>

          <div style={{ marginTop: '20px', textAlign: 'center', maxWidth: '80%' }}>
            <div style={{
              color: '#ffffff',
              fontSize: '24px',
              fontWeight: 'bold',
              marginBottom: '10px'
            }}>
              {lifeVideos[currentVideoIndex].title}
            </div>
            <div style={{
              color: '#ffffff',
              fontSize: '16px',
              opacity: 0.9,
              lineHeight: '1.4'
            }}>
              {lifeVideos[currentVideoIndex].description}
            </div>
          </div>

          <div style={{
            marginTop: '20px',
            display: 'flex',
            gap: '15px',
            alignItems: 'center'
          }}>
            <button
              onClick={() => setShowVideoGallery(false)}
              style={{
                background: '#ff4444',
                border: 'none',
                color: '#fff',
                padding: '12px 20px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
            >
              Cerrar Videos
            </button>
            
            <div style={{
              color: '#ffffff',
              fontSize: '12px',
              opacity: 0.7
            }}>
              ESC: Cerrar | ← →: Navegar | A D: Navegar
            </div>
          </div>
        </div>
      )}

      {/* GALERÍA DE EXPERIMENTOS CIENTÍFICOS (D) */}
      {showExperimentGallery && (
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
          zIndex: 999999
        }}>
          <div style={{
            color: '#ffffff',
            fontSize: '32px',
            fontWeight: 'bold',
            marginBottom: '10px',
            textAlign: 'center'
          }}>
            🔬 Experimentos Científicos ISS
          </div>

          <div style={{
            color: '#44ff88',
            fontSize: '16px',
            marginBottom: '20px'
          }}>
            Experimento {currentExperimentIndex + 1} de {experiments.length}
          </div>

          {/* Contenedor dividido verticalmente */}
          <div style={{
            position: 'relative',
            width: '95vw',
            height: '75vh',
            display: 'flex',
            border: '2px solid #44ff88',
            borderRadius: '15px',
            overflow: 'hidden',
            background: '#111111'
          }}>
            {/* Lado izquierdo - Imagen */}
            <div style={{
              width: '50%',
              height: '100%',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#000000'
            }}>
              <img
                src={experiments[currentExperimentIndex].image}
                alt={experiments[currentExperimentIndex].title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center'
                }}
                onError={(e) => {
                  e.target.style.display = 'none'
                  e.target.nextSibling.style.display = 'flex'
                }}
              />
              
              {/* Placeholder si la imagen no carga */}
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
                <div style={{ fontSize: '48px', marginBottom: '20px' }}>🔬</div>
                <div>Imagen del experimento</div>
                <div style={{ fontSize: '14px', marginTop: '10px', opacity: 0.7 }}>
                  {experiments[currentExperimentIndex].title}
                </div>
              </div>
            </div>

            {/* Lado derecho - Texto */}
            <div style={{
              width: '50%',
              height: '100%',
              padding: '30px',
              background: 'linear-gradient(135deg, #0a1a0a 0%, #1a2a1a 100%)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              overflow: 'auto'
            }}>
              <h2 style={{
                color: '#44ff88',
                fontSize: '28px',
                fontWeight: 'bold',
                marginBottom: '25px',
                lineHeight: '1.2'
              }}>
                {experiments[currentExperimentIndex].title}
              </h2>
              
              <p style={{
                color: '#ffffff',
                fontSize: '16px',
                lineHeight: '1.6',
                opacity: 0.95,
                textAlign: 'justify'
              }}>
                {experiments[currentExperimentIndex].description}
              </p>
            </div>

            {/* Botones de navegación */}
            <button
              onClick={() => navigateCarousel('prev', 'experiments')}
              style={{
                position: 'absolute',
                left: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(68,255,136,0.8)',
                border: 'none',
                color: '#000',
                padding: '15px 20px',
                borderRadius: '50%',
                cursor: 'pointer',
                fontSize: '24px',
                fontWeight: 'bold'
              }}
            >
              ←
            </button>

            <button
              onClick={() => navigateCarousel('next', 'experiments')}
              style={{
                position: 'absolute',
                right: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(68,255,136,0.8)',
                border: 'none',
                color: '#000',
                padding: '15px 20px',
                borderRadius: '50%',
                cursor: 'pointer',
                fontSize: '24px',
                fontWeight: 'bold'
              }}
            >
              →
            </button>
          </div>

          <div style={{
            marginTop: '20px',
            display: 'flex',
            gap: '15px',
            alignItems: 'center'
          }}>
            <button
              onClick={() => setShowExperimentGallery(false)}
              style={{
                background: '#ff4444',
                border: 'none',
                color: '#fff',
                padding: '12px 20px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
            >
              Cerrar Experimentos
            </button>
            
            <div style={{
              color: '#ffffff',
              fontSize: '12px',
              opacity: 0.7
            }}>
              ESC: Cerrar | ← →: Navegar | A D: Navegar
            </div>
          </div>
        </div>
      )}
    </div>
  )
}