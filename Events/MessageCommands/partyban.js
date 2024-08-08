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
         if (message.content.toLowerCase() && this.info.names.some(name => commandName === name)) {
     

    var user = message.author;
    var userBan = Array.from(message.mentions.users.values())[1];

    if(userBan == undefined || userBan == ' ' || userBan == '') return message.reply(`${EMOJICONFIG.no} error command, type: ${inlineCode("@FlipMMO ban <@user>")}`);

    function playerInParty(userBan, player){
        if(userBan.player.other.partyName != 'undefined' && userBan.player.other.partyName == player.player.other.partyName) return true
        else return false
    };

    // == Player DB ==
    let playerStats = await PLAYERDATA.findOne({ userId: user.id });
    if (!playerStats) return message.reply(`${inlineCode('❌')} you are not a player ! : ${inlineCode('@FlipMMO start')}`);
    else {

        let party = await PARTYDATA.findOne({ partyName: playerStats.player.other.partyName });
        if (!party) return message.reply(`${EMOJICONFIG.no} you are not in a party...`)
        else {

            if(user.id != party.leader[0]) return message.reply(`${EMOJICONFIG.no} you are not the leader of the party: ${inlineCode(party.partyName)}`); 
            
            let playerBan = await PLAYERDATA.findOne({ userId: userBan.id });
                
                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('yes')
                            .setLabel('BAN')
                            .setEmoji(EMOJICONFIG.yes)
                            .setStyle(ButtonStyle.Success),

                        new ButtonBuilder()
                            .setCustomId('no')
                            .setLabel('DO NOT BAN')
                            .setEmoji(EMOJICONFIG.no)
                            .setStyle(ButtonStyle.Danger),
                    );

                var banMessage = new EmbedBuilder()
                    .setColor('#2f3136')
                    .setTitle(`${EMOJICONFIG.hammer2} Ban ${playerBan.pseudo} from ${inlineCode(party.partyName)}`)
                    .setDescription(`Do you want to ban "${playerBan.pseudo}" from your party: ${inlineCode(party.partyName)}`)
                    .setTimestamp();
                const msg = await message.reply({embeds: [banMessage], components: [row]});
                
                const collector = msg.createMessageComponentCollector({
                    componentType: ComponentType.Button,
                    max: 1,
                    time: 30_000
                });

                collector.on('collect', async interaction => {
                    if (interaction.customId == 'yes') {

                        if (!party.banned.some(b => b.id === userBan.id)) {
                            party.banned.push({ id: userBan.id, pseudo: playerBan.pseudo });
                        }                        
                        var index = party.member.findIndex(m => m.id === userBan.id);
                        if (index !== -1) {
                            party.member.splice(index, 1);
                        }
                        if (playerInParty(playerBan, playerStats)) {
                        playerBan.player.other.partyName = 'undefined';
                        await playerBan.save();
                        }
                        
                        await party.save()

                        await interaction.reply({ content: `${EMOJICONFIG.yes} ${playerBan.pseudo} has been successfully banned from your party`, ephemeral: true });
                    };
                    if (interaction.customId == 'no') {
                        await interaction.reply({ content: `${EMOJICONFIG.no} You have cancelled the ban of ${playerBan.pseudo}`, ephemeral: true });
                    }
                });
        };
    };
};
},
info: {
    names: ['banparty', 'partyban'],
} }
