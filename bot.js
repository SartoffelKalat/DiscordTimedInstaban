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
            "    `.config`\n        Shows an overview of all set values.\n\n" +
            "    `.help`\n        Opens this help window.\n\n" +
            "**Note**: the individual time values are summed up. Eg. hours=24, days=1 results in a 2 days minimum account age requirement." 
            message.channel.send(text)
        } else if (key === "config"){
          let text = "**Configured Values: **\n"
          for(let k of Object.keys(config)) {
            text+="    " + k + ": " + config[k] + "\n"
          }
          message.channel.send(text)
      } 
        else {
          message.channel.send("Invalid key: " +  key + "\nThe following keys are configurable: " + KEYS.toString())
        }
      }
    }
  })
client.on("guildMemberAdd", (member) => {
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
        member.ban({ days: 7})
        .then(() => {console.log("Banned user:", member.user.username, "(id:", member.user.id+") from guild",  member.guild.name, "(id:", guildId + ") since his account is less than", config.hours, "hour(s),", config.days, "day(s) and", config.minutes,"minute(s) old")})
        .catch(console.error);
        
    }
});
client.login("--insert-secret-here--")