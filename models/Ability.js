class Ability {
  constructor(id, name, description, power, type, cooldown, effectChance = 0, effect = null, currentCooldown = 0) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.power = power; // base damage/healing power
    this.type = type; // damage, heal, buff, debuff
    this.cooldown = cooldown; // turns until can be used again
    this.currentCooldown = currentCooldown; // Allow setting initial cooldown
    this.effectChance = effectChance; // % chance to apply effect (0-100)
    this.effect = effect; // { type, amount, duration }
  }
  
  // Create a default ability when needed
  static createDefault(id = 999) {
    return new Ability(
      id,
      "Basic Attack",
      "A simple attack that deals moderate damage",
      25,
      "damage",
      0, // cooldown
      0, // effectChance
      null, // effect
      0 // currentCooldown
    );
  }
  
  // Clone this ability with its current state
  clone() {
    return new Ability(
      this.id,
      this.name,
      this.description,
      this.power,
      this.type,
      this.cooldown,
      this.effectChance,
      this.effect ? { ...this.effect } : null,
      this.currentCooldown
    );
  }
  
  use() {
    if (this.currentCooldown > 0) {
      console.log(`[ABILITY] Cannot use ${this.name} - on cooldown: ${this.currentCooldown}`);
      return null;
    }
    
    this.currentCooldown = this.cooldown;
    console.log(`[ABILITY] Used ${this.name} - set cooldown to ${this.currentCooldown}`);
    
    return {
      power: this.power,
      effect: this.checkEffect(),
    };
  }
  
  checkEffect() {
    if (!this.effect) return null;
    
    // Random chance to apply effect
    const roll = Math.random() * 100;
    if (roll <= this.effectChance) {
      return this.effect;
    }
    return null;
  }
  
  reduceCooldown() {
    if (this.currentCooldown > 0) {
      this.currentCooldown -= 1;
      console.log(`[ABILITY] Reduced ${this.name} cooldown to ${this.currentCooldown}`);
    }
  }
  
  isReady() {
    return this.currentCooldown === 0;
  }
}

export default Ability; 