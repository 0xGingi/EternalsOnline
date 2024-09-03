const Discord = require('discord.js');
const Marketplace = require('../../modules/marketplace.js');
const Player = require('../../modules/player.js');
const Balance = require('../../modules/economie.js');
const STATS = require('../../modules/statsBot.js');
const CONFIGITEM = require('../../config/stuff.json')
const { bold, inlineCode, codeBlock } = require('@discordjs/builders');
const EMOJICONFIG = require('../../config/emoji.json');
const { prefix } = require('../../App/config.json')
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, Events, ButtonStyle, ComponentType } = require('discord.js');
const { client, mongoose } = require('../../App/index.js');
const fishData = require('../../config/fish.json');
const cookData = require('../../config/cook.json');
const logData = require('../../config/woodcut.json');
const mineData = require('../../config/mine.json');
const barsData = require('../../config/smelt.json');
const totemData = require('../../config/craft.json');
const seedData = require('../../config/seeds.json');
const cropData = require('../../config/crops.json');
const potionData = require('../../config/potions.json');
//const mongoose = require('../../App/index.js');

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
         
    const listingId = args[0].toUpperCase();
    const price = args[1];
    const amountToBuy = args[2] ? parseInt(args[2], 10) : 1; // Default to 1 if not specified
        if (isNaN(amountToBuy) || amountToBuy <= 0) {
            return message.reply(`${EMOJICONFIG.no} Error: Invalid amount specified.`);
        }
        if (price <= 0) {  
            return message.reply(`${EMOJICONFIG.no} Error: Invalid price specified.`);
        }
    const user = message.author;
    const seller = await Player.findOne({ userId: listingId.sellerId })
    let buyer = await Player.findOne({ userId: user.id });
    if (buyer.player.other.ironman === true) return message.reply(`${EMOJICONFIG.no} You are an ironman, you can't buy items from other players!`);

    if (!buyer) return message.reply(`${EMOJICONFIG.no} you are not a player ! : ${inlineCode('@Eternals start')}`);
    else {
        function itemExist(listingId){
           // listingId = listingId.toLowerCase();
            for(let pas = 0; pas < CONFIGITEM.length; pas++){
                for(const alias of CONFIGITEM[pas].alias){
                    if(listingId == alias) return [true, CONFIGITEM[pas].id, CONFIGITEM[pas].cost, CONFIGITEM[pas].name, CONFIGITEM[pas].categorie, CONFIGITEM[pas].rarety, "Item"]
                }
            }
            for(let pas = 0; pas < fishData.length; pas++){              
                if(listingId == fishData[pas].ge.toUpperCase()) return [true, fishData[pas].id, fishData[pas].cost, fishData[pas].name, "Fish", "Common", "Fish"]
            
        }
            for(let pas = 0; pas < cookData.length; pas++){         
                if(listingId == cookData[pas].ge.toUpperCase()) return [true, cookData[pas].id, cookData[pas].cost, cookData[pas].name, "Food", "Common", "Food"]      
        }
            for(let pas = 0; pas < logData.length; pas++){         
                if(listingId == logData[pas].ge.toUpperCase()) return [true, logData[pas].id, logData[pas].cost, logData[pas].name, "Logs", "Common", "Logs"]      
        }
            for(let pas = 0; pas < mineData.length; pas++){         
                if(listingId == mineData[pas].ge.toUpperCase()) return [true, mineData[pas].id, mineData[pas].cost, mineData[pas].name, "Ore", "Common", "Ore"]      
        }
            for(let pas = 0; pas < barsData.length; pas++){         
                if(listingId == barsData[pas].ge.toUpperCase()) return [true, barsData[pas].id, barsData[pas].cost, barsData[pas].name, "Bars", "Common", "Bars"]      
        }
            for(let pas = 0; pas < totemData.length; pas++){  
                if(listingId == totemData[pas].ge.toUpperCase()) return [true, totemData[pas].id, totemData[pas].cost, totemData[pas].name, "Totems", "Common", "Totems"]      
        }       
            for(let pas = 0; pas < seedData.length; pas++){  
                if(listingId == seedData[pas].ge.toUpperCase()) return [true, seedData[pas].id, seedData[pas].cost, seedData[pas].name, "Seeds", "Common", "Seeds"]      
        }       
            for(let pas = 0; pas < cropData.length; pas++){  
                if(listingId == cropData[pas].ge.toUpperCase()) return [true, cropData[pas].id, cropData[pas].cost, cropData[pas].name, "Crops", "Common", "Crops"]      
        }       
             for(let pas = 0; pas < potionData.length; pas++){  
                if(listingId == potionData[pas].ge.toUpperCase()) return [true, potionData[pas].id, potionData[pas].cost, potionData[pas].name, "Potions", "Common", "Potions"]      
        }       

        




            return [false, -1, 0, 'undefined', 'undefined', 'undefined']
        };
        function returnStatsItem(listingId){
           // listingId = listingId.toLowerCase();
            for(let pas = 0; pas < CONFIGITEM.length; pas++){
                for(const alias of CONFIGITEM[pas].alias){
                    if(listingId == alias) return [true, CONFIGITEM[pas].name, CONFIGITEM[pas].categorie, CONFIGITEM[pas].rarety, CONFIGITEM[pas].levelAttack.level1, CONFIGITEM[pas].levelDefense.level1, CONFIGITEM[pas].levelDodge.level1, CONFIGITEM[pas].levelCrit.level1, CONFIGITEM[pas].levelPenetration.level1, CONFIGITEM[pas].levelLifeSteal.level1, CONFIGITEM[pas].levelHealth.level1, "Item"]
                }
            }
            for(let pas = 0; pas < fishData.length; pas++){              
                if(listingId == fishData[pas].ge.toUpperCase()) return [true, fishData[pas].name, "Fish", "Common", 0, 0, 0, 0, 0, 0, 0, "Fish"]
        }
            for(let pas = 0; pas < cookData.length; pas++){         
                if(listingId == cookData[pas].ge.toUpperCase()) return [true, cookData[pas].name, "Food", "Common", 0, 0, 0, 0, 0, 0, 0, "Food"]      
        }
            for(let pas = 0; pas < logData.length; pas++){         
                if(listingId == logData[pas].ge.toUpperCase()) return [true, logData[pas].name, "Logs", "Common", 0, 0, 0, 0, 0, 0, 0, "Logs"]      
        }
            for(let pas = 0; pas < mineData.length; pas++){         
                if(listingId == mineData[pas].ge.toUpperCase()) return [true, mineData[pas].name, "Ore", "Common", 0, 0, 0, 0, 0, 0, 0, "Ore"]      
        }
            for(let pas = 0; pas < barsData.length; pas++){         
                if(listingId == barsData[pas].ge.toUpperCase()) return [true, barsData[pas].name, "Bars", "Common", 0, 0, 0, 0, 0, 0, 0, "Bars"]      
        }
            for(let pas = 0; pas < totemData.length; pas++){         
                if(listingId == totemData[pas].ge.toUpperCase()) return [true, totemData[pas].name, "Totems", "Common", 0, 0, 0, 0, 0, 0, 0, "Totems"]      
        }
            for(let pas = 0; pas < seedData.length; pas++){         
                if(listingId == seedData[pas].ge.toUpperCase()) return [true, seedData[pas].name, "Seeds", "Common", 0, 0, 0, 0, 0, 0, 0, "Seeds"]      
        }
            for(let pas = 0; pas < cropData.length; pas++){         
                if(listingId == cropData[pas].ge.toUpperCase()) return [true, cropData[pas].name, "Crops", "Common", 0, 0, 0, 0, 0, 0, 0, "Crops"]      
        }
            for(let pas = 0; pas < potionData.length; pas++){         
                if(listingId == potionData[pas].ge.toUpperCase()) return [true, potionData[pas].name, "Potions", "Common", 0, 0, 0, 0, 0, 0, 0, "Potions"]      
        }


        };


        let balance = await Balance.findOne({ userId: user.id });
        if (!balance) return message.reply(`${EMOJICONFIG.no} you are not a player ! : ${inlineCode('@Eternals start')}`);
        else {

    // Retrieve the marketplace listing
    //console.log(`Listing ID: ${listingId}`);
    //console.log(`Price: ${price}`);
    const listing = await Marketplace.findOne({ itemEa: listingId, price: price });
    //console.log('Listing:', listing);

    if (!listing) {
        message.reply(`${EMOJICONFIG.no} Listing Not Found `);
        return;
    }

    if (listing.sellerId === user.id) {

        return message.reply(`${EMOJICONFIG.no} You cannot buy your own listing.`);
    
    }
    else{
    // Check if the buyer has enough coins
   // const buyer = await Player.findOne({ id: buyerId });
   const listingprice = listing.price * amountToBuy;
    if (balance.eco.coins < listingprice) return message.reply(`${EMOJICONFIG.no} You do not have enough coins to buy this item.`);
    if (listing.amount < amountToBuy) return message.reply(`${EMOJICONFIG.no} The seller does not have enough of this item in stock.`);

            else {
                const listingprice = listing.price * amountToBuy;
                // [========== Button Buy Item ==========]
                const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('yes')
                        .setLabel(`BUY`)
                        .setEmoji(`${EMOJICONFIG.yes}`)
                        .setStyle(ButtonStyle.Success),
                    
                    new ButtonBuilder()
                        .setCustomId('no')
                        .setLabel(`CANCEL`)
                        .setEmoji(`${EMOJICONFIG.no}`)
                        .setStyle(ButtonStyle.Danger),
                );
                
                const buyItemEmbed = new EmbedBuilder()
                    .setColor('#4dca4d')
                    .setTitle(`${EMOJICONFIG.coinchest} Grand Exchange`)
                    .setDescription(`${EMOJICONFIG.scroll4} **ITEM(S) :${inlineCode(amountToBuy)}x ${inlineCode(listing.itemName)}\n${EMOJICONFIG.coinchest} Price : ${inlineCode(listingprice)}\n${EMOJICONFIG.coin}Category : ${inlineCode(returnStatsItem(listingId)[2])}\n${EMOJICONFIG.paper} Rarity : ${inlineCode(returnStatsItem(listingId)[3])}**\n\n**${EMOJICONFIG.paper} Stats :**\n${EMOJICONFIG.attack} : ${returnStatsItem(listingId)[4]}\n${EMOJICONFIG.shield2} : ${returnStatsItem(listingId)[5]}\n${EMOJICONFIG.heart} : ${returnStatsItem(listingId)[10]}`)
                    .setTimestamp();
                const msg = await message.reply({ embeds: [buyItemEmbed], components: [row] });
                        // ========== Filter & Collector ==========
                        const collector = msg.createMessageComponentCollector({
                            componentType: ComponentType.Button,
                            max: 1,
                            time: 70_000
                        });
                    
                        collector.on('collect', async interaction => {
                            let session;
                            let transactionCommitted = false;
                            if (interaction.customId == 'yes') {
                                try {
                                session = await mongoose.startSession();
                                session.startTransaction();
                                const listing = await Marketplace.findOne({ itemEa: listingId, price: price });
                                const listingprice = listing.price * amountToBuy;
                                balance.eco.coins -= listingprice
                                if(balance.eco.coins <= 0) balance.eco.coins = 0
                                await balance.save()
                                let sellerbalance = await Balance.findOne({ userId: listing.sellerId });
                                sellerbalance.eco.coins += listingprice
                                await sellerbalance.save()
                                
                                if (listing.amount > amountToBuy) {
                                    listing.amount -= amountToBuy;
                                    await listing.save();
                                } else if (listing.amount === amountToBuy) {
                                await Marketplace.deleteOne({ id: listing.id }); 
                                }

                                if (itemExist(listingId)[6] === "Item") {
                                var itemInInventory = buyer.player.stuff.stuffUnlock.find(item => item.id === itemExist(listingId)[1]);
                                }
                                else if (itemExist(listingId)[6] === "Fish") {
                                var itemInInventory = buyer.player.stuff.fish.find(item => item.id === itemExist(listingId)[1]);
                                }
                                else if (itemExist(listingId)[6] === "Food") {
                                var itemInInventory = buyer.player.stuff.food.find(item => item.id === itemExist(listingId)[1]);
                                 }
                                else if (itemExist(listingId)[6] === "Logs") {
                                var itemInInventory = buyer.player.stuff.logs.find(item => item.id === itemExist(listingId)[1]);
                                 }
                                else if (itemExist(listingId)[6] === "Ore") {
                                var itemInInventory = buyer.player.stuff.ore.find(item => item.id === itemExist(listingId)[1]);
                                 }
                                else if (itemExist(listingId)[6] === "Bars") {
                                var itemInInventory = buyer.player.stuff.bars.find(item => item.id === itemExist(listingId)[1]);
                                 }
                                else if (itemExist(listingId)[6] === "Totems") {
                                var itemInInventory = buyer.player.stuff.gem.find(item => item.id === itemExist(listingId)[1]);
                                }
                                else if (itemExist(listingId)[6] === "Seeds") {
                                var itemInInventory = buyer.player.stuff.seeds.find(item => item.id === itemExist(listingId)[1]);
                                }
                                else if (itemExist(listingId)[6] === "Crops") {
                                var itemInInventory = buyer.player.stuff.crops.find(item => item.id === itemExist(listingId)[1]);
                                }
                                else if (itemExist(listingId)[6] === "Potions") {
                                var itemInInventory = buyer.player.stuff.potions.find(item => item.id === itemExist(listingId)[1]);
                                }
    
    
    
    
    
    
        
                                if (itemInInventory) {
                                    itemInInventory.amount += amountToBuy; 
                                } else {
                                if (itemExist(listingId)[6] === "Item") {
                                buyer.player.stuff.stuffUnlock.push({id: itemExist(listingId)[1], name: itemExist(listingId)[3], level: 1, amount: amountToBuy})
                                }
                                else if (itemExist(listingId)[6] === "Fish") {
                                buyer.player.stuff.fish.push({id: itemExist(listingId)[1], name: itemExist(listingId)[3], amount: amountToBuy})
                                }
                                else if (itemExist(listingId)[6] === "Food") {
                                buyer.player.stuff.food.push({id: itemExist(listingId)[1], name: itemExist(listingId)[3], amount: amountToBuy})
                                }
                                else if (itemExist(listingId)[6] === "Logs") {
                                buyer.player.stuff.logs.push({id: itemExist(listingId)[1], name: itemExist(listingId)[3], amount: amountToBuy})
                                }
                                else if (itemExist(listingId)[6] === "Ore") {
                                buyer.player.stuff.ore.push({id: itemExist(listingId)[1], name: itemExist(listingId)[3], amount: amountToBuy})
                                }
                                else if (itemExist(listingId)[6] === "Bars") {
                                buyer.player.stuff.bars.push({id: itemExist(listingId)[1], name: itemExist(listingId)[3], amount: amountToBuy})
                                }
                                else if (itemExist(listingId)[6] === "Totems") {
                                buyer.player.stuff.gem.push({id: itemExist(listingId)[1], name: itemExist(listingId)[3], amount: amountToBuy})
                                }
                                else if (itemExist(listingId)[6] === "Seeds") {
                                buyer.player.stuff.seeds.push({id: itemExist(listingId)[1], name: itemExist(listingId)[3], amount: amountToBuy})
                                }
                                else if (itemExist(listingId)[6] === "Crops") {
                                buyer.player.stuff.crops.push({id: itemExist(listingId)[1], name: itemExist(listingId)[3], amount: amountToBuy})
                                }
                                else if (itemExist(listingId)[6] === "Potions") {
                                buyer.player.stuff.potions.push({id: itemExist(listingId)[1], name: itemExist(listingId)[3], amount: amountToBuy})
                                }
    
    
    
                            }
                                await buyer.save()
                                await session.commitTransaction();
                                transactionCommitted = true;

                                // == Log : ==
                                const logChannel = client.channels.cache.get('1169491579774443660');
                                var now = new Date();
                                var date = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
                                var messageEmbed = new EmbedBuilder()
                                .setColor('#6d4534')
                                .setTitle(`Log ${date}`)
                                .setDescription(`${EMOJICONFIG.coinchest} ${inlineCode(user.username)} bought the item(s) : ${amountToBuy}x ${itemExist(listingId)[3]} for ${inlineCode(listingprice)} ${EMOJICONFIG.coin} on the GE!`);
                                logChannel.send({embeds: [messageEmbed], ephemeral: true });
                                
                                var itemEmbed = new EmbedBuilder()
                                .setColor('#6d4534')
                                .setTitle(`${EMOJICONFIG.coinchest} ${user.username}'s New Item(s)`)
                                .setDescription(`${EMOJICONFIG.yes} **Purchase made!**\n${EMOJICONFIG.coinchest} **NEW ITEM(S)** : **${amountToBuy}x ${inlineCode(itemExist(listingId)[3])}**\n${EMOJICONFIG.paper} Don't forget to equip yourself with : ${inlineCode(`@Eternals equip ${listingId} <1/2/3/4/5>`)}`)
                                .setTimestamp()
                                if (interaction.message) {
                                    await interaction.reply({embeds: [itemEmbed], ephemeral: true});
                                } else {
                                    console.log('The original message no longer exists');
                                }

                        }     catch (error) {
                            // If anything goes wrong, abort the transaction
                            if (session && !transactionCommitted) await session.abortTransaction();
                            console.error('Something went wrong when buying an item:', error);
                        } finally {
                            // End the session
                            if (session) await session.endSession();
                        }
                                };
                                if(interaction.customId === 'no') await interaction.reply({content: `You canceled ${EMOJICONFIG.no}`, ephemeral: true});
                        
                
                            });
                        };
                                
                            }
    
} } };
},
info: {
    names: ['buy', 'buyitem', 'b'],
}
}