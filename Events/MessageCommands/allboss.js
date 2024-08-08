const Discord = require('discord.js');
const BOSSDATA = require('../../modules/boss.js')
const PLAYERDATA = require('../../modules/player.js');
const BOSSCONFIG = require('../../config/boss.json');
const { numStr } = require('../../functionNumber/functionNbr.js');
const { bold, inlineCode, codeBlock } = require('@discordjs/builders');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, Events, ButtonStyle, ComponentType, Collection } = require('discord.js');
const { prefix } = require('../../App/config.json')
const EMOJICONFIG = require('../../config/emoji.json');



// Config Cooldown :
const shuffleTime = 3000;
var cooldownPlayers = new Discord.Collection();

module.exports = {
    name: Events.MessageCreate,
    /**
     * @param {Message} message
     */

    async execute(message, args, commandName) {
        //  const args = message.content.slice(prefix.length).trim().split(/ +/);
       //   const commandName = args.shift().toLowerCase();
          if (message.content.toLowerCase() && this.info.names.some(name => commandName === name)) {
      

    var user = message.author
    
    // Stats
    let playerStats = await PLAYERDATA.findOne({ userId: message.author.id });
    if (!playerStats) return message.reply(`${EMOJICONFIG.no} you are a not player ! : ${inlineCode('@FlipMMO start')}`);
    else {
        /**=== Account BOSs ===*/
        let boss = await BOSSDATA.findOne({ idboss: 8 });
        if (!boss) return message.reply(`${EMOJICONFIG.no} Boss not Found!`);
        else {
            var bossEmbed = new EmbedBuilder()
                .setColor('#fc9803')
                .setTitle(`WOLD BOSS`)
                .setDescription(`${EMOJICONFIG.attack6} **Current World Boss**: ${inlineCode(boss.bossname)}\n${EMOJICONFIG.attack} **Attack** : ${boss.stats.attack}\n${EMOJICONFIG.heart} **Health** : ${boss.stats.health}\nAttack the boss : ${inlineCode("@FlipMMO boss attack")}\n\n${EMOJICONFIG.map} **ALL WORLD BOSSES** : \n`)
                .addFields(
                { name: `**BOSS ** : **${BOSSCONFIG.boss1.name}**\n`, value: `\n${EMOJICONFIG.attack} **Attack** : ${BOSSCONFIG.boss1.attack}\n${EMOJICONFIG.heart} **Health** : ${BOSSCONFIG.boss1.health}`, inline: true },
                { name: `**BOSS ** : **${BOSSCONFIG.boss2.name}**\n`, value: `\n${EMOJICONFIG.attack} **Attack** : ${BOSSCONFIG.boss2.attack}\n${EMOJICONFIG.heart} **Health** : ${BOSSCONFIG.boss2.health}`, inline: true },
                { name: `**BOSS ** : **${BOSSCONFIG.boss3.name}**\n`, value: `\n${EMOJICONFIG.attack} **Attack** : ${BOSSCONFIG.boss3.attack}\n${EMOJICONFIG.heart} **Health** : ${BOSSCONFIG.boss3.health}`, inline: true },
                { name: `**BOSS ** : **${BOSSCONFIG.boss4.name}**\n`, value: `\n${EMOJICONFIG.attack} **Attack** : ${BOSSCONFIG.boss4.attack}\n${EMOJICONFIG.heart} **Health** : ${BOSSCONFIG.boss4.health}`, inline: true },
                { name: `**BOSS ** : **${BOSSCONFIG.boss5.name}**\n`, value: `\n${EMOJICONFIG.attack} **Attack** : ${BOSSCONFIG.boss5.attack}\n${EMOJICONFIG.heart} **Health** : ${BOSSCONFIG.boss5.health}`, inline: true },
                { name: `**BOSS ** : **${BOSSCONFIG.boss6.name}**\n`, value: `\n${EMOJICONFIG.attack} **Attack** : ${BOSSCONFIG.boss6.attack}\n${EMOJICONFIG.heart} **Health** : ${BOSSCONFIG.boss6.health}`, inline: true },
                { name: `**BOSS ** : **${BOSSCONFIG.boss7.name}**\n`, value: `\n${EMOJICONFIG.attack} **Attack** : ${BOSSCONFIG.boss7.attack}\n${EMOJICONFIG.heart} **Health** : ${BOSSCONFIG.boss7.health}`, inline: true },
                { name: `**BOSS ** : **${BOSSCONFIG.boss8.name}**\n`, value: `\n${EMOJICONFIG.attack} **Attack** : ${BOSSCONFIG.boss8.attack}\n${EMOJICONFIG.heart} **Health** : ${BOSSCONFIG.boss8.health}`, inline: true },
                { name: `**BOSS ** : **${BOSSCONFIG.boss9.name}**\n`, value: `\n${EMOJICONFIG.attack} **Attack** : ${BOSSCONFIG.boss9.attack}\n${EMOJICONFIG.heart} **Health** : ${BOSSCONFIG.boss9.health}`, inline: true },
                { name: `**BOSS ** : **${BOSSCONFIG.boss10.name}**\n`, value: `\n${EMOJICONFIG.attack} **Attack** : ${BOSSCONFIG.boss10.attack}\n${EMOJICONFIG.heart} **Health** : ${BOSSCONFIG.boss10.health}`, inline: true },
                )
                .setTimestamp()
            return message.channel.send({embeds: [bossEmbed]});
        };
    };
};
},
info: {
    names: ['allboss', 'bossall', 'ab', 'allB', 'AllBoss', 'Allboss', 'allboss', 'allb', 'bosses'],
} }
