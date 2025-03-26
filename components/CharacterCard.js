import { motion } from 'framer-motion';

// Debug logging utility
const DEBUG = true;
const debugLog = (area, message, data = null) => {
  if (!DEBUG) return;
  const timestamp = new Date().toISOString().substr(11, 8);
  console.log(`[${timestamp}][CHAR_CARD][${area}] ${message}`, data || '');
};

const CharacterCard = ({ character, isSelected, onClick, className = '', disabled = false, targetCharacter = null }) => {
  // Determine border color based on rarity
  const rarityColors = {
    common: 'border-gray-400',
    uncommon: 'border-green-400',
    rare: 'border-blue-400',
    epic: 'border-purple-400',
    legendary: 'border-yellow-400'
  };
  
  const borderColor = rarityColors[character.rarity] || rarityColors.common;
  const isTarget = targetCharacter?.id === character.id;
  const isDisabled = disabled || (character.currentHealth <= 0);

  // Calculate experience progress
  const xpNeeded = character.level * 100;
  const xpProgress = (character.experience / xpNeeded) * 100;

  const handleClick = () => {
    debugLog('CLICK', `Character card clicked: ${character.name} (ID: ${character.id})`, {
      hasClickHandler: !!onClick,
      isSelected
    });
    
    if (onClick) {
      try {
        // Call the onClick handler with the character
        onClick(character);
      } catch (error) {
        console.error('Error in CharacterCard onClick handler:', error);
      }
    } else {
      debugLog('CLICK', 'No click handler available for this character');
    }
  };
  
  return (
    <motion.div
      whileHover={onClick ? { scale: 1.02 } : {}}
      whileTap={{ scale: 0.95 }}
      className={`relative ${className}`}
      onClick={onClick && !isDisabled ? handleClick : undefined}
    >
      <div className={`relative rounded-lg overflow-hidden ${borderColor} ${isSelected ? 'ring-2 ring-neon-green' : ''} ${isTarget ? 'ring-2 ring-red-500' : ''} ${isDisabled ? 'opacity-50' : ''}`}>
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-futuristic text-white">{character.name}</h3>
            <span className="px-2 py-1 text-xs rounded-full bg-black/50 uppercase font-bold" 
                  style={{ color: rarityColors[character.rarity].replace('border-', '') }}>
              {character.rarity}
            </span>
          </div>
          
          <div className="flex gap-2 mb-2">
            <span className="text-sm bg-black/30 px-2 py-1 rounded">{character.species}</span>
            <span className="text-sm bg-black/30 px-2 py-1 rounded">LVL {character.level}</span>
          </div>
          
          {/* Experience Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${xpProgress}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-neon-green"
            />
          </div>
          
          {/* Experience Text */}
          <div className="absolute bottom-1 right-2 text-xs text-white/80">
            {character.experience}/{xpNeeded} XP
          </div>
          
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="stat-item">
              <span className="text-xs text-gray-400">ATK</span>
              <span className="text-neon-green">{character.stats.attack}</span>
            </div>
            <div className="stat-item">
              <span className="text-xs text-gray-400">DEF</span>
              <span className="text-neon-green">{character.stats.defense}</span>
            </div>
            <div className="stat-item">
              <span className="text-xs text-gray-400">HP</span>
              <span className="text-neon-green">{character.stats.health}</span>
            </div>
            <div className="stat-item">
              <span className="text-xs text-gray-400">SPD</span>
              <span className="text-neon-green">{character.stats.speed}</span>
            </div>
          </div>
          
          <div className="mt-3 pt-2 border-t border-white/20">
            <h4 className="text-sm mb-1">Abilities:</h4>
            <ul className="text-xs space-y-1 list-disc pl-4">
              {character.abilities.map((ability, index) => (
                <li key={index} className="text-gray-300">{ability.name}</li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Background character silhouette */}
        <div className="absolute right-2 top-2 h-20 w-20 opacity-20 z-0">
          <div className="w-full h-full rounded-full bg-space-gradient"></div>
        </div>
      </div>
    </motion.div>
  );
};

export default CharacterCard; 