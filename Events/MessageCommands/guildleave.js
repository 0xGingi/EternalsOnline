const Discord = require('discord.js');
const PLAYERDATA = require('../../modules/player.js');
const SQUADDATA = require('../../modules/squad.js')
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
    //const args = message.content.trim().split(/ +/);
   // console.log(args)
  //  const commandName = args.shift().toLowerCase();
    if (message.content.toLowerCase() && this.info.names.some(name => commandName === name)) {


    var user = message.author;

    function playerInSquad(userBan, player){
        if(userBan.player.other.squadName != 'undefined' && userBan.player.other.squadName == player.player.other.squadName) return true
        else return false
    };

    // == Player DB ==
    let playerStats = await PLAYERDATA.findOne({ userId: user.id });
    if (!playerStats) return message.reply(`${EMOJICONFIG.no} you are a not player ! : ${inlineCode('@FlipMMO start')}`);
    else {

        // == Squad DB ==
        let squad = await SQUADDATA.findOne({ squadName: playerStats.player.other.squadName });
        if (!squad) return message.reply(`${EMOJICONFIG.no} you are not in a Guild...`)
        else {

                
                const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('yes')
                        .setLabel('LEAVE')
                        .setEmoji(EMOJICONFIG.yes)
                        .setStyle(ButtonStyle.Success),

                    new ButtonBuilder()
                        .setCustomId('no')
                        .setLabel('DO NOT LEAVE')
                        .setEmoji(EMOJICONFIG.no)
                        .setStyle(ButtonStyle.Danger),
                );

                var banMessage = new EmbedBuilder()
                    .setColor('#2a941a')
                    .setTitle(`${EMOJICONFIG.paper} Leaving the Guild`)
                    .setDescription(`🪧 Do you want to leave ${inlineCode(squad.squadName)}`)
                    .setTimestamp();
                const msg = await message.reply({embeds: [banMessage], components: [row]});
                
                const collector = msg.createMessageComponentCollector({
                    componentType: ComponentType.Button,
                    max: 1,
                    time: 30_000
                });

                collector.on('collect', async interaction => {
                    if (interaction.customId == 'yes') {

                        playerStats.player.other.squadName = 'undefined'
                        playerStats.player.other.squadCoinGiven = 0
                        playerStats.save()

                        for(const allMember of squad.member){
                            var index = allMember.id.indexOf(message.author.id)
                            squad.member.splice(index, 1)
                        }
                        squad.save()

                        await interaction.reply({ content: `${EMOJICONFIG.yes} You left your Guild well!`, ephemeral: true });
                    };
                    if (interaction.customId == 'no') {
                        await interaction.reply({ content: `${EMOJICONFIG.no} You'd rather stay in your Guild!`, ephemeral: true });
                    }
                });
        };
   };
};
},
info: {
    names: ['leave', 'leaveguild','lg'],
} }
