
const PLAYER = require('../modules/player.js');
const config = require('../App/config.json');
const mongoose = require('mongoose');
const SQUAD = require('../modules/squad.js');
const AREA = require('../modules/area.js');

mongoose
   .connect(config.mongodb, {})
   .then(() => console.log(`MongoDB Ready`));
   async function run(userIds) {
    try {
        for (const userId of userIds) {
            const player = await PLAYER.findOne({ userId: userId });
            if (!player) {
                console.log(`Player with userId ${userId} not found`);
                continue;
            }

            player.player.stuff.stuffUnlock.push({id: 93, name: "Borgz's Hat", level: 50, amount: 1});
            await player.save();
        }
    } catch (error) {
        console.log(error);
    }
}

const userIds = ['705234454419079230'];
run(userIds);