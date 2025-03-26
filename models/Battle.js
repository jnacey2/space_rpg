// Debug logging utility
const DEBUG = true;
const debugLog = (area, message, data = null) => {
  if (!DEBUG) return;
  const timestamp = new Date().toISOString().substr(11, 8);
  console.log(`[${timestamp}][BATTLE][${area}] ${message}`, data || '');
};

class Battle {
  constructor(playerTeam, enemyTeam) {
    this.playerTeam = playerTeam;
    this.enemyTeam = enemyTeam;
    this.turnOrder = [];
    this.currentTurn = 0;
    this.logs = [];
    this.status = 'active'; // active, playerWin, enemyWin
    
    debugLog('INIT', 'Battle constructor called', {
      playerTeam: playerTeam.map(p => p.name),
      enemyTeam: enemyTeam.map(e => e.name)
    });
    
    this.initializeBattle();
    
    // Explicitly determine if it's a player's turn based on the first character
    if (this.turnOrder.length > 0) {
      const firstCharacter = this.turnOrder[0];
      this.isPlayerTurn = this.isPlayerCharacter(firstCharacter);
      debugLog('INIT', `Battle initialized. First character: ${firstCharacter.name} (ID: ${firstCharacter.id}), isPlayerTurn: ${this.isPlayerTurn}`);
    } else {
      this.isPlayerTurn = true; // Default to player turn if no characters
      debugLog('INIT', 'WARNING: Battle initialized with no characters in turn order');
    }
  }
  
  initializeBattle() {
    try {
      debugLog('INIT', 'Initializing battle');
      
      // Ensure all characters have valid stats
      for (const character of [...this.playerTeam, ...this.enemyTeam]) {
        // Fix missing stats
        if (!character.stats) {
          debugLog('INIT', `Character ${character.name} missing stats, adding defaults`);
          character.stats = { 
            attack: 30, 
            defense: 30, 
            health: 200, 
            speed: 30, 
            special: 10 
          };
        }
        
        // Ensure all required stats exist
        const requiredStats = ['attack', 'defense', 'health', 'speed', 'special'];
        for (const stat of requiredStats) {
          if (character.stats[stat] === undefined) {
            debugLog('INIT', `Character ${character.name} missing ${stat}, adding default`);
            character.stats[stat] = 30;
          }
        }
        
        // Ensure abilities array exists
        if (!Array.isArray(character.abilities)) {
          debugLog('INIT', `Character ${character.name} missing abilities array, adding default`);
          character.abilities = [];
        }

        // Add a default ability if none exist
        if (character.abilities.length === 0) {
          debugLog('INIT', `Character ${character.name} has no abilities, adding default`);
          character.abilities.push({
            id: 9999,
            name: "Basic Attack",
            description: "A simple attack that deals moderate damage",
            power: 25,
            type: "damage",
            cooldown: 0,
            currentCooldown: 0,
            effectChance: 0,
            effect: null
          });
        }
      }
      
      // Combine teams and sort by speed for turn order
      const allCharacters = [...this.playerTeam, ...this.enemyTeam];
      this.turnOrder = allCharacters.sort((a, b) => b.stats.speed - a.stats.speed);
      
      debugLog('INIT', 'Turn order established', this.turnOrder.map(c => ({
        name: c.name,
        id: c.id,
        speed: c.stats.speed,
        isPlayer: this.isPlayerCharacter(c)
      })));
      
      // Add initial battle log
      this.logs.push('Battle initiated!');
    } catch (error) {
      debugLog('INIT', 'Error in battle initialization', error);
      this.logs.push('Error initializing battle, but we will try to continue.');
      
      // Fallback turn order if something went wrong
      if (!this.turnOrder || this.turnOrder.length === 0) {
        this.turnOrder = [...this.playerTeam, ...this.enemyTeam];
        debugLog('INIT', 'Using fallback turn order');
      }
    }
  }
  
  getCurrentCharacter() {
    const character = this.overrideCurrentCharacter || this.turnOrder[this.currentTurn];
    debugLog('TURN', `Getting current character: ${character?.name || 'NONE'}`, {
      currentTurn: this.currentTurn,
      hasOverride: !!this.overrideCurrentCharacter,
      overrideName: this.overrideCurrentCharacter?.name,
      turnOrderName: this.turnOrder[this.currentTurn]?.name
    });
    return character;
  }
  
  isPlayerCharacter(character) {
    if (!character) {
      debugLog('CHARACTER', 'Character is null or undefined in isPlayerCharacter check');
      return false;
    }
    
    // Use ID for comparison since reference equality might fail
    const isPlayer = this.playerTeam.some(playerChar => playerChar.id === character.id);
    debugLog('CHARACTER', `Checking if ${character.name} (ID: ${character.id}) is a player character: ${isPlayer}`);
    return isPlayer;
  }
  
  executeAbility(ability, target) {
    const attacker = this.getCurrentCharacter();
    debugLog('ABILITY', `Executing ability ${ability?.name} on target ${target?.name} by ${attacker?.name}`);
    
    // Basic validation
    if (!ability || !target) {
      debugLog('ABILITY', 'Invalid ability or target!', { ability, target });
      this.logs.push('Invalid ability or target!');
      return false;
    }
    
    // Check if the attacker is still alive
    if (!attacker || attacker.stats.health <= 0) {
      debugLog('ABILITY', 'The attacker is no longer able to act!', { attacker });
      this.logs.push('The attacker is no longer able to act!');
      return false;
    }
    
    // Check if the target is still alive
    if (target.stats.health <= 0) {
      debugLog('ABILITY', `${target.name} is already defeated and cannot be targeted!`);
      this.logs.push(`${target.name} is already defeated and cannot be targeted!`);
      return false;
    }
    
    // Check for cooldown
    if (ability.currentCooldown > 0) {
      debugLog('ABILITY', `${ability.name} is on cooldown!`);
      this.logs.push(`${ability.name} is on cooldown!`);
      return false;
    }
    
    // Set cooldown when ability is used
    ability.currentCooldown = ability.cooldown;
    
    // Rest of ability execution logic
    let abilityResult = {
      power: ability.power,
      effect: null
    };
    
    // Check for effect chance
    if (ability.effect && ability.effectChance > 0) {
      const roll = Math.random() * 100;
      if (roll <= ability.effectChance) {
        abilityResult.effect = ability.effect;
      }
    }
    
    // Apply ability effects based on type
    try {
      switch (ability.type) {
        case 'damage':
          const damage = attacker.calculateDamage(target, ability);
          target.stats.health -= damage;
          // Ensure health doesn't go below 0
          if (target.stats.health < 0) target.stats.health = 0;
          
          debugLog('ABILITY', `Damage ability execution: ${attacker.name} dealt ${damage} damage to ${target.name}`);
          this.logs.push(`${attacker.name} used ${ability.name} on ${target.name} for ${damage} damage!`);
          
          if (abilityResult.effect) {
            this.applyEffect(target, abilityResult.effect);
          }
          break;
          
        case 'heal':
          const healAmount = Math.floor(ability.power * (attacker.stats.special / 100));
          target.stats.health += healAmount;
          debugLog('ABILITY', `Heal ability execution: ${attacker.name} healed ${target.name} for ${healAmount}`);
          this.logs.push(`${attacker.name} used ${ability.name} on ${target.name} for ${healAmount} healing!`);
          break;
          
        default:
          debugLog('ABILITY', `Unknown ability type: ${ability.type}`);
          this.logs.push(`${attacker.name} used ${ability.name} but it had no effect!`);
          break;
      }
    } catch (error) {
      debugLog('ABILITY', 'Error executing ability:', error);
      this.logs.push(`${ability.name} failed to execute properly!`);
      return false;
    }
    
    this.checkBattleStatus();
    return true;
  }
  
  applyEffect(target, effect) {
    // Apply status effects (stun, poison, etc.)
    target.activeEffects = target.activeEffects || [];
    target.activeEffects.push({
      ...effect,
      remainingDuration: effect.duration
    });
    
    debugLog('EFFECT', `Applied ${effect.type} effect to ${target.name} for ${effect.duration} turns`);
    this.logs.push(`${effect.type} effect applied to ${target.name} for ${effect.duration} turns!`);
  }
  
  processEffects() {
    debugLog('EFFECTS', 'Processing active effects for all characters');
    
    for (const character of this.turnOrder) {
      if (!character.activeEffects) continue;
      
      // Process each active effect
      for (let i = character.activeEffects.length - 1; i >= 0; i--) {
        const effect = character.activeEffects[i];
        
        // Apply effect
        switch (effect.type) {
          case 'poison':
            const damage = effect.amount;
            character.stats.health -= damage;
            debugLog('EFFECTS', `${character.name} took ${damage} poison damage!`);
            this.logs.push(`${character.name} took ${damage} poison damage!`);
            break;
            
          case 'regeneration':
            const healing = effect.amount;
            character.stats.health += healing;
            debugLog('EFFECTS', `${character.name} regenerated ${healing} health!`);
            this.logs.push(`${character.name} regenerated ${healing} health!`);
            break;
        }
        
        // Reduce duration
        effect.remainingDuration -= 1;
        
        // Remove expired effects
        if (effect.remainingDuration <= 0) {
          character.activeEffects.splice(i, 1);
          debugLog('EFFECTS', `${effect.type} effect wore off from ${character.name}!`);
          this.logs.push(`${effect.type} effect wore off from ${character.name}!`);
        }
      }
    }
  }
  
  nextTurn() {
    debugLog('TURN', 'Processing next turn', { 
      currentTurn: this.currentTurn, 
      turnOrder: this.turnOrder.map(c => c.name),
      currentOverride: this.overrideCurrentCharacter?.name
    });
    
    // Process effects before moving to next turn
    this.processEffects();
    
    // Clear any character override from the previous turn
    if (this.overrideCurrentCharacter) {
      debugLog('TURN', `Clearing override character: ${this.overrideCurrentCharacter.name}`);
      this.overrideCurrentCharacter = null;
    }
    
    // Move to next character, skipping dead characters
    let nextCharacterIndex = (this.currentTurn + 1) % this.turnOrder.length;
    let loopGuard = 0; // Prevent infinite loops
    
    // Skip over dead characters
    while (this.turnOrder[nextCharacterIndex].stats.health <= 0 && loopGuard < this.turnOrder.length) {
      debugLog('TURN', `Skipping defeated character: ${this.turnOrder[nextCharacterIndex].name}`);
      nextCharacterIndex = (nextCharacterIndex + 1) % this.turnOrder.length;
      loopGuard++;
      
      // If we've looped through all characters and they're all dead, check battle status
      if (loopGuard >= this.turnOrder.length) {
        debugLog('TURN', 'All characters appear to be defeated, checking battle status');
        this.checkBattleStatus();
        // If battle is still active but all characters are dead, force end
        if (this.status === 'active') {
          // Check if all player characters are dead
          const allPlayersDead = this.playerTeam.every(char => char.stats.health <= 0);
          // Check if all enemy characters are dead
          const allEnemiesDead = this.enemyTeam.every(char => char.stats.health <= 0);
          
          if (allPlayersDead) {
            this.status = 'enemyWin';
            debugLog('TURN', 'Battle ended - all player characters defeated');
            this.logs.push('You have been defeated!');
          } else if (allEnemiesDead) {
            this.status = 'playerWin';
            debugLog('TURN', 'Battle ended - all enemy characters defeated');
            this.logs.push('Victory! All enemies have been defeated!');
          }
        }
        return;
      }
    }
    
    this.currentTurn = nextCharacterIndex;
    const nextCharacter = this.turnOrder[nextCharacterIndex];
    
    // Reduce cooldowns for all abilities of all characters
    for (const character of this.turnOrder) {
      if (character.stats.health > 0) { // Only process living characters
        debugLog('COOLDOWN', `Processing cooldowns for ${character.name}`, {
          abilities: character.abilities.map(a => ({
            name: a.name,
            currentCooldown: a.currentCooldown
          }))
        });
        
        // Use the new method if available
        if (typeof character.reduceCooldowns === 'function') {
          character.reduceCooldowns();
        } else {
          // Fallback to manual loop
          for (const ability of character.abilities) {
            if (ability && typeof ability === 'object' && typeof ability.currentCooldown === 'number') {
              if (ability.currentCooldown > 0) {
                ability.currentCooldown -= 1;
                debugLog('COOLDOWN', `Reduced cooldown for ${ability.name} to ${ability.currentCooldown}`);
              }
            }
          }
        }
      }
    }
    
    // Check if player or enemy turn
    const wasPlayerTurn = this.isPlayerTurn;
    this.isPlayerTurn = this.isPlayerCharacter(nextCharacter);
    
    debugLog('TURN', `Turn changed from ${wasPlayerTurn ? 'player' : 'enemy'} to ${this.isPlayerTurn ? 'player' : 'enemy'}`, {
      character: nextCharacter.name,
      id: nextCharacter.id,
      turnIndex: this.currentTurn,
      abilities: nextCharacter.abilities.map(a => ({
        name: a.name,
        cooldown: a.currentCooldown
      }))
    });
    
    this.logs.push(`It's ${nextCharacter.name}'s turn!`);
  }
  
  checkBattleStatus() {
    // Check if all player characters are defeated
    const allPlayersDead = this.playerTeam.every(character => character.stats.health <= 0);
    
    // Check if all enemy characters are defeated
    const allEnemiesDead = this.enemyTeam.every(character => character.stats.health <= 0);
    
    const oldStatus = this.status;
    
    if (allPlayersDead) {
      this.status = 'enemyWin';
      debugLog('STATUS', 'Battle ended: All player characters defeated');
      this.logs.push('You have been defeated!');
    } else if (allEnemiesDead) {
      this.status = 'playerWin';
      debugLog('STATUS', 'Battle ended: All enemy characters defeated');
      this.logs.push('Victory! All enemies have been defeated!');
    }
    
    if (oldStatus !== this.status) {
      debugLog('STATUS', `Battle status changed from ${oldStatus} to ${this.status}`);
    }
  }
  
  getRewards() {
    // Only provide rewards if player won
    if (this.status !== 'playerWin') return { exp: 0, gold: 0 };
    
    // Calculate rewards based on enemy team
    const totalExp = this.enemyTeam.reduce((sum, enemy) => {
      return sum + (enemy.level * 10);
    }, 0);
    
    const totalGold = this.enemyTeam.reduce((sum, enemy) => {
      const rarityMultiplier = {
        common: 1,
        uncommon: 1.5,
        rare: 2,
        epic: 3,
        legendary: 5
      }[enemy.rarity] || 1;
      
      return sum + Math.floor(enemy.level * 5 * rarityMultiplier);
    }, 0);
    
    debugLog('REWARDS', `Generated rewards for player victory: ${totalExp} XP, ${totalGold} gold`);
    
    return {
      exp: totalExp,
      gold: totalGold
    };
  }
}

export default Battle; 