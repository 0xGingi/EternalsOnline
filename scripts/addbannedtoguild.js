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
        
        const squads = await SQUAD.find({});
        for (let squad of squads) {
        squad.officer = [];
        await squad.save();
        }
    } catch (error) {
    }
  }

run();