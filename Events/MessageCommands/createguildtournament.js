const Discord = require('discord.js');
const SQUADTOURNAMENT = require('../../modules/squadtournament.js');
const { bold, inlineCode, codeBlock } = require('@discordjs/builders');
const { prefix } = require('../../App/config.json')
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, Events, ButtonStyle, ComponentType,Collection } = require('discord.js');
const {client} = require('../../App/index.js');
const EMOJICONFIG = require('../../config/emoji.json');

// Config Cooldown :
const shuffleTime = 8.64e7;

module.exports = {
    name: Events.MessageCreate,
    /**
     * @param {Message} message
     */

    async execute(message, args, commandName) {
        if (message.content.toLowerCase() && this.info.names.some(name => commandName === name)) {
   


    var user = message.author;
    var squadTournamentName = args[0]
    var maxSquadMember = args[1]

    if(maxSquadMember == '' || maxSquadMember == ' ' || maxSquadMember == undefined) return message.reply(`${EMOJICONFIG.no} error command, type: ${inlineCode("@Eternals tournament create <tournament name> <max member>")}`)
    if(isNaN(maxSquadMember) == false){
        if(maxSquadMember >= 2 && maxSquadMember <= 20){
            if(squadTournamentName === '' || squadTournamentName === ' ' || squadTournamentName === undefined || squadTournamentName === 'undefined') return message.reply(`${EMOJICONFIG.no} error command, type: ${inlineCode("@Eternals tournament create <tournament name> <max member>")}`)
            else {

                // ==== Check if squad name ever use ====
                function squadNameEverUsed(allSquadTournament, squadTournamentName){
                    for(const squadT of allSquadTournament){
                        if(squadT.squadTournamentName === squadTournamentName) return false 
                    }
                    return true
                };

                function ifPlayerAsAlreadyCreateTournament(allSquadTournament, user){
                    for(const squadT of allSquadTournament){
                        if(squadT.squadTournamantLeader[0].id === user.id) return false 
                    }
                    return true
                };

                let allSquadTournament = await SQUADTOURNAMENT.find();

                if(squadNameEverUsed(allSquadTournament, squadTournamentName)){
                    if(ifPlayerAsAlreadyCreateTournament(allSquadTournament, user)){


                        var newSquadT = new SQUADTOURNAMENT({
                            squadTournamentName : squadTournamentName,
                            squadTournamantLeader: {id: user.id, pseudo: user.username},
                            maxSquad: maxSquadMember,
                            squadMember: [],
                        });
                        newSquadT.save()
                        
                        // == Log : ==
                        const logChannel = client.channels.cache.get('1169491579774443660');
                        var now = new Date();
                        var date = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
                        var messageEmbed = new EmbedBuilder()
                            .setColor('#e1e920')
                            .setTitle(`Log ${date}`)
                            .setDescription(`${EMOJICONFIG.scroll4} **NEW GUILD TOURNAMENT** by **${inlineCode(user.username)}**\n${EMOJICONFIG.paper} Name : **${inlineCode(squadTournamentName)}**\n${EMOJICONFIG.attack6} Maximum Number of Guilds : **${inlineCode(maxSquadMember)}**`);
                        logChannel.send({embeds: [messageEmbed], ephemeral: true });

                        var squadEmbed = new EmbedBuilder()
                        .setColor('#4dca4d')
                        .setTitle(`🎪 New Guild TOURNAMENT by ${user.username}`)
                        .setDescription(`👊 You created the tournament ${inlineCode(squadTournamentName)}\n${EMOJICONFIG.helmet} Leader : ${user.username}\n${EMOJICONFIG.hat7} Member: ${inlineCode("0")}\n(don't forget to register your Guild for the tournament)`)
                        .setTimestamp();
                        return message.channel.send({embeds: [squadEmbed]});

                    } else return message.reply(`${EMOJICONFIG.no} you have already created a tournament, you can't create a second one...`)
                } else return message.reply(`${EMOJICONFIG.no} the name ${inlineCode(squadTournamentName)} is already taken ! ${inlineCode('@Eternals tournament create <guild name> <max member>')}`)
            }; 
        } else return message.reply(`${EMOJICONFIG.no} a tournament must be composed of a minimum of 2 guilds and a maximum of 15!`);
    } return message.reply(`${EMOJICONFIG.no} error command, type: ${inlineCode("@Eternals tournament create <tournament name> <max member>")}`);
};
},
info: {
    names: ['createguildtournament'],
} }
