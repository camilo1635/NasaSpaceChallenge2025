// src/Components/phase1_museum/Environment/MuseumRoom.jsx
import React, { useState, useEffect } from "react";
import { Html } from "@react-three/drei";
import { createPortal } from "react-dom";

// Componente del modal de astronauta que se renderiza fuera del canvas 3D
function AstronautModal({ selectedAstronaut, onClose }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!selectedAstronaut) return null;

  return createPortal(
    <div style={{
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100vw',
      height: '100vh',
      background: 'rgba(0, 0, 0, 0.95)',
      zIndex: 10000,
      display: 'flex',
      flexDirection: 'column',
      padding: '40px',
      boxSizing: 'border-box',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Botón cerrar */}
      <button 
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          background: '#ff6b4d',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          fontSize: '20px',
          cursor: 'pointer',
          zIndex: 10001
        }}
      >
        ×
      </button>

      {/* Contenido dividido */}
      <div style={{
        display: 'flex',
        flex: 1,
        gap: '40px',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%'
      }}>
        {/* Lado izquierdo - Imagen */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <img 
            src={selectedAstronaut.image}
            alt={selectedAstronaut.name}
            style={{
              width: '100%',
              maxWidth: '400px',
              height: '300px',
              objectFit: 'cover',
              borderRadius: '12px',
              border: '3px solid #ff6b4d',
              boxShadow: '0 8px 16px rgba(255, 107, 77, 0.3)'
            }}
            onError={(e) => {
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjMzMzIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiBmaWxsPSIjZmY2YjRkIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjI0Ij7wn5Gp4oCN8J+agDwvdGV4dD4KPC9zdmc+Cg==';
            }}
          />
        </div>

        {/* Lado derecho - Texto informativo */}
        <div style={{
          flex: 1,
          color: 'white',
          fontSize: '16px',
          lineHeight: '1.6'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #2d1b69, #11998e)',
            padding: '30px',
            borderRadius: '12px',
            border: '2px solid #ff6b4d',
            boxShadow: '0 8px 16px rgba(0,0,0,0.4)',
            height: '100%'
          }}>
            <h3 style={{
              color: '#ff6b4d',
              fontSize: '20px',
              marginBottom: '20px',
              textShadow: '0 0 5px #ff6b4d'
            }}>
              {selectedAstronaut.name}
            </h3>
            <p style={{ margin: 0 }}>
              {selectedAstronaut.description}
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

// Componente del panel de astronautas
function AstronautPanel() {
  const [selectedAstronaut, setSelectedAstronaut] = useState(null);

  const astronauts = [
    {
    id: 1,
    name: "Neil A. Armstrong",
    icon: "👨‍🚀",
    image: "/images/1.jpg",
    description: "First human to walk on the Moon on July 20, 1969, as commander of Apollo 11. Naval aviator (1949–1952) and later aeronautical research scientist at NACA/NASA since 1955. Between 1960–1962, he flew the X-15 rocket plane seven times, reaching 207,500 feet and Mach 5.74 (3,989 mph). Pioneer in adaptive flight control systems and hypersonic sensor testing. Became an astronaut in 1962 and spoke the historic words upon stepping onto the lunar surface."
    },
    {
      id: 2,
      name: "Sally K. Ride",
      icon: "👩‍🚀",
      image: "/images/2.jpg",
      description: "First American woman in space, flying as Mission Specialist on STS-7 aboard Challenger in June 1983. The first Shuttle mission with a five-person crew, it deployed satellites for Canada and Indonesia, tested the Shuttle Pallet Satellite (SPAS-01) with the robotic arm, and performed the first formation flight with a free-flying satellite. The mission also carried U.S./German science payloads, operated electrophoresis and reactor experiments, and activated seven Getaway Specials. Lasted 147 hours, landing at Edwards Air Force Base."
    },
    {
      id: 3,
      name: "YUI Kimiya",
      icon: "👨‍🚀",
      image: "/images/3.jpg",
      description: "YUI Kimiya was born in 1970 in Nagano. In 2015, he spent 142 days aboard the International Space Station as a Flight Engineer as part of the crew of Expeditions 44 and 45. During this stay, he controlled the robotics used in the capture of and conducted both Japanese and international scientific and medical experiments utilizing the space environment. In August 2025, he began his second longduration mission aboard the ISS. He is currently participating in various mission activities as a crew member of Expedition 73/74."
    },
    {
      id: 4,
      name: "Zena Cardman",
      icon: "👩‍🚀",
      image: "/images/4.jpg",
      description: "Zena Cardman was selected as a NASA astronaut in 2017. Currently, Cardman is serving as commander for NASA's SpaceX Crew-11 mission, which launched on August 1, 2025, to the International Space Station. Upon her arrival to the space station, she became a flight engineer of Expeditions 73/74 for a long-duration science expedition aboard the orbiting laboratory."
    }
  ];

  return (
    <>
      <div style={{
        background: 'linear-gradient(135deg, #2d1b69, #11998e)',
        color: 'white',
        padding: '20px',
        borderRadius: '12px',
        width: '280px',
        height: '300px',
        fontFamily: 'Arial, sans-serif',
        border: '3px solid #ff6b4d',
        boxShadow: '0 8px 16px rgba(0,0,0,0.4)'
      }}>
        <h2 style={{ 
          margin: '0 0 15px', 
          fontSize: '14px', 
          textAlign: 'center',
          color: '#ff6b4d',
          textShadow: '0 0 10px #ff6b4d'
        }}>
          👨‍🚀 Featured Astronauts
        </h2>
        
        {/* 4 iconos seleccionables */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)', 
          gap: '15px',
          marginBottom: '15px'
        }}>
          {astronauts.map((astronaut) => (
            <div 
              key={astronaut.id}
              onClick={() => setSelectedAstronaut(astronaut)}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '2px solid #ff6b4d',
                borderRadius: '8px',
                padding: '15px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.05)';
                e.target.style.background = 'rgba(255, 107, 77, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              <div style={{ fontSize: '24px', marginBottom: '5px' }}>
                {astronaut.icon}
              </div>
              <div style={{ fontSize: '10px', color: '#cccccc' }}>
                {astronaut.name.split(' ')[0]}
              </div>
            </div>
          ))}
        </div>
        
        <div style={{ fontSize: '9px', textAlign: 'center', color: '#cccccc' }}>
          Select an astronaut to learn more
        </div>
      </div>
      
      <AstronautModal 
        selectedAstronaut={selectedAstronaut} 
        onClose={() => setSelectedAstronaut(null)} 
      />
    </>
  );
}

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
            🏛️ Exhibition hall
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
            Neutral Buoyancy Laboratory (NBL)
          </h2>
          
          {/* Video de NBL */}
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
        </div>
      </Html>

      {/* Cartel 2 - Astronautas con Galería de Imágenes (Pared Derecha) */}
      <mesh position={[-3.2, 2, -8]} rotation={[0, Math.PI/2, 0]}>
        <planeGeometry args={[4, 3]} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>
      <Html 
        position={[3.15, 2, 0]} 
        rotation={[0, Math.PI/2, 0]} 
        center
        distanceFactor={8}
        occlude
        zIndexRange={[100, 0]}
      >
        <AstronautPanel />
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
          boxShadow: '0 8px 16px rgba(0,0,0,0.4)',
          overflow: 'hidden'
        }}>
          <h2 style={{ 
            margin: '0 0 10px', 
            fontSize: '14px', 
            textAlign: 'center',
            color: '#28a745',
            textShadow: '0 0 10px #28a745'
          }}>
            🔬 15 Benefits of Space Station Research
          </h2>
          
          {/* Video de experimentos */}
          <video 
            src="/videos/15 Benefits of Space Station Research.mp4"
            width="240" 
            height="120"
            controls
            loop
            muted
            autoPlay
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

      {/* ===== ILUMINACIÓN AMBIENTAL MEJORADA ===== */}
      
      {/* Luces principales del techo */}
      <pointLight position={[0, 4, 5]} intensity={1.5} color="#ffffff" />
      <pointLight position={[0, 4, -5]} intensity={1.5} color="#ffffff" />
      <pointLight position={[0, 4, -15]} intensity={1.5} color="#ffffff" />
      
      {/* Luces de acento para carteles multimedia */}
      <pointLight position={[-2, 3, -8]} intensity={1.0} color="#4da6ff" />
      <pointLight position={[2, 3, 0]} intensity={1.0} color="#ff6b4d" />
      <pointLight position={[-2, 3, 8]} intensity={1.0} color="#28a745" />
      
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