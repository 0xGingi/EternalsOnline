const BARS = require('../../config/smith.json'); // Make sure this path is correct
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, Events, ButtonStyle, ComponentType } = require('discord.js');
const { prefix } = require('../../App/config.json');
const EMOJICONFIG = require('../../config/emoji.json');
module.exports = {
    name: Events.MessageCreate,
    /**
     * @param {Message} message
     */
    async execute(message, args, commandName) {
        if (message.content.toLowerCase() && this.info.names.some(name => commandName === name)) {

            const itemEmbeds = [];

            for (let i = 0; i < BARS.length; i += 12) {
                const current = BARS.slice(i, i + 12);

            var embed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle('Item Smithing List')
                .setDescription('Here are all the items you can smith:')
                .setTimestamp();

                current.sort((a, b) => a.level - b.level).forEach(bar => {
                // Create a string that lists all the ores and their amounts
                let oreList = bar.combination.map(ore => `${ore.amount}x ${ore.name}`).join('\n');
                embed.addFields(
                    { name: `${bar.name} (${bar.equipalias})`, value: `Smithing Level: ${bar.level}\nBars Needed:\n${oreList}\nXP: ${bar.xp}`, inline: true }
                );
            });

            itemEmbeds.push(embed);
        }

        var messageEmbed = await message.reply({ embeds: [itemEmbeds[0]], components: [new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('previous').setLabel('Previous').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('next').setLabel('Next').setStyle(ButtonStyle.Secondary),
            )] });  

            const filter = (interaction) => interaction.user.id === message.author.id;
            const collector = messageEmbed.createMessageComponentCollector({ filter, time: 60000 });
            let currentPage = 0;
            //const msg = await message.reply({ embeds: [itemEmbeds[currentPage]], components: [row] });


collector.on('collect', async (interaction) => {
    if (interaction.user.id !== message.author.id) return;

    if (interaction.customId === 'previous') {
        if (currentPage > 0) currentPage--;
    } else if (interaction.customId === 'next') {
        if (currentPage < itemEmbeds.length - 1) currentPage++;
    }
    await interaction.update({ embeds: [itemEmbeds[currentPage]] });
    });

   // await interaction.update({ embeds: [itemEmbeds[currentPage]] });
} },

    info: {
        names: ['smithlist'],
    }
};