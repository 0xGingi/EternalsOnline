## Eternals Online Discord Bot

### Features
* Player Marketplace (Grand Exchange)
* Idle Skilling (Fishing...etc)
* Processing Skills (Smithing, Crafting... etc)
* Raids and Dungeons
* World Bosses
* Fight Monsters
* Guilds \ Guild PvP Tournaments \ Guild Bosses
* Areas \ Travel
* PvP Duel w/ ELO System
* Ironman Mode
* Over 150 Commands
* And So Much More!

  
### How To Use
* Rename App/config.json.example to App/config.json and fill in your discord bot token and mongodb uri
* Run `npm install` to install the required packages
* Run `node serverinit.js` to initialize the database
* Run `node deploy-commands.json` to initalize slash commands (Optional)
* Modify config/emoji.json with your emojis in your server (Optional)
* Run `node App/` to start the bot
* Note: There are many hardcoded Channel/Server/Admin IDs in various commands you might have to change
* Interact with the bot by @Bot command

### Directories
* `api/` - Contains API for Eternals Database
* `App/` - Contains the main bot files
* `config/` - Contains Configuration files for skills, monsters...etc
* `commands/` - Contains slash commands
* `Events/` - Contains event listeners
* `Events/MessageCommands/` - Contains all Eternals Commands
* `leaderboards/` - Contains leaderboard website
* `models/` - Contains all database models
* `scripts/` - Contains random scripts
* `topgg/` - Contains top.gg rewards

### Links
* Eternals Wiki - [https://wiki.eternalsonline.com](https://wiki.eternalsonline.com)

* Eternals Leaderboards Website - [https://https://stats.eternalsonline.com](https://stats.eternalsonline.com)

* Invite Eternals to your Server - [https://discord.com/api/oauth2/authorize?client_id=1234552588339511439&permissions=139586792512&scope=applications.commands+bot ](https://discord.com/api/oauth2/authorize?client_id=1234552588339511439&permissions=139586792512&scope=applications.commands+bot )

* Eternals Discord Server - [https://discord.gg/ywdfj3qbrF](https://discord.gg/ywdfj3qbrF)