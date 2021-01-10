const Discord = require("discord.js");
const client = new Discord.Client();
const moment = require('moment');
const COMMAND_KEY = ".atbm"
const KEYS = ["minutes", "hours", "days"]
var dbHandler = require("./db-handling.js");
const db = new dbHandler()
client.on("ready", () => {
  console.log("Radar system up and ready to shoot!");
});
client.on("message", async function (message) {
    if(message.content.startsWith(COMMAND_KEY)) {
      let params = message.content.replace(COMMAND_KEY, "");
      params = params.trim();
      params = params.split(" ");
      if(message.guild && message.member.hasPermission("ADMINISTRATOR")){
        let guildId = message.guild.id;
        let config = db.getConfig(guildId);
        if(!config){
          db.setDefaultConfigs(guildId);
        }
        let key = params[0]
        if(KEYS.indexOf(key)> -1) {
          let value = Number(params[1])
          if(value !== undefined && !isNaN(params[1])) {
            value = Math.round(value)
            db.setConfig(guildId, key, value)
            message.channel.send("Minimum required " +  key + " is now set to " + value)
          }
          else {
            message.channel.send("Invalid value: " +  key + "\nMake sure value is a number.")
          }
        } else if (key === "help"){
            text = "**Usage: **\n" +
            "    `.atbm (days | hours | minutes) value`\n        Sets the minimum account age requirement.\n        Eg. `.atbm days 1`\n" +
            "    `.atbm unban clientId`\n        Removes specified client ID from blacklist.\n" +
            "    `.atbm ban clientId`\n        Adds specified client ID to blacklist.\n" +
            "    `.atbm blacklist`\n        Displays all banned client IDs.\n" +
            "    `.atbm useBlacklist (true | false)`\n        Enable or disable usage of the blacklist.\n" +
            "    `.atbm config`\n        Shows an overview of all set values.\n" +
            "    `.atbm help`\n        Opens this help window.\n\n" +
            "**Note**: the individual time values are summed up. Eg. hours=24, days=1 results in a 2 days minimum account age requirement." 
            message.channel.send(text)
        } else if (key === "config"){
          let text = "**Configured Values: **\n"
          for(let k of Object.keys(config)) {
            text+="    " + k + ": " + config[k] + "\n"
          }
          message.channel.send(text)
          
        } else if (key === "ban"){
          let value = params[1]
          db.addToBlackList(value);
          message.channel.send("Added " +  value + " from blacklist ")
        }else if (key === "unban"){
          let value = params[1]
          db.removeFromBlackList(value);
          message.channel.send("Removed " +  value + " from blacklist ")
        } else if (key === "useBlacklist"){
          let value = params[1] == 'true'
          db.setConfig(guildId, key, value)
          message.channel.send("Set " +  key + " to " + value)
        } else if (key === "blacklist"){
          let list = db.getBlackList()
          let text = "**Blacklist**:\n    " + list.join("\n    ")
          message.channel.send(text)
        }
        else {
          message.channel.send("Invalid key: " +  key + ". call ´.atbm help´ for further help.")
        }
      }
    }
  })
client.on("guildMemberAdd", (member) => {
    let clientId = member.user.id
    let currentTime = Date.now()
    let dt = new Date();
    let guildId = member.guild.id
    let config = db.getConfig(guildId);
    if(!config){
      db.setDefaultConfigs(guildId);
      config = db.getConfig(guildId);
    }
    dt.setMinutes(dt.getMinutes() - config.minutes)
    dt.setHours(dt.getHours() - config.hours)
    dt.setDate( dt.getDate() - config.days);
    if (currentTime - member.user.createdAt <= currentTime- dt) {
        if(config.useBlacklist){
          db.addToBlackList(clientId)
        }
        member.ban({ days: 7})
        .then(() => {console.log("Banned user:", member.user.username, "(id:", member.user.id+") from guild",  member.guild.name, "(id:", guildId + ") since his account is less than", config.hours, "hour(s),", config.days, "day(s) and", config.minutes,"minute(s) old")})
        .catch(console.error);
    } else if (config.useBlacklist && db.isUserInBlackList(clientId)){
      member.ban({ days: 7})
        .then(() => {console.log("Banned user:", member.user.username, "(id:", member.user.id+") from guild",  member.guild.name, "(id:", guildId + ") since his account is already blacklisted")})
        .catch(console.error);
    }
});
client.login("--insert-secret-here--")