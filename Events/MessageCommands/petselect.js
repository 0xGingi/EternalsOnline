const Discord = require('discord.js');
const PLAYERDATA = require('../../modules/player.js');
const PETS = require('../../config/pets.json');
const { prefix } = require('../../App/config.json');
const EMOJICONFIG = require('../../config/emoji.json');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, Events, ButtonStyle, ComponentType } = require('discord.js');
const shuffleTime = 900000;

module.exports = {
    name: Events.MessageCreate,

    async execute(message, args, commandName) {
        if (message.content.toLowerCase() && this.info.names.some(name => commandName === name)) {

            const petAlias = args[0];

        if (!petAlias) {
            return message.reply("Please specify the pet you want to set as your active pet.");
        }


        let playerStats = await PLAYERDATA.findOne({ userId: message.author.id });
        if (!playerStats) {
            return message.reply("You need to be a player to have pets! Use '@Eternals start' to begin your adventure.");
        }

        const petData = PETS.find(p => p.alias && p.alias.includes(petAlias.toLowerCase()));
        let playerPet;

        if (!petData) {
            // If pet not found by alias, find pet by nickname
             playerPet = playerStats.player.pets.find(p => p.nickname === petAlias);
            if (!playerPet) {
                return message.reply(`There is no pet with the alias or nickname "${petAlias}".`);
            }

        } else {

         playerPet = playerStats.player.pets.find(p => p.id === petData.id);
        if (!playerPet) {
            return message.reply(`You don't have ${petData.name}`);
        }
    }

        if (playerStats.player.activePet && playerStats.player.activePet.id === playerPet.id) {
            return message.reply(`${playerPet.name} is already your active pet.`);
        }

        // Set the selected pet as the active pet
        playerStats.player.activePet = {
            id: playerPet.id,
            name: playerPet.name,
            nickname: playerPet.nickname
        };
    
            await playerStats.save();
    
            let replyMessage = `${petAlias} has been set as your active pet!`;
            
    message.reply(replyMessage);
    
    
    }
},
info: {
    names: ['selectpet'],
}
};

