export default class Repl {
  constructor() {
    this.__events = {};
  }

  subscribe(eventName, fn) {
    if (!this.__events[eventName]) {
      this.__events[eventName] = [];
    }

    this.__events[eventName].push(fn);

    return () => {
      this.__events[eventName] = this.__events[eventName].filter(
        eventFn => fn !== eventFn
      );
    };
  }

  emit(eventName, data) {
    const event = this.__events[eventName];
    if (event) {
      event.forEach(fn => {
        fn.call(null, data);
      });
    }
  }

  on({ author, channel, cmd, args }) {
    switch (cmd) {
      case "c":
        this.emit("event--clear", { channel });
        break;

      case "list":
        this.emit("event--pazaak-list", { channel });
        break;

      case "new":
        this.emit("event--pazaak-new", { channel, author });
        break;

      case "join":
        this.emit("event--pazaak-join", { channel, author, args });
        break;

      case "exit":
        this.emit("event--pazaak-exit", { channel, author });
        break;

      case "play":
        this.emit("event--pazaak-play");
        break;
    }
  }
}
