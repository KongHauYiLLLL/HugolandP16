import { PowerSkill } from '../types/game';

export const powerSkillDefinitions: Omit<PowerSkill, 'isActive'>[] = [
  // Tier 1 - Common
  {
    id: 'heal',
    name: 'Healing Touch',
    description: 'Restore 10% HP every 3 rounds',
    rarity: 'common',
    tier: 1,
    effect: {
      type: 'heal',
      value: 10,
      cooldown: 3,
      currentCooldown: 0
    }
  },
  {
    id: 'shield',
    name: 'Iron Will',
    description: 'Reduce all damage by 5',
    rarity: 'common',
    tier: 1,
    effect: {
      type: 'shield',
      value: 5
    }
  },
  {
    id: 'crit',
    name: 'Sharp Focus',
    description: '15% chance to deal double damage',
    rarity: 'common',
    tier: 1,
    effect: {
      type: 'crit',
      value: 15
    }
  },

  // Tier 2 - Rare
  {
    id: 'vampire',
    name: 'Life Steal',
    description: 'Heal for 20% of damage dealt',
    rarity: 'rare',
    tier: 2,
    effect: {
      type: 'vampire',
      value: 20
    }
  },
  {
    id: 'rage',
    name: 'Battle Fury',
    description: 'ATK increases by 5% each round (max 50%)',
    rarity: 'rare',
    tier: 2,
    effect: {
      type: 'rage',
      value: 5,
      stacks: 0,
      maxStacks: 10
    }
  },
  {
    id: 'lucky',
    name: 'Lucky Charm',
    description: '25% chance to avoid all damage',
    rarity: 'rare',
    tier: 2,
    effect: {
      type: 'lucky',
      value: 25
    }
  },
  {
    id: 'scholar',
    name: 'Quick Mind',
    description: 'Gain +2 seconds for answering questions',
    rarity: 'rare',
    tier: 2,
    effect: {
      type: 'scholar',
      value: 2
    }
  },
  {
    id: 'berserker',
    name: 'Berserker Rage',
    description: 'Deal 2% more damage for every 1% HP missing',
    rarity: 'rare',
    tier: 2,
    effect: {
      type: 'berserker',
      value: 2
    }
  },

  // Tier 3 - Epic
  {
    id: 'poison',
    name: 'Poison Dart Frog',
    description: 'Deals 5% of ATK to the enemy every round',
    rarity: 'epic',
    tier: 3,
    effect: {
      type: 'poison',
      value: 5
    }
  },
  {
    id: 'free_answer',
    name: 'Oracle\'s Wisdom',
    description: 'For the first round, the correct answer is highlighted in blue',
    rarity: 'epic',
    tier: 3,
    effect: {
      type: 'free_answer',
      value: 1
    }
  },
  {
    id: 'fortress',
    name: 'Fortress Defense',
    description: 'Take 30% less damage when HP is below 50%',
    rarity: 'epic',
    tier: 3,
    effect: {
      type: 'fortress',
      value: 30
    }
  },
  {
    id: 'swift',
    name: 'Lightning Reflexes',
    description: '40% chance to attack twice in one round',
    rarity: 'epic',
    tier: 3,
    effect: {
      type: 'swift',
      value: 40
    }
  },
  {
    id: 'midas',
    name: 'Midas Touch',
    description: 'Gain 50% more coins from victories',
    rarity: 'epic',
    tier: 3,
    effect: {
      type: 'midas',
      value: 50
    }
  },

  // Tier 4 - Legendary
  {
    id: 'guardian',
    name: 'Guardian Angel',
    description: 'All damage dealt to the player is inflicted back to the enemy once every 5 rounds',
    rarity: 'legendary',
    tier: 4,
    effect: {
      type: 'guardian',
      cooldown: 5,
      currentCooldown: 0
    }
  },
  {
    id: 'war_veteran',
    name: 'War Veteran',
    description: 'ATK increases by 10% for every round, resets per combat',
    rarity: 'legendary',
    tier: 4,
    effect: {
      type: 'war_veteran',
      value: 10,
      stacks: 0
    }
  },
  {
    id: 'dodge',
    name: 'Dodge++',
    description: 'Every round, 30% chance to not take damage',
    rarity: 'legendary',
    tier: 4,
    effect: {
      type: 'dodge',
      value: 30
    }
  },
  {
    id: 'phoenix',
    name: 'Phoenix Rebirth',
    description: 'Revive with 50% HP once per combat when defeated',
    rarity: 'legendary',
    tier: 4,
    effect: {
      type: 'phoenix',
      value: 50,
      cooldown: 1,
      currentCooldown: 0
    }
  },
  {
    id: 'time_warp',
    name: 'Time Manipulation',
    description: 'Freeze time for 3 seconds when HP drops below 25%',
    rarity: 'legendary',
    tier: 4,
    effect: {
      type: 'time_warp',
      value: 3,
      cooldown: 1,
      currentCooldown: 0
    }
  },

  // Tier 5 - Mythical
  {
    id: 'crown',
    name: 'Royal Crown',
    description: 'All stats +50%',
    rarity: 'mythical',
    tier: 5,
    effect: {
      type: 'crown',
      value: 50
    }
  },
  {
    id: 'hp_boost',
    name: 'Super HP',
    description: 'Max HP and HP *3',
    rarity: 'mythical',
    tier: 5,
    effect: {
      type: 'hp_boost',
      value: 3
    }
  },
  {
    id: 'elemental',
    name: 'Elemental Mastery',
    description: 'Each attack has a random elemental effect (burn, freeze, shock)',
    rarity: 'mythical',
    tier: 5,
    effect: {
      type: 'elemental',
      value: 100
    }
  },
  {
    id: 'assassin',
    name: 'Shadow Assassin',
    description: '10% chance to instantly defeat any enemy',
    rarity: 'mythical',
    tier: 5,
    effect: {
      type: 'assassin',
      value: 10
    }
  }
];

export const getPowerSkillForTier = (tier: number): PowerSkill | null => {
  const availableSkills = powerSkillDefinitions.filter(skill => skill.tier === tier);
  if (availableSkills.length === 0) return null;
  
  const randomSkill = availableSkills[Math.floor(Math.random() * availableSkills.length)];
  return {
    ...randomSkill,
    isActive: true
  };
};

export const applyPowerSkillEffects = (
  powerSkills: PowerSkill[],
  context: 'combat_start' | 'round_start' | 'damage_dealt' | 'damage_taken' | 'victory',
  data?: any
): any => {
  let result = { ...data };
  
  powerSkills.forEach(skill => {
    if (!skill.isActive) return;
    
    switch (skill.effect.type) {
      case 'heal':
        if (context === 'round_start' && skill.effect.currentCooldown === 0) {
          result.healAmount = (result.healAmount || 0) + Math.floor(result.maxHp * (skill.effect.value! / 100));
          skill.effect.currentCooldown = skill.effect.cooldown!;
        }
        break;
        
      case 'shield':
        if (context === 'damage_taken') {
          result.damage = Math.max(0, result.damage - skill.effect.value!);
        }
        break;
        
      case 'crit':
        if (context === 'damage_dealt' && Math.random() * 100 < skill.effect.value!) {
          result.damage *= 2;
          result.isCrit = true;
        }
        break;
        
      case 'vampire':
        if (context === 'damage_dealt') {
          result.healAmount = (result.healAmount || 0) + Math.floor(result.damage * (skill.effect.value! / 100));
          
          
        }
        break;
        
      case 'crown':
        if (context === 'combat_start') {
          result.atkBonus = (result.atkBonus || 0) + skill.effect.value!;
          result.defBonus = (result.defBonus || 0) + skill.effect.value!;
          result.hpBonus = (result.hpBonus || 0) + skill.effect.value!;
        }
        break;
        
      case 'hp_boost':
        if (context === 'combat_start') {
          result.hpMultiplier = (result.hpMultiplier || 1) * skill.effect.value!;
        }
        break;
    }
    
    // Update cooldowns
    if (skill.effect.currentCooldown && skill.effect.currentCooldown > 0) {
      skill.effect.currentCooldown--;
    }
  });
  
  return result;
};