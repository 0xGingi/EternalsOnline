const Discord = require('discord.js');
const EMOJICONFIG = require('../../config/emoji.json');
const BALANCEDATA = require('../../modules/economie.js');
const playerdata = require('../../modules/player.js');
const { numStr } = require('../../functionNumber/functionNbr.js')
const { bold, inlineCode, codeBlock } = require('@discordjs/builders');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, Events, ButtonStyle, ComponentType, Collection } = require('discord.js');
const { client } = require('../../App/index.js');
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
    var amount = 1;

    if(user.id == '351859727568994314' || user.id == '919048526518960198' || user.id == '217025723573993474'){

        if(userInput == undefined || userInput == ' ' || userInput == '') return message.reply(`${EMOJICONFIG.no} bad command : ${inlineCode('@Eternals skillcape <@user>')}`);

            let player = await playerdata.findOne({ userId: userInput.id });
            if (!player) return message.reply(`${EMOJICONFIG.no} ${userInput} is not a player...`);
            else {
                // == Give Skillcape ==
                let alreadyHasItem = player.player.stuff.stuffUnlock.find(item => item.id === Number(50));
                if (alreadyHasItem) {
                    alreadyHasItem.amount += 1;
                } else {
                    player.player.stuff.stuffUnlock.push({
                id: 50,
                name: "Skill Cape",
                level: 1,
                amount: 1
                });
                }
                await player.save();
        

                return message.reply(`${EMOJICONFIG.yes} ${userInput} has received a Skill Cape!`);

            };
    } else return message.reply(`${EMOJICONFIG.no} Sorry! This command is only for admins only...`);
};
    },
info: {
  names: ['skillcape'],
} }
