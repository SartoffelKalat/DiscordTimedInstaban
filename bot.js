const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const moment = require('moment');

client.on("ready", () => {
  console.log("Radar system up and ready to shoot!");
});
client.on("message", async function (message) {
    if(message.content === "!test") {
      message.reply("Hello World!")
    }
  })
client.on("guildMemberAdd", (member) => {
    let currentTime = Date.now()
    let dt = new Date();
    dt.setHours(dt.getHours() - config.hoursJoined)
    dt.setDate( dt.getDate() - config.daysJoined);
    if (currentTime - member.user.createdAt <= currentTime- dt) {
        member.ban({ days: 7, reason: 'Account suspiciously new (Basti stalker)' })
        .then(() => {console.log("Banned user:", member.user.username, "(id:", member.user.id,") since his account is less than", config.hoursJoined, "hour(s) and", config.daysJoined, "day(s) old")})
        .catch(console.error);
        
    }
});
client.login("--insert-client-key-here--")