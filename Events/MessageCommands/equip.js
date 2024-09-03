const Discord = require('discord.js');
const PLAYERDATA = require('../../modules/player.js');
const BALANCEDATA = require('../../modules/economie.js');
const CONFIGITEM = require('../../config/stuff.json');
const { bold, inlineCode, codeBlock } = require('@discordjs/builders');
const { prefix } = require('../../App/config.json');
const EMOJICONFIG = require('../../config/emoji.json');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, Events, ButtonStyle, StringSelectMenuOptionBuilder, StringSelectMenuBuilder, ComponentType, SelectMenuBuilder, SelectMenuOptionBuilder } = require('discord.js');
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
     
    var item = args[0]
    //var slotItem = args[1]
    var user = message.author
    if(item == undefined || item == '' || item == ' ') return message.reply(`${EMOJICONFIG.no} item error : ${inlineCode("@Eternals equip <item> <1/2/3/4/5>")}`);
    /*
    if(!item || item == undefined || item == '' || item == ' ')
    {
        
        let playerStats = await PLAYERDATA.findOne({ userId: user.id });
        if (!playerStats) return message.reply(`${EMOJICONFIG.no} you are not a player ! : ${inlineCode('@Eternals start')}`);

        function itemExist(itemName) {
            for (let pas = 0; pas < CONFIGITEM.length; pas++) {
                    if (itemName === CONFIGITEM[pas].id) {
                        return {
                            exists: true,
                            id: CONFIGITEM[pas].id.toString(),
                            name: CONFIGITEM[pas].name,
                            itemlevel: CONFIGITEM[pas].itemlevel.toString()
                        };
                    }
            }
            return { exists: false };
        }
        
        const inventoryOptions = playerStats.player.stuff.stuffUnlock.map(itemData => {
            const itemInfo = itemExist(itemData.id);
            if (!itemInfo.exists) {
                // Handle the case where the item does not exist in CONFIGITEM
                console.error(`Item ${itemData.id} does not exist in CONFIGITEM.`);
                return null;
            }
        
            let label = itemInfo.name || 'Unknown Item';
            let description = `Level ${itemInfo.itemlevel || 'N/A'}`;
            let value = itemInfo.id || '0'; // '0' or some other default value if id is not found
        
            return new StringSelectMenuOptionBuilder()
                .setLabel(label)
                .setDescription(description)
                .setValue(value);
        }).filter(option => option !== null); // Filter out any null options due to missing items

        const selectMenu = new StringSelectMenuBuilder()
        .setCustomId('select-item')
        .setPlaceholder('Select an item to equip')
        .addOptions(inventoryOptions);

        const row = new ActionRowBuilder().addComponents(selectMenu);

        await message.reply({ content: 'Select an item to equip:', components: [row] });
       // return;
       client.on('interactionCreate', async interaction => {
        if (interaction.type !== InteractionType.MessageComponent) return;
        const { customId, values, message, user } = interaction;
        if (customId === 'select-item') {
            await interaction.deferUpdate();
            const selectedItemValue = values[0];
            const itemConfig = CONFIGITEM.find(item => item.id.toString() === selectedItemValue);
            if (playerStats.player.level < itemConfig.itemlevel) {
                return interaction.followUp({ content: `${EMOJICONFIG.no} You need to be level ${itemConfig.itemlevel} to equip this item.`, ephemeral: true });
            }
            let freeSlot = [playerStats.player.slotItem.slot1, playerStats.player.slotItem.slot2, playerStats.player.slotItem.slot3, playerStats.player.slotItem.slot4, playerStats.player.slotItem.slot5].findIndex(slot => slot == -1) + 1;
            if (freeSlot === 0) {
                return interaction.followUp({ content: `${EMOJICONFIG.no} There are no free slots to equip this item.`, ephemeral: true });
            }
    
            function itemExist(item){
                for(let pas = 0; pas < CONFIGITEM.length; pas++){
                    for(const alias of CONFIGITEM[pas].alias){
                        if(item == alias) return [true, CONFIGITEM[pas].id, CONFIGITEM[pas].name, CONFIGITEM[pas].itemlevel];
                    };
                };
                return [false, -1]
            };
    
            if(itemExist(item)[0]){
                function ifItemInInventory(item){
                    for(const itemPlayerAll of playerStats.player.stuff.stuffUnlock){
                        var itemPlayer = itemPlayerAll.id
                        var level = itemPlayerAll.level
                        var itemPlayerExist = itemExist(item)[1]
                        var itemLevel = itemExist(item)[3]
                        if(itemPlayer == itemPlayerExist) return [true, itemPlayerExist, level, itemLevel]
                    }                        return [false, -1, -1, -1]
                };
    
                const IDITEM = itemExist(item)[1]
                function addStatsPlayers(){
                    var idItem = ifItemInInventory(item)[1];
                    var levelItem = ifItemInInventory(item)[2];
                    for(let pas = 0; pas < CONFIGITEM.length; pas++){
                        if(CONFIGITEM[pas].id == idItem){
                            if(levelItem == 1){
                                playerStats.player.attack += CONFIGITEM[pas].levelAttack.level1
                                playerStats.player.defense += CONFIGITEM[pas].levelDefense.level1
                                playerStats.player.dodge += CONFIGITEM[pas].levelDodge.level1
                                playerStats.player.crit += CONFIGITEM[pas].levelCrit.level1
                                playerStats.player.penetration += CONFIGITEM[pas].levelPenetration.level1
                                playerStats.player.lifeSteal += CONFIGITEM[pas].levelLifeSteal.level1
                                playerStats.player.health += CONFIGITEM[pas].levelHealth.level1
                            };
                        };
                    };
                };
                if(ifItemInInventory(item)[0]){
                    var slotEquipItem = ifItemInInventory(item)[1]
                    addStatsPlayers()
                    if(freeSlot == 1) playerStats.player.slotItem.slot1 = slotEquipItem
                    if(freeSlot == 2) playerStats.player.slotItem.slot2 = slotEquipItem
                    if(freeSlot == 3) playerStats.player.slotItem.slot3 = slotEquipItem
                    if(freeSlot == 4) playerStats.player.slotItem.slot4 = slotEquipItem
                    if(freeSlot == 5) playerStats.player.slotItem.slot5 = slotEquipItem
    
                    const inventoryItem = playerStats.player.stuff.stuffUnlock.find(item => item.id === slotEquipItem);
                    if (inventoryItem && inventoryItem.amount > 0) {
                        inventoryItem.amount -= 1;
                    } else {
                        return message.reply(`${EMOJICONFIG.no} You do not have any of this item left to equip.`);
                    }
    
                    await playerStats.save();
    
    
            await interaction.followUp({ content: `${EMOJICONFIG.yes} Item equipped to slot ${freeSlot}.`, ephemeral: true });
        } 
    }
    }
    });













    }
    */
   // if(isNaN(slotItem) == false && slotItem <= 5 && slotItem >= 0){
        
        let playerStats = await PLAYERDATA.findOne({ userId: user.id });
        if (!playerStats) return message.reply(`${EMOJICONFIG.no} you are not a player ! : ${inlineCode('@Eternals start')}`);
        else {
            let balance = await BALANCEDATA.findOne({ userId: user.id });
            if (!balance) return message.reply(`${EMOJICONFIG.no} you are not a player ! : ${inlineCode('@Eternals start')}`);
            else {
                let freeSlot = [playerStats.player.slotItem.slot1, playerStats.player.slotItem.slot2, playerStats.player.slotItem.slot3, playerStats.player.slotItem.slot4, playerStats.player.slotItem.slot5].findIndex(slot => slot == -1) + 1;
                if (freeSlot == 0) {
                    return message.reply(`${EMOJICONFIG.no} All slots are full, first remove an item with : ${inlineCode("@Eternals unequip <1/2/3/4/5>")}`);
                }
                
                function itemExist(item){
                    for(let pas = 0; pas < CONFIGITEM.length; pas++){
                        for(const alias of CONFIGITEM[pas].alias){
                            if(item == alias) return [true, CONFIGITEM[pas].id, CONFIGITEM[pas].name, CONFIGITEM[pas].itemlevel];
                        };
                    };
                    return [false, -1]
                };

                if(itemExist(item)[0]){
                    function ifItemInInventory(item){
                        for(const itemPlayerAll of playerStats.player.stuff.stuffUnlock){
                            var itemPlayer = itemPlayerAll.id
                            var level = itemPlayerAll.level
                            var itemPlayerExist = itemExist(item)[1]
                            var itemLevel = itemExist(item)[3]
                            if(itemPlayer == itemPlayerExist) return [true, itemPlayerExist, level, itemLevel]
                        }                        return [false, -1, -1, -1]
                    };

                    var iteml = ifItemInInventory(item)[3]
                    console.log(iteml)
                    if(playerStats.player.level < iteml) {
                        return message.reply(`${EMOJICONFIG.no} You need to be level ${itemExist(item)[3]} to equip this item.`);
                    }
    
                    const IDITEM = itemExist(item)[1]
                    function addStatsPlayers(){
                        var idItem = ifItemInInventory(item)[1];
                        var levelItem = ifItemInInventory(item)[2];
                        for(let pas = 0; pas < CONFIGITEM.length; pas++){
                            if(CONFIGITEM[pas].id == idItem){
                                if(levelItem == 1){
                                    playerStats.player.attack += CONFIGITEM[pas].levelAttack.level1
                                    playerStats.player.defense += CONFIGITEM[pas].levelDefense.level1
                                    playerStats.player.dodge += CONFIGITEM[pas].levelDodge.level1
                                    playerStats.player.crit += CONFIGITEM[pas].levelCrit.level1
                                    playerStats.player.penetration += CONFIGITEM[pas].levelPenetration.level1
                                    playerStats.player.lifeSteal += CONFIGITEM[pas].levelLifeSteal.level1
                                    playerStats.player.health += CONFIGITEM[pas].levelHealth.level1
                                };
                            };
                        };
                    };
                    if(ifItemInInventory(item)[0]){
                        var slotEquipItem = ifItemInInventory(item)[1]
                        addStatsPlayers()
                        if(freeSlot == 1) playerStats.player.slotItem.slot1 = slotEquipItem
                        if(freeSlot == 2) playerStats.player.slotItem.slot2 = slotEquipItem
                        if(freeSlot == 3) playerStats.player.slotItem.slot3 = slotEquipItem
                        if(freeSlot == 4) playerStats.player.slotItem.slot4 = slotEquipItem
                        if(freeSlot == 5) playerStats.player.slotItem.slot5 = slotEquipItem

                        const inventoryItem = playerStats.player.stuff.stuffUnlock.find(item => item.id === slotEquipItem);
                        if (inventoryItem && inventoryItem.amount > 0) {
                            inventoryItem.amount -= 1;
                        } else {
                            return message.reply(`${EMOJICONFIG.no} You do not have any of this item left to equip.`);
                        }

                        await playerStats.save();
                        message.reply(`${EMOJICONFIG.attack} You equip your: **${inlineCode(itemExist(item)[2])}** in your slot number : **${inlineCode(freeSlot)}**\nTo remove your equipment type : ${inlineCode(`@Eternals unequip ${freeSlot}`)}`)
                    } else return message.reply(`${EMOJICONFIG.no} you don't have this item, you have to buy it from the GE: ${inlineCode(`@Eternals ge`)}`);
                } else return message.reply(`${EMOJICONFIG.no} this item does not exist...`);
            };
        };
  //  } else return message.reply(`${EMOJICONFIG.no} please specify a correct slot: ${inlineCode("@Eternals equip <item> <1/2/3/4/5>")}`);
};
    },
info: {
    names: ['equip', 'e'],
}
}

