export default class Pazaak {
  constructor() {
    this.deck = new Array(40).fill(0).map((e, i) => {
      return Math.floor(i / 4) + 1;
    });
    this.sideDeck = new Array(18).fill(0).map((e, i) => {
      const x = Math.floor(i / 6);
      const sign = x == 0 ? "+" : x == 1 ? "-" : "±";
      return sign + (i + 1 - 6 * x);
    });
  }

  nameTrimming(str) {
    if (str.length <= 13) {
      return str;
    }

    return str.slice(0, 10) + "...";
  }
}
