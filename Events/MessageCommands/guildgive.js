const Discord = require('discord.js');
const SQUADDATA = require('../../modules/squad.js')
const PLAYERDATA = require('../../modules/player.js');
const EMOJICONFIG = require('../../config/emoji.json');
const BALANCEDATA = require('../../modules/economie.js');
const { bold, inlineCode, codeBlock } = require('@discordjs/builders');
const { numStr } = require('../../functionNumber/functionNbr.js');
const { prefix } = require('../../App/config.json')
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, Events, ButtonStyle, ComponentType } = require('discord.js');

// Config Cooldown :
const shuffleTime = 5000;
var cooldownPlayers = new Discord.Collection();

module.exports = {
    name: Events.MessageCreate,
    /**
     * @param {Message} message
     */

async execute(message, args, commandName) {
 //   const args = message.content.slice(prefix.length).trim().split(/ +/);
 //   const commandName = args.shift().toLowerCase();
    if (message.content.toLowerCase() && this.info.names.some(name => commandName === name)) {


    var user = message.author;
    var coinGiven = args[0]
    
    if(coinGiven === '') return message.reply(`${EMOJICONFIG.no} error command, type: ${inlineCode("@FlipMMO guild give <coin amout>")}`)
    else if(coinGiven === ' ') return message.reply(`${EMOJICONFIG.no} error command, type: ${inlineCode("@FlipMMO guild give <coin amout>")}`)
    else if(coinGiven === undefined) return message.reply(`${EMOJICONFIG.no} error command, type: ${inlineCode("@FlipMMO guild give <coin amout>")}`)
    else if(isNaN(coinGiven)) return message.reply(`${EMOJICONFIG.no} error command, type: ${inlineCode("@FlipMMO guild give <coin amout>")}`)
    else if(coinGiven != undefined && isNaN(coinGiven) == false && coinGiven > 0) {


        function playerInSquad(playerStats){
            // == Player Db ==
            if (!playerStats) return message.reply(`${EMOJICONFIG.no} you are not a player ! : ${inlineCode('@FlipMMO start')}`);
            else {
                if(playerStats.player.other.squadName != 'undefined') return true
            }
            return false
        }
        
        // == Balance Db ==
        let balance = await BALANCEDATA.findOne({ userId: message.author.id });
        if (!balance) return message.reply(`${EMOJICONFIG.no} you are not a player ! : ${inlineCode('@FlipMMO start')}`);
        else {

            // == Player Db ==
            let playerStats = await PLAYERDATA.findOne({ userId: message.author.id });
            if (!playerStats) return message.reply(`${EMOJICONFIG.no} you are not a player ! : ${inlineCode('@FlipMMO start')}`);
            else {

                // == Squad Db ==
                let squad = await SQUADDATA.findOne({ squadName: playerStats.player.other.squadName });
                if (!squad) return message.reply(`${EMOJICONFIG.no} Guild is not available...`)
                else {

                    if(playerInSquad(playerStats)){
                        if(balance.eco.coins < coinGiven) return message.reply(`${EMOJICONFIG.no} you don't have ${inlineCode(coinGiven)} ${EMOJICONFIG.coin} to give to the Guild Bank...`)
                        else {
                            balance.eco.coins -= Math.floor(coinGiven)
                            balance.save()

                            squad.squadbank += Math.floor(coinGiven)
                            squad.save()

                            playerStats.player.other.squadCoinGiven += Math.floor(coinGiven)
                            playerStats.save()
                            var coinGivenTotal = playerStats.player.other.squadCoinGiven;
                            var squadEmbed = new EmbedBuilder()
                                .setColor('#4dca4d')
                                .setTitle(`${EMOJICONFIG.coin} Guild Coin Given`)
                                .setDescription(`${EMOJICONFIG.paper} Guild: ${inlineCode(squad.squadName)}\n${EMOJICONFIG.coin} You've given : ${inlineCode(numStr(coinGiven))}\n${EMOJICONFIG.coin} Total given : ${inlineCode(numStr(coinGivenTotal))}\n${EMOJICONFIG.coinchest} Current Guild Bank : ${inlineCode(numStr(squad.squadbank))}`)
                                .setTimestamp();
                            return message.reply({embeds: [squadEmbed]});
                        } 
                    } else return message.reply(`${EMOJICONFIG.no} you are not in a Guild...`);
                }
            }
        }
    } else return message.reply(`${EMOJICONFIG.no} number of coins is invalid...`) ;
}
},
info: {
  names: ['guildgive', 'giveguild', 'guildcoin','gg'],
} }
