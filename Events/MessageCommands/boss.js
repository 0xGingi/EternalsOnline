const Discord = require('discord.js');
const BOSSDATA = require('../../modules/boss.js')
const PLAYERDATA = require('../../modules/player.js');
const { numStr } = require('../../functionNumber/functionNbr.js')
const { bold, inlineCode, codeBlock } = require('@discordjs/builders');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, Events, ButtonStyle, ComponentType, Collection } = require('discord.js');
const { prefix } = require('../../App/config.json')
const EMOJICONFIG = require('../../config/emoji.json');
const {client} = require('../../App/index.js');


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
       if (this.info.names.some(name => commandName === name)) {
      

    var user = message.author

    let playerStats = await PLAYERDATA.findOne({ userId: message.author.id });
    if (!playerStats) return message.reply(`${EMOJICONFIG.no} you are not a player ! : ${inlineCode('@FlipMMO start')}`);
    else {

        let boss = await BOSSDATA.findOne({ idboss: 8 });
        if (!boss) return message.reply(`${EMOJICONFIG.no} Please change boss id! : ${inlineCode('@FlipMMO start')}`);
        else {
            var bossEmbed = new EmbedBuilder()
                .setColor('#000000')
                .setTitle(`${EMOJICONFIG.attack6} Current World Boss`)
                .setDescription(`${EMOJICONFIG.attack6} **Current World Boss**: **${inlineCode(boss.bossname)}**\n${EMOJICONFIG.attack} **Attack** : ${numStr(boss.stats.attack)}\n${EMOJICONFIG.heart} **Health** : ${numStr(boss.stats.health)}\n(Attack the boss : ${inlineCode("@FlipMMO boss attack")})`)
                .setTimestamp();
            return message.channel.send({embeds: [bossEmbed]});
        };
    };
};
},
info: {
    names: ['currentboss', 'bossactually', 'bossnow', 'worldboss'],
} }
