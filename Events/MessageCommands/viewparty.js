const Discord = require('discord.js');
const PLAYERDATA = require('../../modules/player.js');
const EMOJICONFIG = require('../../config/emoji.json');
const SQUADDATA = require('../../modules/party.js')
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

            let guild = await SQUADDATA.findOne({ partyName: guildName });
            if (!guild) return message.reply(`${EMOJICONFIG.no} This Party does not exist...`)
            else {
    
                var memberLength
                if(guild.member.length == undefined) memberLength = 0
                else memberLength = guild.member.length
                var memberNames = guild.member.map(m => m.pseudo).join(', ');
                var guildEmbed = new EmbedBuilder()
                    .setColor('#6d4534')
                    .setTitle(`${EMOJICONFIG.paper} ${guild.partyName}`)
                    .setDescription(`${EMOJICONFIG.paper} ${inlineCode(guild.partyName)} \n${EMOJICONFIG.helmet} Leader : ${guild.leader[1]}\n${EMOJICONFIG.hat7} Number of Members: ${inlineCode(`${memberLength} / 5`)}\n${EMOJICONFIG.hat7} Members: ${inlineCode(`${memberNames}`)}`)
                    .setTimestamp();
                return message.reply({embeds: [guildEmbed]});
            }  

        }
},
info: {
  names: ['partyview'],
} }
