const Discord = require('discord.js');
const BALANCEDATA = require('../../modules/economie.js');
const PLAYERDATA = require('../../modules/player.js');
const STATS = require('../../modules/statsBot.js');
const EMOJICONFIG = require('../../config/emoji.json');
const PARTYDATA = require('../../modules/party.js');
const { bold, inlineCode, codeBlock } = require('@discordjs/builders');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, Events, ButtonStyle, ComponentType, Collection } = require('discord.js');
const { prefix } = require('../../App/config.json')
const {client} = require('../../App/index.js');

// Config Cooldown :
const shuffleTime = 8.64e7;
var cooldownPlayers = new Discord.Collection();

module.exports = {
    name: Events.MessageCreate,
    /**
     * @param {Message} message
     */

    async execute(message, args, commandName) {
        // const args = message.content.slice(prefix.length).trim().split(/ +/);
        // const commandName = args.shift().toLowerCase();
         if (message.content.toLowerCase() && this.info.names.some(name => commandName === name)) {
     
    var user = message.author;
    var partyName = args[0]

    // == Balance Db ==
    let balance = await BALANCEDATA.findOne({ userId: message.author.id });
    let playerStats = await PLAYERDATA.findOne({ userId: message.author.id });
    if (playerStats.player.other.ironman === true) return message.reply(`${EMOJICONFIG.no} You are an ironman, you can't create a party!`);
    if (!balance) return message.reply(`${EMOJICONFIG.no} you are not a player ! : ${inlineCode('@FlipMMO start')}`);
    else {

        if (balance.eco.coins < 0) return message.reply(`${EMOJICONFIG.no} error, coin balance < 0, contact the developer`)
        else {

            if(partyName === '') return message.reply(`${EMOJICONFIG.no} error command, type: ${inlineCode("@FlipMMO party create <party name>")}`)
            else if(partyName === ' ') return message.reply(`${EMOJICONFIG.no} error command, type: ${inlineCode("@FlipMMO party create <party name>")}`)
            else if(partyName === undefined || partyName === 'undefined') return message.reply(`${EMOJICONFIG.no} name not available, type: ${inlineCode("@FlipMMO party create <party name>")}`)
            else {

                function partyNameEverUsed(allParty, partyNameNew){
                    for(const party of allParty){
                        if(party.partyName === partyNameNew) return false 
                    }
                    return true
                }

                let allParty = await PARTYDATA.find();
                if(partyNameEverUsed(allParty, partyName)){

                    

                    function playerInParty(playerStats){
                        if (!playerStats) return message.reply(`${EMOJICONFIG.no} you are a not player ! : ${inlineCode('@FlipMMO start')}`);
                        else {
                            if(playerStats.player.other.partyName != 'undefined') return true
                        }
                        return false
                    }

                    if(playerInParty(playerStats) == false){
                        playerStats.player.other.partyName = partyName;
                        playerStats.save();

                        var newParty = new PARTYDATA({
                            partyName : partyName,
                            leader: [message.author.id, user.username],
                            member: [{id: user.id, pseudo: user.username}]
                        });
                        newParty.save()

                        // == Log : ==
                        const logChannel = client.channels.cache.get('1169491579774443660');
                        var now = new Date();
                        var date = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
                        var messageEmbed = new EmbedBuilder()
                            .setColor('#c18128')
                            .setTitle(`Log ${date}`)
                            .setDescription(`${EMOJICONFIG.scroll4} New Party by **${inlineCode(user.username)}**\n${EMOJICONFIG.paper} Party name : **${inlineCode(partyName)}**`);
                        logChannel.send({embeds: [messageEmbed], ephemeral: true });


                        var partyEmbed = new EmbedBuilder()
                            .setColor('#4dca4d')
                            .setTitle(`${EMOJICONFIG.scroll4} New Party by ${user.username}`)
                            .setDescription(`👊 You created ${inlineCode(partyName)}\n${EMOJICONFIG.helmet} Leader : ${user.username}\n${EMOJICONFIG.hat7} Member: ${inlineCode("1")}`)
                            .setTimestamp();
                        message.channel.send({embeds: [partyEmbed]});

                    } else return message.reply(`${EMOJICONFIG.no} you are already in a Party...`) 
                } else return message.reply(`${EMOJICONFIG.no} the name ${inlineCode(partyName)} is already taken ! ${inlineCode('@FlipMMO party create <party name>')}`)
            }; 
        };
    };  
};
},
info: {
  names: ['createparty', 'partycreate', 'newparty'],
} }
