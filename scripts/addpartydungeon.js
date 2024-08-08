const PARTY = require('../modules/party.js');
const config = require('../App/config.json');
const mongoose = require('mongoose');

mongoose
   .connect(config.mongodb, {})
   .then(() => console.log(`MongoDB Ready`));
   async function run() {

    try {
  
        const parties = await PARTY.find({});
        

     for (const party of parties) {

        party.lastDungeon = 0;
        party.dungeonHorrificCavernsProgress = 0;
        await party.save();
        
        
      }
    }
     catch (error) {
    }
  }

run();