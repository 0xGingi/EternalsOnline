const Discord = require('discord.js');
const PLAYERDATA = require('../../modules/player.js');
const EMOJICONFIG = require('../../config/emoji.json');
const CONFIGITEM = require('../../config/stuff.json')
const { numStr } = require('../../functionNumber/functionNbr.js')
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, Events, ButtonStyle, ComponentType } = require('discord.js');
const { bold, inlineCode, codeBlock } = require('@discordjs/builders');
const { prefix } = require('../../App/config.json')
const cookConfig = require('../../config/cook.json');
const BALANCEDATA = require('../../modules/economie.js');
const {client} = require('../../App/index.js');


// Config Cooldown :
const shuffleTime = 3000;
var cooldownPlayers = new Discord.Collection();

module.exports = {
    name: Events.MessageCreate,
    
    async execute(message) {
        if (message.mentions.users.first() !== client.user) return;
        const args = message.content.split(/ +/).slice(1);
        const commandName = args.shift().toLowerCase();
        if (this.info.names.some(name => commandName === name)) {
 
    var user = message.author

    let playerStats = await PLAYERDATA.findOne({ userId: user.id });
    let balance = await BALANCEDATA.findOne({ userId: user.id });

    if (!playerStats) return message.reply(`${inlineCode('❌')} you are not a player ! : ${inlineCode('@Eternals start')}`);
    else {

        var allITemEmbed = ``
        var totalvalue = 0
        var itemIndex = 1;
        var equippedItems = '';
        var inventoryItems = '';



        function isItemEquipped(itemId) {
            const slots = playerStats.player.slotItem;
            let equippedSlots = [];

            for (const slot in slots) {
                if (slots[slot] === itemId) {
                    equippedSlots.push(slot.substring(4));                    
                }    
            }
        
            return equippedSlots.length > 0 ? equippedSlots : null;

        
        }        


        const specialRarities = { 'Unique': 9, 'Epic': 8, 'Rare': 7 };

        for (const item of playerStats.player.stuff.stuffUnlock) {
            const itemConfig = CONFIGITEM.find(config => config.id === item.id);
            if (specialRarities[itemConfig.rarety]) {
                item.sortPriority = specialRarities[itemConfig.rarety];
            } else {
                item.sortPriority = parseInt(itemConfig.rarety.replace('Tier ', ''));
            }
        }
        
        playerStats.player.stuff.stuffUnlock.sort((a, b) => b.sortPriority - a.sortPriority);
        
        
        for(const allItem of playerStats.player.stuff.stuffUnlock){
            for(const itemConfig of CONFIGITEM){
                if(itemConfig.id == allItem.id) totalvalue += itemConfig.cost * allItem.level
            }
        };
        let equippedItemsArray = [];
for (const item of playerStats.player.stuff.stuffUnlock) {
    const itemConfig = CONFIGITEM.find(config => config.id === item.id);
    const equippedSlots = isItemEquipped(item.id);
    const unequippedCount = item.amount;

    if (unequippedCount > 0 || (equippedSlots && equippedSlots.length > 0)) {
        if (unequippedCount === 0 && equippedSlots.length === 0 && item.amount > 0) {
            continue; 
        }
        if ((!playerStats.player.stuff.stuffUnlock.includes(item.id) || item.amount !== 0) && item.amount > 0) {
            inventoryItems += `${item.name} **(${itemConfig.equipalias})** - Level **${itemConfig.itemlevel}** - ${itemConfig.rarety} - x ${unequippedCount > 0 ? unequippedCount : item.amount}\n`;
        }
    }
    if (equippedSlots && equippedSlots.length > 0) {
        for (const slot of equippedSlots) {
           // equippedItems += `Slot ${slot}: ${item.name} **(${itemConfig.equipalias})**\n`;
           equippedItemsArray.push({ slot: parseInt(slot), item: `${item.name} **(${itemConfig.equipalias})**` });
        }
    }
}
    equippedItemsArray.sort((a, b) => a.slot - b.slot);
    equippedItems = equippedItemsArray.map(item => `Slot ${item.slot}: ${item.item}\n`).join('');

        var inventoryItemsLines = inventoryItems.split('\n');
        var inventoryItemsPages = [];
for (let i = 0; i < inventoryItemsLines.length; i += 10) {
    inventoryItemsPages.push(inventoryItemsLines.slice(i, i + 10).join('\n'));
}
        
var itemEmbeds = inventoryItemsPages.map((inventoryItemsPage, pageIndex) => {
    return new EmbedBuilder()
            .setColor('#9696ab')
            .setTitle(`${EMOJICONFIG.coinchest} ${user.username}'s Inventory (Page ${pageIndex + 1}/${inventoryItemsPages.length}):`)
            .addFields(
                { name: `${EMOJICONFIG.coin} Coin Pouch`, value: inlineCode(numStr(balance.eco.coins)), inline: true},
                { name: '\u200B', value: '\u200B' , inline: true},
                { name: `${EMOJICONFIG.scroll4} Level`, value: inlineCode(numStr(playerStats.player.level)), inline: true},
                { name: `${EMOJICONFIG.paper} Number of items:`, value: inlineCode(playerStats.player.stuff.stuffUnlock.length.toString()), inline: true },
                { name: `${EMOJICONFIG.coin} Total value:`, value: inlineCode(numStr(totalvalue)), inline: true },
                { name: `${EMOJICONFIG.helmet} Equipped Items:`, value: equippedItems || 'None', inline: false },
                { name: `${EMOJICONFIG.coinchest} Inventory:`, value: inventoryItemsPage || 'None', inline: false }
            )
                    .setTimestamp();
            });

            var messageEmbed = await message.reply({ embeds: [itemEmbeds[0]], components: [new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId('previous').setLabel('Previous').setStyle(ButtonStyle.Secondary),
                new ButtonBuilder().setCustomId('next').setLabel('Next').setStyle(ButtonStyle.Secondary),
                new ButtonBuilder().setCustomId('showResources').setLabel('Skilling').setStyle(ButtonStyle.Primary)

                )] });  
                
                
                const filter = (interaction) => interaction.user.id === message.author.id;
                const collector = messageEmbed.createMessageComponentCollector({ filter, time: 1800000 });
                let currentPage = 0;
          
                
                collector.on('collect', async (interaction) => {
                    if (interaction.customId === 'previous') {
                        if (currentPage > 0) currentPage--;
                    } else if (interaction.customId === 'next') {
                        if (currentPage < itemEmbeds.length - 1) currentPage++;
                    } else if (interaction.customId === 'showResources') {
                        let response = '', response2 = '', response3 = '', response4 = '', response5 = '', response6 = '', response7 = '', response8 = '', response9 = '';
                        playerStats.player.stuff.fish.forEach(fish => {
                            if (fish.amount > 0) {
                                response += (`${fish.name}: ${fish.amount}\n`);
                            }
                        });
                        playerStats.player.stuff.food.forEach(food => {
                            if (food.amount > 0) {
                                const foodConfigItem = cookConfig.find(item => item.name === food.name);
                                const hpValue = foodConfigItem ? foodConfigItem.hp : 'Unknown HP';
                                response2 += (`${food.name}: ${food.amount} (HP: ${hpValue})\n`);
                            }
                        });
                        playerStats.player.stuff.logs.forEach(logs => {
                            if (logs.amount > 0) {
                                response3 += (`${logs.name}: ${logs.amount}\n`);
                            }
                        });
                        playerStats.player.stuff.ore.forEach(ore => {
                            if (ore.amount > 0) {
                                response4 += (`${ore.name}: ${ore.amount}\n`);
                            }
                        });
                        playerStats.player.stuff.bars.forEach(bars => {
                            if (bars.amount > 0) {
                                response5 += (`${bars.name}: ${bars.amount}\n`);
                            }
                        });
                        playerStats.player.stuff.gem.forEach(gem => {
                            if (gem.amount > 0) {
                                response6 += (`${gem.name}: ${gem.amount}\n`);
                            }
                        }); 
                        playerStats.player.stuff.seeds.forEach(seed => {
                            if (seed.amount > 0) {
                                response7 += (`${seed.name}: ${seed.amount}\n`);
                            }
                        });
                        playerStats.player.stuff.crops.forEach(crop => {
                            if (crop.amount > 0) {
                                response8 += (`${crop.name}: ${crop.amount}\n`);
                            }
                        });
                        playerStats.player.stuff.potions.forEach(potion => {
                            if (potion.amount > 0) {
                                response9 += (`${potion.name}: ${potion.amount}\n`);
                            }
                        });
                           
                        const resourceEmbed = new EmbedBuilder()
                            .setColor('#9696ab')
                            .setTitle(`${EMOJICONFIG.coinchest} ${user.username}'s Resources:`)
                            .addFields(
                                { name: `${EMOJICONFIG.fish22} **Fish** :`, value: `${inlineCode(response)}` , inline: true },
                                { name: `${EMOJICONFIG.cookedmeat} **Food** :`, value: `${inlineCode(response2)}`, inline: true },
                                { name: `${EMOJICONFIG.wood2} **Logs** :`, value: `${inlineCode(response3)}`, inline: true },
                                { name: `${EMOJICONFIG.ore} **Ore** :`,  value: `${inlineCode(response4)}`, inline: true },
                                { name: `${EMOJICONFIG.hammer2} **Bars** :`, value: `${inlineCode(response5)}`, inline: true },
                                { name: `${EMOJICONFIG.totem} **Totems** :`, value: `${inlineCode(response6)}`, inline: true },
                                { name: `${EMOJICONFIG.flower1} **Seeds** :`, value: `${inlineCode(response7)}`, inline: true },
                                { name: `${EMOJICONFIG.sunflower1} **Crops** :`, value: `${inlineCode(response8)}`, inline: true },
                                { name: `${EMOJICONFIG.mana3} **Potions** :`, value: `${inlineCode(response9)}`, inline: true },                    

                            )
                            .setTimestamp();
                        await interaction.update({ embeds: [resourceEmbed] });
                        return;
                    
                    }

                    await interaction.update({ embeds: [itemEmbeds[currentPage]] });
                });
                       

    };
};
    },
info:{
    names: ['item', 'inv', 'inventory', 'i'],
}
    }