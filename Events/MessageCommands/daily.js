const Discord = require('discord.js');
const PLAYERDATA = require('../../modules/player.js');
const {client} = require('../../App/index.js');
const { prefix } = require('../../App/config.json')
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, Events, ButtonStyle, ComponentType } = require('discord.js');
const { inlineCode } = require('@discordjs/builders');
const EMOJICONFIG = require('../../config/emoji.json');

const shuffleTime = 8.64e7;

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
    
    let playerStats = await PLAYERDATA.findOne({ userId: message.author.id });
    if (!playerStats) return message.reply(`${EMOJICONFIG.no} you are not a player ! : ${inlineCode('@FlipMMO start')}`);
    if (playerStats.player.energy < 2) return message.reply(`${EMOJICONFIG.no} You don't have enough energy! Restore your energy with ${inlineCode('@FlipMMO energy')}`)

    else {

            

    if (playerStats.player.cooldowns && playerStats.player.cooldowns.daily) {
        const timeSinceLastDaily = new Date().getTime() - new Date(playerStats.player.cooldowns.daily).getTime();
        if (timeSinceLastDaily < shuffleTime) {
            var measuredTime = new Date(null);
            measuredTime.setSeconds(Math.ceil((shuffleTime - timeSinceLastDaily) / 1000));
            var MHSTime = measuredTime.toISOString().substr(11, 8);
            message.channel.send(`${EMOJICONFIG.hellspawn} Please wait \`${MHSTime}\` and try again.`);
            return;
        }
    }
    playerStats.player.cooldowns = playerStats.player.cooldowns || {};
    playerStats.player.cooldowns.daily = new Date();

        playerStats.player.other.box += 1
        playerStats.player.energy -= 2;
        await playerStats.save()
        
        var dailyreward = new EmbedBuilder()
        .setColor('#17ff00')
        .setTitle(`${EMOJICONFIG.coinchest} ${client.users.cache.get(user.id).username}'s Daily Reward`)
        .addFields(
            { name: `\n${EMOJICONFIG.scroll4} Daily Reward !\n`, value : `You get 1 box ${EMOJICONFIG.coinchest}`},
        )
        .setTimestamp();
        message.channel.send({embeds: [dailyreward]});

    };

        };
    },
        info: {
            names: ['daily', 'd'],
        }
    }
        