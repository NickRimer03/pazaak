import Discord from "discord.js";
import Config from "./config.json";
import Pazaak from "./src/pazaak.mjs";
import Repl from "./src/repl.mjs";
// import utils from "./src/utils.mjs";

const Client = new Discord.Client();
const pazaak = new Pazaak();
const repl = new Repl();

repl.subscribe("event--clear", ({ channel }) => {
  channel.bulkDelete(100).then(() => {
    console.log("-- cleaned --");
  });
});
repl.subscribe("event--pazaak-list", ({ channel }) => {
  channel.send(pazaak.listGames());
});
repl.subscribe("event--pazaak-new", ({ channel, author }) => {
  channel.send(pazaak.newGame({ id: author.id, name: author.username }));
});
repl.subscribe("event--pazaak-join", ({ channel, author, args }) => {
  channel.send(pazaak.joinGame({ playerId: args[0], joinId: author.id }));
});
repl.subscribe("event--pazaak-exit", ({ channel, author }) => {
  channel.send(pazaak.exitGame(author.id));
});
repl.subscribe("event--pazaak-play", () => {
  // SEND CARDS TO AUTHOR IN PRIVATE MESSAGE
  // author.send(
  //   `Your cards ${[...new Array(4)].map(() => {
  //     return pazaak.allSideDeckCards[utils.getRandom(pazaak.allSideDeckCards.length - 1)];
  //   })}`
  // );
  // CREATE NEW CHANNEL AND ROLE
  // message.guild.createRole({ name: "test_role" }).then(role => {
  //   console.log(`--- role \`${role.name}\` created`);
  //   message.guild
  //     .createChannel("test_channel", "text", [
  //       { id: message.guild.id, denied: ["VIEW_CHANNEL"] },
  //       { id: role.id, allowed: ["ADMINISTRATOR"] }
  //     ])
  //     .then(channel => {
  //       console.log(`--- channel \`${channel.name}\` created`);
  //     });
  // });
});

Client.on("ready", () => {
  console.log("Now you are ready to enjoy wonderful pazaak!");
});

Client.on("message", ({ author, channel, content }) => {
  if (
    channel.id != 543410962473025556 ||
    author.bot ||
    !content.startsWith(Config.prefix)
  ) {
    return;
  }

  const args = content
    .slice(Config.prefix.length)
    .trim()
    .split(/ +/g);
  const cmd = args.shift().toLowerCase();
  repl.on({ author, channel, cmd, args });
});

Client.login(process.argv[2] || process.env.BOT_TOKEN);
