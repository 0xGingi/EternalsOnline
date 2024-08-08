const PLAYERDATA = require('../../modules/player');
const CONFIGITEM = require('../../config/stuff.json')
const { bold, inlineCode, codeBlock } = require('@discordjs/builders');
const { prefix } = require('../../App/config.json')
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, Events, ButtonStyle, ComponentType } = require('discord.js');
const EMOJICONFIG = require('../../config/emoji.json');
const {client} = require('../../App/index.js');

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
 
const item = args[0];
const item2 = args[1];
const user = message.author;

if(item == undefined || item == '' || item == ' ') return message.reply(`${EMOJICONFIG.no} item error : ${inlineCode("@FlipMMO stats <item>")}`);
let playerStats = await PLAYERDATA.findOne({ userId: user.id });
if (!playerStats) return message.reply(`${EMOJICONFIG.no} you are not a player ! : ${inlineCode('@FlipMMO start')}`);
else {
    function itemExist(item){
        for(let pas = 0; pas < CONFIGITEM.length; pas++){
            for(const alias of CONFIGITEM[pas].alias){
                if(item == alias) return [true, CONFIGITEM[pas].id, CONFIGITEM[pas].cost, CONFIGITEM[pas].name, CONFIGITEM[pas].categorie, CONFIGITEM[pas].rarety]
            }
        }
        return [false, -1, 0, 'undefined', 'undefined', 'undefined']
    };
    const itemExists = itemExist(item)[0];
    if (!itemExists) return message.reply(`${EMOJICONFIG.no} This item does not exist!`);

    function returnStatsItem(item){
        for(let pas = 0; pas < CONFIGITEM.length; pas++){
            for(const alias of CONFIGITEM[pas].alias){
                if(item == alias) return [CONFIGITEM[pas].name, CONFIGITEM[pas].categorie, CONFIGITEM[pas].rarety, CONFIGITEM[pas].levelAttack.level1, CONFIGITEM[pas].levelDefense.level1, CONFIGITEM[pas].levelDodge.level1, CONFIGITEM[pas].levelCrit.level1, CONFIGITEM[pas].levelPenetration.level1, CONFIGITEM[pas].levelLifeSteal.level1, CONFIGITEM[pas].levelHealth.level1, CONFIGITEM[pas].equipalias, CONFIGITEM[pas].description, CONFIGITEM[pas].itemlevel]
            }
        }
    };
    let listingId = item;

    const statsEmbed = new EmbedBuilder()
    .setColor('#4dca4d')
    .setTitle(`${EMOJICONFIG.scroll4} Stats`)
    .addFields({name: `${returnStatsItem(item)[0]}\n${inlineCode(returnStatsItem(item)[11])}`, value: `${EMOJICONFIG.paper} **Category : ${inlineCode(returnStatsItem(item)[1])}\n${EMOJICONFIG.paper} **Level** : ${inlineCode(returnStatsItem(item)[12])}\n${EMOJICONFIG.orb} Rarity : ${inlineCode(returnStatsItem(item)[2])}\n${EMOJICONFIG.attack6} Alias : ${inlineCode(returnStatsItem(item)[10])}**\n\n**${EMOJICONFIG.paper} Stats :**\n${EMOJICONFIG.attack} Attack: ${returnStatsItem(listingId)[3]}\n${EMOJICONFIG.shield2} Defense: ${returnStatsItem(listingId)[4]}\n${EMOJICONFIG.heart} Life Steal: ${returnStatsItem(listingId)[8]}\n${EMOJICONFIG.daggerstrike} Critical Chance: ${returnStatsItem(listingId)[6]}\n${EMOJICONFIG.swordsling4} Dodge: ${returnStatsItem(listingId)[5]}\n${EMOJICONFIG.swordattackblue} Penetration: ${returnStatsItem(listingId)[7]}`, inline: true})


    .setTimestamp();
    
    if (item2) {
        const item2Exists = itemExist(item2)[0];
        if (!item2Exists) {
            message.reply(`${EMOJICONFIG.no} The second item does not exist!`);
        } else {
            statsEmbed.addFields({name:`${returnStatsItem(item2)[0]}\n${inlineCode(returnStatsItem(item2)[11])}`, value: `${EMOJICONFIG.paper} **Category** : ${inlineCode(returnStatsItem(item2)[1])}\n${EMOJICONFIG.paper} **Level** : ${inlineCode(returnStatsItem(item2)[12])}\n${EMOJICONFIG.orb} Rarity : ${inlineCode(returnStatsItem(item2)[2])}\n${EMOJICONFIG.attack6} Alias : ${inlineCode(returnStatsItem(item2)[10])}**\n\n**${EMOJICONFIG.paper} Stats :**\n${EMOJICONFIG.attack} Attack: ${returnStatsItem(item2)[3]}\n${EMOJICONFIG.shield2} Defense: ${returnStatsItem(item2)[4]}\n${EMOJICONFIG.heart} Life Steal: ${returnStatsItem(item2)[8]}\n${EMOJICONFIG.daggerstrike} Critical Chance: ${returnStatsItem(item2)[6]}\n${EMOJICONFIG.swordsling4} Dodge: ${returnStatsItem(item2)[5]}\n${EMOJICONFIG.swordattackblue} Penetration: ${returnStatsItem(item2)[7]}`, inline: true});
        }
    }
    
    message.channel.send({embeds: [statsEmbed]});
} };
    },
info: {
    names: ['stats', 'itemstats', 'statsitem'],
}
    }