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
      winner: null,
      logMessages: [],
    };
  },
  computed: {
    monsterBarStyles() {
      if (this.monsterHealth < 0) {
        return { width: '0%' };
      }
      return { width: this.monsterHealth + '%' };
    },
    playerBarStyles() {
      if (this.playerHealth < 0) {
        return { width: '0%' };
      }
      return { width: this.playerHealth + '%' };
    },
    mayUseSpecialAttack() {
      return this.currentRound % 3 !== 0;
    },
  },
  watch: {
    playerHealth(value) {
      if (value <= 0 && this.monsterHealth <= 0) {
        // A draw
        this.winner = 'draw';
      } else if (value <= 0) {
        // Player Lost
        this.winner = 'monster';
      }
    },
    monsterHealth(value) {
      if (value <= 0 && this.playerHealth <= 0) {
        // A draw
        this.winner = 'draw';
      } else if (value <= 0) {
        // Monster lost
        this.winner = 'player';
      }
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
      this.addLogMessage('player', 'attack', this.diceOutput);
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
        this.addLogMessage('monster', 'attack', this.diceOutput);

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
        this.addLogMessage('player', 'heal', healValue);

        this.playerHealth += healValue;
      }
      this.attackPlayer();
    },
    startGame() {
      this.playerHealth = 100;
      this.monsterHealth = 100;
      this.winner = null;
      this.currentRound = 0;
      this.logMessages = [];
    },
    surrender() {
      this.winner = 'monster';
    },
    addLogMessage(who, what, value) {
      this.logMessages.unshift({
        actionBy: who,
        actionType: what,
        actionValue: value,
      });
    },
  },
});

app.mount('#game');
