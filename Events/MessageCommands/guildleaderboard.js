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

async execute(message, args, commandName) {
    if (message.content.toLowerCase() && this.info.names.some(name => commandName === name)) {


    var user = message.author;
    

        function playerInSquad(playerStats){
            // == Player Db ==
            if (!playerStats) return message.reply(`${EMOJICONFIG.no} you are not a player ! : ${inlineCode('@FlipMMO start')}`);
            else {
                if(playerStats.player.other.squadName != 'undefined') return true
            }
            return false
        }
        

            let playerStats = await PLAYERDATA.findOne({ userId: message.author.id });
            if (!playerStats) return message.reply(`${EMOJICONFIG.no} you are not a player ! : ${inlineCode('@FlipMMO start')}`);
            else {
                let guild = playerStats.player.other.squadName;
                let players = await PLAYERDATA.find({ "player.other.squadName": guild });
                console.log(players)
                players.sort((a, b) => b.player.other.squadCoinGiven - a.player.other.squadCoinGiven);


                if(playerInSquad(playerStats)){
                    let leaderboardEmbed = new EmbedBuilder()
                        .setColor('#4dca4d')
                        .setTitle(`${EMOJICONFIG.coin} Guild Donation Leaderboard`)
                        .setDescription(`${EMOJICONFIG.paper}**Guild**: ${inlineCode(guild)}`)
                        .setTimestamp();

                        for (let i = 0; i < players.length; i++) {
                            leaderboardEmbed.addFields({name: `${i+1}. ${players[i].pseudo}`, value: `Total coins given: ${inlineCode(numStr(players[i].player.other.squadCoinGiven))}`});
                        }

                        return message.reply({embeds: [leaderboardEmbed]});
    
                    } else return message.reply(`${EMOJICONFIG.no} you are not in a Guild...`);
                }
}
},
info: {
  names: ['guildleaderboard'],
} }
