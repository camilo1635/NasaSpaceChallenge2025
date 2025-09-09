// src/Components/Utils/DebugStateMonitor.jsx
import React, { useEffect, useRef } from 'react'
import { Html } from '@react-three/drei'
import { useGameState } from './useGameState'

export function DebugStateMonitor() {
  const { state } = useGameState()
  const renderCount = useRef(0)
  
  // Incrementar contador de renders
  renderCount.current += 1
  
  // Log en cada cambio de estado
  useEffect(() => {
    console.log('🔍 [DEBUG] Estado global cambió:', {
      renderCount: renderCount.current,
      keysCollected: state.progress.museum.keysCollected,
      visited: state.progress.museum.visited,
      completed: state.progress.museum.completed,
      fullState: state,
      timestamp: new Date().toLocaleTimeString()
    })
  }, [state])

  if (!import.meta.env.DEV) return null

  return (
    <Html position={[4, 3, 0]} center>
      <div style={{
        background: 'rgba(255,0,0,0.9)',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        fontSize: '11px',
        fontFamily: 'monospace',
        maxWidth: '250px',
        border: '2px solid #ff0000'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
          🔍 DEBUG STATE MONITOR
        </div>
        <div>Renders: {renderCount.current}</div>
        <div>Keys: {state.progress.museum.keysCollected}/{state.progress.museum.totalKeys}</div>
        <div>Visited: {state.progress.museum.visited.length}/{state.progress.museum.totalInfo}</div>
        <div>Completed: {state.progress.museum.completed ? 'YES' : 'NO'}</div>
        <div>Phase: {state.currentPhase}</div>
        <div>Notifications: {state.notifications.length}</div>
        <div style={{ marginTop: '5px', fontSize: '10px' }}>
          Visited IDs: [{state.progress.museum.visited.join(', ')}]
        </div>
      </div>
    </Html>
  )
}