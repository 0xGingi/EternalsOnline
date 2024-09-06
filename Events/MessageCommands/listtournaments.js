const Discord = require('discord.js');
const SQUADTOURNAMENT = require('../../modules/squadtournament.js');
const { EmbedBuilder, Message, Events } = require('discord.js');
const EMOJICONFIG = require('../../config/emoji.json');

module.exports = {
    name: Events.MessageCreate,
    /**
     * @param {Message} message
     */

    async execute(message, args, commandName) {
        if (message.content.toLowerCase() && this.info.names.some(name => commandName === name)) {

            // == Tournament DB ==
            let squadTournaments = await SQUADTOURNAMENT.find();
            if (!squadTournaments || squadTournaments.length === 0) return message.reply(`${EMOJICONFIG.no} There are no tournaments at the moment.`);
            else {
                let description = '';
                squadTournaments.forEach(tournament => {
                    description += `**${tournament.squadTournamentName}** by ${tournament.squadTournamantLeader[0].pseudo}\nMembers: ${tournament.squadMember.length}/${tournament.maxSquad}\n\n`;
                });

                var squadTournamentEmbed = new EmbedBuilder()
                    .setColor('#6d4534')
                    .setTitle(`${EMOJICONFIG.scroll4} Guild Tournaments`)
                    .setDescription(description)
                    .setTimestamp();
                return message.reply({embeds: [squadTournamentEmbed]});
            }
        }
    },
    info: {
        names: ['listtournaments'],
    }
}
