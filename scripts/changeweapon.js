const PLAYER = require('../modules/player.js');
const config = require('../App/config.json');
const mongoose = require('mongoose');
const SQUAD = require('../modules/squad.js');
const AREA = require('../modules/area.js');

mongoose
   .connect(config.mongodb, {})
   .then(() => console.log(`MongoDB Ready`));
   async function run() {

    try {
  
        const players = await PLAYER.find({});

        for (const player of players) {
            for (const item of player.player.stuff.stuffUnlock) {
                if (item.id === 7) {
                    item.name = "Iron Claws";
                }
                if (item.id === 14) {
                    item.name = "Iron Shield";
                }
                if (item.name === "Iron Dagger") {
                    item.name = "Iron Claws";
                    item.id = 7;
                }

            }
            await player.save();
        }
      
    } catch (error) {
    }
  }

run();