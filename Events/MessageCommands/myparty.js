const Discord = require('discord.js');
const PLAYERDATA = require('../../modules/player.js');
const EMOJICONFIG = require('../../config/emoji.json');
const PARTYDATA = require('../../modules/party.js')
const { bold, inlineCode, codeBlock } = require('@discordjs/builders');
const { numStr } = require('../../functionNumber/functionNbr.js')
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, Events, ButtonStyle, ComponentType, Collection } = require('discord.js');
const { prefix } = require('../../App/config.json')

// Config Cooldown :
const shuffleTime = 3000;
var cooldownPlayers = new Collection();

module.exports = {
    name: Events.MessageCreate,
    /**
     * @param {Message} message
     */

async execute(message, args, commandName) {
   // const args = message.content.slice(prefix.length).trim().split(/ +/);
   // const commandName = args.shift().toLowerCase();
    if (message.content.toLowerCase() && this.info.names.some(name => commandName === name)) {


    var user = message.author
    var partyMention = args[0]

    var user = message.author;


    // == Player Db ==
    let playerStats = await PLAYERDATA.findOne({ userId: message.author.id });
    if (playerStats.player.other.ironman === true) return message.reply(`${EMOJICONFIG.no} You are an ironman, you can't join a party!`)
    if (!playerStats) return message.reply(`${EMOJICONFIG.no} you are not a player ! : ${inlineCode('@Eternals start')}`);
    else {

        let party = await PARTYDATA.findOne({ partyName: playerStats.player.other.partyName });
        if (!party) return message.reply(`${EMOJICONFIG.no} you have not joined a party yet...`)
        else {

            if(partyMention == '' || partyMention == ' ' || partyMention == undefined){
                if(playerStats.userId === party.leader[0]){

                    if(playerStats.userId === party.leader[0]){
                        var memberLenght
                        if(party.member.length == undefined) memberLenght = 0
                        else memberLenght = party.member.length

                        // == Display All Members ==
                        var allmember = ``
                        for(const allPlayerInParty of party.member){
                            allmember += `${inlineCode(allPlayerInParty.pseudo)}, `
                        }

                        var partyEmbed = new EmbedBuilder()
                            .setColor('#6d4534')
                            .setTitle(`${EMOJICONFIG.scroll4} Your Party`)
                            .setDescription(`${EMOJICONFIG.scroll4} ${inlineCode(party.partyName)} Party\n${EMOJICONFIG.helmet} Leader : ${user.username}\n${EMOJICONFIG.hat7} Number of Members(s): ${inlineCode(memberLenght)}\n${EMOJICONFIG.hat7} Member(s) : ${allmember}\n`)
                            .setTimestamp();
                        return message.reply({embeds: [partyEmbed]});
                    }
                } else {
                    var memberLenght
                    if(party.member.length == undefined) memberLenght = 0
                    else memberLenght = party.member.length

                    var partyEmbed = new EmbedBuilder()
                        .setColor('#6d4534')
                        .setTitle(`${EMOJICONFIG.scroll4} Your Party`)
                        .setDescription(`${EMOJICONFIG.scroll4} ${inlineCode(party.partyName)} Party\n${EMOJICONFIG.helmet} Leader : ${party.leader[1]}${EMOJICONFIG.hat7} Member(s): ${inlineCode(memberLenght)}`)
                        .setTimestamp();
                    return message.reply({embeds: [partyEmbed]});
                };
            } else {
                let partyMentionned = await PARTYDATA.findOne({ partyName: partyMention });
                if (!partyMentionned) return message.reply(`${EMOJICONFIG.no} This Party does not exist...`)
                else {
                    if(playerStats.userId === partyMentionned.leader[0]){

                        var memberLenght
                        if(partyMentionned.member.length == undefined) memberLenght = 0
                        else memberLenght = partyMentionned.member.length

                        var partyEmbed = new EmbedBuilder()
                            .setColor('#6d4534')
                            .setTitle(`${EMOJICONFIG.scroll4} Your Party`)
                            .setDescription(`${EMOJICONFIG.scroll4} ${inlineCode(partyMentionned.partyName)}\n${EMOJICONFIG.helmet} Leader : **You**\n${EMOJICONFIG.hat7} Member(s): ${inlineCode(`${memberLenght}/5`)}`)
                            .setTimestamp();
                        return message.reply({embeds: [partyEmbed]});
                    } else {
                        var memberLenght
                        if(partyMentionned.member.length == undefined) memberLenght = 0
                        else memberLenght = partyMentionned.member.length

                        var partyEmbed = new EmbedBuilder()
                            .setColor('#6d4534')
                            .setTitle(`${EMOJICONFIG.scroll4} ${partyMentionned.partyName}`)
                            .setDescription(`${EMOJICONFIG.scroll4} ${inlineCode(partyMentionned.partyName)}\n${EMOJICONFIG.helmet} Leader : ${partyMentionned.leader[1]}\n${EMOJICONFIG.hat7} Member(s): ${inlineCode(`${memberLenght}/5`)}`)
                            .setTimestamp();
                        return message.reply({embeds: [partyEmbed]});
                    };
                };
            };
        };
    };
};
},
info: {
  names: ['myparty'],
} }
