import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import CharacterCard from '../components/CharacterCard';
import { getPlayerCharacters } from '../models/characterData';
import Character from '../models/Character';

export default function Collection() {
  const [characters, setCharacters] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [filterRarity, setFilterRarity] = useState('All Rarities');
  
  useEffect(() => {
    // Load characters from localStorage
    const loadCharacters = () => {
      try {
        const savedChars = JSON.parse(localStorage.getItem('playerCharacters'));
        if (savedChars) {
          // Convert saved data back to Character instances
          const loadedChars = savedChars.map(charData => Character.fromJSON(charData));
          setCharacters(loadedChars);
          console.log('Loaded characters:', loadedChars);
        } else {
          // If no saved characters, use default ones
          const defaultChars = getPlayerCharacters();
          setCharacters(defaultChars);
          localStorage.setItem('playerCharacters', JSON.stringify(defaultChars));
        }
      } catch (error) {
        console.error('Error loading characters:', error);
        const defaultChars = getPlayerCharacters();
        setCharacters(defaultChars);
      }
    };

    loadCharacters();
  }, []);
  
  const handleCharacterSelect = (character) => {
    setSelectedCharacter(character);
  };
  
  const filteredCharacters = filterRarity === 'All Rarities'
    ? characters
    : characters.filter(char => char.rarity.toLowerCase() === filterRarity.toLowerCase());
  
  const rarityOptions = [
    { value: 'all', label: 'All Rarities' },
    { value: 'common', label: 'Common' },
    { value: 'uncommon', label: 'Uncommon' },
    { value: 'rare', label: 'Rare' },
    { value: 'epic', label: 'Epic' },
    { value: 'legendary', label: 'Legendary' },
  ];
  
  return (
    <Layout title="Your Collection - Stellar Vanguard">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-futuristic mb-6 text-white">Your <span className="text-neon-green">Collection</span></h1>
          
          <div className="flex flex-col md:flex-row justify-between items-start mb-8">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-300">Manage your collection of characters and prepare them for battle.</p>
            </div>
            
            <div className="bg-space-black/70 p-3 rounded-md border border-white/20">
              <select 
                value={filterRarity}
                onChange={(e) => setFilterRarity(e.target.value)}
                className="bg-space-black text-white border border-cosmic-blue rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neon-green"
              >
                {rarityOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCharacters.map(character => (
              <div key={character.id} onClick={() => setSelectedCharacter(character)}>
                <CharacterCard 
                  character={character}
                  isSelected={selectedCharacter?.id === character.id}
                />
              </div>
            ))}
          </div>
          
          {filteredCharacters.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-xl">No characters found with the selected filter.</p>
            </div>
          )}
          
          {selectedCharacter && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="fixed inset-0 bg-space-black/80 flex items-center justify-center p-4 z-50"
              onClick={() => setSelectedCharacter(null)}
            >
              <div 
                className="bg-cosmic-blue/20 backdrop-blur-md p-6 rounded-lg sci-fi-border max-w-2xl w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-futuristic text-neon-green">{selectedCharacter.name}</h2>
                  <button 
                    onClick={() => setSelectedCharacter(null)}
                    className="text-white hover:text-neon-green"
                  >
                    X
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="aspect-square bg-space-black rounded-lg mb-4 flex items-center justify-center">
                      <div className="text-6xl opacity-30">🚀</div>
                    </div>
                    
                    <div className="text-sm text-gray-300 mb-2">
                      <span className="text-white font-bold">Species:</span> {selectedCharacter.species}
                    </div>
                    
                    <div className="text-sm text-gray-300 mb-2">
                      <span className="text-white font-bold">Rarity:</span> {selectedCharacter.rarity}
                    </div>
                    
                    <div className="text-sm text-gray-300 mb-2">
                      <span className="text-white font-bold">Level:</span> {selectedCharacter.level}
                    </div>
                    
                    <div className="text-sm text-gray-300">
                      <span className="text-white font-bold">XP:</span> {selectedCharacter.exp}/{selectedCharacter.expToNextLevel()}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-futuristic mb-2 text-white">Stats</h3>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="bg-space-black p-2 rounded">
                        <span className="text-xs text-gray-400 block">Attack</span>
                        <span className="text-neon-green text-lg">{selectedCharacter.stats.attack}</span>
                      </div>
                      <div className="bg-space-black p-2 rounded">
                        <span className="text-xs text-gray-400 block">Defense</span>
                        <span className="text-neon-green text-lg">{selectedCharacter.stats.defense}</span>
                      </div>
                      <div className="bg-space-black p-2 rounded">
                        <span className="text-xs text-gray-400 block">Health</span>
                        <span className="text-neon-green text-lg">{selectedCharacter.stats.health}</span>
                      </div>
                      <div className="bg-space-black p-2 rounded">
                        <span className="text-xs text-gray-400 block">Speed</span>
                        <span className="text-neon-green text-lg">{selectedCharacter.stats.speed}</span>
                      </div>
                      <div className="bg-space-black p-2 rounded col-span-2">
                        <span className="text-xs text-gray-400 block">Special</span>
                        <span className="text-neon-green text-lg">{selectedCharacter.stats.special}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-futuristic mb-2 text-white">Abilities</h3>
                    <ul className="space-y-2">
                      {selectedCharacter.abilities.map((ability, index) => (
                        <li key={index} className="bg-space-black p-2 rounded">
                          <div className="flex justify-between items-start">
                            <span className="font-bold text-white">{ability.name}</span>
                            <span className="text-xs bg-cosmic-blue/50 px-1 rounded">
                              {ability.type}
                            </span>
                          </div>
                          <p className="text-sm text-gray-300">{ability.description}</p>
                          <div className="text-xs text-gray-400 mt-1">
                            Power: {ability.power} | Cooldown: {ability.cooldown} turns
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </Layout>
  );
} 