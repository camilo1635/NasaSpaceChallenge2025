// src/Components/phase1_museum/Environment/MuseumRoom.jsx
import React from "react";
import { Html } from "@react-three/drei";

export function MuseumRoom() {
  return (
    <group>
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

      {/* ===== CARTELES INFORMATIVOS EN LAS PAREDES ===== */}
      
      {/* Cartel 1 - Historia de la ISS (Pared Izquierda) */}
      <mesh position={[-3.2, 2, -8]} rotation={[0, Math.PI/2, 0]}>
        <planeGeometry args={[3, 2]} />
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
          background: 'linear-gradient(135deg, #4da6ff, #0066cc)',
          color: 'white',
          padding: '15px',
          borderRadius: '8px',
          width: '200px',
          height: '140px',
          fontFamily: 'Arial, sans-serif',
          fontSize: '10px',
          lineHeight: '1.3',
          border: '2px solid #fff',
          boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
          transform: 'scale(1)',
          transformOrigin: 'center'
        }}>
          <h2 style={{ margin: '0 0 8px', fontSize: '12px', textAlign: 'center' }}>
            🛰️ Historia de la ISS
          </h2>
          <ul style={{ margin: 0, paddingLeft: '12px', fontSize: '9px' }}>
            <li>1998: Lanzamiento del primer módulo Zarya</li>
            <li>2000: Primera tripulación permanente</li>
            <li>25 años de investigación continua</li>
            <li>Más de 260 astronautas de 19 países</li>
            <li>Más de 3,000 experimentos realizados</li>
          </ul>
        </div>
      </Html>

      {/* Cartel 2 - Astronautas Destacados (Pared Derecha) */}
      <mesh position={[3.2, 2, 0]} rotation={[0, -Math.PI/2, 0]}>
        <planeGeometry args={[3, 2]} />
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
          background: 'linear-gradient(135deg, #ff6b4d, #cc3300)',
          color: 'white',
          padding: '15px',
          borderRadius: '8px',
          width: '200px',
          height: '140px',
          fontFamily: 'Arial, sans-serif',
          fontSize: '10px',
          lineHeight: '1.3',
          border: '2px solid #fff',
          boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
          transform: 'scale(1)',
          transformOrigin: 'center'
        }}>
          <h2 style={{ margin: '0 0 8px', fontSize: '12px', textAlign: 'center' }}>
            👨‍🚀 Astronautas Destacados
          </h2>
          <ul style={{ margin: 0, paddingLeft: '12px', fontSize: '9px' }}>
            <li>William Shepherd - Primer comandante</li>
            <li>Peggy Whitson - Récord de tiempo (665 días)</li>
            <li>Gennady Padalka - Más de 878 días acumulados</li>
            <li>Más de 260 caminatas espaciales</li>
            <li>Cooperación internacional histórica</li>
          </ul>
        </div>
      </Html>

      {/* Cartel 3 - Avances Tecnológicos (Pared Izquierda) */}
      <mesh position={[-3.2, 2, 8]} rotation={[0, Math.PI/2, 0]}>
        <planeGeometry args={[3, 2]} />
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
          background: 'linear-gradient(135deg, #28a745, #155724)',
          color: 'white',
          padding: '15px',
          borderRadius: '8px',
          width: '200px',
          height: '140px',
          fontFamily: 'Arial, sans-serif',
          fontSize: '10px',
          lineHeight: '1.3',
          border: '2px solid #fff',
          boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
          transform: 'scale(1)',
          transformOrigin: 'center'
        }}>
          <h2 style={{ margin: '0 0 8px', fontSize: '12px', textAlign: 'center' }}>
            🔬 Avances Tecnológicos
          </h2>
          <ul style={{ margin: 0, paddingLeft: '12px', fontSize: '9px' }}>
            <li>Desarrollo de medicamentos en microgravedad</li>
            <li>Investigación agrícola avanzada</li>
            <li>Cristalización de proteínas</li>
            <li>Tecnologías de comunicación</li>
            <li>Beneficios directos para la Tierra</li>
          </ul>
        </div>
      </Html>

      {/* ===== ILUMINACIÓN AMBIENTAL ===== */}
      
      {/* Luces principales del techo */}
      <pointLight position={[0, 4, 5]} intensity={1.2} color="#ffffff" />
      <pointLight position={[0, 4, -5]} intensity={1.2} color="#ffffff" />
      <pointLight position={[0, 4, -15]} intensity={1.2} color="#ffffff" />
      
      {/* Luces de acento para carteles */}
      <pointLight position={[-2, 3, -8]} intensity={0.8} color="#4da6ff" />
      <pointLight position={[2, 3, 0]} intensity={0.8} color="#ff6b4d" />
      <pointLight position={[-2, 3, 8]} intensity={0.8} color="#28a745" />
      
      {/* Luz cerca de la puerta */}
      <pointLight position={[0, 4, -18]} intensity={0.8} color="#00ffff" />

      {/* ===== DECORACIÓN FUTURISTA ===== */}
      
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

      {/* Partículas flotantes ambientales */}
      {Array.from({length: 8}, (_, i) => (
        <mesh 
          key={i}
          position={[
            (Math.random() - 0.5) * 6, 
            1 + Math.random() * 2, 
            (Math.random() - 0.5) * 35
          ]}
        >
          <sphereGeometry args={[0.02]} />
          <meshStandardMaterial 
            color="#ffffff" 
            emissive="#ffffff" 
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}
    </group>
  );
}