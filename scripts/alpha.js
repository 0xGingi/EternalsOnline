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
            const newPet = {
                id: 22,
                name: "Golden Snail",
                level: 1,
                experience: 0,
                nickname: "",
                attack: 500,
                defense: 500,
                health: 5000,
            };

            player.player.stuff.stuffUnlock.push({id: 69, name: "Stolen Dev Cape", level: 1, amount: 1});
            player.player.stuff.stuffUnlock.push({id: 70, name: "Stolen Dev Shield", level: 1, amount: 1});
            player.player.stuff.stuffUnlock.push({id: 71, name: "Stolen Dev Sword", level: 1, amount: 1});
            player.player.pets.push(newPet);
            await player.save();
        }
    } catch (error) {
        console.log(error);
    }
}

const userIds = ['1071524267566567525', '1131657390752800899', '498557337238372364', '1055556096263200768', '741937515824676957'];
run(userIds);