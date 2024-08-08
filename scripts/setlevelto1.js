const PLAYER = require('../modules/player.js');
const config = require('../App/config.json');
const mongoose = require('mongoose');
const SQUAD = require('../modules/squad.js');
const AREA = require('../modules/area.js');
const economie = require('../modules/economie.js');

mongoose
   .connect(config.mongodb, {})
   .then(() => console.log(`MongoDB Ready`));
   async function run() {

    try {
  
        const players = await PLAYER.find({});
        const balances = await economie.find({});

     for (const player of players) {
        player.player.level = 1;
        await player.save();
        }
    for (const balance of balances) {
        balance.eco.xp = 0;
        await balance.save();
      }
    }
     catch (error) {
    }
}

run();