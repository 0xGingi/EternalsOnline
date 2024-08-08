const PLAYER = require('../modules/player.js');
const config = require('../App/config.json');
const mongoose = require('mongoose');
const PARTY = require('../modules/party.js');
const AREA = require('../modules/area.js');

mongoose
   .connect(config.mongodb, {})
   .then(() => console.log(`MongoDB Ready`));
   async function run() {

    try {
        
        const partys = await PARTY.find({});
        for (let party of partys) {
        party.banned = [];
        await party.save();
        }
    } catch (error) {
    }
  }

run();