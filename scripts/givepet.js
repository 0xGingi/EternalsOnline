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
        const userId = '351859727568994314';
  
        const player = await PLAYER.findOne({ userId: userId });
        if (!player) {
            console.log(`Player with userId ${userId} not found`);
            return;
        }

        const newPet = {
            id: 11,
            name: "Worldtaker Worm",
            level: 1,
            experience: 0,
            nickname: "",
        };
        
        // Add pet to player's collection
        player.player.pets.push(newPet);
        await player.save();
              
    } catch (error) {
    }
  }

run();