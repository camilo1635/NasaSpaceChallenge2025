// src/Components/Shared/UI/CharacterSelection.jsx
import React, { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import { useCharacter } from '../../Utils/useCharacter'
import { useGameState } from '../../Utils/useGameState'
import { ASTRONAUT_CATALOG } from '../../Utils/characterData'

// Componente para mostrar preview 3D de cada astronauta
function AstronautPreview({ modelPath, scale, previewScale, previewPositionY }) {
  const { scene } = useGLTF(modelPath)
  
  return (
    <primitive 
      object={scene.clone()} 
      scale={scale * previewScale}
      position={[0, previewPositionY, 0]}  // ⬅️ Usa el valor del catálogo
      rotation={[0, Math.PI * 0.2, 0]}
    />
  )
}

// Card individual de cada astronauta
function CharacterCard({ character, isSelected, onSelect }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      onClick={() => onSelect(character.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: '130px',
        height: '190px',
        background: isSelected 
          ? 'linear-gradient(145deg, rgba(77, 166, 255, 0.3), rgba(0, 102, 204, 0.3))'
          : 'rgba(0, 0, 0, 0.6)',
        border: isSelected 
          ? '3px solid #4da6ff'
          : isHovered 
            ? '2px solid rgba(77, 166, 255, 0.5)'
            : '2px solid rgba(77, 166, 255, 0.2)',
        borderRadius: '15px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        transform: isHovered ? 'translateY(-8px) scale(1.05)' : 'translateY(0) scale(1)',
        boxShadow: isSelected
          ? '0 8px 32px rgba(77, 166, 255, 0.6)'
          : isHovered
            ? '0 6px 24px rgba(77, 166, 255, 0.4)'
            : '0 4px 12px rgba(0, 0, 0, 0.5)',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {/* Preview 3D */}
      <div style={{
        width: '100%',
        height: '200px',
        background: 'linear-gradient(to bottom, rgba(0, 20, 40, 0.8), rgba(0, 40, 80, 0.8))',
        position: 'relative'
      }}>
        <Canvas
          camera={{ position: [0, 0, 4], fov: 50 }}
          style={{ width: '100%', height: '100%' }}
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[2, 2, 2]} intensity={1} />
          <pointLight position={[-2, 1, -1]} intensity={0.5} color="#4da6ff" />
          
          <Suspense fallback={null}>
            <AstronautPreview 
              modelPath={`/models/${character.model}`}
              scale={character.scale}
              previewScale={character.previewScale}
              previewPositionY={character.previewPositionY}  // ⬅️ Agregar esta línea
            />
          </Suspense>
          
          <OrbitControls 
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={2}
          />
        </Canvas>
      </div>

      {/* Info del astronauta */}
      <div style={{
        padding: '15px',
        textAlign: 'center'
      }}>
        <h3 style={{
          color: isSelected ? '#4da6ff' : '#fff',
          fontSize: '18px',
          margin: '0 0 5px 0',
          fontWeight: 'bold',
          textShadow: isSelected ? '0 0 10px rgba(77, 166, 255, 0.8)' : 'none'
        }}>
          Astronaut #{character.id}
        </h3>
        
        {isSelected && (
          <div style={{
            color: '#4da6ff',
            fontSize: '12px',
            marginTop: '5px',
            fontWeight: 'bold',
            animation: 'pulse 1.5s ease-in-out infinite'
          }}>
            ✓ SELECTED
          </div>
        )}
      </div>

      {/* Indicator de selección */}
      {isSelected && (
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          width: '30px',
          height: '30px',
          background: '#4da6ff',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
          boxShadow: '0 0 15px rgba(77, 166, 255, 0.8)'
        }}>
          ✓
        </div>
      )}
    </div>
  )
}

// Componente principal
function CharacterSelection() {
  const { selectedCharacter, selectCharacter } = useCharacter()
  const { dispatch } = useGameState()
  const [currentSelection, setCurrentSelection] = useState(selectedCharacter?.id || 1)

  const handleCharacterSelect = (characterId) => {
    setCurrentSelection(characterId)
    selectCharacter(characterId)
  }

  const handleConfirm = () => {
    if (currentSelection) {
      // Ir al video intro y luego al museo
      dispatch({ type: 'SET_PHASE', payload: 'museum' })
    }
  }

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(135deg, #000428 0%, #004e92 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Estrellas de fondo */}
      <div className="stars-background">
        {Array.from({ length: 150 }, (_, i) => (
          <div 
            key={i} 
            className="star" 
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
              width: `${Math.random() * 2}px`,
              height: `${Math.random() * 2}px`,
            }}
          />
        ))}
      </div>

      {/* Contenido principal */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90%',
        maxWidth: '1200px',
        textAlign: 'center'
      }}>
        {/* Título */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ fontSize: '60px', marginBottom: '10px' }}>🚀</div>
          <h1 style={{
            fontSize: '38px',
            color: '#4da6ff',
            textShadow: '0 0 20px rgba(77, 166, 255, 0.6)',
            marginBottom: '10px',
            letterSpacing: '2px'
          }}>
            SELECT YOUR ASTRONAUT
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#ccc',
            margin: '0'
          }}>
            Choose your character for the space adventure
          </p>
        </div>

        {/* Grid de personajes */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 150px))', // ⬅️ Cambia el segundo valor
          gap: '20px 10px',  // vertical horizontal
          justifyContent: 'center', // ⬅️ Agrega esto para centrar las tarjetas
          marginBottom: '40px',
          maxWidth: '1000px',
          margin: '0 auto 40px auto',
          padding: '20px'
        }}>
          {ASTRONAUT_CATALOG.map((character) => (
            <CharacterCard
              key={character.id}
              character={character}
              isSelected={currentSelection === character.id}
              onSelect={handleCharacterSelect}
            />
          ))}
        </div>

        {/* Botón confirmar */}
        <button
          onClick={handleConfirm}
          disabled={!currentSelection}
          style={{
            background: currentSelection
              ? 'linear-gradient(45deg, #4da6ff, #0066cc)'
              : 'rgba(100, 100, 100, 0.5)',
            border: 'none',
            color: 'white',
            padding: '18px 50px',
            fontSize: '20px',
            borderRadius: '30px',
            cursor: currentSelection ? 'pointer' : 'not-allowed',
            fontWeight: 'bold',
            boxShadow: currentSelection 
              ? '0 4px 20px rgba(77, 166, 255, 0.5)'
              : 'none',
            transition: 'all 0.3s ease',
            letterSpacing: '1px',
            opacity: currentSelection ? 1 : 0.5
          }}
          onMouseEnter={(e) => {
            if (currentSelection) {
              e.target.style.transform = 'translateY(-3px)'
              e.target.style.boxShadow = '0 6px 25px rgba(77, 166, 255, 0.7)'
            }
          }}
          onMouseLeave={(e) => {
            if (currentSelection) {
              e.target.style.transform = 'translateY(0)'
              e.target.style.boxShadow = '0 4px 20px rgba(77, 166, 255, 0.5)'
            }
          }}
        >
          CONTINUE
        </button>

        <p style={{
          marginTop: '15px',
          fontSize: '13px',
          color: '#888',
          fontStyle: 'italic'
        }}>
          {currentSelection 
            ? `Astronaut #${currentSelection} selected - Click to begin!`
            : 'Please select an astronaut to continue'}
        </p>
      </div>
    </div>
  )
}

export default CharacterSelection