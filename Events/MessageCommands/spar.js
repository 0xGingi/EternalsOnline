const Discord = require('discord.js');
const PLAYERDATA = require('../../modules/player.js');
const { bold, inlineCode, codeBlock } = require('@discordjs/builders');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, Events, ButtonStyle, ComponentType, Collection } = require('discord.js');
const { prefix } = require('../../App/config.json')
const EMOJICONFIG = require('../../config/emoji.json');
const {client} = require('../../App/index.js');
// Config Cooldown :
const shuffleTime = 15000;
var cooldownPlayers = new Discord.Collection();

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


    
    var user = message.author
    var userInput = Array.from(message.mentions.users.values())[1];

    if (userInput === ' ' || userInput === '') return message.reply(`${EMOJICONFIG.no} player undefined : ${inlineCode("@FlipMMO duel <@user>")}`);
    if (user === userInput) return message.reply(`${EMOJICONFIG.no} it's not good to want to cheat...`);


    // === Try if player are real ===
    function userReal(userInput){
        try {
            var test = userInput.id
            return true
        } catch {
            return false
        }
    };

    if(userReal(userInput)){

        // === Player 1 : DataBase ===
        let playerOne = await PLAYERDATA.findOne({ userId: message.author.id });
        if (!playerOne) return message.reply(`${EMOJICONFIG.no} you are not a player ! : ${inlineCode('@FlipMMO start')}`);
        else {
    
            // === Player 2 : DataBase ===
            let playerTwo = await PLAYERDATA.findOne({ userId: userInput.id });
            if (!playerTwo) return message.reply(`${EMOJICONFIG.no} the user mentioned is not a player...`);
            else {


                var totalStatsP1 = playerOne.player.attack + playerOne.player.health + (playerOne.player.defense * 0.5)
                var totalStatsP2 = playerTwo.player.attack + playerTwo.player.health + (playerTwo.player.defense * 0.5)
                var totalStats = totalStatsP1 + totalStatsP2

                var percentageWin = (100 * totalStatsP1) / totalStats

                var percentageWin = new EmbedBuilder()
                    .setColor('#2f3136')
                    .setTitle(`${EMOJICONFIG.attack} ${user.username}'s Win %`)
                    .setDescription(`${EMOJICONFIG.attack} ${inlineCode(user.username)} vs ${inlineCode(playerTwo.pseudo)}\n`)
                    .addFields(
                        {name: `${EMOJICONFIG.helmet} Your Stats:`, value:`${EMOJICONFIG.attack}: ${playerOne.player.attack}\n${EMOJICONFIG.shield2}: ${playerOne.player.defense}\n${EMOJICONFIG.heart}: ${playerOne.player.health}`, inline: true},
                        {name: `${EMOJICONFIG.hat7} ${playerTwo.pseudo} Stats:`, value:`${EMOJICONFIG.attack}: ${playerTwo.player.attack}\n${EMOJICONFIG.shield2}: ${playerTwo.player.defense}\n${EMOJICONFIG.heart}: ${playerTwo.player.health}`, inline: true},
                        {name: `${EMOJICONFIG.scroll4} Result :`, value:`Your percentage chance of winning is : **${Math.floor(percentageWin)}%**`, inline: false},
                    )
                    .setTimestamp();
                return message.channel.send({embeds: [percentageWin]});
            };
        };
    } else return message.reply(`${EMOJICONFIG.no} player undefined`);
};
},
info: {
    names: ['spar', 'sp'],
} }
