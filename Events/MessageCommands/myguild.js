const Discord = require('discord.js');
const PLAYERDATA = require('../../modules/player.js');
const EMOJICONFIG = require('../../config/emoji.json');
const SQUADDATA = require('../../modules/squad.js')
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
    var squadMention = args[0]

    var user = message.author;


    // == Player Db ==
    let playerStats = await PLAYERDATA.findOne({ userId: message.author.id });
    if (playerStats.player.other.ironman === true) return message.reply(`${EMOJICONFIG.no} You are an ironman, you can't join a guild!`)
    if (!playerStats) return message.reply(`${EMOJICONFIG.no} you are not a player ! : ${inlineCode('@FlipMMO start')}`);
    else {

        // == Squad Db ==
        let squad = await SQUADDATA.findOne({ squadName: playerStats.player.other.squadName });
        if (!squad) return message.reply(`${EMOJICONFIG.no} you have not joined a Guild yet...`)
        else {

            // == Squad Player ==
            if(squadMention == '' || squadMention == ' ' || squadMention == undefined){
                // === If user is the leader of the squad ===
                if(playerStats.userId === squad.leader[0]){

                    // === If user is the leader of the squad ===
                    if(playerStats.userId === squad.leader[0]){
                        var memberLenght
                        if(squad.member.length == undefined) memberLenght = 0
                        else memberLenght = squad.member.length
                        var memberNames = squad.member.map(m => m.pseudo).join(', ');
                        //var officers = squad.officer.map(m => m.pseudo).join(', ');
                        var officers = ``
                        for(const allPlayerInSquad of squad.officer){
                            let pseudo = allPlayerInSquad.pseudo.replace(/_/g, '\\_');
                            officers += `${inlineCode(pseudo)}, `
                        }
                                                // == Display All Members ==
                        var allmember = ``
                        for(const allPlayerInSquad of squad.member){
                            let pseudo = allPlayerInSquad.pseudo.replace(/_/g, '\\_');
                            allmember += `${inlineCode(pseudo)}, `
                        }
                        
                        var squadEmbed = new EmbedBuilder()
                            .setColor('#6d4534')
                            .setTitle(`${EMOJICONFIG.paper} Your Guild`)
                            .setDescription(`${EMOJICONFIG.paper} ${inlineCode(squad.squadName)}\n${EMOJICONFIG.helmet} Master : ${user.username}\n${EMOJICONFIG.scroll4} Guild level : ${inlineCode(numStr(Math.floor(squad.squadXp / 1000)))}\n${EMOJICONFIG.coinchest} Guild Bank : ${inlineCode(numStr(squad.squadbank))}\n${EMOJICONFIG.hat7} Number of Members(s): ${inlineCode(memberLenght)}\n${EMOJICONFIG.hat7} Members : ${allmember}\n${EMOJICONFIG.hat7} Officers: ${officers}\n${EMOJICONFIG.attack6} Guild Bosses: ${EMOJICONFIG.attack}: ${inlineCode(numStr(squad.squadboss.bossattack))} **/** ${EMOJICONFIG.heart}: ${inlineCode(numStr(squad.squadboss.bosshealth))} **/** ${EMOJICONFIG.shield2}: ${inlineCode(numStr(squad.squadboss.bossdefense))}`)
                            .setTimestamp();
                        return message.reply({embeds: [squadEmbed]});
                    }
                } else {
                    // === User is a Member of Squad ===
                    var memberLenght
                    if(squad.member.length == undefined) memberLenght = 0
                    else memberLenght = squad.member.length
                    var memberNames = squad.member.map(m => m.pseudo).join(', ');
                    var officers = squad.officer.map(m => m.pseudo).join(', ');
                    var squadEmbed = new EmbedBuilder()
                        .setColor('#6d4534')
                        .setTitle(`${EMOJICONFIG.paper} Your Guild`)
                        .setDescription(`${EMOJICONFIG.paper} ${inlineCode(squad.squadName)}\n${EMOJICONFIG.helmet} Master : ${squad.leader[1]}\n${EMOJICONFIG.scroll4} Guild level : ${inlineCode(numStr(Math.floor(squad.squadXp / 1000)))}\n${EMOJICONFIG.coinchest} Guild Bank : ${inlineCode(numStr(squad.squadbank))} ${EMOJICONFIG.coin}\n${EMOJICONFIG.hat7} Number of Members: ${inlineCode(`${memberLenght}/20`)}\n${EMOJICONFIG.hat7} Officers: ${inlineCode(`${officers}`)}\n${EMOJICONFIG.hat7} Members: ${inlineCode(`${memberNames}`)}\n${EMOJICONFIG.attack6} Guild Bosses: ${EMOJICONFIG.attack}: ${inlineCode(numStr(squad.squadboss.bossattack))} **/** ${EMOJICONFIG.heart}: ${inlineCode(numStr(squad.squadboss.bosshealth))} **/** ${EMOJICONFIG.shield2}: ${inlineCode(numStr(squad.squadboss.bossdefense))}`)
                        .setTimestamp();
                    return message.reply({embeds: [squadEmbed]});
                };
            } else {
                // == Squad Db ==
                let squadMentionned = await SQUADDATA.findOne({ squadName: squadMention });
                if (!squadMentionned) return message.reply(`${EMOJICONFIG.no} This Guild does not exist...`)
                else {
                    // === If user is the leader of the squad ===
                    if(playerStats.userId === squadMentionned.leader[0]){

                        var memberLenght
                        if(squadMentionned.member.length == undefined) memberLenght = 0
                        else memberLenght = squadMentionned.member.length

                        var squadEmbed = new EmbedBuilder()
                            .setColor('#6d4534')
                            .setTitle(`${EMOJICONFIG.paper} Your Guild`)
                            .setDescription(`${EMOJICONFIG.paper} ${inlineCode(squadMentionned.squadName)} Guild\n${EMOJICONFIG.helmet} Master : ${user.username}\n${EMOJICONFIG.scroll4} Guild level : ${inlineCode(Math.floor(squadMentionned.squadXp / 1000))}\n${EMOJICONFIG.coinchest} Guild Bank : ${inlineCode(numStr(squadMentionned.squadbank))} ${EMOJICONFIG.coin}\n${EMOJICONFIG.hat7} Member(s): ${inlineCode(`${memberLenght}/20`)}\n${EMOJICONFIG.attack6} Guild Bosses: ${EMOJICONFIG.attack}: ${inlineCode(squadMentionned.squadboss.bossattack)} **/** ${EMOJICONFIG.heart}: ${inlineCode(squadMentionned.squadboss.bosshealth)} **/** ${EMOJICONFIG.shield2}: ${inlineCode(squadMentionned.squadboss.bossdefense)}`)
                            .setTimestamp();
                        return message.reply({embeds: [squadEmbed]});
                    } else {
                    // === User is a Member of Squad ===
                        var memberLenght
                        if(squadMentionned.member.length == undefined) memberLenght = 0
                        else memberLenght = squadMentionned.member.length

                        var squadEmbed = new EmbedBuilder()
                            .setColor('#6d4534')
                            .setTitle(`${EMOJICONFIG.paper} ${squadMentionned.squadName}`)
                            .setDescription(`${EMOJICONFIG.paper} ${inlineCode(squadMentionned.squadName)} \n${EMOJICONFIG.helmet} Master : ${squadMentionned.leader[1]}\n${EMOJICONFIG.scroll4} Guild level : ${inlineCode(Math.floor(squadMentionned.squadXp / 1000))}\n${EMOJICONFIG.coinchest} Guild Bank : ${inlineCode(numStr(squadMentionned.squadbank))} ${EMOJICONFIG.coin}\n${EMOJICONFIG.hat7} Member(s): ${inlineCode(`${memberLenght}/20`)}\n${EMOJICONFIG.attack6} Guild Bosses: ${EMOJICONFIG.attack}: ${inlineCode(squadMentionned.squadboss.bossattack)} **/** ${EMOJICONFIG.heart}: ${inlineCode(squadMentionned.squadboss.bosshealth)} **/** ${EMOJICONFIG.shield2}: ${inlineCode(squadMentionned.squadboss.bossdefense)}`)
                            .setTimestamp();
                        return message.reply({embeds: [squadEmbed]});
                    };
                };
            };
        };
    };
};
},
info: {
  names: ['myguild'],
} }
