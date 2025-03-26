# Stellar Vanguard: Tactical RPG

An epic sci-fi tactical RPG where you command a team of diverse heroes in turn-based strategic combat. Lead your elite squad of humans, androids, and xenomorphs in intense battles across the cosmos. Built with Next.js and featuring dynamic character abilities, deep team management, and strategic decision-making.

## 🚀 Features

### Battle System
- **Turn-Based Combat**: Strategic combat system where players and enemies take alternating turns
- **Dynamic Abilities**: Each character has unique abilities with different effects:
  - Damage abilities for attacking enemies
  - Healing abilities for supporting allies
  - Buff abilities for enhancing team members
- **Cooldown System**: Abilities have cooldowns to encourage strategic planning
- **Status Effects**: Various effects like poison, stun, and regeneration

### Characters
- **Diverse Species**:
  - Humans
  - Androids
  - Xenomorphs
  - Altered Humans
  - Mechanical beings
- **Character Stats**:
  - Health: Character's hit points
  - Attack: Determines damage output
  - Defense: Reduces incoming damage
  - Speed: Affects turn order
  - Special: Enhances ability effects

### Team Management
- Build teams of up to 3 characters
- Mix and match different species and abilities
- Strategic character selection based on abilities and synergies

### Progression System
- Experience points (XP) gained from battles
- Gold rewards for victories
- Character leveling system
- Stat improvements upon level up

### Battle Modes
- **Easy Mode**: Fight against basic enemies with standard abilities
- **Hard Mode**: Challenge yourself against advanced enemies with powerful abilities and effects

## 🎮 How to Play

1. **Team Selection**
   - Choose up to 3 characters for your battle team
   - Consider character abilities and team composition

2. **Battle Preparation**
   - Select battle difficulty (Easy/Hard)
   - Review your team's abilities and stats

3. **Combat**
   - Battles proceed in turns based on character speed
   - On your turn:
     1. Select a character
     2. Choose an ability
     3. Select a target
     4. Execute the action
   - Enemy AI will automatically take their turns

4. **Strategy Tips**
   - Use cooldowns wisely
   - Consider target selection carefully
   - Balance damage dealers with support characters
   - Watch for status effects and counters

## 🛠️ Technical Details

### Built With
- Next.js
- React
- Framer Motion for animations
- Tailwind CSS for styling

### Key Components
- `BattleInterface`: Main battle UI and logic
- `CharacterCard`: Character display and selection
- `Battle`: Core battle mechanics
- `Character`: Character stats and abilities
- `Ability`: Ability definitions and effects

### State Management
- React state for UI components
- Battle state managed through Battle class
- Local storage for progress saving

## 🚀 Getting Started

1. **Installation**
   ```bash
   npm install
   ```

2. **Development**
   ```bash
   npm run dev
   ```

3. **Production Build**
   ```bash
   npm run build
   npm start
   ```

## 🎯 Future Features
- More character species and abilities
- Equipment system
- Campaign mode
- PvP battles
- Character customization
- Advanced status effects
- Special events and missions

## 🐛 Debug Mode
- Debug mode available for development
- Displays detailed battle information
- Shows character states and ability cooldowns
- Includes force turn advancement for testing

## 🎨 UI Features
- Sci-fi themed interface
- Animated ability effects
- Battle log system
- Health and status displays
- Character portraits
- Responsive design for all screen sizes

## 💾 Save System
- Progress automatically saved
- Character levels and experience persist
- Team configurations remembered

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License
This project is licensed under the MIT License - see the LICENSE file for details. 