const { EmbedBuilder, Message, Events } = require('discord.js');
const PARTYDATA = require('../../modules/party.js');
const EMOJICONFIG = require('../../config/emoji.json');
const PLAYERDATA = require('../../modules/player.js');

module.exports = {
    name: Events.MessageCreate,
    /**
     * @param {Message} message
     */
    async execute(message, args, commandName) {
        if (message.content.toLowerCase() && this.info.names.some(name => commandName === name)) {
            let playerStats = await PLAYERDATA.findOne({ userId: message.author.id });
            if (!playerStats) {
                return message.reply(`${EMOJICONFIG.no} You are not a player.`);
            }

            let party = await PARTYDATA.findOne({ partyName: playerStats.player.other.partyName });
            if (!party || !Array.isArray(party.banned) || party.banned.length === 0) {
                return message.reply(`${EMOJICONFIG.no} No banned players in the party.`);
            }

            const bannedList = party.banned.map(b => b.pseudo).join('\n');
            const embed = new EmbedBuilder()
                .setColor('#2f3136')
                .setTitle(`${EMOJICONFIG.no} Banned Players in Party: ${playerStats.player.other.partyName}`)
                .setDescription(bannedList)
                .setTimestamp();

            await message.reply({ embeds: [embed] });
        }
    },
    info: {
        names: ['partybanned'],
    }
};