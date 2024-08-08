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
        const userId = '312957374321262597';

        let squad = await SQUAD.findOne({ 'leader.0': userId });
        if (!squad) {
            console.log(`Player with userId ${userId} not found`);
            return;
        }

        squad.stuff.stuffUnlock.push({id: 44, name: "Null Blade", level: 1, amount: 1})
        await squad.save();
      
    } catch (error) {
    }
  }

run();