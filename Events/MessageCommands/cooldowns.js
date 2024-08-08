const Discord = require('discord.js');
const PLAYERDATA = require('../../modules/player.js');
const { EmbedBuilder, Message, Events } = require('discord.js');
const { prefix } = require('../../App/config.json');
const { bold, inlineCode, codeBlock } = require('@discordjs/builders');
const EMOJICONFIG = require('../../config/emoji.json');
const {client} = require('../../App/index.js');

// Assuming cooldowns are stored in the player's data
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

            let user = message.author;
            let playerStats = await PLAYERDATA.findOne({ userId: user.id });

            if (!playerStats) {
                return message.reply('You are not a player!');
            }

            const shuffleTimes = {
                beg: 3600000,
                daily: 8.64e7,
                worldBoss: 8.64e7,
                guildReward: 8.64e7,
                guildAttack: 8.64e7,
                guildRaid: 8.64e7,
                motherload: 8.64e7,
                dungeon: 30000,
                catchpet: 30000,
                trainpet: 900000,
                barbarian: 8.64e7,
                emberforest: 8.64e7,
                gathering: 30000,
                funkyfarm: 8.64e7,
                nightmare: 8.64e7,
            };

            const cooldownKeys = {
                beg: '**Begging**',
                daily: '**Daily Reward**',
                worldBoss: '**World Boss Attack**',
                guildReward: '**Guild Reward**',
                guildRaid: '**Guild Raid** (Guild Leader Only)',
                guildAttack: '**Guild Attack** (Guild Leader Only)',
                motherload: '**Motherload Mine**',
                barbarian: '**Barbarian Fishing**',
                emberforest: '**Ember Forest**',
                funkyfarm: '**Funky Farm**',
                nightmare: '**Nightmare Zone**',
                skilling: '**Skilling**',
                fighting: '**Fighting**',
                gathering: '**Gathering**',
                dungeon: '**Dungeon**',
                catchpet: '**Catch Pet**',
                trainpet: '**Train Pet**'
        

            };


            let cooldownMessages = [];

            for (const [key, name] of Object.entries(cooldownKeys)) { 
                if (playerStats.player.cooldowns[key]) {
                    let cooldownTimestamp;
                    if (key === 'fighting' || key === 'skilling') {
                        const cooldownData = playerStats.player.cooldowns[key];
                        cooldownTimestamp = cooldownData.timestamp + cooldownData.duration;
                    } else {
                        cooldownTimestamp = playerStats.player.cooldowns[key].getTime() + shuffleTimes[key];
                    }
            
                    const currentTime = new Date().getTime();
                    const timeDifference = cooldownTimestamp - currentTime;
            
                    if (timeDifference > 0) {
                        const timeLeft = convertMillisecondsToTime(timeDifference);
                        cooldownMessages.push(`${name}: ${inlineCode(timeLeft)}`);
                    } else {
                        cooldownMessages.push(`${name}: ${inlineCode('Ready')}`);
                    }
                } 
            }
                
                function convertMillisecondsToTime(milliseconds) {
                    let seconds = Math.floor(milliseconds / 1000);
                    let minutes = Math.floor(seconds / 60);
                    seconds = seconds % 60;
                    let hours = Math.floor(minutes / 60);
                    minutes = minutes % 60;
                    return `${hours}h ${minutes}m ${seconds}s`;
                }


            // Send the cooldown information
            let cooldownEmbed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle(`${user.username}'s Cooldowns`)
                .setDescription(cooldownMessages.join('\n\n'))
                .setTimestamp();

            message.reply({ embeds: [cooldownEmbed] });
            }
    },
    info: {
        names: ['cooldowns', 'cd'],
    }
}