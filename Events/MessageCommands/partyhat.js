const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, Events, ButtonStyle, ComponentType } = require('discord.js');
const PLAYERDATA = require('../../modules/player.js');
const stuff = require('../../config/stuff.json');
const Party = require('../../modules/party.js');
const { prefix } = require('../../App/config.json')
const {client} = require('../../App/index.js');
const { bold, inlineCode, codeBlock } = require('@discordjs/builders');
const EMOJICONFIG = require('../../config/emoji.json');
const shuffleTime = 30000;


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
            
            var user = message.author;
            let playerStats = await PLAYERDATA.findOne({ userId: message.author.id });
            if (!playerStats) {
                return message.reply('You are not a player! Use `@Eternals start` to begin your adventure.');
            }
            let itemsToRemoveIds = [41, 42, 89, 90, 91];
            let itemToAddId = 129;
            let playerInventory = playerStats.player.stuff.stuffUnlock;
            for (let itemId of itemsToRemoveIds) {
                let item = playerInventory.find(item => item.id === itemId);
                if (!item) {
                    let stuffItem = stuff.find(stuffItem => stuffItem.id === itemId);
                    let itemName = stuffItem ? stuffItem.name : `Unknown item (id: ${itemId})`;
                    return message.reply(`Hmm... You have a feeling you need a ${itemName} in your inventory... but you're not sure why.`);
                }
            }            
            if (playerStats.player.energy < 2) return message.reply(`${EMOJICONFIG.no} You don't have enough energy! Restore your energy with ${inlineCode('@Eternals energy')}`)
                
                for (let itemId of itemsToRemoveIds) {
                    let item = playerInventory.find(item => item.id === itemId);
                    item.amount -= 1;
                    if (item.amount === 0) {
                        playerInventory = playerInventory.filter(item => item.id !== itemId);
                    }
                }
                
                let itemToAdd = playerInventory.find(item => item.id === itemToAddId);
                if (itemToAdd) {
                    itemToAdd.amount += 1;
                } else {
                    playerInventory.push({ id: itemToAddId, name: "Rainbow Partyhat", level: 1, amount: 1 });
                }
            playerStats.player.stuff.stuffUnlock = playerInventory;
            await playerStats.save();
            message.reply(`You feel your partyhats fusing together... a bright light shining from inside your inventory... You now have a Rainbow Partyhat!`);    
        }
    },
info: {
    names: ['partyhat'],
} }