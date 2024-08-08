const PLAYERDATA = require('../../modules/player');
const PETS = require('../../config/pets.json');
const Discord = require('discord.js');
const BALANCEDATA = require('../../modules/economie.js');
const SQUADDATA = require('../../modules/squad.js')
const { numStr } = require('../../functionNumber/functionNbr.js');
const { bold, inlineCode, codeBlock } = require('@discordjs/builders');
const { prefix } = require('../../App/config.json')
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, Events, ButtonStyle, ComponentType } = require('discord.js');
const emo = require('../../config/emoji.json');
const EMOJICONFIG = require('../../config/emoji.json');
const { get } = require('mongoose');

module.exports = {
    name: Events.MessageCreate,
    /**
     * @param {Message} message
     */
    async execute(message, args, commandName, mentionedUser) {
		if (message.content.toLowerCase() && this.info.names.some(name => commandName === name)) {
        
        const petAlias = args[1];
        var user = message.author
        var userInput = mentionedUser
        if (!petAlias) {
            return message.reply("Please specify the pet you want to set as your active pet.");
        }
        let giverStats = await PLAYERDATA.findOne({ userId: message.author.id });
        let recipientStats = await PLAYERDATA.findOne({ userId: userInput.id });
        if (giverStats.player.other.ironman === true) return message.reply(`${EMOJICONFIG.no} You are an ironman, you can't give a pet!`);
        if (recipientStats.player.other.ironman === true) return message.reply(`${EMOJICONFIG.no} This player is an ironman, they can't recieve a pet!`);

        const petData = PETS.find(p => p.alias.includes(petAlias.toLowerCase()));
        if (!petData) {
             playerPet = giverStats.player.pets.find(p => p.nickname === petAlias);
            if (!playerPet) {
                return message.reply(`There is no pet with the alias or nickname "${petAlias}".`);
            }

        } else {

        playerPet = giverStats.player.pets.find(p => p.id === petData.id);
        if (!playerPet) {
            return message.reply(`You don't have ${petData.name}`);
        }
    }

        // Find the giver's player data
        
        if (!giverStats || !giverStats.player.pets.some(p => p.id === playerPet.id)) {
            return message.reply("You don't have this pet to give.");
        }

        // Find the recipient's player data
        
        if (!recipientStats) {
            return message.reply("The recipient does not have a game profile.");
        }

        // Check if the recipient already has the pet
        if (recipientStats.player.pets.some(p => p.id === playerPet.id)) {
            return message.reply("The recipient already has this pet.");
        }

        // Transfer the pet
        const giverPet = giverStats.player.pets.find(p => p.id === playerPet.id);

        const petToGive = {
            id: giverPet.id,
            name: giverPet.name,
            level: giverPet.level,
            experience: giverPet.experience,
            nickname: giverPet.nickname,
            attack: giverPet.attack,
            defense: giverPet.defense,
            health: giverPet.health
        };
        
        giverStats.player.pets = giverStats.player.pets.filter(p => p.id !== playerPet.id);
        recipientStats.player.pets.push(petToGive);

        // Save both player's data
        await giverStats.save();
        await recipientStats.save();

        // Send confirmation message
        message.reply(`${EMOJICONFIG.hellspawn} You have successfully given ${playerPet.name} to ${userInput.username}!`);
    }
},
info: {
    names: ['petgive'],
}

};