import Discord from "discord.js";
import Config from "./config.json";
import Pazaak from "./src/game.mjs";
import utils from "./src/utils.mjs";

const Client = new Discord.Client();
const pazaak = new Pazaak();

Client.on("ready", () => {
  console.log("Now you are ready to enjoy wonderful pazaak!");
});

Client.on("message", message => {
  const { author, channel, content } = message;

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

  switch (cmd) {
    case "c":
      channel.bulkDelete(100).then(() => {
        console.log("-- cleaned --");
      });
      break;
    case "play":
      // SEND CARDS TO AUTHOR IN PRIVATE MESSAGE
      // author.send(
      //   `Your cards ${[...new Array(4)].map(() => {
      //     return pazaak.sideDeck[utils.getRandom(pazaak.sideDeck.length - 1)];
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
      break;
  }
});

Client.login(process.argv[2] || process.env.BOT_TOKEN);
