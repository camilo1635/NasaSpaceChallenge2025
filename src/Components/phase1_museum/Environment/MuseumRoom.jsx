// src/Components/phase1_museum/Environment/MuseumRoom.jsx
import React from "react";
import { Html } from "@react-three/drei";

export function MuseumRoom() {
  return (
    <group>
      {/* ===== LETRERO DE CONTROLES FIJO EN ESQUINA SUPERIOR IZQUIERDA ===== */}
      <Html 
        transform={false}
        occlude={false}
        calculatePosition={() => [20, 20, 0]}
        style={{
          position: 'absolute',
          top: '0px',
          left: '0px',
          zIndex: 9999,
          pointerEvents: 'none'
        }}
      >
        <div style={{
          background: 'rgba(0, 0, 0, 0.85)',
          color: '#fff',
          padding: '12px 16px',
          borderRadius: '8px',
          fontFamily: 'Arial, sans-serif',
          fontSize: '14px',
          border: '1px solid #00ffff',
          boxShadow: '0 4px 8px rgba(0, 255, 255, 0.3)',
          minWidth: '200px',
          position: 'fixed',
          top: '20px',
          left: '20px'
        }}>
          <div style={{ 
            color: '#00ffff', 
            fontWeight: 'bold', 
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            🏛️ Museum ISS
          </div>
          <div style={{ lineHeight: '1.5' }}>
            <div style={{ marginBottom: '4px' }}>
              🎮 <strong>WASD</strong> - Move
            </div>
            <div style={{ marginBottom: '4px' }}>
              🖱️ <strong>Mouse</strong> - Look around
            </div>
            <div>
              👀 <strong>Observe</strong> - The information signs
            </div>
          </div>
        </div>
      </Html>

      {/* ===== ESTRUCTURA DEL PASILLO ===== */}
      
      {/* Piso principal */}
      <mesh receiveShadow position={[0, -0.5, 0]}>
        <boxGeometry args={[7, 1, 40]} />
        <meshStandardMaterial 
          color="#e8e8e8" 
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* Líneas guía en el piso */}
      <mesh position={[0, -0.49, 0]}>
        <boxGeometry args={[0.1, 0.02, 40]} />
        <meshStandardMaterial color="#4da6ff" emissive="#4da6ff" emissiveIntensity={0.3} />
      </mesh>

      {/* Techo */}
      <mesh position={[0, 4.5, 0]}>
        <boxGeometry args={[7, 0.5, 40]} />
        <meshStandardMaterial color="#f5f5f5" />
      </mesh>

      {/* Pared lateral izquierda */}
      <mesh position={[-3.5, 2, 0]}>
        <boxGeometry args={[0.5, 5, 40]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Pared lateral derecha */}
      <mesh position={[3.5, 2, 0]}>
        <boxGeometry args={[0.5, 5, 40]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Pared trasera (final del museo) */}
      <mesh position={[0, 2, -19.5]}>
        <boxGeometry args={[7, 5, 0.5]} />
        <meshStandardMaterial color="#dddddd" />
      </mesh>

      {/* ===== CARTELES MULTIMEDIA EN LAS PAREDES ===== */}
      
      {/* Cartel 1 - Historia de la ISS con Video (Pared Izquierda) */}
      <mesh position={[-3.2, 2, -8]} rotation={[0, Math.PI/2, 0]}>
        <planeGeometry args={[4, 3]} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>
      <Html 
        position={[-3.15, 2, -8]} 
        rotation={[0, Math.PI/2, 0]} 
        center
        distanceFactor={8}
        occlude
        zIndexRange={[100, 0]}
      >
        <div style={{
          background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
          color: 'white',
          padding: '20px',
          borderRadius: '12px',
          width: '280px',
          height: '200px',
          fontFamily: 'Arial, sans-serif',
          border: '3px solid #4da6ff',
          boxShadow: '0 8px 16px rgba(0,0,0,0.4)',
          overflow: 'hidden'
        }}>
          <h2 style={{ 
            margin: '0 0 10px', 
            fontSize: '14px', 
            textAlign: 'center',
            color: '#4da6ff',
            textShadow: '0 0 10px #4da6ff'
          }}>
            🛰️ Historia de la ISS
          </h2>
          
          {/* Video de la ISS */}
          <video 
            src="/videos/nbl_video.mp4"
            width="240" 
            height="120"
            controls
            loop
            muted
            autoPlay
            style={{
              borderRadius: '8px',
              border: '2px solid #4da6ff',
              marginBottom: '8px',
              display: 'block',
              margin: '0 auto 8px auto'
            }}
            onError={() => console.log('Video no encontrado')}
          >
            Tu navegador no soporta video HTML5
          </video>
          
          <div style={{ fontSize: '10px', textAlign: 'center', lineHeight: '1.2' }}>
            <p style={{ margin: '2px 0', color: '#cccccc' }}>
              25 años de investigación espacial • Más de 260 astronautas
            </p>
          </div>
        </div>
      </Html>

      {/* Cartel 2 - Astronautas con Galería de Imágenes (Pared Derecha) */}
      <mesh position={[3.2, 2, 0]} rotation={[0, -Math.PI/2, 0]}>
        <planeGeometry args={[4, 3]} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>
      <Html 
        position={[3.15, 2, 0]} 
        rotation={[0, -Math.PI/2, 0]} 
        center
        distanceFactor={8}
        occlude
        zIndexRange={[100, 0]}
      >
        <div style={{
          background: 'linear-gradient(135deg, #2d1b69, #11998e)',
          color: 'white',
          padding: '20px',
          borderRadius: '12px',
          width: '280px',
          height: '200px',
          fontFamily: 'Arial, sans-serif',
          border: '3px solid #ff6b4d',
          boxShadow: '0 8px 16px rgba(0,0,0,0.4)'
        }}>
          <h2 style={{ 
            margin: '0 0 10px', 
            fontSize: '14px', 
            textAlign: 'center',
            color: '#ff6b4d',
            textShadow: '0 0 10px #ff6b4d'
          }}>
            👨‍🚀 Astronautas Destacados
          </h2>
          
          {/* Galería de imágenes de astronautas */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: '5px',
            marginBottom: '10px'
          }}>
            {[
              '/images/astronaut1.jpg',
              '/images/astronaut2.jpg', 
              '/images/astronaut3.jpg',
              '/images/astronaut4.jpg',
              '/images/astronaut5.jpg',
              '/images/astronaut6.jpg'
            ].map((src, index) => (
              <img 
                key={index}
                src={src}
                alt={`Astronauta ${index + 1}`}
                style={{
                  width: '60px',
                  height: '45px',
                  objectFit: 'cover',
                  borderRadius: '4px',
                  border: '1px solid #ff6b4d',
                  transition: 'transform 0.2s'
                }}
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNDUiIHZpZXdCb3g9IjAgMCA2MCA0NSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjQ1IiBmaWxsPSIjMzMzIi8+Cjx0ZXh0IHg9IjMwIiB5PSIyNSIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIxMCI+8J+RqOKAjfCfmoA8L3RleHQ+Cjwvc3ZnPgo=';
                }}
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              />
            ))}
          </div>
          
          <div style={{ fontSize: '9px', textAlign: 'center', color: '#cccccc' }}>
            Héroes del espacio que han vivido en la ISS
          </div>
        </div>
      </Html>

      {/* Cartel 3 - Experimentos con Audio y Video (Pared Izquierda) */}
      <mesh position={[-3.2, 2, 8]} rotation={[0, Math.PI/2, 0]}>
        <planeGeometry args={[4, 3]} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>
      <Html 
        position={[-3.15, 2, 8]} 
        rotation={[0, Math.PI/2, 0]} 
        center
        distanceFactor={8}
        occlude
        zIndexRange={[100, 0]}
      >
        <div style={{
          background: 'linear-gradient(135deg, #0f3460, #16537e)',
          color: 'white',
          padding: '20px',
          borderRadius: '12px',
          width: '280px',
          height: '200px',
          fontFamily: 'Arial, sans-serif',
          border: '3px solid #28a745',
          boxShadow: '0 8px 16px rgba(0,0,0,0.4)'
        }}>
          <h2 style={{ 
            margin: '0 0 10px', 
            fontSize: '14px', 
            textAlign: 'center',
            color: '#28a745',
            textShadow: '0 0 10px #28a745'
          }}>
            🔬 Experimentos en la ISS
          </h2>
          
          {/* Video de experimentos */}
          <video 
            src="/videos/nbl_video.mp4"
            width="200" 
            height="100"
            controls
            loop
            muted
            style={{
              borderRadius: '8px',
              border: '2px solid #28a745',
              marginBottom: '10px',
              display: 'block',
              margin: '0 auto 10px auto'
            }}
            onError={() => console.log('Video de experimentos no encontrado')}
          >
            Tu navegador no soporta video HTML5
          </video>
        </div>
      </Html>

      {/* Cartel 4 - Tecnología Espacial con Modelos 3D (Pared Derecha) */}
      <mesh position={[3.2, 2, -12]} rotation={[0, -Math.PI/2, 0]}>
        <planeGeometry args={[4, 3]} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>
      <Html 
        position={[3.15, 2, -12]} 
        rotation={[0, -Math.PI/2, 0]} 
        center
        distanceFactor={8}
        occlude
        zIndexRange={[100, 0]}
      >
        <div style={{
          background: 'linear-gradient(135deg, #141e30, #243b55)',
          color: 'white',
          padding: '20px',
          borderRadius: '12px',
          width: '280px',
          height: '200px',
          fontFamily: 'Arial, sans-serif',
          border: '3px solid #ffc107',
          boxShadow: '0 8px 16px rgba(0,0,0,0.4)'
        }}>
          <h2 style={{ 
            margin: '0 0 10px', 
            fontSize: '14px', 
            textAlign: 'center',
            color: '#ffc107',
            textShadow: '0 0 10px #ffc107'
          }}>
            🚀 Tecnología Espacial
          </h2>
          
          {/* Imagen interactiva de la ISS */}
          <div style={{ textAlign: 'center', marginBottom: '10px' }}>
            <img 
              src="/images/Anne.jpg"
              alt="Estructura de la ISS"
              style={{
                width: '220px',
                height: '120px',
                objectFit: 'cover',
                borderRadius: '8px',
                border: '2px solid #ffc107',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onError={(e) => {
                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDIyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMjAiIGhlaWdodD0iMTIwIiBmaWxsPSIjMjIyIi8+Cjx0ZXh0IHg9IjExMCIgeT0iNjAiIGZpbGw9IiNmZmMxMDciIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMTYiPvCfmoAgSVNTIE1vZGVsIDNEPC90ZXh0Pgo8L3N2Zz4K';
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.05)';
                e.target.style.boxShadow = '0 0 20px #ffc107';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
          
          <div style={{ fontSize: '10px', textAlign: 'center', color: '#cccccc', lineHeight: '1.2' }}>
            Explora los módulos y componentes de la Estación Espacial
          </div>
        </div>
      </Html>

      {/* ===== ILUMINACIÓN AMBIENTAL MEJORADA ===== */}
      
      {/* Luces principales del techo */}
      <pointLight position={[0, 4, 5]} intensity={1.5} color="#ffffff" />
      <pointLight position={[0, 4, -5]} intensity={1.5} color="#ffffff" />
      <pointLight position={[0, 4, -15]} intensity={1.5} color="#ffffff" />
      
      {/* Luces de acento para carteles multimedia */}
      <pointLight position={[-2, 3, -8]} intensity={1.0} color="#4da6ff" />
      <pointLight position={[2, 3, 0]} intensity={1.0} color="#ff6b4d" />
      <pointLight position={[-2, 3, 8]} intensity={1.0} color="#28a745" />
      <pointLight position={[2, 3, -12]} intensity={1.0} color="#ffc107" />
      
      {/* Luz cerca de la puerta */}
      <pointLight position={[0, 4, -18]} intensity={0.8} color="#00ffff" />

      {/* ===== DECORACIÓN FUTURISTA MEJORADA ===== */}
      
      {/* Elementos decorativos del techo */}
      {[-12, -6, 0, 6, 12].map((z, index) => (
        <mesh key={index} position={[0, 4.2, z]}>
          <cylinderGeometry args={[0.3, 0.3, 0.2]} />
          <meshStandardMaterial 
            color="#cccccc" 
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      ))}

      {/* Partículas flotantes ambientales mejoradas */}
      {Array.from({length: 12}, (_, i) => (
        <mesh 
          key={i}
          position={[
            (Math.random() - 0.5) * 6, 
            1 + Math.random() * 2.5, 
            (Math.random() - 0.5) * 35
          ]}
        >
          <sphereGeometry args={[0.03]} />
          <meshStandardMaterial 
            color={['#ffffff', '#4da6ff', '#ff6b4d', '#28a745', '#ffc107'][Math.floor(Math.random() * 5)]} 
            emissive={['#ffffff', '#4da6ff', '#ff6b4d', '#28a745', '#ffc107'][Math.floor(Math.random() * 5)]} 
            emissiveIntensity={0.6}
          />
        </mesh>
      ))}

      {/* Marcos holográficos para los carteles */}
      {[
        {pos: [-3.1, 2, -8], rot: [0, Math.PI/2, 0], color: '#4da6ff'},
        {pos: [3.1, 2, 0], rot: [0, -Math.PI/2, 0], color: '#ff6b4d'},
        {pos: [-3.1, 2, 8], rot: [0, Math.PI/2, 0], color: '#28a745'},
        {pos: [3.1, 2, -12], rot: [0, -Math.PI/2, 0], color: '#ffc107'}
      ].map((frame, index) => (
        <mesh key={`frame-${index}`} position={frame.pos} rotation={frame.rot}>
          <ringGeometry args={[2.2, 2.3, 8]} />
          <meshStandardMaterial 
            color={frame.color} 
            emissive={frame.color}
            emissiveIntensity={0.2}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}
    </group>
  );
}