const app = Vue.createApp({
  data() {
    return {
      monsterHealth: 100,
      monsterArmorClass: 14,
      playerHealth: 100,
      playerArmorClass: 13,
      diceOutput: 0,
      damageOutput: 0,
    };
  },
  computed: {
    monsterBarStyles() {
      return { width: this.monsterHealth + '%' };
    },
    playerBarStyles() {
      return { width: this.playerHealth + '%' };
    },
  },
  methods: {
    attackMonster(num, dice, attNum, attDice) {
      this.diceOutput = this.diceRoll(num, dice);
      if (this.diceOutput >= this.monsterArmorClass) {
        console.log('You hit the monster!');
        this.monsterHealth -= this.damageRoll(attNum, attDice);
        console.log('MonsterHP: ', this.monsterHealth);
      } else {
        console.log('You missed the monster!');
      }
      this.attackPlayer();
    },
    attackPlayer() {
      this.diceOutput = this.diceRoll(1, 20);
      if (this.diceOutput >= this.playerArmorClass) {
        console.log('Monster hits you with an attack!');
        this.playerHealth -= this.damageRoll(1, 12);
        console.log('Player HP: ', this.playerHealth);
      } else {
        console.log('The monster misses!');
      }
    },
    diceRoll(num, dice) {
      if (dice) {
        return (this.diceOutput = num * Math.round(Math.random(1) * dice) + 1);
      }
    },
    damageRoll(num, dice) {
      if (dice) {
        return (this.diceOutput = num * Math.round(Math.random(1) * dice));
      }
    },
  },
});

app.mount('#game');
