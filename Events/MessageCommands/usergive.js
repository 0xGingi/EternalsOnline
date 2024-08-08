const Discord = require('discord.js');
const PLAYERDATA = require('../../modules/player.js');
const BALANCEDATA = require('../../modules/economie.js');
const { inlineCode } = require('@discordjs/builders');
const { Message, Events } = require('discord.js');
const CONFIGITEM = require('../../config/stuff.json');
const fishData = require('../../config/fish.json');
const cookData = require('../../config/cook.json');
const logData = require('../../config/woodcut.json');
const oreData = require('../../config/mine.json');
const barsData = require('../../config/smelt.json');
const totemData = require('../../config/craft.json');
const EMOJICONFIG = require('../../config/emoji.json');
const { prefix } = require('../../App/config.json')
const seedData = require('../../config/seeds.json');
const cropData = require('../../config/crops.json');
const potionData = require('../../config/potions.json');
const {client} = require('../../App/index.js');

module.exports = {
    name: Events.MessageCreate,

    async execute(message) {
        if (message.mentions.users.first() !== client.user) return;
        const args = message.content.split(/ +/).slice(1);
        const commandName = args.shift().toLowerCase();
        if (this.info.names.some(name => commandName === name)) {

            const user = message.author;
            const item = args[1].toUpperCase();
            const recipient = Array.from(message.mentions.users.values())[1];
            const amount = parseInt(args[2]) || 1;
            if (amount < 1) return message.reply(`${EMOJICONFIG.no} Please specify a valid amount of items to give.`);

            if (!recipient) return message.reply(`${EMOJICONFIG.no} Please mention a user to give the item to.`);

            let giverStats = await PLAYERDATA.findOne({ userId: message.author.id });
            if (giverStats.player.other.ironman === true) return message.reply(`${EMOJICONFIG.no} You are an ironman, you can't give items to other players!`);
            let recipientStats = await PLAYERDATA.findOne({ userId: recipient.id });
            if (recipientStats.player.other.ironman === true) return message.reply(`${EMOJICONFIG.no} You can't give items to an ironman!`);
            let giverBal = await BALANCEDATA.findOne({userId: message.author.id});
            let recpBal = await BALANCEDATA.findOne({userId: recipient.id});

            if (!giverStats) return message.reply(`${EMOJICONFIG.no} You are not a player!`);
            if (!recipientStats) return message.reply(`${EMOJICONFIG.no} The recipient is not a player!`);


            function itemExist(item){
                for(let pas = 0; pas < CONFIGITEM.length; pas++){
                    for(const alias of CONFIGITEM[pas].alias){
                        if(item == alias) return [true, CONFIGITEM[pas].id, CONFIGITEM[pas].cost, CONFIGITEM[pas].name, CONFIGITEM[pas].categorie, CONFIGITEM[pas].rarety, CONFIGITEM[pas].equipalias, "Item"]
                    }
                }

                for(let pas = 0; pas < fishData.length; pas++){              
                    if(item == fishData[pas].ge) return [true, fishData[pas].id, fishData[pas].cost, fishData[pas].name, "Fish", "Common", fishData[pas].ge, "Fish"]  
            }
                for(let pas = 0; pas < cookData.length; pas++){         
                    if(item == cookData[pas].ge) return [true, cookData[pas].id, cookData[pas].cost, cookData[pas].name, "Food", "Common", cookData[pas].ge, "Food"]      
            }
                for(let pas = 0; pas < logData.length; pas++){         
                if(item == logData[pas].ge) return [true, logData[pas].id, logData[pas].cost, logData[pas].name, "Logs", "Common", logData[pas].ge, "Logs"]      
            }
                for(let pas = 0; pas < oreData.length; pas++){         
                if(item == oreData[pas].ge) return [true, oreData[pas].id, oreData[pas].cost, oreData[pas].name, "Ore", "Common", oreData[pas].ge, "Ore"]      
            }
                for(let pas = 0; pas < barsData.length; pas++){         
                if(item == barsData[pas].ge) return [true, barsData[pas].id, barsData[pas].cost, barsData[pas].name, "Bars", "Common", barsData[pas].ge, "Bars"]      
            }
                for(let pas = 0; pas < totemData.length; pas++){         
                if(item == totemData[pas].ge) return [true, totemData[pas].id, totemData[pas].cost, totemData[pas].name, "Totems", "Common", totemData[pas].ge, "Totems"]      
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
    
    

            if (item === 'coin' || item === 'coins' || item === 'COIN' || item === 'COINS') {
                
                if (isNaN(amount) || amount <= 0) return message.reply(`${EMOJICONFIG.no} Please specify a valid amount of coins to give.`);
                
                // Check if the giver has enough coins
                if (giverBal.eco.coins < amount) return message.reply(`${EMOJICONFIG.no} You do not have enough coins to give.`);
                
                // Transfer coins
                giverBal.eco.coins -= amount;
                recpBal.eco.coins += amount;

                // Save changes to the database
                await giverBal.save();
                await recpBal.save();

                // Send confirmation message
                return message.reply(`${EMOJICONFIG.yes} You gave ${inlineCode(amount.toString())} ${EMOJICONFIG.coin} to ${recipient}.`);
            }
            else {    
            if (itemExist(item)[0]){
                function ifItemInInventory(item){
                    for(const itemPlayerAll of giverStats.player.stuff.stuffUnlock){
                        var itemPlayer = itemPlayerAll.id
                        var itemPlayerExist = itemExist(item)[1]
                        if(itemPlayer == itemPlayerExist) return [true, itemPlayer]
                    }
                    for(const itemPlayerAll of giverStats.player.stuff.fish){
                        var itemPlayer = itemPlayerAll.id
                        var itemPlayerExist = itemExist(item)[1]
    
                        if(itemPlayer == itemPlayerExist) return [true, itemPlayer]
                    }
                    for(const itemPlayerAll of giverStats.player.stuff.food){
                        var itemPlayer = itemPlayerAll.id
                        var itemPlayerExist = itemExist(item)[1]
    
                        if(itemPlayer == itemPlayerExist) return [true, itemPlayer]
                    }
                    for(const itemPlayerAll of giverStats.player.stuff.logs){
                        var itemPlayer = itemPlayerAll.id
                        var itemPlayerExist = itemExist(item)[1]
    
                        if(itemPlayer == itemPlayerExist) return [true, itemPlayer]
                    }
                    for(const itemPlayerAll of giverStats.player.stuff.ore){
                        var itemPlayer = itemPlayerAll.id
                        var itemPlayerExist = itemExist(item)[1]
    
                        if(itemPlayer == itemPlayerExist) return [true, itemPlayer]
                    }
                    for(const itemPlayerAll of giverStats.player.stuff.bars){
                        var itemPlayer = itemPlayerAll.id
                        var itemPlayerExist = itemExist(item)[1]
    
                        if(itemPlayer == itemPlayerExist) return [true, itemPlayer]
                    }
                    for(const itemPlayerAll of giverStats.player.stuff.gem){
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
            else if (itemExist(item)[4] === "Fish") {
                const indexx = giverStats.player.stuff.fish.findIndex(fishItem => fishItem.id === iteminf[1]);
             if (indexx === -1 || giverStats.player.stuff.fish[indexx].amount < amount) {
                    return message.reply(`${EMOJICONFIG.no} You don't have enough of this fish to give!`); }
            }
             else if (itemExist(item)[4] === "Food") {
                const indexx = giverStats.player.stuff.food.findIndex(foodItem => foodItem.id === iteminf[1]);
                if (indexx === -1 || giverStats.player.stuff.food[indexx].amount < amount) {
                    return message.reply(`${EMOJICONFIG.no} You don't have enough of this food to give!`); }
            }
            else if (itemExist(item)[4] === "Logs") {
                const indexx = giverStats.player.stuff.logs.findIndex(logItem => logItem.id === iteminf[1]);
                if (indexx === -1 || giverStats.player.stuff.logs[indexx].amount < amount) {
                    return message.reply(`${EMOJICONFIG.no} You don't have enough of this log to give!`); }
            }
            else if (itemExist(item)[4] === "Ore") {
                const indexx = giverStats.player.stuff.ore.findIndex(oreItem => oreItem.id === iteminf[1]);
                if (indexx === -1 || giverStats.player.stuff.ore[indexx].amount < amount) {
                    return message.reply(`${EMOJICONFIG.no} You don't have enough of this ore to give!`); }
            }
            else if (itemExist(item)[4] === "Bars") {
                const indexx = giverStats.player.stuff.bars.findIndex(barsItem => barsItem.id === iteminf[1]);
                if (indexx === -1 || giverStats.player.stuff.bars[indexx].amount < amount) {
                    return message.reply(`${EMOJICONFIG.no} You don't have enough of this bar to give!`); }
            }
            else if (itemExist(item)[4] === "Totems") {
                const indexx = giverStats.player.stuff.gem.findIndex(totemItem => totemItem.id === iteminf[1]);
                if (indexx === -1 || giverStats.player.stuff.gem[indexx].amount < amount) {
                    return message.reply(`${EMOJICONFIG.no} You don't have enough of this bar to give!`); }
            }
            else if (itemExist(item)[4] === "Seeds") {
                const indexx = giverStats.player.stuff.seeds.findIndex(seedItem => seedItem.id === iteminf[1]);
                if (indexx === -1 || giverStats.player.stuff.seeds[indexx].amount < amount) {
                    return message.reply(`${EMOJICONFIG.no} You don't have enough of this seed to give!`); }
            }
            else if (itemExist(item)[4] === "Crops") {
                const indexx = giverStats.player.stuff.crops.findIndex(cropItem => cropItem.id === iteminf[1]);
                if (indexx === -1 || giverStats.player.stuff.crops[indexx].amount < amount) {
                    return message.reply(`${EMOJICONFIG.no} You don't have enough of this crop to give!`); }
            }
            else if (itemExist(item)[4] === "Potions") {
                const indexx = giverStats.player.stuff.potions.findIndex(potionItem => potionItem.id === iteminf[1]);
                if (indexx === -1 || giverStats.player.stuff.potions[indexx].amount < amount) {
                    return message.reply(`${EMOJICONFIG.no} You don't have enough of this potion to give!`); }
            }
            
            
            var itemName = itemExist(item)[3];
            var itemId = itemExist(item)[1]
            var itemInfo = ifItemInInventory(item);
            var itemType = itemExist(item)[4];
            var itemType2 = itemExist(item)[7];
            var index, itemm;
            
            if (itemType === 'Fish') {
                var index = giverStats.player.stuff.fish.findIndex(fishItem => fishItem.id === Number(itemInfo[1]));
                var itemm = giverStats.player.stuff.fish.find(fishItem => fishItem.id === Number(itemInfo[1]));
                var pstat = giverStats.player.stuff.fish[index];
                var index2 = recipientStats.player.stuff.fish.findIndex(fishItem2 => fishItem2.id === Number(itemInfo[1]));
                var itemm2 = recipientStats.player.stuff.fish.find(fishItem2 => fishItem2.id === Number(itemInfo[1]));
                var pstat2 = recipientStats.player.stuff.fish[index];

            }
            else if (itemType === 'Food') {
                var index = giverStats.player.stuff.food.findIndex(foodItem => foodItem.id === Number(itemInfo[1]));
                var itemm = giverStats.player.stuff.food.find(foodItem => foodItem.id === Number(itemInfo[1]));;
                var pstat = giverStats.player.stuff.food[index];                
                var index2 = recipientStats.player.stuff.food.findIndex(foodItem2 => foodItem2.id === Number(itemInfo[1]));
                var itemm2 = recipientStats.player.stuff.food.find(foodItem2 => foodItem2.id === Number(itemInfo[1]));;
                var pstat2 = recipientStats.player.stuff.food[index];

            } 
            else if (itemType2 === 'Item') {
                var index = giverStats.player.stuff.stuffUnlock.findIndex(item => item.id === itemInfo[1]);
                var itemm = giverStats.player.stuff.stuffUnlock.find(item => item.id === itemInfo[1]);
                var pstat = giverStats.player.stuff.stuffUnlock[index];
                var index2 = recipientStats.player.stuff.stuffUnlock.findIndex(item2 => item2.id === itemInfo[1]);
                var itemm2 = recipientStats.player.stuff.stuffUnlock.find(item2 => item2.id === itemInfo[1]);
                var pstat2 = recipientStats.player.stuff.stuffUnlock[index];

            }
            if (itemType === 'Logs') {
                var index = giverStats.player.stuff.logs.findIndex(logItem => logItem.id === Number(itemInfo[1]));
                var itemm = giverStats.player.stuff.logs.find(logItem => logItem.id === Number(itemInfo[1]));
                var pstat = giverStats.player.stuff.logs[index];
                var index2 = recipientStats.player.stuff.logs.findIndex(logItem2 => logItem2.id === Number(itemInfo[1]));
                var itemm2 = recipientStats.player.stuff.logs.find(logItem2 => logItem2.id === Number(itemInfo[1]));
                var pstat2 = recipientStats.player.stuff.logs[index];

            }
            if (itemType === 'Ore') {
                var index = giverStats.player.stuff.ore.findIndex(oreItem => oreItem.id === Number(itemInfo[1]));
                var itemm = giverStats.player.stuff.ore.find(oreItem => oreItem.id === Number(itemInfo[1]));
                var pstat = giverStats.player.stuff.ore[index];
                var index2 = recipientStats.player.stuff.ore.findIndex(oreItem2 => oreItem2.id === Number(itemInfo[1]));
                var itemm2 = recipientStats.player.stuff.ore.find(oreItem2 => oreItem2.id === Number(itemInfo[1]));
                var pstat2 = recipientStats.player.stuff.ore[index];

            }
            if (itemType === 'Bars') {
                var index = giverStats.player.stuff.bars.findIndex(barsItem => barsItem.id === Number(itemInfo[1]));
                var itemm = giverStats.player.stuff.bars.find(barsItem => barsItem.id === Number(itemInfo[1]));
                var pstat = giverStats.player.stuff.bars[index];
                var index2 = recipientStats.player.stuff.bars.findIndex(barsItem2 => barsItem2.id === Number(itemInfo[1]));
                var itemm2 = recipientStats.player.stuff.bars.find(barsItem2 => barsItem2.id === Number(itemInfo[1]));
                var pstat2 = recipientStats.player.stuff.bars[index];

            }
            if (itemType === 'Totems') {
                var index = giverStats.player.stuff.gem.findIndex(totemItem => totemItem.id === Number(itemInfo[1]));
                var itemm = giverStats.player.stuff.gem.find(totemItem => totemItem.id === Number(itemInfo[1]));
                var pstat = giverStats.player.stuff.gem[index];
                var index2 = recipientStats.player.stuff.gem.findIndex(totemItem2 => totemItem2.id === Number(itemInfo[1]));
                var itemm2 = recipientStats.player.stuff.gem.find(totemItem2 => totemItem2.id === Number(itemInfo[1]));
                var pstat2 = recipientStats.player.stuff.gem[index];

            }
            if (itemType === 'Seeds') {
                var index = giverStats.player.stuff.seeds.findIndex(seedItem => seedItem.id === Number(itemInfo[1]));
                var itemm = giverStats.player.stuff.seeds.find(seedItem => seedItem.id === Number(itemInfo[1]));
                var pstat = giverStats.player.stuff.seeds[index];
                var index2 = recipientStats.player.stuff.seeds.findIndex(seedItem2 => seedItem2.id === Number(itemInfo[1]));
                var itemm2 = recipientStats.player.stuff.seeds.find(seedItem2 => seedItem2.id === Number(itemInfo[1]));
            }
            if (itemType === 'Potions') {
                var index = giverStats.player.stuff.potions.findIndex(potionItem => potionItem.id === Number(itemInfo[1]));
                var itemm = giverStats.player.stuff.potions.find(potionItem => potionItem.id === Number(itemInfo[1]));
                var pstat = giverStats.player.stuff.potions[index];
                var index2 = recipientStats.player.stuff.potions.findIndex(potionItem => potionItem.id === Number(itemInfo[1]));
                var itemm2 = recipientStats.player.stuff.potions.find(potionItem => potionItem.id === Number(itemInfo[1]));
            }
            if (itemType === 'Crops') {
                var index = giverStats.player.stuff.crops.findIndex(cropItem => cropItem.id === Number(itemInfo[1]));
                var itemm = giverStats.player.stuff.crops.find(cropItem => cropItem.id === Number(itemInfo[1]));
                var pstat = giverStats.player.stuff.crops[index];
                var index2 = recipientStats.player.stuff.crops.findIndex(cropItem => cropItem.id === Number(itemInfo[1]));
                var itemm2 = recipientStats.player.stuff.crops.find(cropItem => cropItem.id === Number(itemInfo[1]));
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
                        recipientStats.player.stuff.stuffUnlock.push({id: itemExist(item)[1], name: itemExist(item)[3], level: 1, amount: amount});
                        await giverStats.save();
                        await recipientStats.save();
                        return message.reply(`you have given ${recipient} ${amount} x ${itemExist(item)[3]}`);    
                    }
                    else if (pstat.amount > amount){
                        //Giver will still amount of item left
                        itemm.amount -= amount;
                        recipientStats.player.stuff.stuffUnlock.push({id: itemExist(item)[1], name: itemExist(item)[3], level: 1, amount: amount});
                        await giverStats.save();
                        await recipientStats.save();
                        return message.reply(`you have given ${recipient} ${amount} x ${itemExist(item)[3]}`);    
                    }
                } else {
                    //Recp does have item
                    if (pstat.amount <= amount){
                        //Giver will have 0 of item, so splice it!
                        giverStats.player.stuff.stuffUnlock.splice(index, 1);
                        itemm2.amount += amount;
                        await giverStats.save();
                        await recipientStats.save();
                        return message.reply(`you have given ${recipient} ${amount} x ${itemExist(item)[3]}`);    
                    }
                    else if (pstat.amount > amount){
                        //Giver will still amount of item left
                        itemm.amount -= amount;
                        itemm2.amount += amount;
                        await giverStats.save();
                        await recipientStats.save();
                        return message.reply(`you have given ${recipient} ${amount} x ${itemExist(item)[3]}`);    
                    }


                }

            }

            //=========Fish
            if (itemExist(item)[7] === "Fish") {
                if (index2 === -1){
                    //Recp does not have item
                    if (pstat.amount <= amount){
                        //Giver will have 0 of item, so splice it!
                        giverStats.player.stuff.fish.splice(index, 1);
                        recipientStats.player.stuff.fish.push({id: itemExist(item)[1], name: itemExist(item)[3], amount: amount});
                        await giverStats.save();
                        await recipientStats.save();
                        return message.reply(`you have given ${recipient} ${amount} x ${itemExist(item)[3]}`);    
                    }
                    else if (pstat.amount > amount){
                        //Giver will still amount of item left
                        itemm.amount -= amount;
                        recipientStats.player.stuff.fish.push({id: itemExist(item)[1], name: itemExist(item)[3], amount: amount});
                        await giverStats.save();
                        await recipientStats.save();
                        return message.reply(`you have given ${recipient} ${amount} x ${itemExist(item)[3]}`);    
                    }
                } else {
                    //Recp does have item
                    if (pstat.amount <= amount){
                        //Giver will have 0 of item, so splice it!
                        giverStats.player.stuff.fish.splice(index, 1);
                        itemm2.amount += amount;
                        await giverStats.save();
                        await recipientStats.save();
                        return message.reply(`you have given ${recipient} ${amount} x ${itemExist(item)[3]}`);    
                    }
                    else if (pstat.amount > amount){
                        //Giver will still amount of item left
                        itemm.amount -= amount;
                        itemm2.amount += amount;
                        await giverStats.save();
                        await recipientStats.save();
                        return message.reply(`you have given ${recipient} ${amount} x ${itemExist(item)[3]}`);    
                    }


                }

            }


            //========Food
            if (itemExist(item)[7] === "Food") {
                if (index2 === -1){
                    //Recp does not have item
                    if (pstat.amount <= amount){
                        //Giver will have 0 of item, so splice it!
                        giverStats.player.stuff.food.splice(index, 1);
                        recipientStats.player.stuff.food.push({id: itemExist(item)[1], name: itemExist(item)[3], amount: amount});
                        await giverStats.save();
                        await recipientStats.save();
                        return message.reply(`you have given ${recipient} ${amount} x ${itemExist(item)[3]}`);    
                    }
                    else if (pstat.amount > amount){
                        //Giver will still amount of item left
                        itemm.amount -= amount;
                        recipientStats.player.stuff.food.push({id: itemExist(item)[1], name: itemExist(item)[3], amount: amount});
                        await giverStats.save();
                        await recipientStats.save();
                        return message.reply(`you have given ${recipient} ${amount} x ${itemExist(item)[3]}`);    
                    }
                } else {
                    //Recp does have item
                    if (pstat.amount <= amount){
                        //Giver will have 0 of item, so splice it!
                        giverStats.player.stuff.food.splice(index, 1);
                        itemm2.amount += amount;
                        await giverStats.save();
                        await recipientStats.save();
                        return message.reply(`you have given ${recipient} ${amount} x ${itemExist(item)[3]}`);    
                    }
                    else if (pstat.amount > amount){
                        //Giver will still amount of item left
                        itemm.amount -= amount;
                        itemm2.amount += amount;
                        await giverStats.save();
                        await recipientStats.save();
                        return message.reply(`you have given ${recipient} ${amount} x ${itemExist(item)[3]}`);    
                    }


                }

            }
            // ===== Logs
            if (itemExist(item)[7] === "Logs") {
                if (index2 === -1){
                    //Recp does not have item
                    if (pstat.amount <= amount){
                        //Giver will have 0 of item, so splice it!
                        giverStats.player.stuff.logs.splice(index, 1);
                        recipientStats.player.stuff.logs.push({id: itemExist(item)[1], name: itemExist(item)[3], amount: amount});
                        await giverStats.save();
                        await recipientStats.save();
                        return message.reply(`you have given ${recipient} ${amount} x ${itemExist(item)[3]}`);    
                    }
                    else if (pstat.amount > amount){
                        //Giver will still amount of item left
                        itemm.amount -= amount;
                        recipientStats.player.stuff.logs.push({id: itemExist(item)[1], name: itemExist(item)[3], amount: amount});
                        await giverStats.save();
                        await recipientStats.save();
                        return message.reply(`you have given ${recipient} ${amount} x ${itemExist(item)[3]}`);    
                    }
                } else {
                    //Recp does have item
                    if (pstat.amount <= amount){
                        //Giver will have 0 of item, so splice it!
                        giverStats.player.stuff.logs.splice(index, 1);
                        itemm2.amount += amount;
                        await giverStats.save();
                        await recipientStats.save();
                        return message.reply(`you have given ${recipient} ${amount} x ${itemExist(item)[3]}`);    
                    }
                    else if (pstat.amount > amount){
                        //Giver will still amount of item left
                        itemm.amount -= amount;
                        itemm2.amount += amount;
                        await giverStats.save();
                        await recipientStats.save();
                        return message.reply(`you have given ${recipient} ${amount} x ${itemExist(item)[3]}`);    
                    }


                }

            }
            ///=====Ore
            if (itemExist(item)[7] === "Ore") {
                if (index2 === -1){
                    //Recp does not have item
                    if (pstat.amount <= amount){
                        //Giver will have 0 of item, so splice it!
                        giverStats.player.stuff.ore.splice(index, 1);
                        recipientStats.player.stuff.ore.push({id: itemExist(item)[1], name: itemExist(item)[3], amount: amount});
                        await giverStats.save();
                        await recipientStats.save();
                        return message.reply(`you have given ${recipient} ${amount} x ${itemExist(item)[3]}`);    
                    }
                    else if (pstat.amount > amount){
                        //Giver will still amount of item left
                        itemm.amount -= amount;
                        recipientStats.player.stuff.ore.push({id: itemExist(item)[1], name: itemExist(item)[3], amount: amount});
                        await giverStats.save();
                        await recipientStats.save();
                        return message.reply(`you have given ${recipient} ${amount} x ${itemExist(item)[3]}`);    
                    }
                } else {
                    //Recp does have item
                    if (pstat.amount <= amount){
                        //Giver will have 0 of item, so splice it!
                        giverStats.player.stuff.ore.splice(index, 1);
                        itemm2.amount += amount;
                        await giverStats.save();
                        await recipientStats.save();
                        return message.reply(`you have given ${recipient} ${amount} x ${itemExist(item)[3]}`);    
                    }
                    else if (pstat.amount > amount){
                        //Giver will still amount of item left
                        itemm.amount -= amount;
                        itemm2.amount += amount;
                        await giverStats.save();
                        await recipientStats.save();
                        return message.reply(`you have given ${recipient} ${amount} x ${itemExist(item)[3]}`);    
                    }


                }

            }  

            //====Bars

            if (itemExist(item)[7] === "Bars") {
                if (index2 === -1){
                    //Recp does not have item
                    if (pstat.amount <= amount){
                        //Giver will have 0 of item, so splice it!
                        giverStats.player.stuff.bars.splice(index, 1);
                        recipientStats.player.stuff.bars.push({id: itemExist(item)[1], name: itemExist(item)[3], amount: amount});
                        await giverStats.save();
                        await recipientStats.save();
                        return message.reply(`you have given ${recipient} ${amount} x ${itemExist(item)[3]}`);    
                    }
                    else if (pstat.amount > amount){
                        //Giver will still amount of item left
                        itemm.amount -= amount;
                        recipientStats.player.stuff.bars.push({id: itemExist(item)[1], name: itemExist(item)[3], amount: amount});
                        await giverStats.save();
                        await recipientStats.save();
                        return message.reply(`you have given ${recipient} ${amount} x ${itemExist(item)[3]}`);    
                    }
                } else {
                    //Recp does have item
                    if (pstat.amount <= amount){
                        //Giver will have 0 of item, so splice it!
                        giverStats.player.stuff.bars.splice(index, 1);
                        itemm2.amount += amount;
                        await giverStats.save();
                        await recipientStats.save();
                        return message.reply(`you have given ${recipient} ${amount} x ${itemExist(item)[3]}`);    
                    }
                    else if (pstat.amount > amount){
                        //Giver will still amount of item left
                        itemm.amount -= amount;
                        itemm2.amount += amount;
                        await giverStats.save();
                        await recipientStats.save();
                        return message.reply(`you have given ${recipient} ${amount} x ${itemExist(item)[3]}`);    
                    }


                }

            }  

        //====Totems

        if (itemExist(item)[7] === "Totems") {
            if (index2 === -1){
                //Recp does not have item
                if (pstat.amount <= amount){
                    //Giver will have 0 of item, so splice it!
                    giverStats.player.stuff.gem.splice(index, 1);
                    recipientStats.player.stuff.gem.push({id: itemExist(item)[1], name: itemExist(item)[3], amount: amount});
                    await giverStats.save();
                    await recipientStats.save();
                    return message.reply(`you have given ${recipient} ${amount} x ${itemExist(item)[3]}`);    
                }
                else if (pstat.amount > amount){
                    //Giver will still amount of item left
                    itemm.amount -= amount;
                    recipientStats.player.stuff.gem.push({id: itemExist(item)[1], name: itemExist(item)[3], amount: amount});
                    await giverStats.save();
                    await recipientStats.save();
                    return message.reply(`you have given ${recipient} ${amount} x ${itemExist(item)[3]}`);    
                }
            } else {
                //Recp does have item
                if (pstat.amount <= amount){
                    //Giver will have 0 of item, so splice it!
                    giverStats.player.stuff.gem.splice(index, 1);
                    itemm2.amount += amount;
                    await giverStats.save();
                    await recipientStats.save();
                    return message.reply(`you have given ${recipient} ${amount} x ${itemExist(item)[3]}`);    
                }
                else if (pstat.amount > amount){
                    //Giver will still amount of item left
                    itemm.amount -= amount;
                    itemm2.amount += amount;
                    await giverStats.save();
                    await recipientStats.save();
                    return message.reply(`you have given ${recipient} ${amount} x ${itemExist(item)[3]}`);    
                }


            }

        }
        
        if (itemExist(item)[7] === "Seeds") {
            if (index2 === -1){
                //Recp does not have item
                if (pstat.amount <= amount){
                    //Giver will have 0 of item, so splice it!
                    giverStats.player.stuff.seeds.splice(index, 1);
                    recipientStats.player.stuff.seeds.push({id: itemExist(item)[1], name: itemExist(item)[3], amount: amount});
                    await giverStats.save();
                    await recipientStats.save();
                    return message.reply(`you have given ${recipient} ${amount} x ${itemExist(item)[3]}`);    
                }
                else if (pstat.amount > amount){
                    //Giver will still amount of item left
                    itemm.amount -= amount;
                    recipientStats.player.stuff.seeds.push({id: itemExist(item)[1], name: itemExist(item)[3], amount: amount});
                    await giverStats.save();
                    await recipientStats.save();
                    return message.reply(`you have given ${recipient} ${amount} x ${itemExist(item)[3]}`);    
                }
            } else {
                //Recp does have item
                if (pstat.amount <= amount){
                    //Giver will have 0 of item, so splice it!
                    giverStats.player.stuff.seeds.splice(index, 1);
                    itemm2.amount += amount;
                    await giverStats.save();
                    await recipientStats.save();
                    return message.reply(`you have given ${recipient} ${amount} x ${itemExist(item)[3]}`);    
                }
                else if (pstat.amount > amount){
                    //Giver will still amount of item left
                    itemm.amount -= amount;
                    itemm2.amount += amount;
                    await giverStats.save();
                    await recipientStats.save();
                    return message.reply(`you have given ${recipient} ${amount} x ${itemExist(item)[3]}`);    
                }


            }

        }
        if (itemExist(item)[7] === "Crops") {
            if (index2 === -1){
                //Recp does not have item
                if (pstat.amount <= amount){
                    //Giver will have 0 of item, so splice it!
                    giverStats.player.stuff.crops.splice(index, 1);
                    recipientStats.player.stuff.crops.push({id: itemExist(item)[1], name: itemExist(item)[3], amount: amount});
                    await giverStats.save();
                    await recipientStats.save();
                    return message.reply(`you have given ${recipient} ${amount} x ${itemExist(item)[3]}`);    
                }
                else if (pstat.amount > amount){
                    //Giver will still amount of item left
                    itemm.amount -= amount;
                    recipientStats.player.stuff.crops.push({id: itemExist(item)[1], name: itemExist(item)[3], amount: amount});
                    await giverStats.save();
                    await recipientStats.save();
                    return message.reply(`you have given ${recipient} ${amount} x ${itemExist(item)[3]}`);    
                }
            } else {
                //Recp does have item
                if (pstat.amount <= amount){
                    //Giver will have 0 of item, so splice it!
                    giverStats.player.stuff.crops.splice(index, 1);
                    itemm2.amount += amount;
                    await giverStats.save();
                    await recipientStats.save();
                    return message.reply(`you have given ${recipient} ${amount} x ${itemExist(item)[3]}`);    
                }
                else if (pstat.amount > amount){
                    //Giver will still amount of item left
                    itemm.amount -= amount;
                    itemm2.amount += amount;
                    await giverStats.save();
                    await recipientStats.save();
                    return message.reply(`you have given ${recipient} ${amount} x ${itemExist(item)[3]}`);    
                }


            }

        }  
        if (itemExist(item)[7] === "Potions") {
            if (index2 === -1){
                //Recp does not have item
                if (pstat.amount <= amount){
                    //Giver will have 0 of item, so splice it!
                    giverStats.player.stuff.potions.splice(index, 1);
                    recipientStats.player.stuff.potions.push({id: itemExist(item)[1], name: itemExist(item)[3], amount: amount});
                    await giverStats.save();
                    await recipientStats.save();
                    return message.reply(`you have given ${recipient} ${amount} x ${itemExist(item)[3]}`);    
                }
                else if (pstat.amount > amount){
                    //Giver will still amount of item left
                    itemm.amount -= amount;
                    recipientStats.player.stuff.potions.push({id: itemExist(item)[1], name: itemExist(item)[3], amount: amount});
                    await giverStats.save();
                    await recipientStats.save();
                    return message.reply(`you have given ${recipient} ${amount} x ${itemExist(item)[3]}`);    
                }
            } else {
                //Recp does have item
                if (pstat.amount <= amount){
                    //Giver will have 0 of item, so splice it!
                    giverStats.player.stuff.potions.splice(index, 1);
                    itemm2.amount += amount;
                    await giverStats.save();
                    await recipientStats.save();
                    return message.reply(`you have given ${recipient} ${amount} x ${itemExist(item)[3]}`);    
                }
                else if (pstat.amount > amount){
                    //Giver will still amount of item left
                    itemm.amount -= amount;
                    itemm2.amount += amount;
                    await giverStats.save();
                    await recipientStats.save();
                    return message.reply(`you have given ${recipient} ${amount} x ${itemExist(item)[3]}`);    
                }


            }

        }  
  

            
        }
    }
             return message.reply(`${EMOJICONFIG.no} this item does not exist...`); 
        } 
    },
    info: {
        names: ['give'],
    }
};

