const PLAYER = require('../../modules/player.js')
const ECONOMIE = require('../../modules/economie.js')
const STATS = require('../../modules/statsBot.js')
const BOSS = require('../../modules/boss.js')
const BOSSCONFIG = require('../../config/boss.json')
const { inlineCode } = require('@discordjs/builders')
const AREA = require('../../modules/area.js')
const { prefix } = require('../../App/config.json')
const EMOJICONFIG = require('../../config/emoji.json');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, Events, ButtonStyle, ComponentType } = require('discord.js');
const emo = require('../../config/emoji.json');
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
 
    var user = message.author;
    let playerStats = await PLAYER.findOne({ userId: user.id });
    let balance = await ECONOMIE.findOne({ userId: user.id });

    if (!playerStats) return message.reply(`${inlineCode('❌')} you are not a player ! : ${inlineCode('@Eternals start')}`);
    async function deletePlayer(){
        await ECONOMIE.deleteOne({ userId: user.id });
        await PLAYER.deleteOne({ userId: user.id }).then(() => {
            message.reply('Your account and all information has been deleted! If you would like to play again, type `@Eternals start`');
        })  
    }
    const row = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId('yes')
            .setLabel(`Delete Account`)
            .setEmoji(`${EMOJICONFIG.yes}`)
            .setStyle(ButtonStyle.Success),
        
        new ButtonBuilder()
            .setCustomId('no')
            .setLabel(`Don't Delete Account`)
            .setEmoji(`${EMOJICONFIG.no}`)
            .setStyle(ButtonStyle.Danger),
    );

const embedMessage = new EmbedBuilder()
    .setColor('#ff0000')
    .setTitle(`${user.username} Account Deletion`)
    .addFields(
        { name: `**${emo.helmet} ${user.username.toUpperCase()} :**\n`, value: `Would You like to delete your account and all informated stored in it? This is permenant and you can never restore any items, coins, or stats!`, inline: true},
    )
    .setTimestamp()

const msg = await message.reply({ embeds: [embedMessage], components: [row] });

const collector = msg.createMessageComponentCollector({
    componentType: ComponentType.Button,
    time: 180_000,
});

collector.on('collect', async interaction => {
    if (interaction.user.id !== user.id) {
        return interaction.reply({ content: 'You are not the one running this command.', ephemeral: true });
    }
    if (interaction.customId == 'yes') {
        if(interaction.user.id === user.id) {

    if (!interaction.replied) {
    await interaction.reply({ embeds:[await deletePlayer()], ephemeral: false });
    }
    collector.stop();
        }else 
        {
            if (!interaction.replied) {
            await interaction.reply({ content: 'You are not the one running this command.', ephemeral: true });
        }
    }
    };
    
    if(interaction.customId === 'no') {
        if(interaction.user.id === user.id) {
            if (!interaction.replied) {
        await interaction.reply('You decided to not delete your account.');
    } }
    collector.stop();
} else {
    if (!interaction.replied) {
    await interaction.reply({ content: 'You are not the one running this command.', ephemeral: true });
    }
}
});
        }
    },
    info: {
        names: ['delete'],
      } }
