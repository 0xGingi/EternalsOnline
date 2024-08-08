const PLAYER = require('../../modules/player.js');
const COOKED_FOODS = require('../../config/cook.json'); // Cooked food config
const { prefix } = require('../../App/config.json');
const levelConfig = require('../../config/configLevel.json');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, Events, ButtonStyle, ComponentType } = require('discord.js');
const EMOJICONFIG = require('../../config/emoji.json');
const { bold, inlineCode, codeBlock } = require('@discordjs/builders');
const {client} = require('../../App/index.js');

module.exports = {

    name: Events.MessageCreate,

    /**

     * @param {Message} message

     */

    async execute(message) {
        var user = message.author;
        if (message.mentions.users.first() !== client.user) return;
        const args = message.content.split(/ +/).slice(1);
        const commandName = args.shift().toLowerCase();
        if (this.info.names.some(name => commandName === name)) {
        
        const foodName = args[0].toLowerCase();

        //const amountToEat = parseInt(args[1], 10) || 1;
        //const amountToEatArg = args[1];
        let amountToEat;
        if (!foodName) {

            message.reply("Please specify a food to eat.");

            return;

        }


        // Find the player

        let player = await PLAYER.findOne({ userId: user.id }).exec();
            
            if (!player) {

                message.reply("You are not a player yet.");

                return;

            }


            // Check if the player is already at full health

            if (player.player.health >= player.player.maxHealth) {

                message.reply("You are already at full health.");

                return;

            }

            // Get the health value from the cooked food config

            const foodConfig = COOKED_FOODS.find(f => f.name.toLowerCase() === foodName || (f.eatalias && f.eatalias.toLowerCase() === foodName));

            if (!foodConfig) {
                message.reply(`The food ${args[0]} does not exist.`);
                return;

            }
            const playerLevel = player.player.level;
            const maxHealth = levelConfig[`level${playerLevel}`].stats.health;

            let foodInInventory;
            if(foodConfig.type === 'fish'){
                 foodInInventory = player.player.stuff.food.find(f =>
                    f.name.toLowerCase() === foodConfig.name.toLowerCase()
                );
            }
            if(foodConfig.type === 'crop'){
                 foodInInventory = player.player.stuff.food.find(f =>
                    f.name.toLowerCase() === foodConfig.eatalias.toLowerCase()
                );
            }
            console.log(foodInInventory)
            
            if (!foodInInventory || foodInInventory.amount < amountToEat) { 
                message.reply(`You do not have enough ${foodConfig.name} to eat.`); 
                return; 
            }                        

            if (player.player.health >= maxHealth) {
                message.reply(`You are already at full health and cannot eat more`);
                return;
            }
            
                const healthNeeded = maxHealth - player.player.health;
                const foodNeeded = Math.ceil(healthNeeded / foodConfig.hp);
                amountToEat = Math.min(foodNeeded, foodInInventory.amount);


            // Calculate health gained
          //  const healthGained = Math.min(foodConfig.hp * amountToEat, maxHealth - player.player.health);
          //  player.player.health += Number(healthGained);


            const initialHealth = player.player.health;
            const potentialNewHealth = player.player.health + (foodConfig.hp * amountToEat);
            if (potentialNewHealth > maxHealth) {
                player.player.health = maxHealth;
            } else {
                player.player.health += Number(foodConfig.hp * amountToEat);
            }
            const healthGained = player.player.health - initialHealth;


            foodInInventory.amount -= amountToEat;

            // Save the player's updated state

            await player.save();


            // Send a confirmation message
            message.reply(`You have eaten ${amountToEat} ${foodName} and gained ${healthGained} health\n Your health is now ${inlineCode(`${player.player.health} / ${maxHealth}`)} \n You have ${foodInInventory.amount} ${foodName} left`);

    }
    },

    info: {

        names: ['eat'],

    }

}