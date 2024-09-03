const Discord = require('discord.js');
const SQUADDATA = require('../../modules/squad.js')
const PLAYERDATA = require('../../modules/player.js');
const EMOJICONFIG = require('../../config/emoji.json');
const SQUADTOURNAMENT = require('../../modules/squadtournament.js');
const { bold, inlineCode, codeBlock } = require('@discordjs/builders');
const { prefix } = require('../../App/config.json')
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, Events, ButtonStyle, ComponentType } = require('discord.js');

// Config Cooldown :
const shuffleTime = 3000;
var cooldownPlayers = new Discord.Collection();

module.exports = {
    name: Events.MessageCreate,
    /**
     * @param {Message} message
     */

    async execute(message, args, commandName) {
        if (message.content.toLowerCase() && this.info.names.some(name => commandName === name)) {
    
    var user = message.author;
    var nameTournament = args[0]
    var priceJoin = 10000;

    if(nameTournament === '' || nameTournament === '' || nameTournament == undefined) return message.reply(`${EMOJICONFIG.no} error command, type: ${inlineCode("@Eternals tournament join <Tournament Name>")}`);

    function playerInSquad(playerStats){
        if (!playerStats) return message.reply(`${EMOJICONFIG.no} you are not a player ! : ${inlineCode('@Eternals start')}`);
        else {
            if(playerStats.player.other.squadName != 'undefined') return true
        }
        return false
    };

    function countSquadMemberTournament(squadTournament){
        var numberSquad = squadTournament.squadMember.length
        if(numberSquad == squadTournament.maxSquad || numberSquad >= squadTournament.maxSquad) return false
        else return true
    };

    function playerIsAlreadyInTournament(squadTournament, playerStats){
        for(const allSquad of squadTournament.squadMember){
            if(allSquad.nameSquad == playerStats.player.other.squadName) return false
        }
        return true
    }

    // == Player DB ==
    let playerStats = await PLAYERDATA.findOne({ userId: user.id });
    if (!playerStats) return message.reply(`${EMOJICONFIG.no} you are not a player ! : ${inlineCode('@Eternals start')}`);
    else {

        // == Squad DB ==
        let squad = await SQUADDATA.findOne({ squadName: playerStats.player.other.squadName });
        if (!squad) return message.reply(`${EMOJICONFIG.no} Guild is not available...`)
        else {

            // == Tournament DB ==
            let squadTournament = await SQUADTOURNAMENT.findOne({ squadTournamentName: nameTournament });
            if (!squadTournament) return message.reply(`${EMOJICONFIG.no} This tournament does not exist...`)
            else {

                // === Player is in Squad ===
                if(playerInSquad(playerStats)){

                    // == Player are already in a tournament ==
                    if(playerIsAlreadyInTournament(squadTournament, playerStats)){

                        // === Check amout balance eco Bank ===
                        if(squad.squadbank >= priceJoin){

                            // === Initialize Player is the leader of the team ===
                           // if(playerStats.userId === squad.leader[0]){
                            if(playerStats.userId != squad.leader[0] && !squad.officer.some(officer => officer.id === playerStats.userId)) {
                                return message.reply(`${EMOJICONFIG.no} you are not the leader or an officer of the Guild: ${inlineCode(squad.squadName)}`);
                            } 
                    

                                if(countSquadMemberTournament(squadTournament)){

                                    squad.squadbank -= priceJoin;
                                    squad.save();

                                    squadTournament.squadMember.push({ nameSquad: squad.squadName, squadLeader: squad.leader[1], totalMember: squad.member.length});
                                    squadTournament.save();

                                    return message.reply(`${EMOJICONFIG.yes} You join the ${inlineCode(squadTournament.squadTournamentName)} tournament\n(Check that your registration is complete by typing the command: ${inlineCode("@Eternals tournament view " + nameTournament)})`)

                                } else return message.reply(`${EMOJICONFIG.no} There are too many guilds in this tournament, the creator decided that the maximum number of squads would be : ${inlineCode(squadTournament.maxSquad)}`);
                        } else return message.reply(`${EMOJICONFIG.no} your Guild bank doesn't have enought money...\nIt takes ${priceJoin} ${EMOJICONFIG.coin} to join a Guild tournament`);
                    } else return message.reply(`${EMOJICONFIG.no} you are already in a tournament...`);
                } else return message.reply(`${EMOJICONFIG.no} you are not in a Guild...`);
            };
        };
    };
};
},
info: {
    names: ['joinguildtournament'],
}}
