const PLAYER = require('../modules/player.js');
const config = require('../App/config.json');
const mongoose = require('mongoose');
const SQUAD = require('../modules/squad.js');
const AREA = require('../modules/area.js');
const PETS = require('../config/pets.json');


mongoose
   .connect(config.mongodb, {})
   .then(() => console.log(`MongoDB Ready`));
   async function run() {

    try {
  
        const players = await PLAYER.find({});

        for (const player of players) {
            for (const pet of player.player.pets) {
                const petConfig = PETS.find(p => p.id === pet.id);
                if (petConfig) {
                    pet.attack = petConfig.attack;
                    pet.defense = petConfig.defense;
                    pet.health = petConfig.health;

                    if (pet.level > 1) {
                        const extraLevels = pet.level - 1;
                        pet.attack += 10 * extraLevels;
                        pet.defense += 10 * extraLevels;
                        pet.health += 100 * extraLevels;
                    }
                }
            }
            await player.save();
        }

        
              
    } catch (error) {
    }
  }

run();