const Discord = require('discord.js');
const PLAYERDATA = require('../../modules/player.js');
const CONFIGITEM = require('../../config/stuff.json')
const { bold, inlineCode, codeBlock } = require('@discordjs/builders');
const { prefix } = require('../../App/config.json')
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, Events, ButtonStyle, ComponentType } = require('discord.js');
const EMOJICONFIG = require('../../config/emoji.json');
const {client} = require('../../App/index.js');
// Config Cooldown :
const shuffleTime = 4000;
var cooldownPlayers = new Discord.Collection();

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

    let playerStats = await PLAYERDATA.findOne({ userId: user.id });
    if (!playerStats) return message.reply(`${EMOJICONFIG.no} you are not a player ! : ${inlineCode('@Eternals start')}`);
    else {

        function slotDisplay(slotID){
            if(slotID == -1) return 'no item'
            else {
                for(let pas = 0; pas < CONFIGITEM.length; pas++){
                    if(slotID == CONFIGITEM[pas].id) return CONFIGITEM[pas].name
                }
                return 'no item'
            };
        };

        const slotEmbed = new EmbedBuilder()
            .setColor('#2dd9a8')
            .setTitle(`🪧 ${user.username}'s item slot`)
            .setDescription(`${EMOJICONFIG.attack} Slot 1: ${inlineCode(slotDisplay(playerStats.player.slotItem.slot1))}\n${EMOJICONFIG.attack} Slot 2: ${inlineCode(slotDisplay(playerStats.player.slotItem.slot2))}\n${EMOJICONFIG.attack} Slot 3: ${inlineCode(slotDisplay(playerStats.player.slotItem.slot3))}\n${EMOJICONFIG.attack} Slot 4: ${inlineCode(slotDisplay(playerStats.player.slotItem.slot4))}\n${EMOJICONFIG.attack} Slot 5: ${inlineCode(slotDisplay(playerStats.player.slotItem.slot5))}\n`)
            .setTimestamp();
        message.reply({embeds: [slotEmbed] });

    };
};
    },
info: {
    names: ['slot', 'slotitem', 'object', 'armor', 'helmet', 'boots', 'pants', 'weapon', 'slots'],
}
    }
