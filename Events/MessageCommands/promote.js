const Discord = require('discord.js');
const PLAYERDATA = require('../../modules/player.js');
const SQUADDATA = require('../../modules/squad.js');
const { inlineCode } = require('@discordjs/builders');
const EMOJICONFIG = require('../../config/emoji.json');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, Events, ButtonStyle, ComponentType } = require('discord.js');

module.exports = {
    name: Events.MessageCreate,
    /**
     * @param {Message} message
     */
    async execute(message, args, commandName) {
        if (message.content.toLowerCase() && this.info.names.some(name => commandName === name)) {
        var user = message.author;
        var memberToPromote = Array.from(message.mentions.users.values())[1];

        if (!memberToPromote) {
            return message.reply(`${EMOJICONFIG.no} Please mention a user to promote.`);
        }

        let playerStats = await PLAYERDATA.findOne({ userId: user.id });
        if (!playerStats) {
            return message.reply(`${EMOJICONFIG.no} You are not a player!`);
        }

        let squad = await SQUADDATA.findOne({ squadName: playerStats.player.other.squadName });
        if (!squad) {
            return message.reply(`${EMOJICONFIG.no} You are not in a guild.`);
        }

        if (user.id !== squad.leader[0]) {
            return message.reply(`${EMOJICONFIG.no} You are not the leader of the Guild: ${inlineCode(squad.squadName)}`);
        }

        if (squad.officer.some(officer => officer.id === memberToPromote.id)) {
            return message.reply(`${EMOJICONFIG.no} This member is already an officer.`);
        }

        squad.officer.push({ id: memberToPromote.id, pseudo: memberToPromote.username });
        await squad.save();

        return message.reply(`${EMOJICONFIG.yes} ${memberToPromote.username} has been promoted to officer.`);
    }
    },
info: {
    names: ['promote'],
}
};