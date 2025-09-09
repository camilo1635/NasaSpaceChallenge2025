// src/Data/issData.js

export const welcomeMessage = `¡Bienvenido a la aventura del 25° Aniversario de la ISS!

En esta experiencia interactiva, vivirás el viaje completo desde el aprendizaje hasta llegar al espacio:

🏛️ MUSEO ISS - Descubre 25 años de historia espacial
🏊‍♂️ ENTRENAMIENTO NBL - Prepárate como un astronauta real  
🚀 VIDA EN LA ISS - Experimenta la microgravedad y las vistas épicas

Cada fase te enseñará sobre las experiencias únicas de los astronautas y cómo benefician a la humanidad en la Tierra.

¡Prepárate para una aventura espacial inolvidable!`

export const stationData = {
  station1: {
    id: 'station1',
    title: 'Historia de la ISS',
    description: 'La Estación Espacial Internacional comenzó su construcción en 1998 y ha sido habitada continuamente desde el año 2000.',
    details: [
      '🛰️ Lanzamiento del primer módulo: Zarya (1998)',
      '👨‍🚀 Primera tripulación permanente: Expedición 1 (2000)',
      '🌍 Más de 260 astronautas de 19 países han visitado la ISS',
      '🔬 Más de 3,000 experimentos científicos realizados'
    ],
    keyReward: 'Llave del Conocimiento Histórico'
  },
  
  station2: {
    id: 'station2', 
    title: 'Astronautas Destacados',
    description: 'Conoce a los héroes que han hecho posible 25 años de vida y trabajo en el espacio.',
    details: [
      '👨‍🚀 William Shepherd - Primer comandante de la ISS',
      '👩‍🚀 Peggy Whitson - Récord de tiempo en el espacio (665 días)',
      '🇷🇺 Gennady Padalka - Más de 878 días acumulados en el espacio',
      '🌟 Más de 260 caminatas espaciales realizadas'
    ],
    keyReward: 'Llave del Heroísmo Espacial'
  },
  
  station3: {
    id: 'station3',
    title: 'Avances Tecnológicos', 
    description: 'Los experimentos y tecnologías desarrolladas en la ISS benefician directamente la vida en la Tierra.',
    details: [
      '💊 Desarrollo de medicamentos en microgravedad',
      '🌱 Investigación agrícola para cultivos más resistentes',
      '🔬 Cristalización de proteínas para nuevos tratamientos',
      '🛰️ Tecnologías de comunicación y navegación mejoradas'
    ],
    keyReward: 'Llave de la Innovación Científica'
  }
}

export const achievements = {
  first_visit: {
    id: 'first_visit',
    title: 'Primer Contacto',
    description: 'Has comenzado tu aventura espacial',
    icon: '🚀'
  },
  
  museum_explorer: {
    id: 'museum_explorer', 
    title: 'Explorador del Museo',
    description: 'Visitaste tu primera estación informativa',
    icon: '🏛️'
  },
  
  key_collector: {
    id: 'key_collector',
    title: 'Recolector de Llaves',
    description: 'Obtuviste tu primera llave del conocimiento',
    icon: '🔑'
  },
  
  museum_master: {
    id: 'museum_master',
    title: 'Maestro del Museo',
    description: 'Completaste toda la experiencia del museo ISS',
    icon: '🏆'
  },
  
  nbl_ready: {
    id: 'nbl_ready',
    title: 'Listo para Entrenar',
    description: 'Pasaste al entrenamiento NBL',
    icon: '🏊‍♂️'
  }
}

export const phases = {
  museum: {
    name: 'Museo ISS',
    description: 'Explora la historia de 25 años de la Estación Espacial Internacional',
    icon: '🏛️',
    color: '#4da6ff'
  },
  
  nbl: {
    name: 'Entrenamiento NBL', 
    description: 'Entrena como un astronauta en el Laboratorio de Flotabilidad Neutral',
    icon: '🏊‍♂️',
    color: '#00ccff'
  },
  
  iss: {
    name: 'Vida en la ISS',
    description: 'Experimenta la microgravedad y contempla la Tierra desde el espacio',
    icon: '🚀', 
    color: '#ff6b4d'
  }
}