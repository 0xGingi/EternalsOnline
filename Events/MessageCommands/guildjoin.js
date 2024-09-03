const Discord = require('discord.js');
const SQUADDATA = require('../../modules/squad.js')
const PLAYERDATA = require('../../modules/player.js');
const EMOJICONFIG = require('../../config/emoji.json');
const BALANCEDATA = require('../../modules/economie.js');
const { bold, inlineCode, codeBlock } = require('@discordjs/builders');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, Events, ButtonStyle, ComponentType, Collection } = require('discord.js');
const { prefix } = require('../../App/config.json')


// Config Cooldown :
const shuffleTime = 4.32e+7;
var cooldownPlayers = new Collection();

module.exports = {
    name: Events.MessageCreate,
    /**
     * @param {Message} message
     */

async execute(message, args, commandName) {
   // const args = message.content.slice(prefix.length).trim().split(/ +/);
   // const commandName = args.shift().toLowerCase();
    if (message.content.toLowerCase() && this.info.names.some(name => commandName === name)) {


    var user = message.author;
    var squadNameJoin = args[0]

    if(squadNameJoin === '') return message.reply(`${EMOJICONFIG.no} error command, type: ${inlineCode("@Eternals guild join <guild name>")}`)
    else if(squadNameJoin === ' ') message.reply(`${EMOJICONFIG.no} error command, type: ${inlineCode("@Eternals guild join <guild name>")}`)
    else if(squadNameJoin === undefined) message.reply(`${EMOJICONFIG.no} error command, type: ${inlineCode("@Eternals guild join <guild name>")}`)
    else if(squadNameJoin != undefined) {

        function playerInSquad(playerStats){
            if (!playerStats) return message.reply(`${EMOJICONFIG.no} you are not a player ! : ${inlineCode('@Eternals start')}`);
            else {
                if(playerStats.player.other.squadName != 'undefined') return true
            }
            return false
        }

        // == Squad Db ==
        let squad = await SQUADDATA.findOne({ squadName: squadNameJoin });    
        let playerStats = await PLAYERDATA.findOne({ userId: message.author.id });
        if (playerStats.player.other.ironman === true) return message.reply(`${EMOJICONFIG.no} You are an ironman, you can't join a guild!`)
        if (!squad) return message.reply(`${EMOJICONFIG.no} Guild is not available...`)
        else {
            if (squad.banned.some(bannedUser => bannedUser.id === message.author.id)) {
                return message.reply(`${EMOJICONFIG.no} You are banned from this guild.`);
            }
    

            // == Balance Db ==
            let balance = await BALANCEDATA.findOne({ userId: message.author.id });
            if (!balance) return message.reply(`${EMOJICONFIG.no} you are not a player ! : ${inlineCode('@Eternals start')}`);
            else {

                // == Player Db ==
                
                if (!playerStats) return message.reply(`${EMOJICONFIG.no} you are not a player ! : ${inlineCode('@Eternals start')}`);
                else {

                    if(playerInSquad(playerStats) == false){
                        if(balance.eco.coins < 150) return message.reply(`${EMOJICONFIG.no} you don't have ${inlineCode('150')} ${EMOJICONFIG.coin} to join a guild...`)
                        else {

                            if(squad.member.length >= 50) return message.reply(`${EMOJICONFIG.no} guild is full (max 50)...`)
                            else {

                                // ========== Button Squad Join ==========
                                const row = new ActionRowBuilder()
                                    .addComponents(
                                        new ButtonBuilder()
                                            .setCustomId('yes')
                                            .setLabel(`JOIN`)
                                            .setEmoji(`${EMOJICONFIG.yes}`)
                                            .setStyle(ButtonStyle.Success),
                                        
                                        new ButtonBuilder()
                                            .setCustomId('no')
                                            .setLabel(`CANCEL`)
                                            .setEmoji(`${EMOJICONFIG.no}`)
                                            .setStyle(ButtonStyle.Danger),
                                    );
                        
                                const squadEmbedRow = new EmbedBuilder()
                                    .setColor('#4dca4d')
                                    .setTitle(`${EMOJICONFIG.scroll4} Join ${squad.squadName}?`)
                                    .setDescription(`Click ${EMOJICONFIG.yes} to join ${inlineCode('or')} Click ${EMOJICONFIG.no} to cancel`)
                                    .setTimestamp();
                                message.reply({embeds: [squadEmbedRow], components: [row] });

                                // ========== Filter & Collector ==========
                                const filter = (interaction)  => {
                                    if(interaction.user.id === message.author.id) return true
                                    return interaction.reply({ content: 'You cant use this button' })
                                };
                                const collector = message.channel.createMessageComponentCollector({
                                    filter, 
                                    max: 1
                                });
                            
                                collector.on('end', (ButtonInteraction) => {
                                    ButtonInteraction.first().deferUpdate()
                                    const id = ButtonInteraction.first().customId
                                    if(id === 'yes'){

                                        
                                        squad.member.push({id: user.id, pseudo: user.username})
                                        squad.save()

                                        playerStats.player.other.squadName = squadNameJoin
                                        playerStats.save()

                                        var squadEmbed = new EmbedBuilder()
                                            .setColor('#4dca4d')
                                            .setTitle(`${EMOJICONFIG.paper} You join ${squad.squadName}`)
                                            .setDescription(`${EMOJICONFIG.scroll4} New Guild Member: ${inlineCode(user.username)}\n${EMOJICONFIG.shieldflame} Congrats you have sucessfully join your new Guild !<\n${EMOJICONFIG.helmet} Leader : ${inlineCode(squad.leader[1])}\n${EMOJICONFIG.scroll4} Member(s): ${inlineCode(squad.member.length), '+1'}\n${EMOJICONFIG.xp} Earn Xp to improve your Guild level !`)
                                            .setTimestamp();
                                        return message.reply({embeds: [squadEmbed]});
                                        
                                    }
                                    if(id === 'no') return message.reply(`You canceled ${EMOJICONFIG.no}`)
                                });
                            };
                        };
                    } else return message.reply(`${EMOJICONFIG.no} you are already in a Guild...`);
                };
            };
        };
    };
};
},
info: {
    names: ['joinguild', 'guildjoin', 'jointeam', 'teamjoin', 'joinG', 'joing', 'guildj', 'Guildj','jg'],
} }
