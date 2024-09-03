const Discord = require('discord.js');
const monsters = require('../../config/monster.json');
const PLAYERDATA = require('../../modules/player.js');
const STATS = require('../../modules/statsBot.js');
const SQUADDATA = require('../../modules/squad.js')
const EMOJICONFIG = require('../../config/emoji.json');
const emo = require('../../config/emoji.json');
const BALANCEDATA = require('../../modules/economie.js');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, Events, ButtonStyle, ComponentType } = require('discord.js');
const {client} = require('../../App/index.js');
const { bold, inlineCode, codeBlock } = require('@discordjs/builders');
const { numStr } = require('../../functionNumber/functionNbr.js');
const crypto = require("crypto");
const { prefix } = require('../../App/config.json')
const configLevel = require('../../config/configLevel.json');
const CONFIGITEM = require('../../config/stuff.json')
const Party = require('../../modules/party.js');
const player = require('../../modules/player.js');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.mentions.users.first() !== client.user) return;
        const args = message.content.split(/ +/).slice(1);
        const commandName = args.shift().toLowerCase();
        if (this.info.names.some(name => commandName === name)) {

        var user = message.author;
        var userInput = Array.from(message.mentions.users.values())[1];
        let wager = args[1];
        let playerStats = await PLAYERDATA.findOne({ userId: user.id });
        let balance = await BALANCEDATA.findOne({ userId: user.id });
        if (balance.eco.coins < wager) {
            return message.reply(`You don't have enough coins to lure with!`);
        }
        if (!playerStats) return message.reply(`${inlineCode('❌')} you are not a player ! : ${inlineCode('@Eternals start')}`);
        if (playerStats.player.other.area !== 'wilderness') return message.reply(`${inlineCode('❌')} you are not in the wilderness! : ${inlineCode('@Eternals travel')}`);
        if (!userInput) {
            return message.reply(`You need to mention a player to lure them!`);
        }
        if (userInput.id === user.id) {
            return message.reply(`You can't attack yourself!`);
        }
        if (!wager) {
            return message.reply(`You need coins to lure with!`);
        }
        let targetStats = await PLAYERDATA.findOne({ userId: userInput.id });
        if (!targetStats) return message.reply(`${inlineCode('❌')} you can't lure a non-player!`);
        if (targetStats.player.other.area === 'wilderness') return message.reply(`${inlineCode('❌')} you can't lure a player who is already in the wilderness!`);
        
        async function lure(){
            let playerStats = await PLAYERDATA.findOne({ userId: message.author.id });
            let targetStats = await PLAYERDATA.findOne({ userId: userInput.id });
            let balance = await BALANCEDATA.findOne({ userId: message.author.id });
            let targetBalance = await BALANCEDATA.findOne({ userId: userInput.id });

            if (balance.eco.coins < wager) {
                return message.reply(`You don't have enough coins to lure with!`);
            }

            targetStats.player.other.area = 'wilderness';
            targetBalance.eco.coins += wager;
            balance.eco.coins -= wager;
            await targetStats.save();
            await targetBalance.save();
            await balance.save();
            var battleEmbed = new EmbedBuilder()
            .setColor('#000000')
            .setTitle(`${user.username}'s Lure`)
            .setDescription(`${emo.necromancy} ${user.username} has lured ${targetStats.pseudo} into the wilderness\n`)
            .addFields(
                { name: `**${emo.necromancy} ${user.username.toUpperCase()}**`, value:`dropped ${wager} ${emo.coinchest} in the wilderness and lured ${targetStats.pseudo} to pick them up!`, inline: true },
                { name: `**${emo.necromancy} ${targetStats.pseudo.toUpperCase()}**`, value: `is now inside the wilderness!\n `, inline: true },
            )
            .setTimestamp();
        return battleEmbed

        }
        
        
        
        const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('yes')
                .setLabel(`Take Coins`)
                .setEmoji(`${EMOJICONFIG.yes}`)
                .setStyle(ButtonStyle.Success),
            
            new ButtonBuilder()
                .setCustomId('no')
                .setLabel(`Ignore`)
                .setEmoji(`${EMOJICONFIG.no}`)
                .setStyle(ButtonStyle.Danger),
        );

    const embedMessage = new EmbedBuilder()
        .setColor('#ff0000')
        .setTitle(`${user.username} has dropped coins for ${userInput.username}!`)
        .setDescription(`${user.username} has dropped ${wager} coins for ${userInput.username} to pick up! What a friendly gesture!`)
        .setTimestamp()

    const msg = await message.reply({ embeds: [embedMessage], components: [row] });

    const collector = msg.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: 180_000,
    });
    
    collector.on('collect', async interaction => {
        if (interaction.user.id !== userInput.id) {
            return interaction.reply({ content: 'You are not the one being given coins.', ephemeral: true });
        }
        if (interaction.customId == 'yes') {
            if(interaction.user.id === userInput.id) {

        // ================= LEVEL CONFIG =================
        if (!interaction.replied) {
        await interaction.reply({ embeds:[await lure()], ephemeral: false });
        }
        collector.stop();
            }else 
            {
                if (!interaction.replied) {
                await interaction.reply({ content: 'You are not the one being given coins.', ephemeral: true });
            }
        }
        };
        
        if(interaction.customId === 'no') {
            if(interaction.user.id === userInput.id) {
                if (!interaction.replied) {
            await interaction.reply('You declined the friendly gesture!');
        } }
        collector.stop();
    } else {
        if (!interaction.replied) {
        await interaction.reply({ content: 'You are not the one being given coins.', ephemeral: true });
        }
    }
});
}
}, 
info: {
names: ['lure'],
} }

