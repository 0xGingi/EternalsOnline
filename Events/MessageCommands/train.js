const Discord = require('discord.js');
const PLAYERDATA = require('../../modules/player.js');
const PETS = require('../../config/pets.json');
const { prefix } = require('../../App/config.json');
const EMOJICONFIG = require('../../config/emoji.json');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, Events, ButtonStyle, ComponentType } = require('discord.js');
const shuffleTime = 900000;
const {client} = require('../../App/index.js');
const { bold, inlineCode, codeBlock } = require('@discordjs/builders');

module.exports = {
    name: Events.MessageCreate,

    async execute(message, args, commandName) {
        if (message.content.toLowerCase() && this.info.names.some(name => commandName === name)) {
            var user = message.author;


            const petAlias = args[0].toLowerCase();

        if (!petAlias) {
            return message.reply("Please specify the pet you want to train.");
        }


        let playerStats = await PLAYERDATA.findOne({ userId: message.author.id });
        if (!playerStats) {
            return message.reply("You need to be a player to train pets! Use '@Eternals start' to begin your adventure.");
        }
        if (playerStats.player.energy < 2) return message.reply(`${EMOJICONFIG.no} You don't have enough energy! Restore your energy with ${inlineCode('@Eternals energy')}`)

        const petData = PETS.find(p => p.alias && p.alias.includes(petAlias.toLowerCase()));
        if (!petData) {
            // If pet not found by alias, find pet by nickname
            const playerPet = playerStats.player.pets.find(p => p.nickname === petAlias);
            if (!playerPet) {
                return message.reply(`There is no pet with the alias or nickname "${petAlias}".`);
            }

            if (playerStats.player.cooldowns && playerStats.player.cooldowns.trainpet) {
                const timeSinceLastDaily = new Date().getTime() - new Date(playerStats.player.cooldowns.trainpet).getTime();
                if (timeSinceLastDaily < shuffleTime) {
                    var measuredTime = new Date(null);
                    measuredTime.setSeconds(Math.ceil((shuffleTime - timeSinceLastDaily) / 1000));
                    var MHSTime = measuredTime.toISOString().substr(11, 8);
                    message.channel.send(`${EMOJICONFIG.hellspawn} Please wait \`${MHSTime}\` and try again.`);
                    return;
                }
            }
            playerStats.player.cooldowns = playerStats.player.cooldowns || {};
            playerStats.player.cooldowns.trainpet = new Date();
            playerStats.player.energy -= 2;
    
            // Award random amount of experience between 1 and 350
            const expAwarded = Math.floor(Math.random() * 350) + 1;
            playerPet.experience += expAwarded;
            playerStats.player.taming.xp += 100;
            playerStats.player.taming.totalxp += 100;

            // Check for level up
            let xpNeeded = xpToLevel(playerPet.level + 1);
            const xpNeeded2 = xpToNextLevel(playerStats.player.taming.level);
            let initialLevel = playerPet.level;
            let initialLevel2 = playerStats.player.taming.level;
            while (playerPet.experience >= xpNeeded) {
                playerPet.level++;
                playerPet.attack += 10;
                playerPet.health += 100;
                playerPet.defense += 10;
                playerPet.experience -= xpNeeded;
                xpNeeded = xpToLevel(playerPet.level + 1);
            }
            if (playerStats.player.taming.xp >= xpNeeded2) {
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

                } 
            }
    
            await playerStats.save();
    
            let replyMessage = `${petAlias} has gained ${expAwarded} experience!`;
            if (playerPet.level > initialLevel) {
            replyMessage += ` They've leveled up and are now level ${playerPet.level}!`;
    }
    if (playerStats.player.taming.level > initialLevel2) {
        replyMessage += ` You leveled up and are now taming level ${playerStats.player.taming.level}!`;
}

            
    message.reply(replyMessage);

        } else {
            // If pet found by alias, find player's pet by id
            const playerPet = playerStats.player.pets.find(p => p.id === petData.id);
            if (!playerPet) {
                return message.reply(`You don't have ${petData.name}`);
            }



        if (playerStats.player.cooldowns && playerStats.player.cooldowns.trainpet) {
            const timeSinceLastDaily = new Date().getTime() - new Date(playerStats.player.cooldowns.trainpet).getTime();
            if (timeSinceLastDaily < shuffleTime) {
                var measuredTime = new Date(null);
                measuredTime.setSeconds(Math.ceil((shuffleTime - timeSinceLastDaily) / 1000));
                var MHSTime = measuredTime.toISOString().substr(11, 8);
                message.channel.send(`${EMOJICONFIG.hellspawn} Please wait \`${MHSTime}\` and try again.`);
                return;
            }
        }
        playerStats.player.cooldowns = playerStats.player.cooldowns || {};
        playerStats.player.cooldowns.trainpet = new Date();


        // Award random amount of experience between 1 and 350
        const expAwarded = Math.floor(Math.random() * 350) + 1;
        playerPet.experience += expAwarded;
        playerStats.player.taming.xp += 100;
        playerStats.player.taming.totalxp += 100;

        // Check for level up

        let xpNeeded = xpToLevel(playerPet.level + 1);
        const xpNeeded2 = xpToNextLevel(playerStats.player.taming.level);
        let initialLevel = playerPet.level;
        let initialLevel2 = playerStats.player.taming.level;
        while (playerPet.experience >= xpNeeded) {
            playerPet.level++;
            playerPet.attack += 10;
            playerPet.health += 100;
            playerPet.defense += 10;
            playerPet.experience -= xpNeeded;
            xpNeeded = xpToLevel(playerPet.level + 1);
        }
        if (playerStats.player.taming.xp >= xpNeeded2) {
            if (playerStats.player.taming.level >= 120) {
            }
            else if (playerStats.player.taming.level <= 120) {

                while (playerStats.player.taming.xp >= xpToNextLevel(playerStats.player.taming.level)) {
                    playerStats.player.taming.level += 1;
                    playerStats.player.taming.xp -= xpToNextLevel(playerStats.player.taming.level);
                }
            }
            
            const logChannel = client.channels.cache.get('1169491579774443660');
            var now = new Date();
            var date = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
            var messageEmbed = new EmbedBuilder()
            .setColor('#D5EB0D')
            .setTitle(`Log ${date}`)
            .setDescription(`${EMOJICONFIG.pickaxe2} ${inlineCode(user.username)} is now taming level **${playerStats.player.taming.level}**!`);
            logChannel.send({embeds: [messageEmbed], ephemeral: true });

        }

        await playerStats.save();

        let replyMessage = `${petData.name} has gained ${expAwarded} experience!`;
        if (playerPet.level > initialLevel) {
        replyMessage += ` They've leveled up and are now level ${playerPet.level}!`;
}
if (playerStats.player.taming.level > initialLevel2) {
    replyMessage += ` You leveled up and are now taming level ${playerStats.player.taming.level}!`;
}
        
message.reply(replyMessage);
        }
}
        },
info: {
    names: ['train'],
}
};

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
