const PLAYERDATA = require('../../modules/player');
const PETS = require('../../config/pets.json');
const { prefix } = require('../../App/config.json')
const EMOJICONFIG = require('../../config/emoji.json');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, Events, ButtonStyle, ComponentType } = require('discord.js');
const mongoose = require('mongoose');
const { bold, inlineCode, codeBlock } = require('@discordjs/builders');

module.exports = {
    name: Events.MessageCreate,
    /**
     * @param {Message} message
     */

    async execute(message, args, commandName) {
        if (message.content.toLowerCase() && this.info.names.some(name => commandName === name)) {
            var user = message.author;
            const petAlias = args[0].toLowerCase();
            const newNickname = args.slice(1).join(' ').toLowerCase();
    
            const isExistingAlias = PETS.some(p => p.alias.includes(newNickname.toLowerCase()));
            if (isExistingAlias) {
                return message.reply(`The nickname "${newNickname}" is already an alias for another pet.`);
            }

            const petData = PETS.find(p => p.alias.includes(petAlias.toLowerCase()));
            if (!petData) {
                return message.reply(`There is no pet with the alias "${petAlias}".`);
            }

            let playerStats = await PLAYERDATA.findOne({ userId: user.id });
            if (!playerStats) {
                return message.reply("You don't have any pets.");
            }
    
            const playerPet = playerStats.player.pets.find(p => p.id === petData.id);
            if (!playerPet) {
                return message.reply(`You don't have ${petData.name}`);
            }

            playerPet.nickname = newNickname;
            await playerStats.save();

            return message.reply(`Your ${petData.name}'s nickname has been changed to "${newNickname}".`);

        }
        },
        info: {
            names: ['namepet'],
        }
        };