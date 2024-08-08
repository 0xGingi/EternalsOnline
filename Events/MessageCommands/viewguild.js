const Discord = require('discord.js');
const PLAYERDATA = require('../../modules/player.js');
const EMOJICONFIG = require('../../config/emoji.json');
const SQUADDATA = require('../../modules/squad.js')
const { bold, inlineCode, codeBlock } = require('@discordjs/builders');
const { numStr } = require('../../functionNumber/functionNbr.js')
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, Events, ButtonStyle, ComponentType, Collection } = require('discord.js');
const { prefix } = require('../../App/config.json')

module.exports = {
    name: Events.MessageCreate,
    /**
     * @param {Message} message
     */

async execute(message, args, commandName) {
    if (message.content.toLowerCase() && this.info.names.some(name => commandName === name)) {


    
    var guildName = args[0];

            let guild = await SQUADDATA.findOne({ squadName: guildName });
            if (!guild) return message.reply(`${EMOJICONFIG.no} This Guild does not exist...`)
            else {
    
                var memberLength
                if(guild.member.length == undefined) memberLength = 0
                else memberLength = guild.member.length
                var memberNames = guild.member.map(m => m.pseudo).join(', ');
                var officers = guild.officer.map(m => m.pseudo).join(', ');
                var guildEmbed = new EmbedBuilder()
                    .setColor('#6d4534')
                    .setTitle(`${EMOJICONFIG.paper} ${guild.squadName}`)
                    .setDescription(`${EMOJICONFIG.paper} ${inlineCode(guild.squadName)} \n${EMOJICONFIG.helmet} Master : ${guild.leader[1]}\n${EMOJICONFIG.scroll4} Guild level : ${inlineCode(Math.floor(guild.squadXp / 1000))}\n${EMOJICONFIG.coinchest} Guild Bank : ${inlineCode(numStr(guild.squadbank))} ${EMOJICONFIG.coin}\n${EMOJICONFIG.hat7} Number of Members: ${inlineCode(`${memberLength}/20`)}\n${EMOJICONFIG.hat7} Officers: ${inlineCode(`${officers}`)}\n${EMOJICONFIG.hat7} Members: ${inlineCode(`${memberNames}`)}\n${EMOJICONFIG.attack6} Guild Bosses: ${EMOJICONFIG.attack}: ${inlineCode(guild.squadboss.bossattack)} **/** ${EMOJICONFIG.heart}: ${inlineCode(guild.squadboss.bosshealth)} **/** ${EMOJICONFIG.shield2}: ${inlineCode(guild.squadboss.bossdefense)}`)
                    .setTimestamp();
                return message.reply({embeds: [guildEmbed]});
            }  

        }
},
info: {
  names: ['guildview'],
} }
