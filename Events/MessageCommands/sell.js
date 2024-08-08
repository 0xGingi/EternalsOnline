const Discord = require('discord.js');
const Marketplace = require('../../modules/marketplace');
const PLAYERDATA = require('../../modules/player');
const CONFIGITEM = require('../../config/stuff.json')
const STATS = require('../../modules/statsBot.js');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const { bold, inlineCode, codeBlock } = require('@discordjs/builders');
const EMOJICONFIG = require('../../config/emoji.json');
const Balance = require('../../modules/economie.js');
const { prefix } = require('../../App/config.json')
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, Events, ButtonStyle, ComponentType } = require('discord.js');
const {client} = require('../../App/index.js');
const fishData = require('../../config/fish.json');
const cookData = require('../../config/cook.json');
const logData = require('../../config/woodcut.json');
const oreData = require('../../config/mine.json');
const barsData = require('../../config/smelt.json');
const totemData = require('../../config/craft.json');
const seedData = require('../../config/seeds.json');
const cropData = require('../../config/crops.json');
const potionData = require('../../config/potions.json');

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

        
    const sellerId = message.author.id;
    const sellerName = message.author.username;
    const item = args[0].toUpperCase();
    const price = args[1];
    if (price < 0) {
        return message.reply('Price must be a positive number.');
    }
    const amountToSell = args[2] ? parseInt(args[2], 10) : 1; // Default to 1 if not specified
    
    if (!Number.isInteger(parseFloat(price))) {
        return message.reply(`${EMOJICONFIG.no} Error: Price must be an integer.`);
    }


    if (isNaN(amountToSell) || amountToSell <= 0) {
        return message.reply(`${EMOJICONFIG.no} Error: Invalid amount specified.`);
    }
    
    //const price = price1 * amountToSell

    if(item == undefined || item == '' || item == ' ') return message.reply(`${EMOJICONFIG.no} item error : ${inlineCode("@FlipMMO sell <item name> <price>")}`);

    if (!price) return message.reply(`${EMOJICONFIG.no} Error: You must specify a price. Usage: ${inlineCode("@FlipMMO sell <item name> <price>")}`);
    let playerStats = await PLAYERDATA.findOne({ userId: sellerId });
    if (playerStats.player.other.ironman === true) return message.reply(`${EMOJICONFIG.no} You are an ironman, you can't sell items on the GE!`);
    if (!playerStats) return message.reply(`${EMOJICONFIG.no} you are not a player ! : ${inlineCode('@FlipMMO start')}`);
    else {
        function itemExist(item){
            for(let pas = 0; pas < CONFIGITEM.length; pas++){
                for(const alias of CONFIGITEM[pas].alias){
                    if(item == alias) return [true, CONFIGITEM[pas].id, CONFIGITEM[pas].cost, CONFIGITEM[pas].name, CONFIGITEM[pas].categorie, CONFIGITEM[pas].rarety, CONFIGITEM[pas].equipalias, "Item"]
                }
            }

            for(let pas = 0; pas < fishData.length; pas++){              
                if(item == fishData[pas].ge.toUpperCase()) return [true, fishData[pas].id, fishData[pas].cost, fishData[pas].name, "Fish", "Common", fishData[pas].ge.toUpperCase(), "Fish"]
            }
            for(let pas = 0; pas < cookData.length; pas++){         
                if(item == cookData[pas].ge.toUpperCase()) return [true, cookData[pas].id, cookData[pas].cost, cookData[pas].name, "Food", "Common", cookData[pas].ge.toUpperCase(), "Food"]      
            }
            for(let pas = 0; pas < logData.length; pas++){         
            if(item == logData[pas].ge.toUpperCase()) return [true, logData[pas].id, logData[pas].cost, logData[pas].name, "Logs", "Common", logData[pas].ge.toUpperCase(), "Logs"]      
            }
            for(let pas = 0; pas < oreData.length; pas++){         
            if(item == oreData[pas].ge.toUpperCase()) return [true, oreData[pas].id, oreData[pas].cost, oreData[pas].name, "Ore", "Common", oreData[pas].ge.toUpperCase(), "Ore"]      
            }
            for(let pas = 0; pas < barsData.length; pas++){         
            if(item == barsData[pas].ge.toUpperCase()) return [true, barsData[pas].id, barsData[pas].cost, barsData[pas].name, "Bars", "Common", barsData[pas].ge.toUpperCase(), "Bars"]      
            }
            for(let pas = 0; pas < totemData.length; pas++){         
            if(item == totemData[pas].ge.toUpperCase()) return [true, totemData[pas].id, totemData[pas].cost, totemData[pas].name, "Totems", "Common", totemData[pas].ge.toUpperCase(), "Totems"]      
            }
            for(let pas = 0; pas < seedData.length; pas++){         
                if(item == seedData[pas].ge.toUpperCase()) return [true, seedData[pas].id, seedData[pas].cost, seedData[pas].name, "Seeds", "Common", seedData[pas].ge.toUpperCase(), "Seeds"]      
            }
            for(let pas = 0; pas < cropData.length; pas++){         
                if(item == cropData[pas].ge.toUpperCase()) return [true, cropData[pas].id, cropData[pas].cost, cropData[pas].name, "Crops", "Common", cropData[pas].ge.toUpperCase(), "Crops"]      
            }
            for(let pas = 0; pas < potionData.length; pas++){         
                if(item == potionData[pas].ge.toUpperCase()) return [true, potionData[pas].id, potionData[pas].cost, potionData[pas].name, "Potions", "Common", potionData[pas].ge.toUpperCase(), "Potions"]      
            }


            return [false, -1, 0, 'undefined', 'undefined', 'undefined']
        };
        let balance = await Balance.findOne({ userId: sellerId });
        if (!balance) return message.reply(`${EMOJICONFIG.no} you are not a player ! : ${inlineCode('@FlipMMO start')}`);
        else {

        if(itemExist(item)[0]){

            function ifItemInInventory(item){
                for(const itemPlayerAll of playerStats.player.stuff.stuffUnlock){
                    var itemPlayer = itemPlayerAll.id
                    var itemPlayerExist = itemExist(item)[1]
                    if(itemPlayer == itemPlayerExist) return [true, itemPlayer]
                }
                for(const itemPlayerAll of playerStats.player.stuff.fish){
                    var itemPlayer = itemPlayerAll.id
                    var itemPlayerExist = itemExist(item)[1]

                    if(itemPlayer == itemPlayerExist) return [true, itemPlayer]
                }
                for(const itemPlayerAll of playerStats.player.stuff.food){
                    var itemPlayer = itemPlayerAll.id
                    var itemPlayerExist = itemExist(item)[1]

                    if(itemPlayer == itemPlayerExist) return [true, itemPlayer]
                }
                for(const itemPlayerAll of playerStats.player.stuff.logs){
                    var itemPlayer = itemPlayerAll.id
                    var itemPlayerExist = itemExist(item)[1]

                    if(itemPlayer == itemPlayerExist) return [true, itemPlayer]
                }
                for(const itemPlayerAll of playerStats.player.stuff.ore){
                    var itemPlayer = itemPlayerAll.id
                    var itemPlayerExist = itemExist(item)[1]

                    if(itemPlayer == itemPlayerExist) return [true, itemPlayer]
                }
                for(const itemPlayerAll of playerStats.player.stuff.bars){
                    var itemPlayer = itemPlayerAll.id
                    var itemPlayerExist = itemExist(item)[1]

                    if(itemPlayer == itemPlayerExist) return [true, itemPlayer]
                }
                for(const itemPlayerAll of playerStats.player.stuff.gem){
                    var itemPlayer = itemPlayerAll.id
                    var itemPlayerExist = itemExist(item)[1]

                    if(itemPlayer == itemPlayerExist) return [true, itemPlayer]
                }


                return [false, -1]
            };

        // Check if the player has the item and enough quantity to sell
        const iteminf = ifItemInInventory(item);
            if (!iteminf[0]) {
            return message.reply(`${EMOJICONFIG.no} You don't have this item!`);
}

// Find the item in the player's inventory
if (itemExist(item)[7] === "Item"){
    const indexx = playerStats.player.stuff.stuffUnlock.findIndex(item => item.id === iteminf[1]);
    if (indexx === -1 || playerStats.player.stuff.stuffUnlock[indexx].amount < amountToSell) {
        return message.reply(`${EMOJICONFIG.no} You don't have enough of this item to sell!`); } 
}
else if (itemExist(item)[4] === "Fish") {
    const indexx = playerStats.player.stuff.fish.findIndex(fishItem => fishItem.id === iteminf[1]);
 if (indexx === -1 || playerStats.player.stuff.fish[indexx].amount < amountToSell) {
        return message.reply(`${EMOJICONFIG.no} You don't have enough of this fish to sell!`); }
}
 else if (itemExist(item)[4] === "Food") {
    const indexx = playerStats.player.stuff.food.findIndex(foodItem => foodItem.id === iteminf[1]);
    if (indexx === -1 || playerStats.player.stuff.food[indexx].amount < amountToSell) {
        return message.reply(`${EMOJICONFIG.no} You don't have enough of this food to sell!`); }
}
else if (itemExist(item)[4] === "Logs") {
    const indexx = playerStats.player.stuff.logs.findIndex(logItem => logItem.id === iteminf[1]);
    if (indexx === -1 || playerStats.player.stuff.logs[indexx].amount < amountToSell) {
        return message.reply(`${EMOJICONFIG.no} You don't have enough of this log to sell!`); }
}
else if (itemExist(item)[4] === "Ore") {
    const indexx = playerStats.player.stuff.ore.findIndex(oreItem => oreItem.id === iteminf[1]);
    if (indexx === -1 || playerStats.player.stuff.ore[indexx].amount < amountToSell) {
        return message.reply(`${EMOJICONFIG.no} You don't have enough of this ore to sell!`); }
}
else if (itemExist(item)[4] === "Bars") {
    const indexx = playerStats.player.stuff.bars.findIndex(barsItem => barsItem.id === iteminf[1]);
    if (indexx === -1 || playerStats.player.stuff.bars[indexx].amount < amountToSell) {
        return message.reply(`${EMOJICONFIG.no} You don't have enough of this bar to sell!`); }
}
else if (itemExist(item)[4] === "Totems") {
    const indexx = playerStats.player.stuff.gem.findIndex(totemItem => totemItem.id === iteminf[1]);
    if (indexx === -1 || playerStats.player.stuff.gem[indexx].amount < amountToSell) {
        return message.reply(`${EMOJICONFIG.no} You don't have enough of this totem to sell!`); }
}
else if (itemExist(item)[4] === "Seeds") {
    const indexx = playerStats.player.stuff.seeds.findIndex(seedItem => seedItem.id === iteminf[1]);
    if (indexx === -1 || playerStats.player.stuff.seeds[indexx].amount < amountToSell) {
        return message.reply(`${EMOJICONFIG.no} You don't have enough of this seed to sell!`); }
}
else if (itemExist(item)[4] === "Crops") {
    const indexx = playerStats.player.stuff.crops.findIndex(cropItem => cropItem.id === iteminf[1]);
    if (indexx === -1 || playerStats.player.stuff.crops[indexx].amount < amountToSell) {
        return message.reply(`${EMOJICONFIG.no} You don't have enough of this crop to sell!`); }
}
else if (itemExist(item)[4] === "Potions") {
    const indexx = playerStats.player.stuff.potions.findIndex(potionItem => potionItem.id === iteminf[1]);
    if (indexx === -1 || playerStats.player.stuff.potions[indexx].amount < amountToSell) {
        return message.reply(`${EMOJICONFIG.no} You don't have enough of this potion to sell!`); }
}


        //else {

                var itemName = itemExist(item)[3];
                var itemId = itemExist(item)[1]
                var itemInfo = ifItemInInventory(item);
                var taxper = Math.floor((price * 5)/100);
                var tax = taxper * amountToSell;
                var itemType = itemExist(item)[4];
                var itemType2 = itemExist(item)[7];
                var index, itemm;
                if (itemType === 'Fish') {
                    var index = playerStats.player.stuff.fish.findIndex(fishItem => fishItem.id === Number(itemInfo[1]));
                    var itemm = playerStats.player.stuff.fish.find(fishItem => fishItem.id === Number(itemInfo[1]));
                    var pstat = playerStats.player.stuff.fish[index];
                }
                else if (itemType === 'Food') {
                    var index = playerStats.player.stuff.food.findIndex(foodItem => foodItem.id === Number(itemInfo[1]));
                    var itemm = playerStats.player.stuff.food.find(foodItem => foodItem.id === Number(itemInfo[1]));;
                    var pstat = playerStats.player.stuff.food[index];
                } 
                else if (itemType2 === 'Item') {
                    var index = playerStats.player.stuff.stuffUnlock.findIndex(item => item.id === itemInfo[1]);
                    var itemm = playerStats.player.stuff.stuffUnlock.find(item => item.id === itemInfo[1]);
                    var pstat = playerStats.player.stuff.stuffUnlock[index];
                }
                if (itemType === 'Logs') {
                    var index = playerStats.player.stuff.logs.findIndex(logItem => logItem.id === Number(itemInfo[1]));
                    var itemm = playerStats.player.stuff.logs.find(logItem => logItem.id === Number(itemInfo[1]));
                    var pstat = playerStats.player.stuff.logs[index];
                }
                if (itemType === 'Ore') {
                    var index = playerStats.player.stuff.ore.findIndex(oreItem => oreItem.id === Number(itemInfo[1]));
                    var itemm = playerStats.player.stuff.ore.find(oreItem => oreItem.id === Number(itemInfo[1]));
                    var pstat = playerStats.player.stuff.ore[index];
                }
                if (itemType === 'Bars') {
                    var index = playerStats.player.stuff.bars.findIndex(barsItem => barsItem.id === Number(itemInfo[1]));
                    var itemm = playerStats.player.stuff.bars.find(barsItem => barsItem.id === Number(itemInfo[1]));
                    var pstat = playerStats.player.stuff.bars[index];
                }
                if (itemType === 'Totems') {
                    var index = playerStats.player.stuff.gem.findIndex(totemItem => totemItem.id === Number(itemInfo[1]));
                    var itemm = playerStats.player.stuff.gem.find(totemItem => totemItem.id === Number(itemInfo[1]));
                    var pstat = playerStats.player.stuff.gem[index];
                }
                if (itemType === 'Seeds') {
                    var index = playerStats.player.stuff.seeds.findIndex(seedItem => seedItem.id === Number(itemInfo[1]));
                    var itemm = playerStats.player.stuff.seeds.find(seedItem => seedItem.id === Number(itemInfo[1]));
                    var pstat = playerStats.player.stuff.seeds[index];
                }
                if (itemType === 'Crops') {
                    var index = playerStats.player.stuff.crops.findIndex(cropItem => cropItem.id === Number(itemInfo[1]));
                    var itemm = playerStats.player.stuff.crops.find(cropItem => cropItem.id === Number(itemInfo[1]));
                    var pstat = playerStats.player.stuff.crops[index];
                }
                if (itemType === 'Potions') {
                    var index = playerStats.player.stuff.potions.findIndex(potionItem => potionItem.id === Number(itemInfo[1]));
                    var itemm = playerStats.player.stuff.potions.find(potionItem => potionItem.id === Number(itemInfo[1]));
                    var pstat = playerStats.player.stuff.potions[index];
                }

                if (index === -1) {
                    return message.reply(`${EMOJICONFIG.no} You don't have this item in your inventory.`);
                }

                if (pstat.amount < amountToSell) {
                    return message.reply(`${EMOJICONFIG.no} You don't have enough of this item to sell the specified amount.`);
                }


                
                const IDITEM = itemExist(item)[1]

                const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('yes')
                        .setLabel('SELL')
                        .setEmoji(`${EMOJICONFIG.yes}`)
                        .setStyle(ButtonStyle.Success),
                    
                    new ButtonBuilder()
                        .setCustomId('no')
                        .setLabel('STOP THE SALE')
                        .setEmoji(`${EMOJICONFIG.no}`)
                        .setStyle(ButtonStyle.Danger),
                );
        
                const embedMessage = new EmbedBuilder()
                    .setColor('#0099ff')
                    .setTitle(`${EMOJICONFIG.coinchest} Listing ${itemName}`)
                    .setDescription(`${EMOJICONFIG.scroll4} List ${amountToSell}x  ${itemName} for : ${inlineCode(price)} ${EMOJICONFIG.coin}\n${EMOJICONFIG.coin} Tax (5%) : ${inlineCode(tax)}`)
                    .addFields(
                        { name: `**${EMOJICONFIG.paper} ${itemName} STATS :**\n`, value: `${EMOJICONFIG.coinchest} Cost: ${inlineCode(price)} ${EMOJICONFIG.coin}\n${EMOJICONFIG.paper} Item category : ${itemExist(item)[4]}\n${EMOJICONFIG.orb} Rarity of the item: : ${itemExist(item)[5]}`, inline: true},
                    )
                    .setTimestamp()

                const msg = await message.reply({ embeds: [embedMessage], components: [row] });
                
                const collector = msg.createMessageComponentCollector({
                    componentType: ComponentType.Button,
                    max: 1,
                    time: 180_000
                });
                
                collector.on('collect', async interaction => {
                    if (interaction.customId == 'yes') {


                        let existingListing = await Marketplace.findOne({
                            sellerId: sellerId,
                            itemName: itemName,
                            price: price
                        });
                    
                        if (existingListing) {
                            if (itemExist(item)[4] === "Fish") {
                                existingListing.amount += amountToSell;
                                itemm.amount -= amountToSell; 
                            if (playerStats.player.stuff.fish[index].amount <= 0) {
                                playerStats.player.stuff.fish.splice(index, 1);  
                            }     
                            await existingListing.save();  
                            await playerStats.save()        
                            return message.reply(`The amount for your existing listing of ${itemName} has been updated to ${existingListing.amount}.`);
                            }
                            else if (itemExist(item)[4] === "Food") {
                                existingListing.amount += amountToSell;
                                itemm.amount -= amountToSell; 
                            if (playerStats.player.stuff.food[index].amount <= 0) {
                                playerStats.player.stuff.food.splice(index, 1);  
                            }     
                            await existingListing.save();  
                            await playerStats.save();
                                
                            return message.reply(`The amount for your existing listing of ${itemName} has been updated to ${existingListing.amount}.`);
                        } 
                        else if (itemExist(item)[4] === "Logs") {
                            existingListing.amount += amountToSell;
                            itemm.amount -= amountToSell; 
                        if (playerStats.player.stuff.logs[index].amount <= 0) {
                            playerStats.player.stuff.logs.splice(index, 1);  
                        }     
                        await existingListing.save();  
                        await playerStats.save();
                            
                        return message.reply(`The amount for your existing listing of ${itemName} has been updated to ${existingListing.amount}.`);
                        } 
                        else if (itemExist(item)[4] === "Ore") {
                            existingListing.amount += amountToSell;
                            itemm.amount -= amountToSell; 
                            if (playerStats.player.stuff.ore[index].amount <= 0) {
                            playerStats.player.stuff.ore.splice(index, 1);  
                        }     
                        await existingListing.save();  
                        await playerStats.save();
                        
                        return message.reply(`The amount for your existing listing of ${itemName} has been updated to ${existingListing.amount}.`);
                        }
                        else if (itemExist(item)[4] === "Bars") {
                            existingListing.amount += amountToSell;
                            itemm.amount -= amountToSell; 
                            if (playerStats.player.stuff.bars[index].amount <= 0) {
                            playerStats.player.stuff.bars.splice(index, 1);  
                        }     
                        await existingListing.save();  
                        await playerStats.save();
                        
                        return message.reply(`The amount for your existing listing of ${itemName} has been updated to ${existingListing.amount}.`);
                        }
                        else if (itemExist(item)[4] === "Totems") {
                            existingListing.amount += amountToSell;
                            itemm.amount -= amountToSell; 
                            if (playerStats.player.stuff.gem[index].amount <= 0) {
                            playerStats.player.stuff.gem.splice(index, 1);  
                        }     
                        await existingListing.save();  
                        await playerStats.save();
                        
                        return message.reply(`The amount for your existing listing of ${itemName} has been updated to ${existingListing.amount}.`);
                        } 
                        else if (itemExist(item)[4] === "Seeds") {
                            existingListing.amount += amountToSell;
                            itemm.amount -= amountToSell; 
                            if (playerStats.player.stuff.seeds[index].amount <= 0) {
                            playerStats.player.stuff.seeds.splice(index, 1);  
                        }     
                        await existingListing.save();  
                        await playerStats.save();
                        
                        return message.reply(`The amount for your existing listing of ${itemName} has been updated to ${existingListing.amount}.`);
                        } 
                        else if (itemExist(item)[4] === "Crops") {
                            existingListing.amount += amountToSell;
                            itemm.amount -= amountToSell; 
                            if (playerStats.player.stuff.crops[index].amount <= 0) {
                            playerStats.player.stuff.crops.splice(index, 1);  
                        }     
                        await existingListing.save();  
                        await playerStats.save();
                        
                        return message.reply(`The amount for your existing listing of ${itemName} has been updated to ${existingListing.amount}.`);
                        } 
                        else if (itemExist(item)[4] === "Potions") {
                            existingListing.amount += amountToSell;
                            itemm.amount -= amountToSell; 
                            if (playerStats.player.stuff.potions[index].amount <= 0) {
                            playerStats.player.stuff.potions.splice(index, 1);  
                        }     
                        await existingListing.save();  
                        await playerStats.save();
                        
                        return message.reply(`The amount for your existing listing of ${itemName} has been updated to ${existingListing.amount}.`);
                        } 

 
 


                            else if (itemExist(item)[7]) {
                                existingListing.amount += amountToSell;    
                                itemm.amount -= amountToSell; 
                            if (playerStats.player.stuff.stuffUnlock[index].amount <= 0) {
                                    playerStats.player.stuff.stuffUnlock.splice(index, 1);  
                                }    
                            await existingListing.save();  
                            await playerStats.save()        
                            return message.reply(`The amount for your existing listing of ${itemName} has been updated to ${existingListing.amount}.`);
                        }  } 
                        
                        
                        else {
                            itemm.amount -= amountToSell;

                            if (itemExist(item)[7] === "Item") {
                            if (playerStats.player.stuff.stuffUnlock[index].amount <= 0) {
                                playerStats.player.stuff.stuffUnlock.splice(index, 1);
                                await playerStats.save();
                            } 
                        }
                            else if (itemExist(item)[4] === "Fish") {
                             if (playerStats.player.stuff.fish[index].amount <= 0) {
                                playerStats.player.stuff.fish.splice(index, 1);
                                await playerStats.save();
                            } }
                            else if (itemExist(item)[4] === "Food") {
                            if (playerStats.player.stuff.food[index].amount <= 0) {
                                playerStats.player.stuff.food.splice(index, 1);
                                await playerStats.save();
                            } }
                            else if (itemExist(item)[4] === "Logs") {
                                if (playerStats.player.stuff.logs[index].amount <= 0) {
                                   playerStats.player.stuff.logs.splice(index, 1);
                                   await playerStats.save();
                               } }
                            else if (itemExist(item)[4] === "Ore") {
                                if (playerStats.player.stuff.ore[index].amount <= 0) {
                                   playerStats.player.stuff.ore.splice(index, 1);
                                   await playerStats.save();
                               } }
                            else if (itemExist(item)[4] === "Bars") {
                                if (playerStats.player.stuff.bars[index].amount <= 0) {
                                   playerStats.player.stuff.bars.splice(index, 1);
                                   await playerStats.save();
                               } }
                            else if (itemExist(item)[4] === "Totems") {
                                if (playerStats.player.stuff.gem[index].amount <= 0) {
                                   playerStats.player.stuff.gem.splice(index, 1);
                                   await playerStats.save();
                               } }
                            else if (itemExist(item)[4] === "Seeds") {
                                if (playerStats.player.stuff.seeds[index].amount <= 0) {
                                    playerStats.player.stuff.seeds.splice(index, 1);
                                    await playerStats.save();
                                } }
                            else if (itemExist(item)[4] === "Crops") {
                                if (playerStats.player.stuff.crops[index].amount <= 0) {
                                   playerStats.player.stuff.crops.splice(index, 1);
                                   await playerStats.save();
                               } }
                               else if (itemExist(item)[4] === "Potions") {
                                if (playerStats.player.stuff.potions[index].amount <= 0) {
                                   playerStats.player.stuff.potions.splice(index, 1);
                                   await playerStats.save();
                               } }


        
                        
                        await playerStats.save();
                        const listing = new Marketplace({
                            sellerId: sellerId,
                            itemName: itemName,
                            price: price,
                            id: sellerId + itemName,
                            itemEa: itemExist(item)[6],
                            sellerName: sellerName,
                            amount: amountToSell,
                            itemId: itemId,
                            type: itemExist(item)[7]
                        });
                        await listing.save();
                    }
        





                        
                        balance.eco.coins -= tax
                        balance.save();
                        
                        
                        itemInfo -= amountToSell;
                        



                    // == Log : ==
                    const logChannel = client.channels.cache.get('1169491579774443660');
                    var now = new Date();
                    var date = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
                    var messageEmbed = new EmbedBuilder()
                    .setColor('#6d4534')
                    .setTitle(`Log ${date}`)
                    .setDescription(`${EMOJICONFIG.coinchest} ${inlineCode(sellerName)} Listed: ${amountToSell}x ${itemExist(item)[3]} for ${inlineCode(price)} ${EMOJICONFIG.coin} each on the GE!`);
                    logChannel.send({embeds: [messageEmbed], ephemeral: true });
                                                            
                    var itemEmbed = new EmbedBuilder()
                    .setColor('#6d4534')
                    .setTitle(`${EMOJICONFIG.coinchest} ${sellerName}'s New Listing`)
                    .setDescription(`${EMOJICONFIG.yes} **Listing made!**\n${EMOJICONFIG.paper} **NEW LISTING** : **${amountToSell}x ${inlineCode(itemExist(item)[3])} for ${inlineCode(price)} ${EMOJICONFIG.coin} each on the GE!** `)
                    .setTimestamp()
                    await interaction.reply({embeds: [itemEmbed], ephemeral: true});
                            

                    };
                    if(interaction.customId === 'no') await interaction.reply({content: `${EMOJICONFIG.no} Listing cancelled...`, ephemeral: true});
                });
            
       // } 
    }
             
         else return message.reply(`${EMOJICONFIG.no} this item does not exist...`); 
        
  }  }; };
    },
        info: {
            names: ['sell', 'itemlist', 'listitem', 'sellitem', 's'],
        } }