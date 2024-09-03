const Discord = require('discord.js');
const PLAYERDATA = require('../../modules/player.js')
const CONFIGITEM = require('../../config/mine.json')
const BALANCEDATA = require('../../modules/economie.js')
const STATS = require('../../modules/statsBot.js')
const { inlineCode } = require('@discordjs/builders')
const { prefix } = require('../../App/config.json')
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, Events, ButtonStyle, ComponentType } = require('discord.js');
const EMOJICONFIG = require('../../config/emoji.json');


// Config Cooldown :
const shuffleTime = 4000;
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
      
    var user = message.author
    let stats = await STATS.findOne({ botID: 899 });

    /**=== Account Stats Mine ===*/
    let playerStats = await PLAYERDATA.findOne({ userId: user.id });
    if (!playerStats) return message.reply(`${EMOJICONFIG.no} you are not a player ! : ${inlineCode('@Eternals start')}`);
    else {

        let balance = await BALANCEDATA.findOne({ userId: user.id });
        if (!balance) return message.reply(`${EMOJICONFIG.no} you are not a player ! : ${inlineCode('@Eternals start')}`);
        else {
            if (playerStats.player.other.orepack == 0) return message.reply(`${EMOJICONFIG.no} You don't have any ore packs to open! \n Vote At https://top.gg/bot/1157454837861056552/vote`);
            else {
            
            async function randomitem(){
                const eligibleOre = CONFIGITEM.filter(ore => playerStats.player.mining.level >= ore.level);
                const randomItem = eligibleOre[Math.floor(Math.random() * eligibleOre.length)];
                let amount = Math.floor(Math.random() * 250) + 200;
                let id = randomItem.id;
                let name = randomItem.name;
                var existingItem = playerStats.player.stuff.ore.find(item => item.id === id);
                if (existingItem) {
                    existingItem.amount += amount;
                } else {
                    playerStats.player.stuff.ore.push({id: id, name: name, amount: amount})
                }
                playerStats.player.other.orepack -= 1;
                await playerStats.save();
                return { 
                    error: false,
                    nname:  `${EMOJICONFIG.ore} **Ore Pack Opened** : **${inlineCode(amount)} x ${inlineCode(name)}** - You now have ${existingItem ? existingItem.amount : amount}!.`,
                    nid: id
                };
            }
                    
            async function openAllBoxes() {
                if(playerStats.player.other.orepack > 0){
                    let boxesOpened = 0;
                    let itemsFound = [];
                    while (playerStats.player.other.orepack > 0) {
                        var result = await randomitem();
                        if (result.error) {
                            return message.reply(result.message);
                        }
                        boxesOpened++;
                        itemsFound.push(result.nname);
                    }
                    await playerStats.save();
                    await stats.save();
                    var itemEmbed = new EmbedBuilder()
                    .setColor('#6d4534')
                    .setTitle(`${EMOJICONFIG.pickaxe2} ${user.username}'s New Ore`)
                    .setDescription(`${EMOJICONFIG.yes} **All ore packs opened!**\n${itemsFound.join('\n')}`)
                    .setTimestamp();
                    return message.reply({ embeds: [itemEmbed] });
                } else {
                    return message.reply(`${EMOJICONFIG.no} You don't have any ore packs to open!\n Vote At https://top.gg/bot/1157454837861056552/vote`);
                }
            }
            
            if (args[0] && args[0].toLowerCase() === 'all') {
                return openAllBoxes();
            } else {
                var result = await randomitem();
                if (result.error) {
                    return message.reply(result.message);
                }                
                var nid = result.nid;
                var itemEmbed = new EmbedBuilder()
                    .setColor('#6d4534')
                    .setTitle(`${EMOJICONFIG.pickaxe2} ${user.username}'s New Ore`)
                    .setDescription(`${EMOJICONFIG.yes} **Ore Pack open!**\n${result.nname}`)
                    .setTimestamp()
                return message.reply({ embeds: [itemEmbed]})
            }
            
        
      } 
     } } 
}
        },
info: {
    names: ['openorepack'],
}
}
