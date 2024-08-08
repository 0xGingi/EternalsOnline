const { bold, inlineCode, codeBlock } = require('@discordjs/builders');
const { prefix } = require('../../App/config.json')
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, Events, ButtonStyle, ComponentType } = require('discord.js');
const  SQUADDATA  = require('../../modules/squad.js');
const EMOJICONFIG = require('../../config/emoji.json');



module.exports = {
    name: Events.MessageCreate,
    /**
     * @param {Message} message
     */

async execute(message, args, commandName) {
     if (message.content.toLowerCase() && this.info.names.some(name => commandName === name)) {
    const guilds = await SQUADDATA.find();

let guildsList = ``;
guilds.forEach(guild => {
    const memberCount = Array.isArray(guild.member) ? guild.member.length : 0;
    guildsList += ` **${guild.squadName}** \n ${EMOJICONFIG.xp}: ${guild.squadXp} | Leader: **${guild.leader[1]}** | ${memberCount} Members\n\n`;
});

    const embed = new EmbedBuilder()
        .setTitle('All Guilds')
        .setDescription(`${guildsList}`)
        .setColor(0x00AE86)


    message.channel.send({ embeds: [embed] });
}
},
info: {
    names: ['allguild'],
}
}