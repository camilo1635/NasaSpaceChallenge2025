// src/Components/Utils/CharacterProvider.jsx
import React, { useState } from 'react'
import { CharacterContext } from './CharacterContext'
import { ASTRONAUT_CATALOG } from './characterData'

export function CharacterProvider({ children }) {
  const [selectedCharacter, setSelectedCharacter] = useState(null)

  const selectCharacter = (characterId) => {
    const character = ASTRONAUT_CATALOG.find(c => c.id === characterId)
    if (character) {
      setSelectedCharacter(character)
      console.log('Character selected:', character)
    }
  }

  const getSelectedCharacter = () => {
    // Si no hay personaje seleccionado, usar el primero por defecto
    return selectedCharacter || ASTRONAUT_CATALOG[0]
  }

  return (
    <CharacterContext.Provider 
      value={{ 
        selectedCharacter: getSelectedCharacter(),
        selectCharacter,
        catalog: ASTRONAUT_CATALOG
      }}
    >
      {children}
    </CharacterContext.Provider>
  )
}