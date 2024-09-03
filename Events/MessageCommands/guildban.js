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
   // const args = message.content.slice(prefix.length).trim().split(/ +/);
  //  const commandName = args.shift().toLowerCase();
    if (message.content.toLowerCase() && this.info.names.some(name => commandName === name)) {


    var user = message.author;
    var userBan = Array.from(message.mentions.users.values())[1];

    if(userBan == undefined || userBan == ' ' || userBan == '') return message.reply(`${inlineCode("❌")} error command, type: ${inlineCode("@Eternals guild ban <@user>")}`);

    function playerInSquad(userBan, player){
        if(userBan.player.other.squadName != 'undefined' && userBan.player.other.squadName == player.player.other.squadName) return true
        else return false
    };

    // == Player DB ==
    let playerStats = await PLAYERDATA.findOne({ userId: user.id });
    if (!playerStats) return message.reply(`${EMOJICONFIG.no} you are not a player ! : ${inlineCode('@Eternals start')}`);
    else {

        // == Squad DB ==
        let squad = await SQUADDATA.findOne({ squadName: playerStats.player.other.squadName });
        if (!squad) return message.reply(`${EMOJICONFIG.no} you are not in a guild...`)
        else {

            if(user.id != squad.leader[0] && !squad.officer.some(officer => officer.id === user.id)) {
                return message.reply(`${EMOJICONFIG.no} you are not the leader or an officer of the Guild: ${inlineCode(squad.squadName)}`);
            } 

            let playerBan = await PLAYERDATA.findOne({ userId: userBan.id });
            
                
                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('yes')
                            .setLabel('BAN')
                            .setEmoji(`${EMOJICONFIG.yes}`)
                            .setStyle(ButtonStyle.Success),

                        new ButtonBuilder()
                            .setCustomId('no')
                            .setLabel('DO NOT BAN')
                            .setEmoji(`${EMOJICONFIG.no}`)
                            .setStyle(ButtonStyle.Danger),
                    );

                var banMessage = new EmbedBuilder()
                    .setColor('#2f3136')
                    .setTitle(`${EMOJICONFIG.hammer2} Ban ${playerBan.pseudo} from ${inlineCode(squad.squadName)}`)
                    .setDescription(`Do you want to ban "${playerBan.pseudo}" from your Guild: ${inlineCode(squad.squadName)}`)
                    .setTimestamp();
                const msg = await message.reply({embeds: [banMessage], components: [row]});
                
                const collector = msg.createMessageComponentCollector({
                    componentType: ComponentType.Button,
                    max: 1,
                    time: 30_000
                });

collector.on('collect', async interaction => {
    if (interaction.customId == 'yes') {

        if (!squad.banned.some(b => b.id === userBan.id)) {
            squad.banned.push({ id: userBan.id, pseudo: playerBan.pseudo });
        }

        var index = squad.member.findIndex(m => m.id === userBan.id);
        if (index !== -1) {
            squad.member.splice(index, 1);
        }

        if (playerInSquad(playerBan, playerStats)) {
            playerBan.player.other.squadName = 'undefined';
            playerBan.player.other.squadCoinGiven = 0;
            await playerBan.save();
        }

        await squad.save();

        await interaction.reply({ content: `${EMOJICONFIG.yes} ${playerBan.pseudo} has been successfully banned from your Guild`, ephemeral: true });
    };
    if (interaction.customId == 'no') {
        await interaction.reply({ content: `${EMOJICONFIG.no}You have cancelled the ban of ${playerBan.pseudo}`, ephemeral: true });
    }
});
        
            
        };
    };
};
},
info: {
    names: ['guildban'],
} }
