class Character {
  constructor(id, name, rarity, level = 1, exp = 0, imageUrl, species, abilities, stats) {
    this.id = id;
    this.name = name;
    this.rarity = rarity; // common, uncommon, rare, epic, legendary
    this.level = level;
    this.exp = exp;
    this.imageUrl = imageUrl;
    this.species = species;
    this.abilities = abilities; // array of ability objects
    this.stats = stats; // { attack, defense, health, speed, special }
  }

  levelUp() {
    if (this.exp >= this.expToNextLevel()) {
      // Store excess experience
      const excess = this.exp - this.expToNextLevel();
      
      this.level += 1;
      this.exp = excess; // Carry over excess experience
      
      // Increase stats based on level up
      this.stats.attack += Math.floor(this.stats.attack * 0.1);
      this.stats.defense += Math.floor(this.stats.defense * 0.1);
      this.stats.health += Math.floor(this.stats.health * 0.1);
      this.stats.speed += Math.floor(this.stats.speed * 0.05);
      this.stats.special += Math.floor(this.stats.special * 0.1);
      
      console.log(`${this.name} leveled up to ${this.level}! Stats increased:`, this.stats);
      return true;
    }
    return false;
  }
  
  expToNextLevel() {
    return Math.floor(100 * Math.pow(1.1, this.level - 1));
  }
  
  addExp(amount) {
    console.log(`${this.name} gaining ${amount} experience`);
    this.exp += amount;
    console.log(`${this.name} now has ${this.exp}/${this.expToNextLevel()} experience`);
    
    // Keep leveling up while we have enough experience
    let leveled = false;
    while (this.exp >= this.expToNextLevel()) {
      leveled = this.levelUp() || leveled;
    }
    return leveled;
  }
  
  calculateDamage(target, ability) {
    // Validate inputs
    if (!target || !target.stats || !ability) {
      console.error('Invalid target or ability in calculateDamage');
      return 0;
    }
    
    // Prevent division by zero
    const targetDefense = target.stats.defense || 1;
    
    // Calculate base damage with a minimum value
    const baseDamage = Math.max(1, ability.power * (this.stats.attack / targetDefense));
    
    // Add some randomness within reasonable bounds
    const randomFactor = 0.9 + Math.random() * 0.2; // 0.9 to 1.1
    
    // Ensure we return a whole number greater than zero
    return Math.max(1, Math.floor(baseDamage * randomFactor));
  }

  reduceCooldowns() {
    if (this.abilities && Array.isArray(this.abilities)) {
      for (const ability of this.abilities) {
        if (ability && typeof ability === 'object' && typeof ability.reduceCooldown === 'function') {
          ability.reduceCooldown();
        } else if (ability && typeof ability === 'object' && typeof ability.currentCooldown === 'number') {
          // Manually reduce cooldown if method is missing
          if (ability.currentCooldown > 0) {
            ability.currentCooldown -= 1;
          }
        }
      }
    }
  }
}

export default Character; 