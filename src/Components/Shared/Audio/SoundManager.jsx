// src/Components/Shared/Audio/SoundManager.jsx
import React, { useEffect, useRef, useState } from 'react'
import { useGameState } from '../../Utils/useGameState'

// Single audio configuration for all phases
const GAME_AUDIO = {
  src: '/audio/game_ambient.mp3', // Un solo archivo para todas las fases
  volume: 0.1,
  loop: true,
  name: 'Space Adventure'
}

export function SoundManager() {
  const { state } = useGameState()
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(GAME_AUDIO.volume)
  const [audioError, setAudioError] = useState(null)
  const [audioInitialized, setAudioInitialized] = useState(false)
  const fadeIntervalRef = useRef(null)

  // Debug log
  if (import.meta.env.DEV) {
    console.log('🎵 SoundManager - Current phase:', state.currentPhase, '| Is playing:', isPlaying)
  }

  // Initialize audio on first user interaction
  useEffect(() => {
    const initAudio = () => {
      try {
        if (!audioRef.current) {
          audioRef.current = new Audio()
          audioRef.current.src = GAME_AUDIO.src
          audioRef.current.volume = volume
          audioRef.current.loop = true
          audioRef.current.preload = 'auto'
          
          // Add event listeners for debugging
          audioRef.current.addEventListener('canplay', () => {
            console.log('🎵 Audio can play:', audioRef.current.src)
          })
          
          audioRef.current.addEventListener('error', (e) => {
            console.error('🚨 Audio error:', e)
            setAudioError('Error loading audio file')
          })
          
          audioRef.current.addEventListener('loadstart', () => {
            console.log('🎵 Started loading:', audioRef.current.src)
          })
          
          audioRef.current.addEventListener('loadeddata', () => {
            console.log('🎵 Audio data loaded successfully')
            setAudioError(null)
          })
          
          setAudioInitialized(true)
        }
      } catch (error) {
        console.error('🚨 Error initializing audio:', error)
        setAudioError('Failed to initialize audio')
      }
    }

    // Initialize on first click/key press
    const handleFirstInteraction = () => {
      initAudio()
      document.removeEventListener('click', handleFirstInteraction)
      document.removeEventListener('keydown', handleFirstInteraction)
    }

    document.addEventListener('click', handleFirstInteraction)
    document.addEventListener('keydown', handleFirstInteraction)

    return () => {
      document.removeEventListener('click', handleFirstInteraction)
      document.removeEventListener('keydown', handleFirstInteraction)
    }
  }, [volume])

  // Fade in effect
  const fadeIn = (targetVolume = volume) => {
    if (!audioRef.current) return
    
    console.log('🎵 Starting fade in to volume:', targetVolume)
    audioRef.current.volume = 0
    
    audioRef.current.play().then(() => {
      console.log('🎵 Audio play started successfully')
      setIsPlaying(true)
    }).catch(error => {
      console.error('🚨 Error playing audio:', error)
      setAudioError('Error playing audio')
      return
    })
    
    let currentVolume = 0
    const increment = targetVolume / 20 // 20 steps for smooth fade
    
    fadeIntervalRef.current = setInterval(() => {
      if (currentVolume < targetVolume) {
        currentVolume = Math.min(currentVolume + increment, targetVolume)
        if (audioRef.current) {
          audioRef.current.volume = currentVolume
        }
      } else {
        clearInterval(fadeIntervalRef.current)
        console.log('🎵 Fade in completed')
      }
    }, 100) // Update every 100ms for 2 second fade
  }

  // Fade out effect
  const fadeOut = () => {
    if (!audioRef.current) return
    
    console.log('🎵 Starting fade out')
    const currentVolume = audioRef.current.volume
    let fadingVolume = currentVolume
    const decrement = currentVolume / 20
    
    fadeIntervalRef.current = setInterval(() => {
      if (fadingVolume > 0.01) {
        fadingVolume = Math.max(fadingVolume - decrement, 0)
        if (audioRef.current) {
          audioRef.current.volume = fadingVolume
        }
      } else {
        clearInterval(fadeIntervalRef.current)
        if (audioRef.current) {
          audioRef.current.pause()
          audioRef.current.volume = volume // Reset to default volume
        }
        setIsPlaying(false)
        console.log('🎵 Fade out completed')
      }
    }, 100)
  }

  // Handle phase changes - Start/Stop music based on phase and video state
  useEffect(() => {
    if (!audioRef.current || !audioInitialized) {
      console.log('🎵 Audio not initialized yet, skipping phase change')
      return
    }

    // Clear any ongoing fade
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current)
    }

    console.log('🎵 Phase change detected:', state.currentPhase)
    
    // Check if we're currently showing a video or in transition
    const isVideoPlaying = document.querySelector('video') !== null
    const isShowingGlobalIntro = document.querySelector('.global-intro-video') !== null
    const isInTransition = document.querySelector('[style*="zIndex: 999999"]') !== null
    
    const shouldPauseForVideo = isVideoPlaying || isShowingGlobalIntro || isInTransition
    
    if (shouldPauseForVideo) {
      console.log('🎵 Video/Transition detected - pausing music to avoid interference')
      if (isPlaying) {
        fadeOut()
      }
      return
    }
    
    // Start music for game phases (not menu) when no video is playing
    if (['museum', 'nbl', 'iss'].includes(state.currentPhase)) {
      if (!isPlaying && !isMuted) {
        console.log('🎵 Starting game music for phase:', state.currentPhase)
        fadeIn(volume)
      }
    } else {
      // Stop music for menu or other phases
      if (isPlaying) {
        console.log('🎵 Stopping game music (not in game phase)')
        fadeOut()
      }
    }

    return () => {
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current)
      }
    }
  }, [state.currentPhase, audioInitialized])

  // Additional effect to check for transition end and restart music
  useEffect(() => {
    const checkForTransitionEnd = () => {
      if (!audioRef.current || !audioInitialized) return

      const isInTransition = document.querySelector('[style*="zIndex: 999999"]') !== null
      const isVideoPlaying = document.querySelector('video') !== null
      const isShowingGlobalIntro = document.querySelector('.global-intro-video') !== null
      
      const shouldPauseForVideo = isVideoPlaying || isShowingGlobalIntro || isInTransition
      
      // If we're in a game phase, not in transition, and music isn't playing
      if (['museum', 'nbl', 'iss'].includes(state.currentPhase) && 
          !shouldPauseForVideo && 
          !isPlaying && 
          !isMuted) {
        console.log('🎵 Transition ended - restarting music')
        setTimeout(() => fadeIn(volume), 500) // Small delay to ensure transition is fully complete
      }
    }

    // Check periodically for transition end
    const interval = setInterval(checkForTransitionEnd, 1000)
    
    return () => clearInterval(interval)
  }, [state.currentPhase, isPlaying, isMuted, volume, audioInitialized])

  // Handle mute toggle
  const toggleMute = () => {
    if (!audioRef.current) return
    
    const newMutedState = !isMuted
    setIsMuted(newMutedState)
    
    console.log('🎵 Toggling mute:', newMutedState)
    
    if (newMutedState) {
      audioRef.current.volume = 0
    } else {
      audioRef.current.volume = volume
      // If we're in a game phase and audio is not playing, start it
      if (['museum', 'nbl', 'iss'].includes(state.currentPhase) && !isPlaying) {
        fadeIn(volume)
      }
    }
  }

  // Handle volume change
  const handleVolumeChange = (newVolume) => {
    if (!audioRef.current) return
    
    const volumeValue = parseFloat(newVolume)
    setVolume(volumeValue)
    
    console.log('🎵 Volume changed to:', volumeValue)
    
    if (!isMuted && isPlaying) {
      audioRef.current.volume = volumeValue
    }
  }

  // Don't render controls in menu
  if (state.currentPhase === 'menu') {
    return null
  }
  
}