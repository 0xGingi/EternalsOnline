const Discord = require('discord.js');
const PLAYERDATA = require('../../modules/player.js');
const SQUADDATA = require('../../modules/squad.js');
const { inlineCode } = require('@discordjs/builders');
const { Message, Events } = require('discord.js');

module.exports = {
    name: Events.MessageCreate,
    /**
     * @param {Message} message
     */

    async execute(message, args, commandName) {
        if (message.content.toLowerCase() && this.info.names.some(name => commandName === name)) {
            var user = message.author;
            var squadNameToDelete = args[0];

            if (!squadNameToDelete) {
                return message.reply(`${EMOJICONFIG.no} Please specify the guild name to delete: ${inlineCode("@FlipMMO guild destroy <guild name>")}`);
            }

            // == Player DB ==
            let playerStats = await PLAYERDATA.findOne({ userId: user.id });
            if (!playerStats) {
                return message.reply(`${EMOJICONFIG.no} You are not a player! Type: ${inlineCode('@FlipMMO start')}`);
            }

            // == Squad DB ==
            let squad = await SQUADDATA.findOne({ squadName: squadNameToDelete });
            if (!squad) {
                return message.reply(`${EMOJICONFIG.no} Guild not found...`);
            }

            if (user.id !== squad.leader[0]) {
                return message.reply(`${EMOJICONFIG.no} You are not the leader of the Guild: ${inlineCode(squad.squadName)}`);
            }

            // Delete the guild from the database
            await SQUADDATA.deleteOne({ squadName: squadNameToDelete });

            // Update all members' player data to reflect they are no longer in a guild
            for (const member of squad.member) {
                await PLAYERDATA.updateOne({ userId: member.id }, { 'player.other.squadName': 'undefined' });
            }

            return message.reply(`${EMOJICONFIG.yes} Guild ${inlineCode(squad.squadName)} has been successfully deleted.`);
        }
    },
    info: {
        names: ['guilddelete'],
    }
}