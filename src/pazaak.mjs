export default class Pazaak {
  constructor() {
    this.allMainDeckCards = new Array(40).fill(0).map((e, i) => {
      return Math.floor(i / 4) + 1;
    });
    this.allSideDeckCards = new Array(18).fill(0).map((e, i) => {
      const x = Math.floor(i / 6);
      const sign = x == 0 ? "+" : x == 1 ? "-" : "±";
      return sign + (i + 1 - 6 * x);
    });
    this.pending = new Map();
    this.awaiting = new Map();
  }

  listGames() {
    if (this.pending.size == 0) {
      console.log("list: -- no active games --");

      return "No active games";
    }

    let str = "```\n";
    let i = 1;
    this.pending.forEach((game, key) => {
      const { name, opponent, status } = game;
      str += [
        `${i} -- Player name: ${name}`,
        `ID: ${key}`,
        `Opponent: ${opponent.name || "NO"}`,
        `Status: ${status}\n`
      ].join("  ");
    });
    console.log(`list: -- ${this.pending.size} games --`);

    return (str += "```");
  }

  newGame({ id, name }) {
    if (this.pending.has(id)) {
      console.log(`new game: -- ${id} is already in the list --`);
      return "Can't create the new game. You are in the pending list for now. Exit current game: `pazaak exit`";
    }

    this.pending.set(id, {
      name,
      opponent: { id: null, name: null },
      status: "pending"
    });
    console.log(`new game: -- ${id} --`);

    return `New game request. Your game ID: ${id}`;
  }

  joinGame({ playerId, joinId }) {
    if (this.pending.has(joinId)) {
      // player is in pending list
    } else if (this.awaiting.has(joinId)) {
      // player is already in awaiting list
    } else {
      if (!this.pending.has(playerId)) {
        // no such ID in list
      }

      this.awaiting.set(joinId, playerId);

      const game = this.pending.get(playerId);
      [game.opponent, game.status] = [joinId, "awaits"];
      // message to playerId: `joinId wants to play with you; pazaak start -- play, pazaak reject -- reject`
    }
  }

  exitGame(id) {
    const game = this.pending.get(id);
    if (this.pending.has(id) && game.status != "playing") {
      if (game.opponent.id != null) {
        this.awaiting.delete(game.opponent.id);
      }
      this.pending.delete(id);
      console.log(`exit game: -- ${id} --`);

      return `Game with ID ${id} was closed`;
    } else if (this.awaiting.has(id)) {
      const gameId = this.awaiting.get(id);
      const game = this.pending.get(gameId);
      [game.opponent.id, game.opponent.name] = [null, null];
      this.awaiting.delete(id);
      console.log(`exit game: -- ${id} is no longer waiting --`);

      return "Now you are not waiting for game start";
    }
  }

  nameTrimming(str) {
    if (str.length <= 13) {
      return str;
    }

    return str.slice(0, 10) + "...";
  }
}
