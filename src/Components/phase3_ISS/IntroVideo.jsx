// src/Components/phase3_ISS/IntroVideo.jsx
import React, { useRef, useEffect } from 'react'

export function IntroVideo({ onVideoEnd, videoEnded }) {
  const videoRef = useRef()

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      // Intentar reproducir con audio
      const playPromise = video.play()
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.log('Error auto-playing video with audio:', err)
          // Si falla, mostrar controles y permitir al usuario iniciar manualmente
          video.controls = true
        })
      }

      // Listener para cuando termine el video
      const handleVideoEnd = () => {
        onVideoEnd()
      }

      video.addEventListener('ended', handleVideoEnd)
      return () => video.removeEventListener('ended', handleVideoEnd)
    }
  }, [onVideoEnd])

  return (
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
      opacity: videoEnded ? 0 : 1,
      transition: 'opacity 1s ease-out'
    }}>
      {/* Título introductorio */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        color: '#ffffff',
        fontSize: '28px',
        fontWeight: 'bold',
        textAlign: 'center',
        textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
        zIndex: 1000001
      }}>
        🛸 Welcome to the International Space Station
      </div>

      {/* Video principal */}
      <video
        ref={videoRef}
        style={{
          width: '95vw',
          height: '85vh',
          maxWidth: '95vw',
          maxHeight: '85vh',
          borderRadius: '10px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          objectFit: 'contain'
        }}
        controls
        playsInline
      >
        <source src="/videos/iss_intro.mp4" type="video/mp4" />
        Tu navegador no soporta el elemento video.
      </video>

      {/* Controles informativos */}
      <div style={{
        position: 'absolute',
        bottom: '50px',
        left: '50%',
        transform: 'translateX(-50%)',
        color: '#ffffff',
        fontSize: '16px',
        textAlign: 'center',
        opacity: 0.9
      }}>
      </div>

      {/* Botón de saltar (opcional) */}
      <button
        onClick={onVideoEnd}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          background: 'rgba(255,255,255,0.2)',
          border: '2px solid rgba(255,255,255,0.5)',
          color: '#ffffff',
          padding: '10px 20px',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '14px',
          transition: 'all 0.3s ease'
        }}
        onMouseOver={(e) => {
          e.target.style.background = 'rgba(255,255,255,0.3)'
          e.target.style.borderColor = 'rgba(255,255,255,0.8)'
        }}
        onMouseOut={(e) => {
          e.target.style.background = 'rgba(255,255,255,0.2)'
          e.target.style.borderColor = 'rgba(255,255,255,0.5)'
        }}
      >
        Skip ⏭️
      </button>

      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </div>
  )
}