const PLAYERDATA = require('../../modules/player');
const seeds = require('../../config/seeds.json');
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

    async execute(message) {
        if (message.mentions.users.first() !== client.user) return;
        const args = message.content.split(/ +/).slice(1);
        const commandName = args.shift().toLowerCase();
        if (this.info.names.some(name => commandName === name)) {
             
            var user = message.author;
            let playerStats = await PLAYERDATA.findOne({ userId: user.id });
            
            if (!playerStats) return message.reply(`${inlineCode('❌')} you are not a player ! : ${inlineCode('@FlipMMO start')}`);
            if (playerStats.player.energy < 2) return message.reply(`${EMOJICONFIG.no} You don't have enough energy! Restore your energy with ${inlineCode('@FlipMMO energy')}`)

            if (playerStats.player.cooldowns && playerStats.player.cooldowns.gathering) {
                const timeSinceLastDaily = new Date().getTime() - new Date(playerStats.player.cooldowns.gathering).getTime();
                if (timeSinceLastDaily < shuffleTime) {
                    var measuredTime = new Date(null);
                    measuredTime.setSeconds(Math.ceil((shuffleTime - timeSinceLastDaily) / 1000));
                    var MHSTime = measuredTime.toISOString().substr(11, 8);
                    message.channel.send(`${EMOJICONFIG.hellspawn} Please wait \`${MHSTime}\` and try again.`);
                    return;
                }
            }
            playerStats.player.cooldowns = playerStats.player.cooldowns || {};
            playerStats.player.cooldowns.gathering = new Date();
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
        
                var battleEmbed = new EmbedBuilder()
                .setColor('#fc9803')
                .setTitle(`${user.username} Seed Gathering`)
                .setDescription(`\n`)
                .setThumbnail('https://images.discordapp.net/avatars/1157454837861056552/c8d66bd2b5f32dbf44e3bdd2d3f61489.png')
                .setFooter({ text: 'FlipMMO Farming'});

                const availableSeeds = seeds.filter(seed => seed.level <= playerStats.player.farming.level);
                const randomSeed = availableSeeds[Math.floor(Math.random() * availableSeeds.length)];
                const seedAmount = Math.floor(Math.random() * 10) + 1;
                const seedName = randomSeed.name;
                const seedId = randomSeed.id;
                const seedXp = randomSeed.xp;
                const seedAlias = randomSeed.plantalias;
                const existingSeed = playerStats.player.stuff.seeds.find(seed => seed.id === seedId);
                if (existingSeed) {
                    existingSeed.amount += seedAmount;
                }
                else {
                    playerStats.player.stuff.seeds.push({ id: seedId, name: seedName, amount: seedAmount });
                }
                battleEmbed.addFields(
                    { name: `Seeds Gathered`, value: `You gathered ${seedAmount} ${seedName} and gained ${seedXp * seedAmount} XP!\nYou can plant your seeds with ${inlineCode(`@FlipMMO farm plant ${seedAlias} all`)}` },
                );

                playerStats.player.farming.xp += Math.abs(Math.floor(seedXp * seedAmount));
                playerStats.player.farming.totalxp += Math.abs(Math.floor(seedXp * seedAmount));
                await playerStats.save();
                let xpNeeded = xpToNextLevel(playerStats.player.farming.level);
            if (playerStats.player.farming.xp >= xpNeeded) {
                if (playerStats.player.farming.level >= 120) {
                }
                else if (playerStats.player.farming.level <= 120) {

                    while (playerStats.player.farming.xp >= xpToNextLevel(playerStats.player.farming.level)) {
                        playerStats.player.farming.level += 1;
                        let xpNeeded = xpToNextLevel(playerStats.player.farming.level - 1);
                        if (playerStats.player.farming.xp >= xpNeeded) {
                            playerStats.player.farming.xp -= xpNeeded;
                        } else {
                            playerStats.player.farming.xp = 0;
                        }
                    }

                    const logChannel = client.channels.cache.get('1169491579774443660');
                    var now = new Date();
                    var date = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
                    var messageEmbed = new EmbedBuilder()
                    .setColor('#D5EB0D')
                    .setTitle(`Log ${date}`)
                    .setDescription(`${EMOJICONFIG.hoe2} ${inlineCode(user.username)} is now farming level **${playerStats.player.farming.level}**!`);
                    logChannel.send({embeds: [messageEmbed], ephemeral: true });
        
                await playerStats.save();
                battleEmbed.addFields(
                    { name: `Level Up`, value: `Your farming level is now ${playerStats.player.farming.level}` },
                );

                } }
                await playerStats.save();
                message.reply({embeds: [battleEmbed]});
    }
},
info: {
    names: ['gather', 'gathering'],
}
};