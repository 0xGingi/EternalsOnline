const Discord = require('discord.js');
const PLAYERDATA = require('../../modules/player.js');
const EMOJICONFIG = require('../../config/emoji.json');
const CONFIGITEM = require('../../config/pets.json')
const { numStr } = require('../../functionNumber/functionNbr.js')
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, Events, ButtonStyle, ComponentType } = require('discord.js');
const { bold, inlineCode, codeBlock } = require('@discordjs/builders');
const { prefix } = require('../../App/config.json')
const cookConfig = require('../../config/cook.json');
const PETS = require('../../config/pets.json');


// Config Cooldown :
const shuffleTime = 3000;
var cooldownPlayers = new Discord.Collection();

module.exports = {
    name: Events.MessageCreate,
    
    async execute(message, args, commandName) {
        if (message.content.toLowerCase() && this.info.names.some(name => commandName === name)) {

    var user = message.author

    let playerStats = await PLAYERDATA.findOne({ userId: user.id });
    if (!playerStats) return message.reply(`${inlineCode('❌')} you are not a player ! : ${inlineCode('@FlipMMO start')}`);
    else {

        var allITemEmbed = ``
        var totalvalue = 0
        var itemIndex = 1;
        var inventoryItems = '';
        
    playerStats.player.pets.sort((a, b) => b.level - a.level);

for (const item of playerStats.player.pets) {
    const itemConfig = CONFIGITEM.find(config => config.id === item.id);

        if (!playerStats.player.stuff.stuffUnlock.includes(item.id) || item.amount !== 0) {
            const displayName = item.nickname !== "" ? item.nickname : itemConfig.equipalias;
            inventoryItems += `${item.name} **(${displayName})** - Level ${item.level}\n${EMOJICONFIG.attack6} ${item.attack}\n${EMOJICONFIG.shield2} ${item.defense}\n${EMOJICONFIG.heart} ${item.health}\n${EMOJICONFIG.attack} Special Attack: ${itemConfig.specialMove}\n`;
        }
    }

        var inventoryItemsLines = inventoryItems.split('\n');
        var inventoryItemsPages = [];
for (let i = 0; i < inventoryItemsLines.length; i += 15) {
    inventoryItemsPages.push(inventoryItemsLines.slice(i, i + 15).join('\n'));
}
        
var itemEmbeds = inventoryItemsPages.map((inventoryItemsPage, pageIndex) => {
    return new EmbedBuilder()
           // .setType(EmbedBuilder.types.RICH)
            .setColor('#9696ab')
            .setTitle(`${EMOJICONFIG.coinchest} ${user.username}'s Pets (Page ${pageIndex + 1}/${inventoryItemsPages.length}):`)
            .addFields(
                { name: `${EMOJICONFIG.paper} Number of Pets:`, value: inlineCode(playerStats.player.pets.length.toString()), inline: true },
                { name: `${EMOJICONFIG.hellspawn} Pets:`, value: inventoryItemsPage || 'None', inline: false }
            )
                    .setTimestamp();
            });

            var messageEmbed = await message.reply({ embeds: [itemEmbeds[0]], components: [new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId('previous').setLabel('Previous').setStyle(ButtonStyle.Secondary),
                new ButtonBuilder().setCustomId('next').setLabel('Next').setStyle(ButtonStyle.Secondary),

                )] });  4
                
                
                const filter = (interaction) => interaction.user.id === message.author.id;
                const collector = messageEmbed.createMessageComponentCollector({ filter, time: 60000 });
                let currentPage = 0;
               /*
                collector.on('collect', async (interaction) => {
                    if (interaction.customId === 'previous') {
                        if (currentPage > 0) currentPage--;
                    } else if (interaction.customId === 'next') {
                        if (currentPage < itemEmbeds.length - 1) currentPage++;
                    }
                    await interaction.update({ embeds: [itemEmbeds[currentPage]] });
                });
           */
          
                
                collector.on('collect', async (interaction) => {
                    if (interaction.customId === 'previous') {
                        if (currentPage > 0) currentPage--;
                    } else if (interaction.customId === 'next') {
                        if (currentPage < itemEmbeds.length - 1) currentPage++;
                    }
                    await interaction.update({ embeds: [itemEmbeds[currentPage]] });
                });
                       

    };
};
    },
info:{
    names: ['pets'],
}
    }