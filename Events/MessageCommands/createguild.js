const Discord = require('discord.js');
const BALANCEDATA = require('../../modules/economie.js');
const PLAYERDATA = require('../../modules/player.js');
const STATS = require('../../modules/statsBot.js');
const EMOJICONFIG = require('../../config/emoji.json');
const SQUADDATA = require('../../modules/squad.js');
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
 //   const args = message.content.slice(prefix.length).trim().split(/ +/);
  //  const commandName = args.shift().toLowerCase();
    if (message.content.toLowerCase() && this.info.names.some(name => commandName === name)) {

    var user = message.author;
    var squadName = args[0]

    // == Balance Db ==
    let balance = await BALANCEDATA.findOne({ userId: message.author.id });
    let playerStats = await PLAYERDATA.findOne({ userId: message.author.id });
    if (playerStats.player.other.ironman === true) return message.reply(`${EMOJICONFIG.no} You are an ironman, you can't create a guild!`);
    if (!balance) return message.reply(`${EMOJICONFIG.no} you are not a player ! : ${inlineCode('@Eternals start')}`);
    else {

        if (balance.eco.coins < 0) return message.reply(`${EMOJICONFIG.no} error, coin balance < 0, contact the developer`)
        else {

            if(squadName === '') return message.reply(`${EMOJICONFIG.no} error command, type: ${inlineCode("@Eternals guild create <guild name>")}`)
            else if(squadName === ' ') return message.reply(`${EMOJICONFIG.no} error command, type: ${inlineCode("@Eternals guild create <guild name>")}`)
            else if(squadName === undefined || squadName === 'undefined') return message.reply(`${EMOJICONFIG.no} name not available, type: ${inlineCode("@Eternals guild create <guild name>")}`)
            else {

                // ==== Check if squad name ever use ====
                function squadNameEverUsed(allSquad, squadNameNew){
                    for(const squad of allSquad){
                        if(squad.squadName === squadNameNew) return false 
                    }
                    return true
                }

                let allSquad = await SQUADDATA.find();
                if(squadNameEverUsed(allSquad, squadName)){

                    

                    function playerInSquad(playerStats){
                        if (!playerStats) return message.reply(`${EMOJICONFIG.no} you are a not player ! : ${inlineCode('@Eternals start')}`);
                        else {
                            if(playerStats.player.other.squadName != 'undefined') return true
                        }
                        return false
                    }

                    if(playerInSquad(playerStats) == false){
                        playerStats.player.other.squadName = squadName;
                        playerStats.save();

                        var newSquad = new SQUADDATA({
                            squadName : squadName,
                            squadXp: 0,
                            leader: [message.author.id, user.username],
                            officer: [{id: user.id, pseudo: user.username}],
                            member: [{id: user.id, pseudo: user.username}],
                            banned: [{id: user.id, pseudo: user.username}],
                            squadbank: 0,
                            squadboss: {
                                bossattack: 500,
                                bosshealth: 8000,
                                bossdefense: 0,
                            },
                            stuff: {
                                stuffUnlock: [],
                                raid: [],
                            },
                            other:{
                                raidnzothprogress: 0,
                                raidcityofhatredprogress: 0,
                                bossKill:0,
                            },
                            lastRaid: null
                            });
                        newSquad.save()

                        // == Log : ==
                        const logChannel = client.channels.cache.get('1169491579774443660');
                        var now = new Date();
                        var date = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
                        var messageEmbed = new EmbedBuilder()
                            .setColor('#c18128')
                            .setTitle(`Log ${date}`)
                            .setDescription(`${EMOJICONFIG.paper} New Guild by **${inlineCode(user.username)}**\n${EMOJICONFIG.scroll4} Guild name : **${inlineCode(squadName)}**`);
                        logChannel.send({embeds: [messageEmbed], ephemeral: true });


                        let stats = await STATS.findOne({ botID: 899 });
                        stats.numberSquad += 1
                        stats.save()

                        var squadEmbed = new EmbedBuilder()
                            .setColor('#4dca4d')
                            .setTitle(`${EMOJICONFIG.paper} New Guild by ${user.username}`)
                            .setDescription(`${EMOJICONFIG.paper} You created ${inlineCode(squadName)}\n${EMOJICONFIG.coinchest} Guild Bank : ${inlineCode("0")} ${EMOJICONFIG.coin}\n${EMOJICONFIG.attack6} Leader : ${user.username}\n${EMOJICONFIG.attack} Member: ${inlineCode("1")}`)
                            .setTimestamp();
                        message.channel.send({embeds: [squadEmbed]});

                        // ===============================
                    } else return message.reply(`${EMOJICONFIG.no} you are already in a Guild...`) 
                } else return message.reply(`${EMOJICONFIG.no} the name ${inlineCode(squadName)} is already taken ! ${inlineCode('@Eternals guild create <guild name>')}`)
            }; 
        };
    };  
};
},
info: {
  names: ['createguild'],
} }
