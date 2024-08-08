const FISHES = require('../../config/potions.json');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, Events, ButtonStyle, ComponentType } = require('discord.js');
const { prefix } = require('../../App/config.json');
const EMOJICONFIG = require('../../config/emoji.json');

module.exports = {

    name: Events.MessageCreate,
    /**
     * @param {Message} message
     */
    async execute(message, args, commandName) {
		//const args = message.content.slice(prefix.length).trim().split(/ +/);
		//const commandName = args.shift().toLowerCase();
		if (message.content.toLowerCase() && this.info.names.some(name => commandName === name)) {
            const itemEmbeds = [];

            for (let i = 0; i < FISHES.length; i += 12) {
                const current = FISHES.slice(i, i + 12);

                const embed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle('Potion List')
                .setDescription('Here are all the potions you can brew:')
                .setTimestamp();


                current.sort((a, b) => a.level - b.level).forEach(fish => {
                    let stats = Object.entries(fish.stats)
                        .filter(([key, value]) => value !== 0)
                        .map(([key, value]) => `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`)
                        .join('\n');
                    
                    let statsLine = stats ? `\nStats:\n${stats}` : '';
                    embed.addFields(
                        { 
                            name: `${fish.name}`, 
                            value: `Magic Level: ${fish.level}\nXP: ${fish.xp}\nDescription: ${fish.description}${statsLine}`,
                            inline: true 
                        }
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

        names: ['potions'],

    }

};