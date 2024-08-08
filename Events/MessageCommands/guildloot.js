const Discord = require('discord.js');
const SQUADDATA = require('../../modules/squad.js');
const PLAYERDATA = require('../../modules/player.js');
const { inlineCode } = require('@discordjs/builders');
const { Message, Events } = require('discord.js');
const CONFIGITEM = require('../../config/stuff.json');
const EMOJICONFIG = require('../../config/emoji.json');
module.exports = {
    name: Events.MessageCreate,
    async execute(message, args, commandName) {
        if (message.content.toLowerCase() && this.info.names.some(name => commandName === name)) {
            const user = message.author;
            const itemName = args[0].toUpperCase();
            const recipientId = Array.from(message.mentions.users.values())[1];
            const itemConstant = findItemByAlias(itemName);

            function findItemByAlias(equipalias) {
                for (let i = 0; i < CONFIGITEM.length; i++) {
                    if (CONFIGITEM[i].equipalias === equipalias) {   
                        return CONFIGITEM[i];           
                    }       
                }        
                return null;     
            }
            // Check if the user is a player and the guild master
            let playerStats = await PLAYERDATA.findOne({ userId: user.id });
            if (!playerStats) return message.reply(`${EMOJICONFIG.no} You are not a player! : ${inlineCode('@FlipMMO start')}`);

            let squad = await SQUADDATA.findOne({ squadName: playerStats.player.other.squadName });
            if (!squad) return message.reply(`${EMOJICONFIG.no} You are in a guild`);

            if(user.id != squad.leader[0] && !squad.officer.some(officer => officer.id === user.id)) {
                return message.reply(`${EMOJICONFIG.no} you are not the leader or an officer of the Guild: ${inlineCode(squad.squadName)}`);
            } 

            // Find the item in the squad's unlocked stuff
            const itemIndex = squad.stuff.stuffUnlock.findIndex(item => item.id === itemConstant.id);
            const itemToGive = squad.stuff.stuffUnlock.find(item => item.id === itemConstant.id);
            if (itemIndex === -1) return message.reply(`${EMOJICONFIG.no} Item not found in the guild's inventory.`);

            // Remove the item from the guild's inventory
            if (itemToGive.amount > 1)
            {   itemToGive.amount -= 1 }
            else {
            squad.stuff.stuffUnlock.splice(itemIndex, 1);
            }
            await squad.save();

            // Add the item to the recipient's inventory
            let recipientStats = await PLAYERDATA.findOne({ userId: recipientId.id });
            if (!recipientStats) return message.reply(`${inlineCode('❌')} player not found.`);
            const existingItem = recipientStats.player.stuff.stuffUnlock.find(item => item.id === itemConstant.id);
            if (existingItem) {
                existingItem.amount += 1;
                await recipientStats.save();
            } else {
            recipientStats.player.stuff.stuffUnlock.push({
                id: itemConstant.id,
                name: itemConstant.name,
                level: 1,
                amount: 1
            });
            await recipientStats.save();
            }
            message.reply(`${EMOJICONFIG.yes} Item ${inlineCode(itemConstant.name)} has been transferred to ${inlineCode(recipientStats.pseudo)}.`);
        }
    },
    info: {
        names: ['guildloot'],
    }
}