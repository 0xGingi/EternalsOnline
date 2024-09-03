const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, Events, ButtonStyle, ComponentType, StringSelectMenuBuilder } = require('discord.js');
const { prefix } = require('../../App/config.json');
const EMOJICONFIG = require('../../config/emoji.json');
const { bold, inlineCode, codeBlock } = require('@discordjs/builders');
const {client} = require('../../App/index.js');
module.exports = {
    name: Events.MessageCreate,
    /**
     * @param {Message} message
     */
    async execute(message) {
        if (message.mentions.users.first() !== client.user) return;
        const args = message.content.split(/ +/).slice(1);
        const commandName = args.shift().toLowerCase();
        if (this.info.names.some(name => commandName === name)) {

            const voteEmbed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Vote for Eternals!')
            .setURL('https://top.gg/bot/1157454837861056552/vote')
            .setDescription('Click the link above to vote for Eternals on top.gg and receive a special top.gg reward box!')
            .setThumbnail('https://images.discordapp.net/avatars/1157454837861056552/c8d66bd2b5f32dbf44e3bdd2d3f61489.png')
            .addFields(
                { name: 'Vote Rewards', value: `After voting, you will receive a top.gg reward box which you can open with ${inlineCode('mmo open topgg')}!` }
            )
            .setTimestamp()
            .setFooter({ text: 'Thank you for supporting Eternals!'});

        message.channel.send({ embeds: [voteEmbed] });
            }
    },
    info: {
        names: ['vote'],
    }    
};