## FlipMMO Discord Bot

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
* Run `node App/` to start the bot

### Directories
* `api/` - Contains API for FlipMMO Database
* `App/` - Contains the main bot files
* `config/` - Contains Configuration files for skills, monsters...etc
* `commands/` - Contains slash commands
* `Events/` - Contains event listeners
* `Events/MessageCommands/` - Contains all FlipMMO Commands
* `leaderboards/` - Contains leaderboard website
* `models/` - Contains all database models
* `scripts/` - Contains random scripts
* `topgg/` - Contains top.gg rewards
