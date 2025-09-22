// src/Components/Shared/UI/GlobalIntroVideo.jsx
import React, { useRef, useEffect } from 'react'

export function GlobalIntroVideo({ onVideoEnd, videoEnded }) {
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
        <source src="/videos/global_intro.mp4" type="video/mp4" />
        Tu navegador no soporta el elemento video.
      </video>

      {/* Botón de saltar */}
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
        Saltar Intro ⏭️
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