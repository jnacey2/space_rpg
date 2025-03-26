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

export default characters; 