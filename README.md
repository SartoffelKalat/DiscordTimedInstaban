# DiscordTimedInstaban
A Node-based Discord bot that bans accounts when joining a server based on account age to protect the server from raids and general harassment.  
The bot also keeps track of banned users through a blacklist. Individual server configurations and blacklisted accounts are stored in a local JSON database using [lowdb](https://github.com/typicode/lowdb).  

## Usage
Server Admins can configure the following aspects of the bot: 

 | Command  | Description | Example usage |
| ------------- | ------------- | ------------- |
| `.atbm (days/hours/minutes) value`  |  Sets the minimum account age requirement.<br /> **Note**: the individual time values are summed up. Eg. hours=24, days=1 results in a 2 days minimum account age requirement.  | `.atbm days 1`  |
| `.atbm unban clientId`  | Removes specified client ID from blacklist.  | `.atbm unban 123456789`  | 
| `.atbm ban clientId`  | Adds specified client ID to blacklist.  | `.atbm ban 123456789`  |
| `.atbm blacklist`  | Displays all banned client IDs.  | `.atbm blacklist`  |
| `.atbm useBlacklist (true/false)`  | Enable or disable usage of the blacklist.  | `.atbm useBlacklist true`  |
| `.atbm config`  | Shows an overview of all set configuration parameters.  | `.atbm config`  |
| `.atbm help`  | Opens this help window.  | `.atbm help`  |

## Installation  
Prerequisites: 
 - npm
 - node
1. To install all dependencies call: `npm install`  
2. In bot.js insert your bots  secret key. 
3. To start the bot execute the following command: `node bot.js`  
