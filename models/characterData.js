import Ability from './Ability';
import Character from './Character';

// Define abilities
const abilities = {
  // Damage abilities
  laserShot: new Ability(1, 'Laser Shot', 'A precise laser attack', 25, 'damage', 0),
  plasmaBlast: new Ability(2, 'Plasma Blast', 'Area damage with plasma energy', 35, 'damage', 1),
  gravitySurge: new Ability(3, 'Gravity Surge', 'Manipulates gravity to crush enemies', 40, 'damage', 2),
  quantumStrike: new Ability(4, 'Quantum Strike', 'Attacks across multiple dimensions', 50, 'damage', 3),
  neuralDisruption: new Ability(5, 'Neural Disruption', 'Disrupts neural pathways', 30, 'damage', 1, 50, { type: 'stun', amount: 0, duration: 1 }),
  toxicVenom: new Ability(6, 'Toxic Venom', 'Injects a deadly alien toxin', 20, 'damage', 1, 70, { type: 'poison', amount: 10, duration: 3 }),
  
  // Healing abilities
  nanoRepair: new Ability(7, 'Nano Repair', 'Microscopic robots repair damage', 30, 'heal', 2),
  bioRegeneration: new Ability(8, 'Bio Regeneration', 'Accelerates natural healing', 25, 'heal', 1, 30, { type: 'regeneration', amount: 5, duration: 2 }),
  
  // Buff abilities
  shieldMatrix: new Ability(9, 'Shield Matrix', 'Projects a protective energy field', 0, 'buff', 3, 100, { type: 'shield', amount: 50, duration: 3 }),
  neuralOverclock: new Ability(10, 'Neural Overclock', 'Enhances reflexes and speed', 0, 'buff', 4, 100, { type: 'speed', amount: 20, duration: 2 }),
  
  // New abilities for unlockable characters
  timeFreeze: new Ability(11, 'Time Freeze', 'Temporarily stops time for the target', 35, 'damage', 2, 40, { type: 'stun', amount: 0, duration: 2 }),
  plasmaShield: new Ability(12, 'Plasma Shield', 'Creates a shield of plasma energy', 0, 'buff', 3, 100, { type: 'shield', amount: 75, duration: 2 }),
  quantumHeal: new Ability(13, 'Quantum Heal', 'Heals using quantum energy', 40, 'heal', 2, 30, { type: 'regeneration', amount: 8, duration: 2 }),
  voidRift: new Ability(14, 'Void Rift', 'Opens a rift in space-time', 45, 'damage', 3, 20, { type: 'poison', amount: 15, duration: 2 }),
  neuralSync: new Ability(15, 'Neural Sync', 'Synchronizes neural patterns for enhanced abilities', 0, 'buff', 4, 100, { type: 'speed', amount: 25, duration: 3 }),
};

// Define characters
const characters = [
  // Player Characters
  new Character(
    1,
    'Zephyr-9',
    'rare',
    1,
    0,
    '/images/android-soldier.jpg',
    'Android',
    [abilities.laserShot, abilities.plasmaBlast, abilities.nanoRepair],
    { attack: 50, defense: 40, health: 300, speed: 45, special: 30 }
  ),
  new Character(
    2,
    'Nova Blade',
    'epic',
    1,
    0,
    '/images/space-warrior.jpg',
    'Altered Human',
    [abilities.quantumStrike, abilities.gravitySurge, abilities.shieldMatrix],
    { attack: 60, defense: 35, health: 280, speed: 50, special: 40 }
  ),
  new Character(
    3,
    'Bio-Vex',
    'legendary',
    1,
    0,
    '/images/alien-creature.jpg',
    'Xenomorph',
    [abilities.toxicVenom, abilities.bioRegeneration, abilities.neuralDisruption],
    { attack: 100, defense: 30, health: 320, speed: 60, special: 50 }
  ),
  new Character(
    4,
    'Epsilon',
    'uncommon',
    1,
    0,
    '/images/robot-healer.jpg',
    'AI Construct',
    [abilities.nanoRepair, abilities.shieldMatrix, abilities.neuralOverclock],
    { attack: 30, defense: 45, health: 270, speed: 35, special: 70 }
  ),
  
  // Enemy Characters - Basic
  new Character(
    101,
    'Scrap Droid',
    'common',
    1,
    0,
    '/images/scrap-droid.jpg',
    'Mechanical',
    [abilities.laserShot],
    { attack: 30, defense: 30, health: 200, speed: 30, special: 10 }
  ),
  new Character(
    102,
    'Space Pirate',
    'common',
    1,
    0,
    '/images/space-pirate.jpg',
    'Human',
    [abilities.plasmaBlast],
    { attack: 40, defense: 20, health: 180, speed: 40, special: 15 }
  ),
  
  // Enemy Characters - Advanced
  new Character(
    201,
    'Void Stalker',
    'rare',
    5,
    0,
    '/images/void-stalker.jpg',
    'Void Entity',
    [abilities.gravitySurge, abilities.neuralDisruption],
    { attack: 80, defense: 50, health: 450, speed: 65, special: 60 }
  ),
  new Character(
    202,
    'Dr. Nexus',
    'epic',
    8,
    0,
    '/images/mad-scientist.jpg',
    'Cybernetic Human',
    [abilities.quantumStrike, abilities.neuralOverclock, abilities.toxicVenom],
    { attack: 100, defense: 70, health: 600, speed: 70, special: 90 }
  ),
  
  // Unlockable Characters
  new Character(
    5,
    'Chronos',
    'epic',
    1,
    0,
    '/images/time-warrior.jpg',
    'Time Manipulator',
    [abilities.timeFreeze, abilities.quantumStrike, abilities.plasmaShield],
    { attack: 55, defense: 45, health: 280, speed: 60, special: 65 }
  ),
  new Character(
    6,
    'Void Walker',
    'legendary',
    1,
    0,
    '/images/void-walker.jpg',
    'Void Entity',
    [abilities.voidRift, abilities.gravitySurge, abilities.neuralSync],
    { attack: 70, defense: 40, health: 300, speed: 55, special: 80 }
  ),
  new Character(
    7,
    'Quantum Healer',
    'rare',
    1,
    0,
    '/images/quantum-healer.jpg',
    'Quantum Being',
    [abilities.quantumHeal, abilities.shieldMatrix, abilities.neuralOverclock],
    { attack: 35, defense: 50, health: 250, speed: 45, special: 90 }
  ),
];

// Utility functions
export function getPlayerCharacters() {
  return characters.filter(char => char.id < 100);
}

export function getEnemyCharacters() {
  return characters.filter(char => char.id >= 100);
}

export function getCharacterById(id) {
  return characters.find(char => char.id === id);
}

export function getBasicEnemies() {
  return characters.filter(char => char.id >= 100 && char.id < 200);
}

export function getAdvancedEnemies() {
  return characters.filter(char => char.id >= 200);
}

export function getUnlockableCharacters() {
  return characters.filter(char => char.id >= 5);
}

// Unlockable characters
export const unlockableCharacters = [
  {
    id: 'chronos',
    name: 'Chronos',
    species: 'Time Manipulator',
    rarity: 'epic',
    baseStats: {
      health: 85,
      attack: 75,
      defense: 65,
      speed: 80,
      special: 90
    },
    abilities: [
      {
        id: 'time-stop',
        name: 'Time Stop',
        description: 'Freeze time for all enemies, preventing their next action',
        power: 0,
        type: 'control',
        cooldown: 4,
        effectChance: 100,
        effect: 'stun'
      },
      {
        id: 'time-rewind',
        name: 'Time Rewind',
        description: 'Restore health to all allies by rewinding their wounds',
        power: 60,
        type: 'heal',
        cooldown: 3,
        effectChance: 100,
        effect: 'heal'
      }
    ]
  },
  {
    id: 'void-walker',
    name: 'Void Walker',
    species: 'Void Entity',
    rarity: 'legendary',
    baseStats: {
      health: 90,
      attack: 85,
      defense: 75,
      speed: 70,
      special: 95
    },
    abilities: [
      {
        id: 'void-blast',
        name: 'Void Blast',
        description: 'Deal massive damage to all enemies',
        power: 100,
        type: 'damage',
        cooldown: 4,
        effectChance: 30,
        effect: 'void'
      },
      {
        id: 'void-shield',
        name: 'Void Shield',
        description: 'Create a protective void barrier for all allies',
        power: 0,
        type: 'buff',
        cooldown: 3,
        effectChance: 100,
        effect: 'shield'
      }
    ]
  },
  {
    id: 'quantum-healer',
    name: 'Quantum Healer',
    species: 'Quantum Entity',
    rarity: 'rare',
    baseStats: {
      health: 80,
      attack: 60,
      defense: 70,
      speed: 75,
      special: 85
    },
    abilities: [
      {
        id: 'quantum-heal',
        name: 'Quantum Heal',
        description: 'Heal all allies and remove negative effects',
        power: 70,
        type: 'heal',
        cooldown: 3,
        effectChance: 100,
        effect: 'heal'
      },
      {
        id: 'quantum-shield',
        name: 'Quantum Shield',
        description: 'Create a quantum barrier that absorbs damage',
        power: 0,
        type: 'buff',
        cooldown: 4,
        effectChance: 100,
        effect: 'shield'
      }
    ]
  }
];

export default characters; 