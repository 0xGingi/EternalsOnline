const Discord = require('discord.js');
const EMOJICONFIG = require('../../config/emoji.json');
const BALANCEDATA = require('../../modules/economie.js');
const { numStr } = require('../../functionNumber/functionNbr.js')
const { bold, inlineCode, codeBlock } = require('@discordjs/builders');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, Events, ButtonStyle, ComponentType, Collection } = require('discord.js');
const { prefix } = require('../../App/config.json')
const {client} = require('../../App/index.js');

// Config Cooldown :
const shuffleTime = 3000;
var cooldownPlayers = new Collection();

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
  
    var user = message.author
    var userInput = Array.from(message.mentions.users.values())[1];
    var item = args[1]
    var amount = args[2]

    if(user.id == '351859727568994314' || user.id == '919048526518960198' || user.id == '217025723573993474'){

        if(userInput == undefined || userInput == ' ' || userInput == '') return message.reply(`${EMOJICONFIG.no} bad command : ${inlineCode('@Eternals give <@user> <item> <amount>')}`);
        if(isNaN(amount) == false || amount >= 0){

            let balance = await BALANCEDATA.findOne({ userId: userInput.id });
            if (!balance) return message.reply(`${EMOJICONFIG.no} ${userInput} is not a player...`);
            else {

                if(item == 'coin' || item == 'coins' || item == 'Coins' || item == 'Coin' || item == 'money'){
                    // == Give Coins ==
                    balance.eco.coins += parseInt(amount);
                    balance.save();
                    return message.reply(`${EMOJICONFIG.yes} you give ${inlineCode(amount)} ${EMOJICONFIG.coin} to ${userInput}`);

                } else if (item == 'xp' || item == 'level' || item == 'experience' || item == 'XP' || item == 'Xp'){
                    // == Give XP ==
                    balance.eco.xp += parseInt(amount);
                    balance.save();
                    return message.reply(`${EMOJICONFIG.yes} you give ${inlineCode(numStr(amount))} ${EMOJICONFIG.xp} to ${userInput}`);
                
                } else return message.reply(`${EMOJICONFIG.no} This item does not exist or is not recognized... : ${inlineCode('@Eternals give <@user> <item> <amount>')}`);
            };
        } else return message.reply(`${EMOJICONFIG.no} please use a correct amount : ${inlineCode('@Eternals give <@user> <item> <amount>')}`);
    } else return message.reply(`${EMOJICONFIG.no} Sorry! This command is only for admins only...`);
};
    },
info: {
  names: ['admingive'],
} }
