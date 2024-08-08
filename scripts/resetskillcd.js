const PLAYER = require('../modules/player.js');
const config = require('../App/config.json');
const mongoose = require('mongoose');
const SQUAD = require('../modules/squad.js');
const AREA = require('../modules/area.js');
const economie = require('../modules/economie.js');

mongoose
   .connect(config.mongodb, {})
   .then(() => console.log(`Skill Reset Ready`));
   async function run() {

    try {
  
        const players = await PLAYER.find({});

     for (const player of players) {
        player.player.cooldowns.fighting.timestamp = 0;
        player.player.cooldowns.skilling.timestamp = 0;
        await player.save();
        }
    }
     catch (error) {
    }
}
module.exports = run;
//run();