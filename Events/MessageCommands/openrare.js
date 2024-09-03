const Discord = require('discord.js');
const PLAYERDATA = require('../../modules/player.js')
const CONFIGITEM = require('../../config/rarebox.json')
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
            if (playerStats.player.other.rarebox == 0) return message.reply(`${EMOJICONFIG.no} You don't have any rare boxes to open`);
            else {
            
            async function randomitem(){
                var randomIndex = Math.floor(Math.random() * CONFIGITEM.length);
                var randomItem = CONFIGITEM[randomIndex];
            
                let id = randomItem.id;
                let name = randomItem.name;
                var alias = randomItem.equipalias;
                var existingItem = playerStats.player.stuff.stuffUnlock.find(item => item.id === id);
                if (existingItem) {
                    existingItem.amount += 1;
                    stats.amoutItem += 1;
                } else {
                    playerStats.player.stuff.stuffUnlock.push({id: id, name: name, level: 1, amount:1})
                    stats.amoutItem += 1;
                }
                playerStats.player.other.rarebox -= 1;
                await playerStats.save();
                await stats.save();
                return { 
                    error: false,
                    nname:  `${EMOJICONFIG.attack} **NEW ITEM** : **${inlineCode(name)}(${inlineCode(alias)})** - You now have ${existingItem ? existingItem.amount : 1} of these!.`,
                    nid: id
                };
            }
                    
            async function openAllBoxes() {
                if(playerStats.player.other.rarebox > 0){
                    let boxesOpened = 0;
                    let itemsFound = [];
                    while (playerStats.player.other.rarebox > 0) {
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
                    .setTitle(`${EMOJICONFIG.attack} ${user.username}'s New Items`)
                    .setDescription(`${EMOJICONFIG.yes} **All rare boxes opened!**\n${itemsFound.join('\n')}`)
                    .setTimestamp();
                    return message.reply({ embeds: [itemEmbed] });
                } else {
                    return message.reply(`${EMOJICONFIG.no} You don't have any rare boxes to open`);
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
                    .setTitle(`${EMOJICONFIG.attack} ${user.username}'s New Item(s)`)
                    .setDescription(`${EMOJICONFIG.yes} **Rare Box open!**\n${result.nname}`)
                    .setTimestamp()
                return message.reply({ embeds: [itemEmbed]})
            }
            
        
      } 
     } } 
}
        },
info: {
    names: ['openrare'],
}
}

