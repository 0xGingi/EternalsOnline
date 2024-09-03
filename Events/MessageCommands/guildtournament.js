const Discord = require('discord.js');
const SQUADDATA = require('../../modules/squad.js')
const PLAYERDATA = require('../../modules/player.js');
const SQUADTOURNAMENT = require('../../modules/squadtournament.js');
const { bold, inlineCode, codeBlock } = require('@discordjs/builders');
const { prefix } = require('../../App/config.json')
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, Events, ButtonStyle, ComponentType } = require('discord.js');
const EMOJICONFIG = require('../../config/emoji.json');

module.exports = {
    name: Events.MessageCreate,
    /**
     * @param {Message} message
     */

    async execute(message, args, commandName) {
        if (message.content.toLowerCase() && this.info.names.some(name => commandName === name)) {
   

    var user = message.author;
    var nameTournament = args[0]

    if(nameTournament === '' || nameTournament === '' || nameTournament == undefined) return message.reply(`${EMOJICONFIG.no} error command, type: ${inlineCode("@Eternals tournament view <name tournament>")}`);

    // == Tournament DB ==
    let squadTournament = await SQUADTOURNAMENT.findOne({ squadTournamentName: nameTournament });
    if (!squadTournament) return message.reply(`${EMOJICONFIG.no} this tournament name does not exist...`);
    else {

        var allMember = ``
        for(const allMemberInT of squadTournament.squadMember){
            allMember += `${inlineCode(allMemberInT.nameSquad)}, `            
        }

        var squadTournamentEmbed = new EmbedBuilder()
            .setColor('#6d4534')
            .setTitle(`${EMOJICONFIG.scroll4} Guild Tournament`)
            .setDescription(`${EMOJICONFIG.paper} **${squadTournament.squadTournamentName}** Guild Tournament\n${EMOJICONFIG.helmet} Organizer: ${inlineCode(squadTournament.squadTournamantLeader[0].pseudo)}\n${EMOJICONFIG.scroll4} Number of Guilds: ${inlineCode(squadTournament.squadMember.length)} (max: ${squadTournament.maxSquad})\n${EMOJICONFIG.attack6} Participating Squad(s) : ${allMember}`)
            .setTimestamp();
        return message.reply({embeds: [squadTournamentEmbed]});
    };
};
},
info: {
    names: ['guildtournament'],
} }
