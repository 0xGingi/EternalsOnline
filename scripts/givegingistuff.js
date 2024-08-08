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
            player.player.stuff.stuffUnlock.push({ id: 41, name: "Blue Partyhat", level: 1, amount: 1 });
            player.player.stuff.stuffUnlock.push({ id: 42, name: "Yellow Partyhat", level: 1, amount: 1 });
            player.player.stuff.stuffUnlock.push({ id: 89, name: "Red Partyhat", level: 1, amount: 1 });
            player.player.stuff.stuffUnlock.push({ id: 90, name: "Green Partyhat", level: 1, amount: 1 });
            player.player.stuff.stuffUnlock.push({ id: 91, name: "Pink Partyhat", level: 1, amount: 1 });
            //player.player.stuff.stuffUnlock.push({ id: 113, name: "Mace of the Multiverse", level: 1, amount: 1 });
           //player.player.stuff.bars.push({ id: 10, name: "Brimstone Bar", amount: 558 });
            await player.save();
        }
    } catch (error) {
        console.log(error);
    }
}

//const userIds = ['351859727568994314'];
//costy:
const userIds = ['1239538282157834241'];
run(userIds);