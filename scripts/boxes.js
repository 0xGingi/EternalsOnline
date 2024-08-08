const PLAYER = require('../modules/player.js');
const config = require('../App/config.json');
const mongoose = require('mongoose');

mongoose
   .connect(config.mongodb, {})
   .then(() => console.log(`MongoDB Ready`));
   async function run() {

    try {
  
        const players = await PLAYER.find({});
        

     for (const player of players) {

        player.player.other.petbox = 1;

        await player.save();
        }
        
      }
      
     catch (error) {
    }
  }

run();