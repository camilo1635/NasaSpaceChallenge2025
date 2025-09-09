// src/Components/phase1_museum/Interactive/SimpleDoor.jsx
import { useRef, useState, useEffect, useCallback } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";

export function SimpleDoor({ position = [0, 0, -17] }) {
  const doorRef = useRef();
  const { camera } = useThree();
  const [isNearby, setIsNearby] = useState(false);

  // Animación y detección de cercanía
  useFrame(() => {
    if (!doorRef.current) return;

    // Detección de cercanía
    const dx = camera.position.x - position[0];
    const dz = camera.position.z - position[2];
    const distance = Math.hypot(dx, dz);
    
    setIsNearby(distance < 8);

    // Animación suave de apertura (siempre abierta)
    const targetY = position[1] + 5; // Puerta siempre arriba
    const currentY = doorRef.current.position.y;
    const delta = targetY - currentY;

    if (Math.abs(delta) > 0.01) {
      doorRef.current.position.y += Math.sign(delta) * 0.05;
    }
  });

  // Iniciar transición usando función global
  const startTransition = useCallback(() => {
    console.log('🚪 SimpleDoor: Iniciando transición a NBL...');
    
    // Llamar a la función de transición global
    if (window.startGlobalTransition) {
      window.startGlobalTransition('nbl');
    } else {
      console.error('❌ Función de transición global no disponible');
    }
  }, []);

  // Detectar tecla ESPACIO
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'Space' && isNearby) {
        e.preventDefault();
        startTransition();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isNearby, startTransition]);

  return (
    <group>
      {/* Marco de la puerta */}
      <mesh position={[position[0], position[1] + 3, position[2] - 0.5]}>
        <boxGeometry args={[4.5, 0.3, 1]} />
        <meshStandardMaterial color="#666" />
      </mesh>
      <mesh position={[position[0] - 2.25, position[1], position[2] - 0.5]}>
        <boxGeometry args={[0.3, 6, 1]} />
        <meshStandardMaterial color="#666" />
      </mesh>
      <mesh position={[position[0] + 2.25, position[1], position[2] - 0.5]}>
        <boxGeometry args={[0.3, 6, 1]} />
        <meshStandardMaterial color="#666" />
      </mesh>

      {/* Puerta (invisible/abierta) */}
      <mesh ref={doorRef} position={[position[0], position[1] + 5, position[2]]} castShadow receiveShadow>
        <boxGeometry args={[4, 15, 0.7]} />
        <meshStandardMaterial 
          color="#28a745"
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Efectos de luz */}
      <pointLight 
        position={[position[0], position[1], position[2] + 2]} 
        intensity={1.5} 
        color="#28a745" 
      />

      {/* Panel de acceso - POSICIÓN BAJADA */}
      <Html 
        position={[position[0], position[1] + 1, position[2] + 1]} // Bajado de 3.5 a 1
        center
        distanceFactor={10}
        occlude
        zIndexRange={[100, 0]}
      >
        <div style={{
          background: "linear-gradient(135deg, rgba(40,167,69,0.95), rgba(0,100,0,0.95))",
          color: "#fff",
          padding: "15px",
          borderRadius: "12px",
          textAlign: "center",
          fontFamily: "Arial, sans-serif",
          border: "2px solid #28a745",
          boxShadow: "0 6px 20px rgba(0,0,0,0.4)",
          width: "240px"
        }}>
          <div style={{ fontSize: "24px", marginBottom: "8px" }}>
            🏊‍♂️
          </div>
          
          <h2 style={{ 
            margin: "0 0 10px", 
            fontSize: "16px",
            color: "#d4edda"
          }}>
            ENTRENAMIENTO NBL
          </h2>
          
          <p style={{ margin: "8px 0", fontSize: "12px", lineHeight: "1.3" }}>
            ¡Has completado el tour del museo!
          </p>
          
          <p style={{ margin: "8px 0", fontSize: "11px" }}>
            Continúa al Laboratorio de Flotabilidad Neutral para entrenar como un astronauta real.
          </p>
          
          {isNearby ? (
            <div style={{
              background: "#fff",
              color: "#28a745",
              padding: "8px 16px",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: "bold",
              marginTop: "8px",
              boxShadow: "0 3px 6px rgba(0,0,0,0.2)",
              animation: "pulse 1.5s infinite"
            }}>
              ⌨️ Presiona ESPACIO para continuar
            </div>
          ) : (
            <p style={{ 
              margin: "8px 0", 
              fontSize: "10px", 
              opacity: 0.8 
            }}>
              Acércate para continuar
            </p>
          )}
        </div>

        {/* CSS Animation para el botón */}
        <style>{`
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.08); }
          }
        `}</style>
      </Html>
    </group>
  );
}