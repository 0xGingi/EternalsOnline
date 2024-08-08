const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, Events, ButtonStyle, ComponentType, Collection } = require('discord.js');
const dungeons = require('../../config/dungeons.json');
const { prefix } = require('../../App/config.json');
const { numStr } = require('../../functionNumber/functionNbr.js');
const EMOJICONFIG = require('../../config/emoji.json');

// Config Cooldown :
const shuffleTime = 5000;
var cooldownPlayers = new Collection();

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
            const dungeonEntries = Object.entries(dungeons);

            for (let i = 0; i < dungeonEntries.length; i += 12) {
                const current = dungeonEntries.slice(i, i + 12);



        const embed = new EmbedBuilder()
            .setTitle('Dungeons List')
            .setDescription('Here are all the available dungeons:')
            .setColor('#0099ff');


            current.sort((a, b) => a[1].level - b[1].level).forEach(([dungeonName, dungeonDetails]) => {
            embed.addFields({name: `${dungeonDetails.display} ( ${dungeonDetails.alias} )` ,value: `Level Req: ${dungeonDetails.level}\n Totem Req: ${dungeonDetails.totem}\n\n`});
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
    names: ['dungeons'],
} 
};