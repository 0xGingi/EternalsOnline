const PLAYERDATA = require('../../modules/player');
const PETS = require('../../config/pets.json');
const { prefix } = require('../../App/config.json')
const EMOJICONFIG = require('../../config/emoji.json');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, Events, ButtonStyle, ComponentType } = require('discord.js');
const mongoose = require('mongoose');
const { bold, inlineCode, codeBlock } = require('@discordjs/builders');
const shuffleTime = 30000;
const {client} = require('../../App/index.js');

module.exports = {
    name: Events.MessageCreate,
    /**
     * @param {Message} message
     */

    async execute(message, args, commandName) {
        if (message.content.toLowerCase() && this.info.names.some(name => commandName === name)) {
           
            var user = message.author;
            let playerStats = await PLAYERDATA.findOne({ userId: user.id });
            
            if (!playerStats) {
                return message.reply("You need to be a player to catch pets! Use '@Eternals start' to begin your adventure.");
            }
            if (playerStats.player.energy < 2) return message.reply(`${EMOJICONFIG.no} You don't have enough energy! Restore your energy with ${inlineCode('@Eternals energy')}`)

            if (playerStats.player.cooldowns && playerStats.player.cooldowns.catchpet) {
                const timeSinceLastDaily = new Date().getTime() - new Date(playerStats.player.cooldowns.catchpet).getTime();
                if (timeSinceLastDaily < shuffleTime) {
                    var measuredTime = new Date(null);
                    measuredTime.setSeconds(Math.ceil((shuffleTime - timeSinceLastDaily) / 1000));
                    var MHSTime = measuredTime.toISOString().substr(11, 8);
                    message.channel.send(`${EMOJICONFIG.hellspawn} Please wait \`${MHSTime}\` and try again.`);
                    return;
                }
            }
            playerStats.player.cooldowns = playerStats.player.cooldowns || {};
            playerStats.player.cooldowns.catchpet = new Date();
            playerStats.player.energy -= 2;
            await playerStats.save();
            
            function xpToLevel(level) {
                let total = 0;
                for (let l = 1; l < level; l++) {
                    total += Math.floor(l + 300 * Math.pow(2, l / 7.0));
                }
                return Math.floor(total / 4);
            }
            
            
            function xpToNextLevel(currentLevel) {
                return xpToLevel(currentLevel + 1) - xpToLevel(currentLevel);
            }
        
            if (Math.random() <= 0.75) {
                let totalChance = PETS.reduce((total, pet) => total + pet.chance, 0);
                let randomNum = Math.random() * totalChance;

            let pet;
            for (let i = 0; i < PETS.length; i++) {

                randomNum -= PETS[i].chance;

                if (randomNum <= 0) {
                    pet = PETS[i];
                    break;
            
                }
            }

            if (!pet) {
                pet = PETS[0];
            }
        
               // const randomPetIndex = Math.floor(Math.random() * PETS.length);
               // const pet = PETS[randomPetIndex];
                if (playerStats.player.pets.some(existingPet => existingPet.id === pet.id)) {
                    playerStats.player.taming.xp += 100;
                    playerStats.player.taming.totalxp += 100;
                    await playerStats.save();
                    let xpNeeded = xpToNextLevel(playerStats.player.taming.level);
                    if (playerStats.player.taming.xp >= xpNeeded) {
                        if (playerStats.player.taming.level >= 120) {
                        }
                        else if (playerStats.player.taming.level <= 120) {
        
                            while (playerStats.player.taming.xp >= xpToNextLevel(playerStats.player.taming.level)) {
                                playerStats.player.taming.level += 1;
                                playerStats.player.taming.xp -= xpToNextLevel(playerStats.player.taming.level);
                            }
        
                            const logChannel = client.channels.cache.get('1169491579774443660');
                            var now = new Date();
                            var date = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
                            var messageEmbed = new EmbedBuilder()
                            .setColor('#D5EB0D')
                            .setTitle(`Log ${date}`)
                            .setDescription(`${EMOJICONFIG.hellspawn} ${inlineCode(user.username)} is now taming level **${playerStats.player.taming.level}**!`);
                            logChannel.send({embeds: [messageEmbed], ephemeral: true });
                
                        await playerStats.save();
                        return message.reply(`You attempt to catch a ${pet.name}, but you already have one! You leveled up! Your new level is ${playerStats.player.taming.level}`);
                        } }
                        else {
                        return message.reply(`You attempt to catch a ${pet.name}, but you already have one! You gained 100 taming xp!`);
                        }
                        }
            
                // Initialize pet with level and experience
                const newPet = {
                    id: pet.id,
                    name: pet.name,
                    level: 1,
                    experience: 0,
                    nickname: "",
                    attack: pet.attack,
                    defense: pet.defense,
                    health: pet.health,
                };

                // Add pet to player's collection
                playerStats.player.pets.push(newPet);
                await playerStats.save();
                playerStats.player.taming.xp += 100;
                playerStats.player.taming.totalxp += 100;
                const xpNeeded = xpToNextLevel(playerStats.player.taming.level);
            if (playerStats.player.taming.xp >= xpNeeded) {
                if (playerStats.player.taming.level >= 120) {
                }
                else if (playerStats.player.taming.level <= 120) {

                    while (playerStats.player.taming.xp >= xpToNextLevel(playerStats.player.taming.level)) {
                        playerStats.player.taming.level += 1;
                        playerStats.player.taming.xp -= xpToNextLevel(playerStats.player.taming.level);
                    }

                    const logChannel = client.channels.cache.get('1169491579774443660');
                    var now = new Date();
                    var date = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
                    var messageEmbed = new EmbedBuilder()
                    .setColor('#D5EB0D')
                    .setTitle(`Log ${date}`)
                    .setDescription(`${EMOJICONFIG.hellspawn} ${inlineCode(user.username)} is now taming level **${playerStats.player.taming.level}**!`);
                    logChannel.send({embeds: [messageEmbed], ephemeral: true });
        
                await playerStats.save();
                message.reply(`Congratulations! You've caught a ${pet.name}! You leveled up! Your new level is ${playerStats.player.taming.level}`);
                } }
                else {
                message.reply(`Congratulations! You've caught a ${pet.name} and gained 100 taming xp!`);
                }
            } else {
                
                message.reply("You tried to catch a pet, but it escaped!");
            }
    }
},
info: {
    names: ['catch'],
}
};