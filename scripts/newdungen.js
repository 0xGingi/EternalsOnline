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

        for (const player of players) {
            player.player.other.dungeonWitchesTowerProgress = "0";
            await player.save();
        }
    }
     catch (error) {
    }
}

run();