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
        const players = await PLAYER.findOne({ userId: userId });
        for (const player of players) {

        const beerItem = player.player.stuff.food.find(f => f.name === "beer");
        if (beerItem) {
            beerItem.amount += 6;
        } else {
            player.player.stuff.food.push({ id: 22, name: "beer", amount: 6 });
        }
    
        await player.save();
    }       
    } catch (error) {
    }
  }

run();