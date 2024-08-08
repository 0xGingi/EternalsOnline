const { EmbedBuilder, Message, Events } = require('discord.js');
const GUILDDATA = require('../../modules/squad.js'); // Assuming there's a similar module for guild data
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

            let guildStats = await GUILDDATA.findOne({ squadName: playerStats.player.other.squadName });
            console.log(guildStats);
            if (!guildStats || !Array.isArray(guildStats.banned) || guildStats.banned.length === 0) {
                return message.reply(`${EMOJICONFIG.no} No banned players in the guild.`);
            }

            const bannedList = guildStats.banned.map(b => b.pseudo).join('\n');
            const embed = new EmbedBuilder()
                .setColor('#2f3136')
                .setTitle(`${EMOJICONFIG.no} Banned Players in ${playerStats.player.other.squadName}`)
                .setDescription(bannedList)
                .setTimestamp();

            await message.reply({ embeds: [embed] });
        }
    },
    info: {
        names: ['guildbanned'],
    }
};