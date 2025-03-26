import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CharacterCard from './CharacterCard';

// Debug logging utility
const DEBUG = true;
const debugLog = (area, message, data = null) => {
  if (!DEBUG) return;
  const timestamp = new Date().toISOString().substr(11, 8);
  console.log(`[${timestamp}][${area}] ${message}`, data || '');
};

const BattleInterface = ({ battle, onAbilityUse, onNextTurn, onBattleEnd }) => {
  const [selectedAbility, setSelectedAbility] = useState(null);
  const [selectedTarget, setSelectedTarget] = useState(null);
  const [animatingAction, setAnimatingAction] = useState(false);
  const [battleLogs, setBattleLogs] = useState([]);
  const [debugInfo, setDebugInfo] = useState({});
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [isExecutingAITurn, setIsExecutingAITurn] = useState(false);
  
  // Update logs whenever battle logs change
  useEffect(() => {
    setBattleLogs(battle.logs);
  }, [battle.logs]);
  
  // Handle battle end
  useEffect(() => {
    if (battle.status !== 'active') {
      debugLog('BATTLE_END', `Battle ended with status: ${battle.status}`);
      onBattleEnd && onBattleEnd(battle.status, battle.getRewards());
    }
  }, [battle.status]);
  
  const currentCharacter = battle.getCurrentCharacter();
  const isPlayerTurn = battle.isPlayerTurn;
  
  // Update the useEffect for character selection to be more permissive
  useEffect(() => {
    if (isPlayerTurn && currentCharacter && battle.isPlayerCharacter(currentCharacter)) {
      debugLog('TURN', `Player turn - automatically selected ${currentCharacter.name}`, {
        currentCharacter: currentCharacter,
        abilities: currentCharacter.abilities,
        isPlayerTurn: isPlayerTurn,
        battleStatus: battle.status
      });
      
      // Set both the selected character and the battle override
      setSelectedCharacter(currentCharacter);
      battle.overrideCurrentCharacter = currentCharacter;
    }
  }, [isPlayerTurn, currentCharacter, battle]);
  
  // Debug info updates
  useEffect(() => {
    const info = {
      turnNumber: battle.currentTurn,
      isPlayerTurn: isPlayerTurn,
      currentCharacter: currentCharacter ? {
        id: currentCharacter.id,
        name: currentCharacter.name,
        team: battle.isPlayerCharacter(currentCharacter) ? 'player' : 'enemy',
        health: currentCharacter.stats?.health,
        abilities: currentCharacter.abilities?.map(a => a.name) || [],
      } : null,
      selectedCharacter: selectedCharacter ? {
        id: selectedCharacter.id,
        name: selectedCharacter.name,
      } : null,
      selectedAbility: selectedAbility ? {
        id: selectedAbility.id,
        name: selectedAbility.name,
        type: selectedAbility.type,
      } : null,
      selectedTarget: selectedTarget ? {
        id: selectedTarget.id,
        name: selectedTarget.name,
      } : null,
      playerTeam: battle.playerTeam.map(c => ({
        id: c.id,
        name: c.name,
        health: c.stats.health,
      })),
      enemyTeam: battle.enemyTeam.map(c => ({
        id: c.id,
        name: c.name,
        health: c.stats.health,
      })),
    };
    
    setDebugInfo(info);
    debugLog('STATE_UPDATE', 'Battle interface state updated', info);
  }, [battle, currentCharacter, isPlayerTurn, selectedCharacter, selectedAbility, selectedTarget]);

  // Update handlePlayerCharacterSelect to be more permissive
  const handlePlayerCharacterSelect = (character) => {
    if (!isPlayerTurn || character.stats.health <= 0) {
      debugLog('CHARACTER_SELECT', `Cannot select ${character.name} - not player turn or character defeated`, {
        isPlayerTurn,
        health: character.stats.health
      });
      return;
    }
    
    // Allow selecting any player character that's alive
    if (!battle.isPlayerCharacter(character)) {
      debugLog('CHARACTER_SELECT', `Cannot select ${character.name} - not a player character`);
      return;
    }
    
    debugLog('CHARACTER_SELECT', `Player selected character: ${character.name}`, {
      character: character,
      abilities: character.abilities,
      isPlayerTurn: isPlayerTurn,
      battleStatus: battle.status
    });
    
    // Set both the selected character and the battle override
    setSelectedCharacter(character);
    battle.overrideCurrentCharacter = character;
    setSelectedAbility(null);
    setSelectedTarget(null);
  };

  // Determine potential targets based on ability type
  const getPotentialTargets = (ability) => {
    if (!ability) {
      debugLog('TARGETS', 'No ability provided for target selection');
      return [];
    }
    
    let targets = [];
    switch (ability.type) {
      case 'damage':
        targets = battle.enemyTeam.filter(enemy => enemy.stats.health > 0);
        debugLog('TARGETS', `Found ${targets.length} potential enemy targets for damage ability`, 
          targets.map(t => `${t.name} (ID: ${t.id})`));
        break;
      case 'heal':
      case 'buff':
        targets = battle.playerTeam.filter(char => char.stats.health > 0);
        debugLog('TARGETS', `Found ${targets.length} potential player targets for ${ability.type} ability`, 
          targets.map(t => `${t.name} (ID: ${t.id})`));
        break;
      default:
        debugLog('TARGETS', `Unknown ability type: ${ability.type}`);
        break;
    }
    return targets;
  };
  
  // Update handleAbilitySelect to work with any selected character
  const handleAbilitySelect = (ability) => {
    if (!ability) {
      debugLog('ABILITY_SELECT', 'No ability provided');
      return;
    }
    
    if (!selectedCharacter) {
      debugLog('ABILITY_SELECT', 'No character selected');
      return;
    }
    
    if (!isPlayerTurn) {
      debugLog('ABILITY_SELECT', 'Cannot select ability - not player turn');
      return;
    }
    
    // Find the matching ability in the selected character's abilities
    const characterAbility = selectedCharacter.abilities.find(a => 
      a.name === ability.name || a.id === ability.id
    );
    
    debugLog('ABILITY_SELECT', `Searching for ability: ${ability.name}`, {
      selectedCharacter: selectedCharacter.name,
      characterAbilities: selectedCharacter.abilities.map(a => ({
        name: a.name,
        id: a.id,
        cooldown: a.currentCooldown
      })),
      foundAbility: !!characterAbility
    });
    
    if (!characterAbility) {
      debugLog('ABILITY_SELECT', 'Ability not found in character abilities');
      return;
    }
    
    // Check cooldown
    if (characterAbility.currentCooldown > 0) {
      debugLog('ABILITY_SELECT', `Ability ${characterAbility.name} is on cooldown: ${characterAbility.currentCooldown}`);
      return;
    }
    
    debugLog('ABILITY_SELECT', `Selected ability: ${characterAbility.name}`, {
      ability: characterAbility,
      character: selectedCharacter.name,
      isPlayerTurn: isPlayerTurn
    });
    
    setSelectedAbility(characterAbility);
    setSelectedTarget(null);
  };
  
  const handleTargetSelect = (target) => {
    debugLog('TARGET_SELECT', `Target selected: ${target.name} (ID: ${target.id})`, target);
    
    if (!selectedAbility) {
      debugLog('TARGET_SELECT', 'Attempt to select target without ability selection');
      return;
    }
    
    // Validate target is legitimate for the selected ability
    const validTargets = getPotentialTargets(selectedAbility);
    const isValidTarget = validTargets.some(t => t.id === target.id);
    
    if (!isValidTarget) {
      debugLog('TARGET_SELECT', `Invalid target ${target.name} for ability ${selectedAbility.name}`, {
        targetId: target.id,
        validTargetIds: validTargets.map(t => t.id)
      });
      return;
    }
    
    debugLog('TARGET_SELECT', `Valid target selected: ${target.name} for ${selectedAbility.name}`);
    setSelectedTarget(target);
  };
  
  // Update handleActionConfirm to work with any selected character
  const handleActionConfirm = async () => {
    if (!selectedCharacter || !selectedAbility || !selectedTarget) {
      debugLog('ACTION_CONFIRM', 'Missing required selections', {
        hasCharacter: !!selectedCharacter,
        hasAbility: !!selectedAbility,
        hasTarget: !!selectedTarget
      });
      return;
    }
    
    if (!isPlayerTurn) {
      debugLog('ACTION_CONFIRM', 'Cannot confirm action - not player turn');
      return;
    }
    
    // Verify this is a player character
    if (!battle.isPlayerCharacter(selectedCharacter)) {
      debugLog('ACTION_CONFIRM', 'Cannot confirm action - not a player character', {
        characterName: selectedCharacter.name
      });
      return;
    }
    
    debugLog('ACTION_CONFIRM', `Executing ${selectedAbility.name} on ${selectedTarget.name}`, {
      character: selectedCharacter.name,
      ability: selectedAbility,
      target: selectedTarget,
      currentTurn: battle.currentTurn
    });
    
    setAnimatingAction(true);
    
    try {
      const success = onAbilityUse(selectedAbility, selectedTarget);
      debugLog('ACTION_CONFIRM', `Ability use result: ${success ? 'SUCCESS' : 'FAILED'}`);
      
      if (success) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Clear selections
        setSelectedCharacter(null);
        setSelectedAbility(null);
        setSelectedTarget(null);
        setAnimatingAction(false);
        
        // Move to next turn
        debugLog('ACTION_CONFIRM', 'Moving to next turn');
        onNextTurn();
      } else {
        debugLog('ACTION_CONFIRM', 'Ability use failed');
        setAnimatingAction(false);
        setSelectedCharacter(null);
        setSelectedAbility(null);
        setSelectedTarget(null);
      }
    } catch (error) {
      debugLog('ACTION_CONFIRM', 'Error executing ability', error);
      setAnimatingAction(false);
      setSelectedCharacter(null);
      setSelectedAbility(null);
      setSelectedTarget(null);
    }
  };
  
  // AI turn
  useEffect(() => {
    if (!isPlayerTurn && battle.status === 'active' && !isExecutingAITurn) {
      debugLog('AI_TURN', 'AI turn started', {
        currentCharacter: currentCharacter?.name,
        characterId: currentCharacter?.id,
        turnNumber: battle.currentTurn,
        abilities: currentCharacter?.abilities?.map(a => ({
          name: a.name,
          cooldown: a.currentCooldown
        }))
      });
      
      const performAITurn = async () => {
        if (!currentCharacter || currentCharacter.stats.health <= 0) {
          debugLog('AI_TURN', 'No valid AI character to act');
          return;
        }

        try {
          setIsExecutingAITurn(true);
          
          // Add a small delay before AI turn
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Find an available ability (not on cooldown)
          const availableAbilities = currentCharacter.abilities.filter(a => a.currentCooldown === 0);
          debugLog('AI_TURN', 'Available abilities:', availableAbilities.map(a => a.name));
          
          if (availableAbilities.length === 0) {
            debugLog('AI_TURN', 'No abilities available (all on cooldown)');
            return;
          }
          
          // Select a random available ability
          const ability = availableAbilities[Math.floor(Math.random() * availableAbilities.length)];
          debugLog('AI_TURN', `Selected ability: ${ability.name}`, {
            cooldown: ability.cooldown,
            currentCooldown: ability.currentCooldown
          });
          
          // Find valid targets based on ability type
          let potentialTargets = [];
          if (ability.type === 'damage') {
            potentialTargets = battle.playerTeam.filter(char => char.stats.health > 0);
          } else if (ability.type === 'heal' || ability.type === 'buff') {
            potentialTargets = battle.enemyTeam.filter(char => char.stats.health > 0);
          }
          
          debugLog('AI_TURN', 'Potential targets:', potentialTargets.map(t => t.name));
          
          if (potentialTargets.length === 0) {
            debugLog('AI_TURN', 'No valid targets available');
            return;
          }
          
          // Select a random target from potential targets
          const target = potentialTargets[Math.floor(Math.random() * potentialTargets.length)];
          debugLog('AI_TURN', `Selected target: ${target.name}`);
          
          if (ability && target) {
            // Let the UI show the action
            setSelectedCharacter(currentCharacter);
            setSelectedAbility(ability);
            setSelectedTarget(target);
            setAnimatingAction(true);
            
            // Use the ability
            try {
              debugLog('AI_TURN', `Executing ability ${ability.name} on target ${target.name}`);
              const success = onAbilityUse(ability, target);
              debugLog('AI_TURN', `Ability use result: ${success ? 'SUCCESS' : 'FAILED'}`);
              
              if (!success) {
                debugLog('AI_TURN', 'Ability use failed');
                setAnimatingAction(false);
                setSelectedCharacter(null);
                setSelectedAbility(null);
                setSelectedTarget(null);
                return;
              }
            } catch (error) {
              debugLog('AI_TURN', 'Error executing ability:', error);
              setAnimatingAction(false);
              setSelectedCharacter(null);
              setSelectedAbility(null);
              setSelectedTarget(null);
              return;
            }
            
            // Wait for animation
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Reset UI state
            setSelectedCharacter(null);
            setSelectedAbility(null);
            setSelectedTarget(null);
            setAnimatingAction(false);
          }
        } catch (error) {
          debugLog('AI_TURN', 'Critical error in AI turn:', error);
          setAnimatingAction(false);
          setSelectedCharacter(null);
          setSelectedAbility(null);
          setSelectedTarget(null);
        } finally {
          setIsExecutingAITurn(false);
        }
      };
      
      // Start AI turn after a short delay
      const timeout = setTimeout(() => {
        debugLog('AI_TURN', 'Starting AI turn execution after delay');
        performAITurn().catch(error => {
          debugLog('AI_TURN', 'Unhandled error in AI turn:', error);
          setIsExecutingAITurn(false);
        });
      }, 500);
      
      return () => {
        clearTimeout(timeout);
        setIsExecutingAITurn(false);
      };
    }
  }, [isPlayerTurn, battle.status, currentCharacter, onAbilityUse, battle, isExecutingAITurn]);
  
  // Debug button
  const debugForceNextTurn = () => {
    if (!isPlayerTurn && battle.status === 'active') {
      debugLog('DEBUG', 'Forcing next turn via debug button');
      onNextTurn();
    }
  };
  
  // Check if a character is the selected character
  const isSelectedCharacter = (character) => {
    return selectedCharacter && character && selectedCharacter.id === character.id;
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* Left side - Player team */}
      <div className="lg:col-span-3 flex flex-col gap-4">
        <h2 className="text-lg font-futuristic text-white">Your Team</h2>
        {battle.playerTeam.map(character => {
          const isCurrentTurn = battle.getCurrentCharacter()?.id === character.id;
          return (
            <div 
              key={character.id} 
              className={`${character.stats.health <= 0 ? 'opacity-50' : ''}`}
            >
              <CharacterCard 
                character={character}
                isSelected={isSelectedCharacter(character)}
                onClick={isPlayerTurn && character.stats.health > 0 ? 
                  () => handlePlayerCharacterSelect(character) : null}
                className={isCurrentTurn ? 'border-neon-green border-2' : ''}
              />
            </div>
          );
        })}
      </div>
      
      {/* Middle - Battle area */}
      <div className="lg:col-span-6 flex flex-col">
        <div className="bg-space-black/80 p-4 rounded-lg sci-fi-border mb-4">
          <h2 className="text-xl font-futuristic text-center mb-4">
            {battle.status === 'active' 
              ? (isPlayerTurn ? "Your Turn - Select a Character" : "Enemy's Turn")
              : battle.status === 'playerWin' 
                ? 'Victory!' 
                : 'Defeat!'
            }
          </h2>
          
          {/* Detailed Debug Display */}
          <div className="mb-4 p-2 bg-black/60 border border-yellow-500 rounded text-xs text-yellow-200">
            <div className="font-mono">
              <div><strong>BATTLE DEBUG:</strong> Turn {debugInfo.turnNumber} | {debugInfo.isPlayerTurn ? 'PLAYER' : 'ENEMY'} TURN</div>
              <div><strong>Selected Character:</strong> {debugInfo.selectedCharacter?.name || 'None'}</div>
              <div><strong>Selected Ability:</strong> {debugInfo.selectedAbility?.name || 'None'}</div>
              <div><strong>Selected Target:</strong> {debugInfo.selectedTarget?.name || 'None'}</div>
            </div>
          </div>
          
          {/* Player character selection guidance */}
          {isPlayerTurn && !selectedCharacter && battle.status === 'active' && (
            <div className="mb-4 p-3 bg-yellow-600/20 rounded border border-yellow-500/50 text-center">
              <h3 className="text-yellow-300 text-lg mb-1">Select a Character</h3>
              <p className="text-yellow-100 text-sm">Click on one of your characters to select them for an action</p>
            </div>
          )}
          
          {/* Player abilities section - after character is selected */}
          {isPlayerTurn && selectedCharacter && battle.status === 'active' && (
            <div className="mb-4 p-3 bg-cosmic-blue/20 rounded border border-white/20">
              <h3 className="text-center text-neon-green text-lg mb-2">
                {selectedCharacter.name}'s Abilities
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {Array.isArray(selectedCharacter.abilities) && selectedCharacter.abilities.map((ability) => {
                  debugLog('RENDER_ABILITY', `Rendering ability button for ${ability.name}`, {
                    abilityId: ability.id,
                    abilityType: ability.type,
                    characterName: selectedCharacter.name,
                    isSelected: selectedAbility?.name === ability.name,
                    currentCooldown: ability.currentCooldown,
                    isAnimating: animatingAction
                  });
                  
                  return (
                    <button
                      key={ability.id}
                      onClick={() => {
                        debugLog('BUTTON_CLICK', `Ability button clicked: ${ability.name}`, {
                          ability: ability,
                          selectedCharacter: selectedCharacter.name,
                          characterAbilities: selectedCharacter.abilities.map(a => ({
                            name: a.name,
                            id: a.id,
                            type: a.type,
                            currentCooldown: a.currentCooldown
                          }))
                        });
                        
                        handleAbilitySelect(ability);
                      }}
                      disabled={ability.currentCooldown > 0 || animatingAction}
                      className={`p-2 rounded text-left ${
                        selectedAbility?.name === ability.name
                          ? 'bg-neon-green text-space-black font-bold' 
                          : ability.currentCooldown > 0
                            ? 'bg-gray-700/50 text-gray-400 cursor-not-allowed'
                            : 'bg-cosmic-blue/80 hover:bg-cosmic-blue text-white'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold">{ability.name}</span>
                        {ability.cooldown > 0 && (
                          <span className="text-xs bg-black/30 px-2 py-1 rounded">
                            {ability.currentCooldown > 0 ? `CD: ${ability.currentCooldown}` : 'Ready'}
                          </span>
                        )}
                      </div>
                      <div className="text-xs mt-1 opacity-80">
                        {ability.description}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Battle field */}
          <div className="battle-field relative h-64 border border-white/20 rounded-lg flex items-center justify-center overflow-hidden mb-4">
            {/* Background effects */}
            <div className="absolute inset-0 bg-cosmic-blue/10 backdrop-blur-sm"></div>
            
            {/* Character avatars */}
            <div className="absolute left-10 bottom-4 top-4 w-28 flex flex-col items-center justify-center">
              <div className="sci-fi-border h-24 w-24 bg-space-black/50 rounded-md overflow-hidden flex items-center justify-center mb-2">
                <div className="text-4xl opacity-50">
                  {(selectedCharacter || currentCharacter).species === 'Android' || (selectedCharacter || currentCharacter).species === 'Mechanical' ? '🤖' : 
                   (selectedCharacter || currentCharacter).species === 'Xenomorph' ? '👾' : 
                   (selectedCharacter || currentCharacter).species === 'Human' || (selectedCharacter || currentCharacter).species === 'Altered Human' ? '👨‍🚀' : '👽'}
                </div>
              </div>
              <div className="text-center text-xs text-neon-green">
                <span className="text-white">{(selectedCharacter || currentCharacter).name}</span>
                <div className="bg-space-black/70 px-2 py-1 mt-1 rounded">
                  HP: <span className="text-neon-green">{(selectedCharacter || currentCharacter).stats.health}</span>
                </div>
              </div>
            </div>
            
            {/* Target character avatar (when selected) */}
            {selectedTarget && (
              <div className="absolute right-10 bottom-4 top-4 w-28 flex flex-col items-center justify-center">
                <div className="sci-fi-border h-24 w-24 bg-space-black/50 rounded-md overflow-hidden flex items-center justify-center mb-2">
                  <div className="text-4xl opacity-50">
                    {selectedTarget.species === 'Android' || selectedTarget.species === 'Mechanical' ? '🤖' : 
                     selectedTarget.species === 'Xenomorph' ? '👾' : 
                     selectedTarget.species === 'Human' || selectedTarget.species === 'Altered Human' ? '👨‍🚀' : '👽'}
                  </div>
                </div>
                <div className="text-center text-xs text-red-400">
                  <span className="text-white">{selectedTarget.name}</span>
                  <div className="bg-space-black/70 px-2 py-1 mt-1 rounded">
                    HP: <span className="text-red-400">{selectedTarget.stats.health}</span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Battle action animation */}
            <AnimatePresence>
              {animatingAction && selectedAbility && selectedTarget && (
                <motion.div
                  initial={{ x: isPlayerTurn ? -100 : 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: isPlayerTurn ? 100 : -100, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute z-10"
                >
                  <div className={`text-2xl font-bold ${
                    selectedAbility.type === 'damage' 
                      ? 'text-red-500' 
                      : selectedAbility.type === 'heal' 
                        ? 'text-green-500' 
                        : 'text-blue-500'
                  }`}>
                    {selectedAbility.name}!
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Attack visualization */}
            {animatingAction && selectedAbility && selectedTarget && (
              <motion.div 
                className="absolute h-1 bg-gradient-to-r from-transparent via-neon-green to-transparent"
                style={{ 
                  width: '70%',
                  top: '50%',
                  left: '15%',
                  zIndex: 5,
                  transformOrigin: isPlayerTurn ? 'left' : 'right'
                }}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 0.8 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            )}
            
            {/* Status display */}
            <div className="absolute bottom-2 left-2 right-2 bg-black/70 text-xs text-gray-300 p-1 rounded">
              {isPlayerTurn ? 
                (selectedCharacter ? 
                  `Selected: ${selectedCharacter.name}` : 
                  "Your Turn - Select a character") : 
                `Enemy Turn - ${currentCharacter.name}`}
            </div>
            
            {/* Debug button for AI turn */}
            {!isPlayerTurn && battle.status === 'active' && (
              <button 
                onClick={debugForceNextTurn}
                className="absolute top-2 right-2 px-2 py-1 bg-red-700 text-white text-xs rounded z-20"
              >
                Force Next Turn
              </button>
            )}
          </div>
          
          {/* Target selection */}
          {isPlayerTurn && selectedCharacter && selectedAbility && battle.status === 'active' && (
            <div className="mb-4">
              <h3 className="text-center text-yellow-300 mb-2">Select Target</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {getPotentialTargets(selectedAbility).map(target => (
                  <button
                    key={target.id}
                    onClick={() => handleTargetSelect(target)}
                    className={`p-2 border rounded ${
                      selectedTarget?.id === target.id
                        ? 'bg-yellow-400 text-black border-yellow-500'
                        : 'bg-cosmic-blue/30 text-white border-cosmic-blue hover:bg-cosmic-blue/50'
                    }`}
                  >
                    <div className="text-center">
                      <div>{target.name}</div>
                      <div className="text-xs mt-1">HP: {target.stats.health}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Action controls */}
          {isPlayerTurn && selectedCharacter && selectedAbility && selectedTarget && battle.status === 'active' && (
            <div className="flex justify-center">
              <button
                onClick={handleActionConfirm}
                disabled={animatingAction}
                className={`px-6 py-2 rounded-md text-lg font-futuristic ${
                  animatingAction
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-neon-green text-space-black hover:bg-neon-green/80'
                }`}
              >
                Execute
              </button>
            </div>
          )}
          
          {/* Battle logs */}
          <div className="mt-4 h-32 overflow-y-auto p-2 bg-space-black rounded border border-white/20 text-sm">
            {battleLogs.map((log, index) => (
              <div key={index} className="mb-1 text-gray-300">
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Right side - Enemy team */}
      <div className="lg:col-span-3 flex flex-col gap-4">
        <h2 className="text-lg font-futuristic text-white">Enemy Team</h2>
        {battle.enemyTeam.map(enemy => (
          <div 
            key={enemy.id} 
            className={`${enemy.stats.health <= 0 ? 'opacity-50' : ''}`}
          >
            <CharacterCard 
              character={enemy}
              isSelected={selectedTarget?.id === enemy.id}
              onClick={isPlayerTurn && selectedCharacter && selectedAbility && 
                       enemy.stats.health > 0 && 
                       selectedAbility.type === 'damage' ? 
                () => handleTargetSelect(enemy) : null}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BattleInterface;