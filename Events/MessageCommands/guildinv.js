const Discord = require('discord.js');
const SQUADDATA = require('../../modules/squad.js');
const PLAYERDATA = require('../../modules/player.js');
const EMOJICONFIG = require('../../config/emoji.json');
const CONFIGITEM = require('../../config/stuff.json');
const { numStr } = require('../../functionNumber/functionNbr.js');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, Events, ButtonStyle, ComponentType } = require('discord.js');
const { bold, inlineCode, codeBlock } = require('@discordjs/builders');
const { prefix } = require('../../App/config.json');


// Config Cooldown :
const shuffleTime = 3000;
var cooldownPlayers = new Discord.Collection();

module.exports = {
    name: Events.MessageCreate,
    /**
     * @param {Message} message
     */
    async execute(message, args, commandName) {
        if (message.content.toLowerCase() && this.info.names.some(name => commandName === name)) {
 

    var user = message.author

    let playerStats = await PLAYERDATA.findOne({ userId: user.id });
    if (!playerStats) return message.reply(`${EMOJICONFIG.no} You are not a player! : ${inlineCode('@FlipMMO start')}`);

    let squad = await SQUADDATA.findOne({ squadName: playerStats.player.other.squadName });
    if (!squad) return message.reply(`${EMOJICONFIG.no} You are in a guild.`);
    else {

        var allITemEmbed = ``
        var totalvalue = 0
        var itemIndex = 1;


        const specialRarities = { 'Unique': 1, 'Rare': 2 };

        for (const allItem of squad.stuff.stuffUnlock) {
            for (const itemConfig of CONFIGITEM) {
                if (itemConfig.id == allItem.id) {
                    if (specialRarities[itemConfig.rarety]) {
                        allItem.sortPriority = specialRarities[itemConfig.rarety];
                    } else {           
                    //allItem.sortPriority = parseInt(itemConfig.rarety.replace('Tier ', '')) + Object.keys(specialRarities).length;                              
                    allItem.sortPriority = 100 - parseInt(itemConfig.rarety.replace('Tier ', ''));
                    }
                    totalvalue += itemConfig.cost * allItem.level;
                } } } 
        
    //    playerStats.player.stuff.stuffUnlock.sort((a, b) => b.tier - a.tier);
    squad.stuff.stuffUnlock.sort((a, b) => a.sortPriority - b.sortPriority);
        for(const allItem of squad.stuff.stuffUnlock){
            for(const itemConfig of CONFIGITEM){
                if(itemConfig.id == allItem.id) totalvalue += itemConfig.cost * allItem.level
            }
        for(const itemConfig of CONFIGITEM){
            if(itemConfig.id == allItem.id) {
                const itemName = allItem.name;
                allITemEmbed += `**${inlineCode(itemName)}(${inlineCode(itemConfig.equipalias)})** ${inlineCode("#: " + allItem.amount)} ${inlineCode(itemConfig.rarety)}\n`           
             }
        }
        };

        var itemEmbed = new EmbedBuilder()
        .setColor('#9696ab')
        .setTitle(`${EMOJICONFIG.coinchest} ${squad.squadName} Inventory`)
        .setDescription(`${EMOJICONFIG.attack6} Number of items : ${inlineCode(squad.stuff.stuffUnlock.length)}\n${EMOJICONFIG.coinchest} Total value : ${inlineCode(numStr(totalvalue))}\n${allITemEmbed}`)
        .setTimestamp()

        message.reply({ embeds: [itemEmbed] });
    };
};
    },
info:{
    names: ['guildinv'],
}
    }
