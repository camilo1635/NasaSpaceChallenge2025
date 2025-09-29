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
  
  // States for the 3 carousels
  const [showImageGallery, setShowImageGallery] = useState(false) // G - Cupola images
  const [showVideoGallery, setShowVideoGallery] = useState(false) // F - Life on ISS videos
  const [showExperimentGallery, setShowExperimentGallery] = useState(false) // D - Experiments
  
  // Current indices for each carousel
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [currentExperimentIndex, setCurrentExperimentIndex] = useState(0)

  // Image list for cupola gallery (G)
  const cupolaImages = [
    {
      id: 'Hurricane_Franklin',
      src: '/images/Hurricane_Franklin.jpg',
      title: 'Hurricane Franklin in the Atlantic Ocean'
    },
    {
      id: 'Hurricane_Genevieve',
      src: '/images/Hurricane_Genevieve.jpg',
      title: 'Hurricane Genevieve off the Pacific coast of Mexico'
    },
    {
      id: 'Hurricane_Beryl',
      src: '/images/Hurricane_Beryl.jpg',
      title: 'Hurricane Beryl pictured as a Category 5 storm'
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
      id: 'The_Night_New_york',
      src: '/images/The_Nigth_New_york.jpg',
      title: 'The night lights of the New York-New Jersey metropolitan area'
    },
    {
      id: 'The_Night_Tokyo',
      src: '/images/The_Nigth_Tokyo.jpg',
      title: 'Tokyo, Japan, the world´s most populous metropolitan area'
    },
    {
      id: 'Baghdad',
      src: '/images/Baghdad.jpg',
      title: 'Baghdad, Iraq, split by the Tigris River'
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

  // Video list about life on ISS (F)
  const lifeVideos = [
    {
      id: 'coffee',
      title: 'How they drink coffee in space',
      videoSrc: '/videos/coffee_space.mp4'
    },
    {
      id: 'bathroom',
      title: 'The space bathroom',
      videoSrc: '/videos/space_bathroom.mp4'
    },
    {
      id: 'hair_wash',
      title: 'Female hair washing in space',
      videoSrc: '/videos/hair_wash_space.mp4'
    }
  ]

  // Scientific experiments list (D)
  const experiments = [
    {
      id: 'protein_crystals',
      title: 'Protein Crystallization',
      image: '/images/experiments/protein_crystals.jpg',
      description: 'In microgravity, proteins can form larger and more perfect crystals than on Earth. These crystals help scientists better understand protein structure, which is crucial for developing new medicines. Crystallization experiments on the ISS have contributed to the development of treatments for cancer, diabetes, and other diseases.'
    },
    {
      id: 'plant_growth',
      title: 'Plant Growth in Microgravity',
      image: '/images/experiments/plant_growth.jpg',
      description: 'Astronauts grow different types of plants to understand how they grow without gravity. These experiments are fundamental for future missions to Mars, where astronauts will need to produce their own food. Plants also help purify the air and provide psychological benefits to the crew.'
    },
    {
      id: 'flame_studies',
      title: 'Fire Behavior in Space',
      image: '/images/experiments/flame_studies.jpg',
      description: 'In microgravity, flames behave very differently than on Earth. They are more spherical and burn at lower temperatures. These studies help develop more efficient engines and cleaner combustion systems, as well as improve fire safety both in space and on Earth.'
    },
    {
      id: 'fluid_physics',
      title: 'Fluid Physics without Gravity',
      image: '/images/experiments/fluid_physics.jpg',
      description: 'Fluids behave fascinatingly in microgravity, forming perfect spheres and mixing in ways impossible on Earth. These experiments help improve industrial processes, from metal casting to drug production, and teach us about fundamental physical phenomena.'
    },
    {
      id: 'tissue_engineering',
      title: 'Tissue Engineering',
      image: '/images/experiments/tissue_engineering.jpg',
      description: 'In space, cells can grow in more natural three-dimensional structures without the influence of gravity. Scientists are developing techniques to grow human organs that could revolutionize transplants. They also study how microgravity affects cellular aging and tissue regeneration.'
    }
  ]

  // Enable audio from first click
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

  // Key controls for the 3 carousels
  useEffect(() => {
    const handleKeyPress = (e) => {
      // G - Cupola image gallery
      if (e.code === 'KeyG') {
        e.preventDefault()
        setShowImageGallery(true)
        setCurrentImageIndex(0)
        // Close other carousels
        setShowVideoGallery(false)
        setShowExperimentGallery(false)
      }
      
      // F - Life on ISS videos
      if (e.code === 'KeyF') {
        e.preventDefault()
        setShowVideoGallery(true)
        setCurrentVideoIndex(0)
        // Close other carousels
        setShowImageGallery(false)
        setShowExperimentGallery(false)
      }
      
      // J - Scientific experiments
      if (e.code === 'KeyJ') {
        e.preventDefault()
        setShowExperimentGallery(true)
        setCurrentExperimentIndex(0)
        // Close other carousels
        setShowImageGallery(false)
        setShowVideoGallery(false)
      }
      
      // ESC - Close any open carousel
      if (e.code === 'Escape') {
        setShowImageGallery(false)
        setShowVideoGallery(false)
        setShowExperimentGallery(false)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  // Arrow navigation for all carousels
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

  // Navigation functions
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

  // If intro video hasn't ended, show it
  if (showIntroVideo) {
    return (
      <IntroVideo 
        onVideoEnd={handleIntroVideoEnd}
        videoEnded={introVideoEnded}
      />
    )
  }

  // Render the ISS
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
      
      {/* HUD always visible OUTSIDE the Canvas */}
      <ISSHUD />

      {/* CUPOLA IMAGE GALLERY (G) */}
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
            🖼️ ISS Cupola Gallery
          </div>

          <div style={{
            color: '#00ffff',
            fontSize: '16px',
            marginBottom: '20px'
          }}>
            Image {currentImageIndex + 1} of {cupolaImages.length}
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
              <div style={{
              color: '#ffffff',
              fontSize: '12px',
              opacity: 0.7
            }}>
              ESC: Close
            </div>
          </div>
        </div>
      )}

      {/* VIDEO GALLERY - LIFE ON ISS (F) */}
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
            🎬 Life on ISS
          </div>

          <div style={{
            color: '#ffaa44',
            fontSize: '16px',
            marginBottom: '20px'
          }}>
            Video {currentVideoIndex + 1} of {lifeVideos.length}
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
              key={`video-${currentVideoIndex}`} // Unique key to force recreation
              controls
              autoPlay
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain'
              }}
            >
              <source src={lifeVideos[currentVideoIndex].videoSrc} type="video/mp4" />
              Your browser does not support the video element.
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
            <div style={{
              color: '#ffffff',
              fontSize: '12px',
              opacity: 0.7
            }}>
              ESC: Close
            </div>
          </div>
        </div>
      )}

      {/* SCIENTIFIC EXPERIMENTS GALLERY (D) */}
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
            🔬 ISS Scientific Experiments
          </div>

          <div style={{
            color: '#44ff88',
            fontSize: '16px',
            marginBottom: '20px'
          }}>
            Experiment {currentExperimentIndex + 1} of {experiments.length}
          </div>

          {/* Container divided vertically */}
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
            {/* Left side - Image */}
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
              
              {/* Placeholder if image doesn't load */}
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
                <div>Experiment image</div>
                <div style={{ fontSize: '14px', marginTop: '10px', opacity: 0.7 }}>
                  {experiments[currentExperimentIndex].title}
                </div>
              </div>
            </div>

            {/* Right side - Text */}
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

            {/* Navigation buttons */}
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
            <div style={{
              color: '#ffffff',
              fontSize: '12px',
              opacity: 0.7
            }}>
              ESC: Close
            </div>
          </div>
        </div>
      )}
    </div>
  )
}