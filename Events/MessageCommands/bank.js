const Discord = require('discord.js');
const PLAYERDATA = require('../../modules/player.js');
const BALANCEDATA = require('../../modules/economie.js');
const { inlineCode } = require('@discordjs/builders');
const CONFIGITEM = require('../../config/stuff.json');
const EMOJICONFIG = require('../../config/emoji.json');
const { prefix } = require('../../App/config.json')
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, Events, ButtonStyle, ComponentType } = require('discord.js');
const { numStr } = require('../../functionNumber/functionNbr.js')
const {client} = require('../../App/index.js');

module.exports = {
    name: Events.MessageCreate,

    async execute(message) {
        if (message.mentions.users.first() !== client.user) return;
        const args = message.content.split(/ +/).slice(1);
        const commandName = args.shift().toLowerCase();
        if (this.info.names.some(name => commandName === name)) {

            const user = message.author;
            const action = args[0];


            if (!action) {
                var totalvalue = 0
                var inventoryItems = '';
                let player = await PLAYERDATA.findOne({ userId: message.author.id });
        
        
                const specialRarities = { 'Unique': 8, 'Epic': 7, 'Rare': 6 };
        
                for (const item of player.player.bank.stuffUnlock) {
                    const itemConfig = CONFIGITEM.find(config => config.id === item.id);
                    if (specialRarities[itemConfig.rarety]) {
                        item.sortPriority = specialRarities[itemConfig.rarety];
                    } else {
                        item.sortPriority = parseInt(itemConfig.rarety.replace('Tier ', ''));
                    }
                }
                
                player.player.bank.stuffUnlock.sort((a, b) => b.sortPriority - a.sortPriority);
                
                
                for(const allItem of player.player.bank.stuffUnlock){
                    for(const itemConfig of CONFIGITEM){
                        if(itemConfig.id == allItem.id) totalvalue += itemConfig.cost * allItem.level
                    }
                };
        
        for (const item of player.player.bank.stuffUnlock) {1
            const itemConfig = CONFIGITEM.find(config => config.id === item.id);
        
                if (!player.player.bank.stuffUnlock.includes(item.id) || item.amount !== 0) {
                    inventoryItems += `${item.name} **(${itemConfig.equipalias})** - ${itemConfig.rarety} - x ${item.amount}\n`;
                }
            }
                var inventoryItemsLines = inventoryItems.split('\n');
                var inventoryItemsPages = [];
        for (let i = 0; i < inventoryItemsLines.length; i += 10) {
            inventoryItemsPages.push(inventoryItemsLines.slice(i, i + 10).join('\n'));
        }
                
        var itemEmbeds = inventoryItemsPages.map((inventoryItemsPage, pageIndex) => {
            return new EmbedBuilder()
                   // .setType(EmbedBuilder.types.RICH)
                    .setColor('#9696ab')
                    .setTitle(`${EMOJICONFIG.coinchest} ${user.username}'s Bank (Page ${pageIndex + 1}/${inventoryItemsPages.length}):`)
                    .addFields(
                        { name: `${EMOJICONFIG.coinchest} Coins:`, value: inlineCode(numStr(player.player.bank.coins)), inline: true },
                        { name: `${EMOJICONFIG.paper} Number of items:`, value: inlineCode(player.player.bank.stuffUnlock.length.toString()), inline: true },
                        { name: `${EMOJICONFIG.coin} Total Item value:`, value: inlineCode(numStr(totalvalue)), inline: true },
                        { name: `${EMOJICONFIG.coinchest} Bank:`, value: inventoryItemsPage || 'None', inline: false }
                    )
                            .setTimestamp();
                    });
        
                    var messageEmbed = await message.reply({ embeds: [itemEmbeds[0]], components: [new ActionRowBuilder().addComponents(
                        new ButtonBuilder().setCustomId('previous').setLabel('Previous').setStyle(ButtonStyle.Secondary),
                        new ButtonBuilder().setCustomId('next').setLabel('Next').setStyle(ButtonStyle.Secondary),
        
                        )] });  
                        
                        
                        const filter = (interaction) => interaction.user.id === message.author.id;
                        const collector = messageEmbed.createMessageComponentCollector({ filter, time: 60000 });
                        let currentPage = 0;
                  
                        
                        collector.on('collect', async (interaction) => {
                            if (interaction.customId === 'previous') {
                                if (currentPage > 0) currentPage--;
                            } else if (interaction.customId === 'next') {
                                if (currentPage < itemEmbeds.length - 1) currentPage++;
                            } 
                            await interaction.update({ embeds: [itemEmbeds[currentPage]] });
                        });
            }

            if (action === 'withdraw' || action === 'w') {
                let giverStats = await PLAYERDATA.findOne({ userId: message.author.id });
                let giverBal = await BALANCEDATA.findOne({userId: message.author.id});
   
                const item = args[1];
                //const amount = parseInt(args[2]) || 1;
                let amount;

                if (args[2] && args[2].toLowerCase() === 'all') {
                    if (item === 'coin' || item === 'coins') {
                        amount = giverStats.player.bank.coins;
                    } else {
                        const itemInBank = giverStats.player.bank.stuffUnlock.find(bankItem => bankItem.id === itemExist(item)[1]);
                        amount = itemInBank ? itemInBank.amount : 0;
                    }
                } else {
                    amount = parseInt(args[2]) || 1;
                }
                

 
 
             function itemExist(item){
                 for(let pas = 0; pas < CONFIGITEM.length; pas++){
                     for(const alias of CONFIGITEM[pas].alias){
                         if(item == alias) return [true, CONFIGITEM[pas].id, CONFIGITEM[pas].cost, CONFIGITEM[pas].name, CONFIGITEM[pas].categorie, CONFIGITEM[pas].rarety, CONFIGITEM[pas].equipalias, "Item"]
                     }
                 }
     
     
                 return [false, -1, 0, 'undefined', 'undefined', 'undefined']
             };
     
     
 
             if (item === 'coin' || item === 'coins') {
                 
                 if (isNaN(amount) || amount <= 0) return message.reply(`${EMOJICONFIG.no} Please specify a valid amount of coins to give.`);
                 
                 // Check if the giver has enough coins
                 if (giverStats.player.bank.coins < amount) return message.reply(`${EMOJICONFIG.no} You do not have enough coins in your bank.`);
                 
                 // Transfer coins
                 giverBal.eco.coins += amount;
                 giverStats.player.bank.coins -= amount;
                 // Save changes to the database
                 await giverBal.save();
                 await giverStats.save();
                 // Send confirmation message
                 return message.reply(`${EMOJICONFIG.yes} You withdraw ${inlineCode(amount.toString())} ${EMOJICONFIG.coin} to your coin pouch.`);
             }
             else {    
             if (itemExist(item)[0]){
                 function ifItemInInventory(item){
                     for(const itemPlayerAll of giverStats.player.bank.stuffUnlock){
                         var itemPlayer = itemPlayerAll.id
                         var itemPlayerExist = itemExist(item)[1]
                         if(itemPlayer == itemPlayerExist) return [true, itemPlayer]
                     }
     
                     return [false, -1]
     
             };
 
             const iteminf = ifItemInInventory(item);
             if (!iteminf[0]) {
             return message.reply(`${EMOJICONFIG.no} You don't have this item!`);
 
             }
 
             if (itemExist(item)[7] === "Item"){
                 const indexx = giverStats.player.bank.stuffUnlock.findIndex(item => item.id === iteminf[1]);
                 if (indexx === -1 || giverStats.player.bank.stuffUnlock[indexx].amount < amount) {
                     return message.reply(`${EMOJICONFIG.no} You don't have enough of this item to withdraw!`); } 
             }
             
             var itemName = itemExist(item)[3];
             var itemId = itemExist(item)[1]
             var itemInfo = ifItemInInventory(item);
             var itemType = itemExist(item)[4];
             var itemType2 = itemExist(item)[7];
             var index, itemm;
     
          
              if (itemType2 === 'Item') {
                 var index = giverStats.player.bank.stuffUnlock.findIndex(item => item.id === itemInfo[1]);
                 var itemm = giverStats.player.bank.stuffUnlock.find(item => item.id === itemInfo[1]);
                 var pstat = giverStats.player.bank.stuffUnlock[index];
                 var index2 = giverStats.player.stuff.stuffUnlock.findIndex(item2 => item2.id === itemInfo[1]);
                 var itemm2 = giverStats.player.stuff.stuffUnlock.find(item2 => item2.id === itemInfo[1]);
                 var pstat2 = giverStats.player.stuff.stuffUnlock[index];
 
             }
 
             if (index === -1) {
                 return message.reply(`${EMOJICONFIG.no} You don't have this item in your bank.`);
             }
 
             if (pstat.amount < amount) {
                 return message.reply(`${EMOJICONFIG.no} You don't have enough of this item to give the specified amount.`);
             }
             if (itemExist(item)[7] === "Item") {
                 if (index2 === -1){
                     //Recp does not have item
                     if (pstat.amount <= amount){
                         //Giver will have 0 of item, so splice it!
                         giverStats.player.bank.stuffUnlock.splice(index, 1);
                         giverStats.player.stuff.stuffUnlock.push({id: itemExist(item)[1], name: itemExist(item)[3], level: 1, amount: amount});
                         await giverStats.save();
                         return message.reply(`You have banked ${amount} x ${itemExist(item)[3]}`);    
                     }
                     else if (pstat.amount > amount){
                         //Giver will still amount of item left
                         itemm.amount -= amount;
                         giverStats.player.stuff.stuffUnlock.push({id: itemExist(item)[1], name: itemExist(item)[3], level: 1, amount: amount});
                         await giverStats.save();
                         return message.reply(`you have banked ${amount} x ${itemExist(item)[3]}`);    
                     }
                 } else {
                     //Recp does have item
                     if (pstat.amount <= amount){
                         //Giver will have 0 of item, so splice it!
                         giverStats.player.bank.stuffUnlock.splice(index, 1);
                         itemm2.amount += amount;
                         await giverStats.save();
                         return message.reply(`you have banked ${amount} x ${itemExist(item)[3]}`);    
                     }
                     else if (pstat.amount > amount){
                         //Giver will still amount of item left
                         itemm.amount -= amount;
                         itemm2.amount += amount;
                         await giverStats.save();
                         await recipientStats.save();
                         return message.reply(`you have banked ${amount} x ${itemExist(item)[3]}`);    
                     }
                    
                    
                 }
 
             }
            
         }
     }
              return message.reply(`${EMOJICONFIG.no} this item does not exist...`); 
         } 

             // =============================================================
            
             if (action === 'deposit' || action === 'd') {
                let giverStats = await PLAYERDATA.findOne({ userId: message.author.id });
                let giverBal = await BALANCEDATA.findOne({userId: message.author.id});
    
                const item = args[1];
                //const amount = parseInt(args[2]) || 1;
                
                let amount;

                if (args[2] && args[2].toLowerCase() === 'all') {
                    if (item === 'coin' || item === 'coins') {
                        amount = giverBal.eco.coins;
                    } else {
                        const itemInInventory = giverStats.player.stuff.stuffUnlock.find(inventoryItem => inventoryItem.id === itemExist(item)[1]);
                        amount = itemInInventory ? itemInInventory.amount : 0;
                    }
                } else {
                    amount = parseInt(args[2]) || 1;
                }
                  
    




            function itemExist(item){
                for(let pas = 0; pas < CONFIGITEM.length; pas++){
                    for(const alias of CONFIGITEM[pas].alias){
                        if(item == alias) return [true, CONFIGITEM[pas].id, CONFIGITEM[pas].cost, CONFIGITEM[pas].name, CONFIGITEM[pas].categorie, CONFIGITEM[pas].rarety, CONFIGITEM[pas].equipalias, "Item"]
                    }
                }
    
    
                return [false, -1, 0, 'undefined', 'undefined', 'undefined']
            };
    
    

            if (item === 'coin' || item === 'coins') {
                
                if (isNaN(amount) || amount <= 0) return message.reply(`${EMOJICONFIG.no} Please specify a valid amount of coins to give.`);
                console.log(giverBal.eco.coins)
                console.log(amount)
                // Check if the giver has enough coins
                if (giverBal.eco.coins < amount) return message.reply(`${EMOJICONFIG.no} You do not have enough coins to bank.`);
                
                // Transfer coins
                giverBal.eco.coins -= amount;
                giverStats.player.bank.coins += amount;

                // Save changes to the database
                await giverBal.save();
                await giverStats.save();

                // Send confirmation message
                return message.reply(`${EMOJICONFIG.yes} You store ${inlineCode(amount.toString())} ${EMOJICONFIG.coin} in your bank.`);
            }
            else {    
            if (itemExist(item)[0]){
                function ifItemInInventory(item){
                    for(const itemPlayerAll of giverStats.player.stuff.stuffUnlock){
                        var itemPlayer = itemPlayerAll.id
                        var itemPlayerExist = itemExist(item)[1]
                        if(itemPlayer == itemPlayerExist) return [true, itemPlayer]
                    }
    
                    return [false, -1]
    
            };

            const iteminf = ifItemInInventory(item);
            if (!iteminf[0]) {
            return message.reply(`${EMOJICONFIG.no} You don't have this item!`);

            }

            if (itemExist(item)[7] === "Item"){
                const indexx = giverStats.player.stuff.stuffUnlock.findIndex(item => item.id === iteminf[1]);
                if (indexx === -1 || giverStats.player.stuff.stuffUnlock[indexx].amount < amount) {
                    return message.reply(`${EMOJICONFIG.no} You don't have enough of this item to give!`); } 
            }
            
            var itemName = itemExist(item)[3];
            var itemId = itemExist(item)[1]
            var itemInfo = ifItemInInventory(item);
            var itemType = itemExist(item)[4];
            var itemType2 = itemExist(item)[7];
            var index, itemm;
    
         
             if (itemType2 === 'Item') {
                var index = giverStats.player.stuff.stuffUnlock.findIndex(item => item.id === itemInfo[1]);
                var itemm = giverStats.player.stuff.stuffUnlock.find(item => item.id === itemInfo[1]);
                var pstat = giverStats.player.stuff.stuffUnlock[index];
                var index2 = giverStats.player.bank.stuffUnlock.findIndex(item2 => item2.id === itemInfo[1]);
                var itemm2 = giverStats.player.bank.stuffUnlock.find(item2 => item2.id === itemInfo[1]);
                var pstat2 = giverStats.player.bank.stuffUnlock[index];
            }

            if (index === -1) {
                return message.reply(`${EMOJICONFIG.no} You don't have this item in your inventory.`);
            }

            if (pstat.amount < amount) {
                return message.reply(`${EMOJICONFIG.no} You don't have enough of this item to give the specified amount.`);
            }
            if (itemExist(item)[7] === "Item") {
                if (index2 === -1){
                    //Recp does not have item
                    if (pstat.amount <= amount){
                        //Giver will have 0 of item, so splice it!
                        giverStats.player.stuff.stuffUnlock.splice(index, 1);
                        giverStats.player.bank.stuffUnlock.push({id: itemExist(item)[1], name: itemExist(item)[3], level: 1, amount: amount});
                        await giverStats.save();
                        return message.reply(`You have banked ${amount} x ${itemExist(item)[3]}`);    
                    }
                    else if (pstat.amount > amount){
                        //Giver will still amount of item left
                        itemm.amount -= amount;
                        giverStats.player.bank.stuffUnlock.push({id: itemExist(item)[1], name: itemExist(item)[3], level: 1, amount: amount});
                        await giverStats.save();
                        return message.reply(`you have banked ${amount} x ${itemExist(item)[3]}`);    
                    }
                } else {
                    //Recp does have item
                    if (pstat.amount <= amount){
                        //Giver will have 0 of item, so splice it!
                        giverStats.player.stuff.stuffUnlock.splice(index, 1);
                        itemm2.amount += amount;
                        await giverStats.save();
                        return message.reply(`you have banked ${amount} x ${itemExist(item)[3]}`);    
                    }
                    else if (pstat.amount > amount){
                        //Giver will still amount of item left
                        itemm.amount -= amount;
                        itemm2.amount += amount;
                        await giverStats.save();
                        await recipientStats.save();
                        return message.reply(`you have banked ${amount} x ${itemExist(item)[3]}`);    
                    }
                

                }

            }
            
                }
    }
             return message.reply(`${EMOJICONFIG.no} this item does not exist...`); 
        } 
    }
    },
    info: {
        names: ['bank'],
    }
};

