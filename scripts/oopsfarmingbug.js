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
              }
    
            await player.save();
        }
    } catch (error) {
        console.log(error);
    }
}

const userIds = ['750380832983875728', '812850958849540107', '231840970956734464', '1085606984281227397', '363661387605475339', '457417046083239971', '1034569182349639750', '669003030053781524','894780431864569876','1189980160338968599','850914401242710016','1028919091114823741','1012082019636871338','394206443701534733','705234454419079230','882608778183344158','442861307520352297'];
run(userIds);