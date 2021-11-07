const app = Vue.createApp({
  data() {
    return {
      monsterHealth: 100,
      monsterArmorClass: 12,
      playerHealth: 100,
      playerArmorClass: 13,
      diceOutput: 0,
      damageOutput: 0,
      critical: false,
      currentRound: 0,
    };
  },
  computed: {
    monsterBarStyles() {
      return { width: this.monsterHealth + '%' };
    },
    playerBarStyles() {
      return { width: this.playerHealth + '%' };
    },
    mayUseSpecialAttack() {
      return this.currentRound % 3 !== 0;
    },
  },
  methods: {
    attackMonster(num, dice, attNum, attDice) {
      this.diceOutput = this.diceRoll(num, dice);
      this.currentRound++;
      if (this.diceOutput >= this.monsterArmorClass) {
        console.log('You hit the monster! You rolled ', this.diceOutput);
        this.monsterHealth -= this.damageRoll(attNum, attDice);
        console.log('MonsterHP: ', this.monsterHealth);
      } else {
        console.log('You missed the monster! You rolled ', this.diceOutput);
      }
      this.attackPlayer();
    },
    attackPlayer() {
      this.diceOutput = this.diceRoll(1, 20);
      if (this.diceOutput >= this.playerArmorClass) {
        console.log(
          'Monster hits you with an attack! You rolled ',
          this.diceOutput
        );
        this.playerHealth -= this.damageRoll(1, 12);
        console.log('Player HP: ', this.playerHealth);
      } else {
        console.log('The monster misses! You rolled ', this.diceOutput);
      }
    },
    diceRoll(num, dice) {
      if (dice) {
        if (this.diceOutput === 20) {
          console.log('You scored a critical!');
          this.critical = true;
        } else {
          this.critical = false;
        }
        return (this.diceOutput = num * Math.round(Math.random(1) * dice) + 4);
      }
    },
    damageRoll(num, dice) {
      if (dice) {
        if (this.critical === true) {
          this.diceOutput = num * 2 * Math.round(Math.random(1) * dice);
        } else {
          return (this.diceOutput = num * Math.round(Math.random(1) * dice));
        }
      }
    },
    healPlayer() {
      const healValue = this.diceRoll(2, 4);
      this.currentRound++;

      if (this.playerHealth + healValue > 100) {
        this.playerHealth = 100;
      } else {
        console.log(
          'You drank a healing potion and got healed for ',
          healValue
        );
        this.playerHealth += healValue;
      }
      this.attackPlayer();
    },
  },
});

app.mount('#game');
