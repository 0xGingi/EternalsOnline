const PLAYERDATA = require('../../modules/player.js');
const PARTYDATA = require('../../modules/party.js')
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
        // const args = message.content.slice(prefix.length).trim().split(/ +/);
        // const commandName = args.shift().toLowerCase();
         if (message.content.toLowerCase() && this.info.names.some(name => commandName === name)) {
     

    var user = message.author;

    function playerInParty(userBan, player){
        if(userBan.player.other.partyName != 'undefined' && userBan.player.other.partyName == player.player.other.partyName) return true
        else return false
    };

    // == Player DB ==
    let playerStats = await PLAYERDATA.findOne({ userId: user.id });
    if (!playerStats) return message.reply(`${EMOJICONFIG.no} you are a not player ! : ${inlineCode('@Eternals start')}`);
    else {

        let party = await PARTYDATA.findOne({ partyName: playerStats.player.other.partyName });
        if (!party) return message.reply(`${EMOJICONFIG.no} you are not in a party...`)
        else {

                
                const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('yes')
                        .setLabel('LEAVE')
                        .setEmoji(`${EMOJICONFIG.yes}`)
                        .setStyle(ButtonStyle.Success),

                    new ButtonBuilder()
                        .setCustomId('no')
                        .setLabel('DO NOT LEAVE')
                        .setEmoji(`${EMOJICONFIG.no}`)
                        .setStyle(ButtonStyle.Danger),
                );

                var banMessage = new EmbedBuilder()
                    .setColor('#2a941a')
                    .setTitle(`🎓 Leaving the Party`)
                    .setDescription(`🪧 Do you want to leave ${inlineCode(party.partyName)}?`)
                    .setTimestamp();
                const msg = await message.reply({embeds: [banMessage], components: [row]});
                
                const collector = msg.createMessageComponentCollector({
                    componentType: ComponentType.Button,
                    max: 1,
                    time: 30_000
                });

                collector.on('collect', async interaction => {
                    if (interaction.customId == 'yes') {

                        playerStats.player.other.partyName = 'undefined'
                        playerStats.player.other.partyCoinGiven = 0
                        playerStats.save()

                        const index = party.member.findIndex(member => member.id === message.author.id);
                        if (index !== -1) {
                            party.member.splice(index, 1);
                        await party.save();
                        }

                        await interaction.reply({ content: `${EMOJICONFIG.yes} You left your party well!`, ephemeral: true });
                    };
                    if (interaction.customId == 'no') {
                        await interaction.reply({ content: `${EMOJICONFIG.no} You'd rather stay in your party!`, ephemeral: true });
                    }
                });
        };
    };
};
},
info: {
    names: ['leaveparty'],
} }
