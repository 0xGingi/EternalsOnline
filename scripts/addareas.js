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
  
      //const players = await PLAYER.find({});
      const areas = await AREA.find({});

      //for (const player of players) {
        var area11 = new AREA({
          areaid: 14,
          areaname: 'barrens'
      })
      var area12 = new AREA({
        areaid: 15,
        areaname: 'eastlands'
    })
    var area13 = new AREA({
      areaid: 16,
      areaname: 'bloodlands'
  })

    area11.save();
    area12.save();
    area13.save();

      
    } catch (error) {
    }
  }

run();