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

            player.player.stuff.gem.push({id: 7, name: "Corrupted Totem", amount: 100});
            await player.save();
        }
    } catch (error) {
        console.log(error);
    }
}

const userIds = ['351859727568994314', '790134574679064588', '919048526518960198'];
run(userIds);