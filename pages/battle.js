import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import CharacterCard from '../components/CharacterCard';
import BattleInterface from '../components/BattleInterface';
import { getPlayerCharacters, getBasicEnemies, getAdvancedEnemies, getUnlockableCharacters } from '../models/characterData';
import Battle from '../models/Battle';
import Ability from '../models/Ability';
import Character from '../models/Character';

export default function BattlePage() {
  const playerCharacters = getPlayerCharacters();
  const [localPlayerCharacters, setLocalPlayerCharacters] = useState(playerCharacters);
  const [selectedTeam, setSelectedTeam] = useState([]);
  const [battleMode, setBattleMode] = useState('select'); // select, prepare, battle, results
  const [battleDifficulty, setBattleDifficulty] = useState('easy');
  const [currentBattle, setCurrentBattle] = useState(null);
  const [battleResults, setBattleResults] = useState(null);
  
  const maxTeamSize = 3;
  
  // Load player progress on component mount
  useEffect(() => {
    const savedCharacters = loadPlayerProgress();
    if (savedCharacters) {
      console.log('Loaded saved character progress');
      setLocalPlayerCharacters(savedCharacters);
    }
  }, []);
  
  const toggleCharacterSelection = (character) => {
    if (battleMode !== 'select') return;
    
    if (selectedTeam.includes(character)) {
      setSelectedTeam(selectedTeam.filter(c => c.id !== character.id));
    } else if (selectedTeam.length < maxTeamSize) {
      setSelectedTeam([...selectedTeam, character]);
    }
  };
  
  const prepareForBattle = () => {
    if (selectedTeam.length === 0) return;
    setBattleMode('prepare');
  };
  
  const generateEnemyTeam = (teamSize, difficulty) => {
    console.log('Generating enemy team with difficulty:', difficulty);
    
    // Always create fresh instances of enemies to avoid reference issues
    if (difficulty === 'easy') {
      // For easy mode - just use basic enemies
      const basicEnemies = getBasicEnemies();
      const shuffled = [...basicEnemies].sort(() => 0.5 - Math.random());
      const selectedEnemies = shuffled.slice(0, teamSize);
      
      console.log(`Creating easy team of size ${teamSize}`);
      
      // Convert enemy data to proper Character instances
      return selectedEnemies.map(enemy => {
        try {
          // Create abilities with proper methods
          const abilities = enemy.abilities.map(ability => {
            return new Ability(
              ability.id,
              ability.name,
              ability.description || "No description",
              ability.power,
              ability.type,
              ability.cooldown,
              ability.effectChance || 0,
              ability.effect
            );
          });
          
          // If enemy has no abilities, add a default one
          if (!abilities.length) {
            abilities.push(Ability.createDefault(enemy.id * 100));
          }
          
          // Create new Character instance
          return new Character(
            enemy.id,
            enemy.name,
            enemy.rarity || 'common',
            enemy.level || 1,
            0, // exp
            enemy.imageUrl || "",
            enemy.species,
            abilities,
            { ...enemy.stats }
          );
        } catch (error) {
          console.error("Error creating enemy:", error);
          // Create a fallback enemy
          return createFallbackEnemy(enemy.id, enemy.name);
        }
      });
    } else {
      // For hard mode - manually create advanced enemies
      console.log('Creating hard enemy team');
      
      // Create a team with stronger enemies
      const advancedEnemies = [
        {
          id: 201,
          name: 'Void Stalker',
          rarity: 'rare',
          level: 5,
          species: 'Void Entity',
          stats: {
            attack: 65,
            defense: 45,
            health: 350,
            speed: 55,
            special: 45
          },
          abilities: [
            { 
              id: 3, 
              name: 'Gravity Surge', 
              description: 'Manipulates gravity to crush enemies', 
              power: 35, 
              type: 'damage', 
              cooldown: 2 
            },
            { 
              id: 5, 
              name: 'Neural Disruption', 
              description: 'Disrupts neural pathways', 
              power: 25, 
              type: 'damage', 
              cooldown: 1, 
              effectChance: 40, 
              effect: { type: 'stun', amount: 0, duration: 1 } 
            }
          ]
        },
        {
          id: 202,
          name: 'Dr. Nexus',
          rarity: 'epic',
          level: 8,
          species: 'Cybernetic Human',
          stats: {
            attack: 75,
            defense: 55,
            health: 400,
            speed: 60,
            special: 65
          },
          abilities: [
            { 
              id: 4, 
              name: 'Quantum Strike', 
              description: 'Attacks across multiple dimensions', 
              power: 40, 
              type: 'damage', 
              cooldown: 3 
            },
            { 
              id: 10, 
              name: 'Neural Overclock', 
              description: 'Enhances reflexes and speed', 
              power: 0, 
              type: 'buff', 
              cooldown: 4, 
              effectChance: 100, 
              effect: { type: 'speed', amount: 15, duration: 2 } 
            },
            { 
              id: 6, 
              name: 'Toxic Venom', 
              description: 'Injects a deadly alien toxin', 
              power: 15, 
              type: 'damage', 
              cooldown: 1, 
              effectChance: 60, 
              effect: { type: 'poison', amount: 8, duration: 3 } 
            }
          ]
        }
      ];
      
      // Create a team based on player team size - add basic enemies if needed
      let enemyTeam = [];
      
      // Add advanced enemies first
      for (let i = 0; i < Math.min(teamSize, advancedEnemies.length); i++) {
        enemyTeam.push(advancedEnemies[i]);
      }
      
      // If we need more enemies, add basic ones
      if (teamSize > advancedEnemies.length) {
        const basicEnemies = getBasicEnemies();
        const shuffled = [...basicEnemies].sort(() => 0.5 - Math.random());
        const neededBasic = teamSize - advancedEnemies.length;
        
        for (let i = 0; i < neededBasic; i++) {
          if (i < shuffled.length) {
            enemyTeam.push(shuffled[i]);
          }
        }
      }
      
      console.log('Created hard team:', enemyTeam.map(e => e.name));
      
      // Convert enemy data to proper Character instances
      return enemyTeam.map(enemy => {
        try {
          // Create abilities with proper methods
          const abilities = enemy.abilities.map(ability => {
            return new Ability(
              ability.id,
              ability.name,
              ability.description || "No description",
              ability.power,
              ability.type,
              ability.cooldown,
              ability.effectChance || 0,
              ability.effect
            );
          });
          
          // If enemy has no abilities, add a default one
          if (!abilities.length) {
            abilities.push(Ability.createDefault(enemy.id * 100));
          }
          
          // Create new Character instance
          return new Character(
            enemy.id,
            enemy.name,
            enemy.rarity || 'common',
            enemy.level || 1,
            0, // exp
            enemy.imageUrl || "",
            enemy.species,
            abilities,
            { ...enemy.stats }
          );
        } catch (error) {
          console.error("Error creating enemy:", error);
          // Create a fallback enemy
          return createFallbackEnemy(enemy.id, enemy.name);
        }
      });
    }
  };
  
  const startBattle = () => {
    try {
      // Clone player characters to avoid modifying the originals
      const clonedPlayerTeam = selectedTeam.map(char => {
        const clonedAbilities = char.abilities.map(ability => {
          return new Ability(
            ability.id,
            ability.name,
            ability.description,
            ability.power,
            ability.type,
            ability.cooldown,
            ability.effectChance,
            ability.effect
          );
        });
        
        return new Character(
          char.id,
          char.name,
          char.rarity,
          char.level,
          char.exp,
          char.imageUrl,
          char.species,
          clonedAbilities,
          { ...char.stats }
        );
      });
      
      // Generate enemy team based on difficulty
      const enemyTeamData = generateEnemyTeam(selectedTeam.length, battleDifficulty);
      
      // Convert enemy data to proper Character instances
      const enemyTeam = enemyTeamData.map(enemy => {
        try {
          // Create abilities with proper methods
          const abilities = enemy.abilities.map(ability => {
            return new Ability(
              ability.id,
              ability.name,
              ability.description || "No description",
              ability.power,
              ability.type,
              ability.cooldown,
              ability.effectChance || 0,
              ability.effect,
              ability.currentCooldown // Copy the current cooldown
            );
          });
          
          // If enemy has no abilities, add a default one
          if (!abilities.length) {
            abilities.push(Ability.createDefault(enemy.id * 100));
          }
          
          // Create new Character instance
          return new Character(
            enemy.id,
            enemy.name,
            enemy.rarity,
            enemy.level,
            0, // exp
            enemy.imageUrl || "",
            enemy.species,
            abilities,
            { ...enemy.stats }
          );
        } catch (error) {
          console.error("Error creating enemy:", error);
          // Create a fallback enemy
          return createFallbackEnemy(enemy.id, enemy.name);
        }
      });
      
      console.log("Battle teams ready:", {
        players: clonedPlayerTeam.map(p => p.name),
        enemies: enemyTeam.map(e => e.name),
        difficulty: battleDifficulty
      });
      
      const battle = new Battle(clonedPlayerTeam, enemyTeam, battleDifficulty === 'hard');
      setCurrentBattle(battle);
      setBattleMode('battle');
    } catch (error) {
      console.error("Error starting battle:", error);
      alert("There was an error starting the battle. Please try again.");
      setBattleMode('select');
    }
  };
  
  // Helper function to create a fallback enemy
  const createFallbackEnemy = (id, name) => {
    return new Character(
      id,
      name,
      'common',
      1,
      0,
      "",
      "Unknown",
      [Ability.createDefault()],
      { attack: 30, defense: 30, health: 200, speed: 30, special: 10 }
    );
  };
  
  // Define handler for ability use
  const handleAbilityUse = (ability, target) => {
    if (!currentBattle) return false;
    
    console.log('BATTLE PAGE: Ability use requested', {
      ability: ability.name,
      targetName: target.name,
      targetId: target.id,
      currentCharacter: currentBattle.getCurrentCharacter()?.name,
      isPlayerTurn: currentBattle.isPlayerTurn
    });
    
    try {
      // Execute the ability
      const result = currentBattle.executeAbility(ability, target);
      if (!result) {
        console.log('BATTLE PAGE: Ability execution failed');
        return false;
      }
      
      // Create new Character instances with proper cooldowns
      const clonedPlayerTeam = currentBattle.playerTeam.map(char => {
        const clonedAbilities = char.abilities.map(ability => {
          return new Ability(
            ability.id,
            ability.name,
            ability.description,
            ability.power,
            ability.type,
            ability.cooldown,
            ability.effectChance,
            ability.effect,
            ability.currentCooldown // Copy the current cooldown
          );
        });
        
        return new Character(
          char.id,
          char.name,
          char.rarity,
          char.level,
          char.exp,
          char.imageUrl,
          char.species,
          clonedAbilities,
          { ...char.stats }
        );
      });
      
      const clonedEnemyTeam = currentBattle.enemyTeam.map(char => {
        const clonedAbilities = char.abilities.map(ability => {
          return new Ability(
            ability.id,
            ability.name,
            ability.description,
            ability.power,
            ability.type,
            ability.cooldown,
            ability.effectChance,
            ability.effect,
            ability.currentCooldown // Copy the current cooldown
          );
        });
        
        return new Character(
          char.id,
          char.name,
          char.rarity,
          char.level,
          char.exp,
          char.imageUrl,
          char.species,
          clonedAbilities,
          { ...char.stats }
        );
      });
      
      // Create a fresh battle instance with the cloned teams
      const battleCopy = new Battle(clonedPlayerTeam, clonedEnemyTeam);
      
      // Copy battle state
      battleCopy.currentTurn = currentBattle.currentTurn;
      battleCopy.turnOrder = battleCopy.playerTeam.concat(battleCopy.enemyTeam)
        .sort((a, b) => b.stats.speed - a.stats.speed);
      battleCopy.isPlayerTurn = currentBattle.isPlayerTurn;
      battleCopy.status = currentBattle.status;
      battleCopy.logs = [...currentBattle.logs];
      
      // Clear any character override
      battleCopy.overrideCurrentCharacter = null;
      
      // Always advance turn after ability use, regardless of who used it
      battleCopy.nextTurn();
      
      console.log('BATTLE PAGE: Turn state updated', {
        newTurn: battleCopy.currentTurn,
        newIsPlayerTurn: battleCopy.isPlayerTurn,
        newCurrentCharacterName: battleCopy.getCurrentCharacter()?.name
      });
      
      setCurrentBattle(battleCopy);
      return true;
    } catch (error) {
      console.error('BATTLE PAGE: Error executing ability:', error);
      return false;
    }
  };
  
  // Define handler for next turn
  const handleNextTurn = () => {
    if (!currentBattle) return;
    
    console.log('BATTLE PAGE: Next turn requested', {
      currentTurn: currentBattle.currentTurn,
      isPlayerTurn: currentBattle.isPlayerTurn,
      currentCharacterName: currentBattle.getCurrentCharacter()?.name
    });
    
    try {
      // Create new Character instances with proper cooldowns
      const clonedPlayerTeam = currentBattle.playerTeam.map(char => {
        const clonedAbilities = char.abilities.map(ability => {
          return new Ability(
            ability.id,
            ability.name,
            ability.description,
            ability.power,
            ability.type,
            ability.cooldown,
            ability.effectChance,
            ability.effect,
            ability.currentCooldown // Copy the current cooldown
          );
        });
        
        return new Character(
          char.id,
          char.name,
          char.rarity,
          char.level,
          char.exp,
          char.imageUrl,
          char.species,
          clonedAbilities,
          { ...char.stats }
        );
      });
      
      const clonedEnemyTeam = currentBattle.enemyTeam.map(char => {
        const clonedAbilities = char.abilities.map(ability => {
          return new Ability(
            ability.id,
            ability.name,
            ability.description,
            ability.power,
            ability.type,
            ability.cooldown,
            ability.effectChance,
            ability.effect,
            ability.currentCooldown // Copy the current cooldown
          );
        });
        
        return new Character(
          char.id,
          char.name,
          char.rarity,
          char.level,
          char.exp,
          char.imageUrl,
          char.species,
          clonedAbilities,
          { ...char.stats }
        );
      });
      
      // Create a fresh battle instance with the cloned teams
      const battleCopy = new Battle(clonedPlayerTeam, clonedEnemyTeam);
      
      // Copy battle state
      battleCopy.currentTurn = currentBattle.currentTurn;
      battleCopy.turnOrder = battleCopy.playerTeam.concat(battleCopy.enemyTeam)
        .sort((a, b) => b.stats.speed - a.stats.speed);
      battleCopy.isPlayerTurn = currentBattle.isPlayerTurn;
      battleCopy.status = currentBattle.status;
      battleCopy.logs = [...currentBattle.logs];
      
      // Clear any character override
      battleCopy.overrideCurrentCharacter = null;
      
      // Execute the next turn on the copy
      battleCopy.nextTurn();
      
      console.log('BATTLE PAGE: Turn advanced', {
        newTurn: battleCopy.currentTurn,
        newIsPlayerTurn: battleCopy.isPlayerTurn,
        newCurrentCharacterName: battleCopy.getCurrentCharacter()?.name,
        playerAbilities: battleCopy.playerTeam.map(char => ({
          name: char.name,
          abilities: char.abilities.map(a => ({
            name: a.name,
            cooldown: a.cooldown,
            currentCooldown: a.currentCooldown
          }))
        })),
        enemyAbilities: battleCopy.enemyTeam.map(char => ({
          name: char.name,
          abilities: char.abilities.map(a => ({
            name: a.name,
            cooldown: a.cooldown,
            currentCooldown: a.currentCooldown
          }))
        }))
      });
      
      setCurrentBattle(battleCopy);
    } catch (error) {
      console.error('BATTLE PAGE: Error advancing turn:', error);
      
      // Emergency fallback - manually advance turn with proper cooldown handling
      try {
        console.log('BATTLE PAGE: Attempting emergency turn advance');
        
        // Create new Character instances with proper cooldowns
        const emergencyPlayerTeam = currentBattle.playerTeam.map(char => {
          const clonedAbilities = char.abilities.map(ability => {
            return new Ability(
              ability.id,
              ability.name,
              ability.description,
              ability.power,
              ability.type,
              ability.cooldown,
              ability.effectChance,
              ability.effect,
              ability.currentCooldown // Copy the current cooldown
            );
          });
          
          return new Character(
            char.id,
            char.name,
            char.rarity,
            char.level,
            char.exp,
            char.imageUrl,
            char.species,
            clonedAbilities,
            { ...char.stats }
          );
        });
        
        const emergencyEnemyTeam = currentBattle.enemyTeam.map(char => {
          const clonedAbilities = char.abilities.map(ability => {
            return new Ability(
              ability.id,
              ability.name,
              ability.description,
              ability.power,
              ability.type,
              ability.cooldown,
              ability.effectChance,
              ability.effect,
              ability.currentCooldown // Copy the current cooldown
            );
          });
          
          return new Character(
            char.id,
            char.name,
            char.rarity,
            char.level,
            char.exp,
            char.imageUrl,
            char.species,
            clonedAbilities,
            { ...char.stats }
          );
        });
        
        const emergencyBattle = new Battle(emergencyPlayerTeam, emergencyEnemyTeam);
        
        emergencyBattle.currentTurn = (currentBattle.currentTurn + 1) % currentBattle.turnOrder.length;
        emergencyBattle.turnOrder = emergencyBattle.playerTeam.concat(emergencyBattle.enemyTeam)
          .sort((a, b) => b.stats.speed - a.stats.speed);
        emergencyBattle.isPlayerTurn = !currentBattle.isPlayerTurn;
        emergencyBattle.status = currentBattle.status;
        emergencyBattle.logs = [...currentBattle.logs, 'Emergency turn advance'];
        emergencyBattle.overrideCurrentCharacter = null;
        
        console.log('BATTLE PAGE: Emergency turn advance successful');
        setCurrentBattle(emergencyBattle);
      } catch (emergencyError) {
        console.error('BATTLE PAGE: Emergency turn advance failed:', emergencyError);
      }
    }
  };
  
  const handleBattleEnd = (results) => {
    console.log('Battle ended with results:', results);
    setBattleResults(results);
    setBattleMode('results');

    if (results.status === 'playerWin') {
      // Get current player characters from localStorage
      const localPlayerCharacters = JSON.parse(localStorage.getItem('playerCharacters') || '[]');
      
      // 20% chance to unlock a new character
      if (Math.random() < 0.2) {
        const unlockableChars = getUnlockableCharacters();
        const alreadyUnlocked = localPlayerCharacters.map(char => char.id);
        const availableToUnlock = unlockableChars.filter(char => !alreadyUnlocked.includes(char.id));
        
        if (availableToUnlock.length > 0) {
          // Randomly select one character to unlock
          const newCharacter = availableToUnlock[Math.floor(Math.random() * availableToUnlock.length)];
          
          // Create a new character instance at level 1
          const unlockedChar = new Character(
            newCharacter.id,
            newCharacter.name,
            newCharacter.species,
            newCharacter.rarity,
            newCharacter.baseStats,
            newCharacter.abilities.map(ability => new Ability(ability))
          );
          unlockedChar.level = 1;
          unlockedChar.experience = 0;
          
          // Add to local storage
          localPlayerCharacters.push(unlockedChar);
          localStorage.setItem('playerCharacters', JSON.stringify(localPlayerCharacters));
          
          // Update current battle's player team
          if (currentBattle) {
            currentBattle.playerTeam.push(unlockedChar);
          }
        }
      }
    }
  };
  
  const resetBattle = () => {
    setSelectedTeam([]);
    setCurrentBattle(null);
    setBattleResults(null);
    setBattleMode('select');
  };
  
  // Function to save player progress to local storage
  const savePlayerProgress = (characters) => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('playerCharacters', JSON.stringify(characters));
        console.log('Progress saved to local storage');
      }
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  };

  // Function to load player progress from local storage
  const loadPlayerProgress = () => {
    try {
      if (typeof window !== 'undefined') {
        const savedData = localStorage.getItem('playerCharacters');
        if (savedData) {
          return JSON.parse(savedData);
        }
      }
    } catch (error) {
      console.error('Failed to load progress:', error);
    }
    return null;
  };
  
  return (
    <Layout title="Battle - Stellar Vanguard">
      <div className="container mx-auto">
        {battleMode === 'select' && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-futuristic mb-6 text-white">
              Team <span className="text-neon-green">Selection</span>
            </h1>
            
            <div className="mb-6">
              <p className="text-gray-300 mb-2">
                Select up to {maxTeamSize} characters for your battle team.
              </p>
              <div className="bg-space-black/70 p-3 rounded-lg mb-4">
                <p className="text-white">
                  Selected: <span className="text-neon-green">{selectedTeam.length}</span>/{maxTeamSize}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {localPlayerCharacters.map(character => (
                <div key={character.id}>
                  <CharacterCard 
                    character={character}
                    onClick={toggleCharacterSelection}
                    isSelected={selectedTeam.includes(character)}
                  />
                </div>
              ))}
            </div>
            
            <div className="flex justify-center">
              <button
                onClick={prepareForBattle}
                disabled={selectedTeam.length === 0}
                className={`px-8 py-3 rounded-md text-xl font-futuristic ${
                  selectedTeam.length === 0 
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                    : 'bg-neon-green text-space-black hover:bg-neon-green/80'
                }`}
              >
                Prepare for Battle
              </button>
            </div>
          </motion.div>
        )}
        
        {battleMode === 'prepare' && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-futuristic mb-6 text-white">
              Battle <span className="text-neon-green">Preparation</span>
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-space-black/70 p-6 rounded-lg sci-fi-border">
                <h3 className="text-xl font-futuristic text-white mb-4">Your Team</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-4">
                  {selectedTeam.map(character => (
                    <div key={character.id} className="col-span-1">
                      <CharacterCard character={character} />
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-space-black/70 p-6 rounded-lg sci-fi-border">
                <h3 className="text-xl font-futuristic text-white mb-4">Battle Settings</h3>
                
                <div className="mb-6">
                  <label className="block text-white mb-2">Difficulty</label>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setBattleDifficulty('easy')}
                      className={`flex-1 py-2 rounded-md transition-colors ${
                        battleDifficulty === 'easy'
                          ? 'bg-neon-green text-space-black'
                          : 'bg-cosmic-blue/50 text-white'
                      }`}
                    >
                      Easy
                    </button>
                    <button
                      onClick={() => setBattleDifficulty('hard')}
                      className={`flex-1 py-2 rounded-md transition-colors ${
                        battleDifficulty === 'hard'
                          ? 'bg-alien-orange text-space-black'
                          : 'bg-cosmic-blue/50 text-white'
                      }`}
                    >
                      Hard
                    </button>
                  </div>
                  <p className="text-sm text-gray-400 mt-2">
                    {battleDifficulty === 'easy' 
                      ? 'Fight against lower-level enemies with basic abilities.'
                      : 'Challenge yourself against powerful enemies with advanced abilities.'}
                  </p>
                </div>
                
                <div className="flex justify-between mt-8">
                  <button
                    onClick={() => setBattleMode('select')}
                    className="px-4 py-2 bg-cosmic-blue/50 text-white rounded-md hover:bg-cosmic-blue/70"
                  >
                    Back
                  </button>
                  <button
                    onClick={startBattle}
                    className="px-6 py-2 bg-neon-green text-space-black rounded-md hover:bg-neon-green/80 font-futuristic"
                  >
                    Start Battle
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        {battleMode === 'battle' && currentBattle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-futuristic mb-6 text-white">
              <span className="text-neon-green">Battle</span> in Progress
            </h1>
            
            <BattleInterface
              battle={currentBattle}
              onAbilityUse={handleAbilityUse}
              onNextTurn={handleNextTurn}
              onBattleEnd={handleBattleEnd}
            />
          </motion.div>
        )}
        
        {battleMode === 'results' && (
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto bg-space-black/80 rounded-lg p-6 sci-fi-border">
              <h2 className="text-2xl font-futuristic text-white mb-6">
                {battleResults.status === 'playerWin' ? 'Victory!' : 'Defeat'}
              </h2>
              
              {battleResults.status === 'playerWin' && battleResults.rewards && (
                <>
                  <div className="mb-6">
                    <h3 className="text-lg font-futuristic text-neon-green mb-2">Battle Rewards</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-black/30 p-4 rounded">
                        <div className="text-sm text-gray-400">Experience</div>
                        <div className="text-xl text-white">+{battleResults.rewards.exp}</div>
                      </div>
                      <div className="bg-black/30 p-4 rounded">
                        <div className="text-sm text-gray-400">Gold</div>
                        <div className="text-xl text-white">+{battleResults.rewards.gold}</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Show newly unlocked character if any */}
                  {currentBattle && currentBattle.playerTeam.length > localPlayerCharacters.length && (
                    <div className="mb-6 p-4 bg-neon-green/10 border border-neon-green/30 rounded">
                      <h3 className="text-lg font-futuristic text-neon-green mb-2">New Character Unlocked!</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {currentBattle.playerTeam
                          .filter(char => !localPlayerCharacters.find(c => c.id === char.id))
                          .map(char => (
                            <div key={char.id} className="bg-black/30 p-4 rounded">
                              <div className="text-white font-futuristic">{char.name}</div>
                              <div className="text-sm text-gray-400">{char.species}</div>
                              <div className="text-sm text-neon-green mt-2">Level 1</div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </>
              )}
              
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setBattleMode('select')}
                  className="px-6 py-2 rounded-md text-lg font-futuristic bg-neon-green text-space-black hover:bg-neon-green/80"
                >
                  Back to Character Selection
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
} 