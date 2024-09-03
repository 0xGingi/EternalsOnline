const Discord = require('discord.js');
const PLAYERDATA = require('../../modules/player.js');
const PARTYDATA = require('../../modules/party.js');
const { inlineCode } = require('@discordjs/builders');
const { Message, Events } = require('discord.js');
const EMOJICONFIG = require('../../config/emoji.json');
module.exports = {
    name: Events.MessageCreate,
    /**
     * @param {Message} message
     */

    async execute(message, args, commandName) {
        if (message.content.toLowerCase() && this.info.names.some(name => commandName === name)) {
            var user = message.author;
            var partyNameToDelete = args[0];

            if (!partyNameToDelete) {
                return message.reply(`${EMOJICONFIG.no} Please specify the party name to delete: ${inlineCode("@Eternals party destroy <party name>")}`);
            }

            // == Player DB ==
            let playerStats = await PLAYERDATA.findOne({ userId: user.id });
            if (!playerStats) {
                return message.reply(`${EMOJICONFIG.no} You are not a player! Type: ${inlineCode('@Eternals start')}`);
            }

            // == Party DB ==
            let party = await PARTYDATA.findOne({ partyName: partyNameToDelete });
            if (!party) {
                return message.reply(`${EMOJICONFIG.no} party not found...`);
            }

            if (user.id !== party.leader[0]) {
                return message.reply(`${EMOJICONFIG.no} You are not the leader of the party: ${inlineCode(party.partyName)}`);
            }

            // Delete the party from the database
            await PARTYDATA.deleteOne({ partyName: partyNameToDelete });

            // Update all members' player data to reflect they are no longer in a party
            for (const member of party.member) {
                await PLAYERDATA.updateOne({ userId: member.id }, { 'player.other.partyName': 'undefined' });
            }

            return message.reply(`${EMOJICONFIG.yes} Party ${inlineCode(party.partyName)} has been successfully deleted.`);
        }
    },
    info: {
        names: ['partydelete'],
    }
}