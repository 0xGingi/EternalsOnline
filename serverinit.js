const STATS = require('./modules/statsBot.js');
const BOSS = require('./modules/boss.js');
const BOSSCONFIG = require('./config/boss.json');
const AREA = require('./modules/area.js')
const config = require('./App/config.json');
const mongoose = require('mongoose');

mongoose
.connect(config.mongodb, {})
.then(() => console.log(`MongoDB Ready`))
.catch(err => console.error(`MongoDB connection error: ${err}`));

async function initializeServer() {
    var statsBot = new STATS({
        botID: 899,
        numberPlayer: 0,
        numberSquad: 0,
        amoutCoin: 0,
        amoutItem: 0,
        amoutMonsterKilled: 0,
        boxOpen: 0,
    });
    await statsBot.save();

    var area1 = new AREA({
        areaid: 0,
        areaname: 'lumby'
    })
    var area2 = new AREA({
        areaid: 1,
        areaname: 'fally'
    })
    var area3 = new AREA({
        areaid: 2,
        areaname: `highlands`,
    })
        var area4 = new AREA({
          areaid: 3,
          areaname: 'astrals'
      })
      var area5 = new AREA({
          areaid: 4,
          areaname: 'ethereal'
      })
      var area6 = new AREA({
        areaid: 5,
        areaname: 'polyzeal'
    })  
          var area7 = new AREA({
        areaid: 6,
        areaname: 'underworld'
    })  
      var area8 = new AREA({
        areaid: 7,
        areaname: 'rektlands'
    })  
        var area9 = new AREA({
          areaid: 8,
          areaname: 'mountstone'
      })
      var area10 = new AREA({
          areaid: 9,
          areaname: 'royalrealm'
      })
        var area11 = new AREA({
            areaid: 10,
            areaname: 'goneville'
    })
      var area12 = new AREA({
            areaid: 11,
            areaname: 'ascension'
    })
        var area13 = new AREA({
            areaid: 12,
            areaname: 'donaldscave'
    })
        var area14 = new AREA({
            areaid: 13,
            areaname: 'wilderness'
    })
        var area15 = new AREA({
            areaid: 14,
            areaname: 'barrens'
    })
        var area16 = new AREA({
            areaid: 15,
            areaname: 'eastlands'
    })
        var area17 = new AREA({
            areaid: 16,
            areaname: 'westlands'
    })


    area1.save()
    area2.save()
    area3.save()
    area4.save()
    area5.save()
    area6.save()
    area7.save()
    area8.save()
    area9.save()
    area10.save()
    area11.save()
    area12.save()
    area13.save()
    area14.save()
    area15.save()
    area16.save()
    area17.save()



    try {
        const boss = await BOSS.findOne({ bossname: 'Thunder Fenrir' });
        if (!boss) {
            var bossPlayer = new BOSS({
                idboss: 5,
                bossname: BOSSCONFIG.boss6.name,
                stats: {
                    attack: BOSSCONFIG.boss6.attack,
                    health: BOSSCONFIG.boss6.health,
                },
            });
            await bossPlayer.save();
            console.log('Boss created !');
        } else {
            console.log('Boss already exists !');
        }
    } catch (err) {
        console.log(err);
    }
}

initializeServer();
