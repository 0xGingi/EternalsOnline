const PLAYER = require('../modules/player.js');
const config = require('../App/config.json');
const mongoose = require('mongoose');
const SQUAD = require('../modules/squad.js');
const AREA = require('../modules/area.js');

mongoose
   .connect(config.mongodb, {})
   .then(() => console.log(`MongoDB Ready`));
   async function run() {
console.log(`started`)
    try {
      console.log(`trying`)

      const players = await PLAYER.find({});

      for (const player of players) {
        console.log(`Player ${player.userId} plots:`, player.player.farming.plots);
        const plotsAreEmpty = Object.values(player.player.farming.plots).every(plot => Object.keys(plot).length === 0);
        if (!player.player.farming.plots || Object.keys(player.player.farming.plots).length === 0 || plotsAreEmpty) {
          console.log(`Adding plots to ${player.player.pseudo}`)
          player.player.farming.plots = {
            plot1: {
              duration: 0,
              level: 1,
              planted: false,
              seed: "",
              timestamp: 0,
              cropid: 0,
              cropname: "",
              amount: 0
            },
            plot2: {
              duration: 0,
              level: 20,
              planted: false,
              seed: "",
              timestamp: 0,
              cropid: 0,
              cropname: "",
              amount: 0
            },
            plot3: {
              duration: 0,
              level: 40,
              planted: false,
              seed: "",
              timestamp: 0,
              cropid: 0,
              cropname: "",
              amount: 0
            },
            plot4: {
              duration: 0,
              level: 60,
              planted: false,
              seed: "",
              timestamp: 0,
              cropid: 0,
              cropname: "",
              amount: 0
            },
            plot5: {
              duration: 0,
              level: 80,
              planted: false,
              seed: "",
              timestamp: 0,
              cropid: 0,
              cropname: "",
              amount: 0
            },
            plot6: {
              duration: 0,
              level: 99,
              planted: false,
              seed: "",
              timestamp: 0,
              cropid: 0,
              cropname: "",
              amount: 0
            }
          };
          await player.save().catch(error => console.error(`Error saving player ${player._id}:`, error));

        }
      }
    }    
     catch (error) {
      console.error(error);
    }
  }

run();